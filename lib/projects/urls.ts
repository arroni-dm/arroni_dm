// Pure helpers shared by client and server code.

const IMAGE_HOSTS = new Set(["images.unsplash.com", "res.cloudinary.com"]);

/** Images may only come from our own storage (or the existing Unsplash seeds). */
export function isAllowedImageUrl(value: string): boolean {
  if (/^\/uploads\/[a-f0-9]{32}\.(jpg|png|webp|gif)$/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && IMAGE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

/** Links in rich text: http(s), mailto, or same-site paths only. */
export function isSafeLinkUrl(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    return ["http:", "https:", "mailto:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

export function isHttpUrl(value: string): boolean {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}
