"use client";

import { ImagePlus, LoaderCircle, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ui } from "./styles";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_MB, uploadImage, validateImageFile } from "./upload";

type Props = {
  id: string;
  value: string;
  onChange: (url: string) => void;
  invalid?: boolean;
  describedBy?: string;
};

/** Single image field: choose/drop, instant preview, progress, replace, retry. */
export function ImageUploader({ id, value, onChange, invalid, describedBy }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const start = async (file: File) => {
    setError(null);
    const problem = validateImageFile(file);
    if (problem) return setError(problem);

    setLastFile(file);
    setPreview(URL.createObjectURL(file));
    setProgress(0);
    try {
      const url = await uploadImage(file, setProgress);
      onChange(url);
      setLastFile(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setProgress(null);
      setPreview(null);
    }
  };

  const uploading = progress !== null;
  const shown = preview ?? value;

  return (
    <div className="space-y-3">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files[0];
          if (file && !uploading) void start(file);
        }}
        className={`relative flex min-h-56 items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed bg-[#f8f9fa] transition-colors ${
          dragging ? "border-[#ffbc16] bg-[#ffbc16]/10" : invalid ? "border-red-400" : "border-[#3c2f21]/20"
        }`}
      >
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob previews cannot go through next/image
          <img src={shown} alt="Featured image preview" className="h-56 w-full object-cover sm:h-72" />
        ) : (
          <div className="flex flex-col items-center gap-2 p-6 text-center">
            <UploadCloud className="size-10 text-[#3c2f21]/40" aria-hidden="true" />
            <p className="text-sm font-bold">Drag an image here, or choose a file</p>
            <p className="text-xs font-medium text-[#3c2f21]/60">JPEG, PNG, WebP or GIF · up to {MAX_IMAGE_MB} MB</p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm" role="status">
            <LoaderCircle className="size-8 animate-spin" aria-hidden="true" />
            <p className="text-sm font-bold">Uploading… {progress}%</p>
            <div className="h-2 w-48 overflow-hidden rounded-full bg-[#3c2f21]/10">
              <div className="h-full rounded-full bg-[#ffbc16] transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        className="sr-only"
        aria-describedby={describedBy}
        aria-invalid={invalid}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void start(file);
        }}
        disabled={uploading}
      />

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className={ui.btnSecondary}>
          <ImagePlus className="size-4" aria-hidden="true" />
          {value ? "Replace image" : "Choose image"}
        </button>
        {value && !uploading && (
          <button type="button" onClick={() => onChange("")} className={`${ui.btnSecondary} hover:border-red-300 hover:bg-red-50`}>
            <Trash2 className="size-4" aria-hidden="true" /> Remove
          </button>
        )}
      </div>

      {error && (
        <div role="alert" className="flex flex-wrap items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          <span className="flex-1">{error}</span>
          {lastFile && (
            <button type="button" onClick={() => void start(lastFile)} className="inline-flex items-center gap-1.5 underline">
              <RefreshCw className="size-3.5" aria-hidden="true" /> Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}
