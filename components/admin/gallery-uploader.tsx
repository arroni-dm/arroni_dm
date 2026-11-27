"use client";

import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ui } from "./styles";
import { ACCEPTED_IMAGE_TYPES, uploadImage, validateImageFile } from "./upload";

type Pending = { key: string; preview: string; progress: number };

const MAX_ITEMS = 12;

export function GalleryUploader({ value, onChange }: { value: string[]; onChange: (urls: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<Pending[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // Uploads finish out of order; always append to the latest list.
  const latest = useRef(value);
  useEffect(() => {
    latest.current = value;
  }, [value]);

  const previews = useRef(new Set<string>());
  useEffect(() => {
    const urls = previews.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const addFiles = async (files: File[]) => {
    setErrors([]);
    const room = MAX_ITEMS - latest.current.length - pending.length;
    const problems: string[] = [];
    const accepted: File[] = [];

    for (const file of files) {
      const problem = validateImageFile(file);
      if (problem) problems.push(`${file.name}: ${problem}`);
      else if (accepted.length >= room) problems.push(`${file.name}: gallery is limited to ${MAX_ITEMS} images.`);
      else accepted.push(file);
    }
    if (problems.length) setErrors(problems);

    await Promise.all(
      accepted.map(async (file) => {
        const key = `${file.name}-${crypto.randomUUID()}`;
        const preview = URL.createObjectURL(file);
        previews.current.add(preview);
        setPending((items) => [...items, { key, preview, progress: 0 }]);
        try {
          const url = await uploadImage(file, (progress) =>
            setPending((items) => items.map((item) => (item.key === key ? { ...item, progress } : item))),
          );
          latest.current = [...latest.current, url];
          onChange(latest.current);
        } catch (cause) {
          setErrors((current) => [...current, `${file.name}: ${cause instanceof Error ? cause.message : "Upload failed."}`]);
        } finally {
          setPending((items) => items.filter((item) => item.key !== key));
          URL.revokeObjectURL(preview);
          previews.current.delete(preview);
        }
      }),
    );
  };

  const busy = pending.length > 0;

  return (
    <div className="space-y-3">
      {(value.length > 0 || busy) && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((url, index) => (
            <li key={url} className="group relative aspect-video overflow-hidden rounded-2xl border border-[#3c2f21]/10">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail */}
              <img src={url} alt={`Gallery image ${index + 1}`} loading="lazy" decoding="async" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((item) => item !== url))}
                className={`absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-[#3c2f21]/85 text-white transition-opacity hover:bg-red-600 sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100 ${ui.focus}`}
                aria-label={`Remove gallery image ${index + 1}`}
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
          {pending.map((item) => (
            <li key={item.key} className="relative aspect-video overflow-hidden rounded-2xl border border-[#3c2f21]/10" role="status">
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
              <img src={item.preview} alt="" className="size-full object-cover opacity-50" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/60">
                <LoaderCircle className="size-6 animate-spin" aria-hidden="true" />
                <span className="text-xs font-bold">{item.progress}%</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        multiple
        className="sr-only"
        aria-label="Add gallery images"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          event.target.value = "";
          if (files.length) void addFiles(files);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={value.length + pending.length >= MAX_ITEMS}
        className={ui.btnSecondary}
      >
        <ImagePlus className="size-4" aria-hidden="true" /> Add images
      </button>
      <span className="ml-3 text-xs font-medium text-[#3c2f21]/60">
        {value.length}/{MAX_ITEMS}
      </span>

      {errors.length > 0 && (
        <ul role="alert" className="space-y-1 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
