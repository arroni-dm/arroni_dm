// Client-side upload helper. XHR (not fetch) because it reports upload progress.

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const MAX_IMAGE_MB = 5;

/** Quick pre-flight check for instant feedback; the server re-validates the real file contents. */
export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return "Only JPEG, PNG, WebP or GIF images are allowed.";
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) return `Image must be ${MAX_IMAGE_MB} MB or smaller.`;
  if (file.size === 0) return "That file is empty.";
  return null;
}

export function uploadImage(file: File, onProgress?: (percent: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.set("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.responseType = "json";
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onerror = () => reject(new Error("Network error. Check your connection and try again."));
    xhr.onload = () => {
      const result = xhr.response as { url?: string; error?: string } | null;
      if (xhr.status >= 200 && xhr.status < 300 && result?.url) resolve(result.url);
      else if (xhr.status === 401) reject(new Error("Your session has expired. Please sign in again."));
      else reject(new Error(result?.error ?? "Upload failed. Please try again."));
    };
    xhr.send(body);
  });
}
