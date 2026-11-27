import { getAdmin } from "@/lib/auth/dal";
import { MAX_IMAGE_BYTES, saveImage, sniffImage } from "@/lib/storage";

const json = (body: { url: string } | { error: string }, status = 200) => Response.json(body, { status });

export async function POST(request: Request) {
  // Authorisation is enforced here, not only by the proxy.
  if (!(await getAdmin())) return json({ error: "Unauthorized." }, 401);

  const declared = Number(request.headers.get("content-length"));
  if (declared > MAX_IMAGE_BYTES + 64 * 1024) return json({ error: "Image must be 5 MB or smaller." }, 413);

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return json({ error: "Invalid upload." }, 400);
  }
  if (!(file instanceof File) || file.size === 0) return json({ error: "Choose an image to upload." }, 400);
  if (file.size > MAX_IMAGE_BYTES) return json({ error: "Image must be 5 MB or smaller." }, 413);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const ext = sniffImage(bytes);
  if (!ext) return json({ error: "Only JPEG, PNG, WebP or GIF images are allowed." }, 415);

  try {
    return json({ url: await saveImage(bytes, ext) });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Upload failed." }, 502);
  }
}
