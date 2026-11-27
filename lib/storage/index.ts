import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const TYPES = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
} as const;

export type ImageExtension = keyof typeof TYPES;
export const contentTypeFor = (ext: ImageExtension) => TYPES[ext];

/** Detects the real format from magic bytes — the client-supplied MIME type is not trusted. */
export function sniffImage(bytes: Uint8Array): ImageExtension | null {
  const startsWith = (...sig: number[]) => sig.every((byte, i) => bytes[i] === byte);
  if (startsWith(0xff, 0xd8, 0xff)) return "jpg";
  if (startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "png";
  if (startsWith(0x47, 0x49, 0x46, 0x38)) return "gif";
  if (startsWith(0x52, 0x49, 0x46, 0x46) && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
    return "webp";
  }
  return null;
}

export const LOCAL_UPLOAD_DIR = path.join(process.cwd(), ".data", "uploads");

function cloudinaryConfig() {
  const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env;
  return cloud && key && secret ? { cloud, key, secret } : null;
}

async function saveToCloudinary(bytes: Uint8Array, ext: ImageExtension, config: NonNullable<ReturnType<typeof cloudinaryConfig>>) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = "credence/projects";
  // Cloudinary signature: sha1 of the sorted, signed params followed by the API secret.
  const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${config.secret}`).digest("hex");

  const body = new FormData();
  body.set("file", new Blob([Buffer.from(bytes)], { type: TYPES[ext] }), `upload.${ext}`);
  body.set("api_key", config.key);
  body.set("timestamp", timestamp);
  body.set("folder", folder);
  body.set("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloud}/image/upload`, { method: "POST", body });
  const result = (await response.json().catch(() => null)) as { secure_url?: string } | null;
  if (!response.ok || !result?.secure_url) throw new Error("Image storage rejected the upload.");
  return result.secure_url;
}

/**
 * Cloudinary when configured (required for serverless hosting). Otherwise a
 * local-disk fallback: development, or a self-hosted server with a persistent
 * disk (opt in with ALLOW_LOCAL_UPLOADS=true).
 */
export async function saveImage(bytes: Uint8Array, ext: ImageExtension): Promise<string> {
  const cloudinary = cloudinaryConfig();
  if (cloudinary) return saveToCloudinary(bytes, ext, cloudinary);

  if (process.env.NODE_ENV === "production" && process.env.ALLOW_LOCAL_UPLOADS !== "true") {
    throw new Error("Image storage is not configured. Set the CLOUDINARY_* environment variables.");
  }
  await mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  const name = `${randomBytes(16).toString("hex")}.${ext}`;
  await writeFile(path.join(LOCAL_UPLOAD_DIR, name), bytes);
  return `/uploads/${name}`;
}
