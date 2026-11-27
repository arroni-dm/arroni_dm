import { readFile } from "node:fs/promises";
import path from "node:path";

import { LOCAL_UPLOAD_DIR, contentTypeFor, type ImageExtension } from "@/lib/storage";

// Serves files written by the local-disk storage fallback (see lib/storage).
// Only names we generated ourselves are accepted — no path traversal possible.
const NAME = /^[a-f0-9]{32}\.(jpg|png|webp|gif)$/;

export async function GET(_request: Request, { params }: RouteContext<"/uploads/[name]">) {
  const { name } = await params;
  const match = NAME.exec(name);
  if (!match) return new Response("Not found", { status: 404 });

  try {
    const file = await readFile(path.join(LOCAL_UPLOAD_DIR, name));
    return new Response(file, {
      headers: {
        "Content-Type": contentTypeFor(match[1] as ImageExtension),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
