"use client";

import { X } from "lucide-react";
import { Dialog } from "radix-ui";

import { ProjectArticle, type ProjectArticleData } from "@/components/credence/project-article";
import { EMPTY_DOC, sanitizeDoc } from "@/lib/projects/rich-text";
import type { ProjectFormValues } from "@/lib/projects/schema";
import { isAllowedImageUrl } from "@/lib/projects/urls";

import { usePortalContainer } from "./portal";
import { ui } from "./styles";

/** Builds exactly what the public page would render from the (possibly unsaved) form values. */
export function toArticleData(values: ProjectFormValues): ProjectArticleData | null {
  if (!isAllowedImageUrl(values.image)) return null;

  let content = EMPTY_DOC;
  try {
    content = sanitizeDoc(values.content);
  } catch {
    /* an invalid document previews as empty */
  }
  const completed = values.completedAt ? new Date(`${values.completedAt}T00:00:00.000Z`) : null;

  return {
    title: values.title.trim() || "Untitled project",
    category: values.category.trim() || "CATEGORY",
    heroMetric: values.heroMetric.trim() || "—",
    heroMetricLabel: values.heroMetricLabel.trim(),
    image: values.image,
    imageAlt: values.imageAlt ?? "",
    content,
    gallery: values.gallery.filter(isAllowedImageUrl),
    highlights: values.highlights.map((item) => item.trim()).filter(Boolean),
    results: values.results.filter((item) => item.value.trim() && item.label.trim()),
    technologies: values.technologies,
    liveUrl: values.liveUrl?.trim() || null,
    githubUrl: values.githubUrl?.trim() || null,
    clientName: values.clientName?.trim() || null,
    completedAt: completed && !Number.isNaN(completed.getTime()) ? completed : null,
  };
}

type Props = { open: boolean; onOpenChange: (open: boolean) => void; data: ProjectArticleData | null; status: "DRAFT" | "PUBLISHED" };

export function ProjectPreview({ open, onOpenChange, data, status }: Props) {
  const container = usePortalContainer();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal container={container}>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          data-lenis-prevent
          className="fixed inset-2 z-50 flex flex-col overflow-hidden rounded-3xl bg-[#f8f9fa] shadow-2xl outline-none sm:inset-6"
        >
          <header className="flex items-center justify-between gap-3 border-b border-[#3c2f21]/10 bg-white px-5 py-3">
            <div>
              <Dialog.Title className="font-outfit text-lg font-black tracking-tight">Preview</Dialog.Title>
              <Dialog.Description className="text-xs font-medium text-[#3c2f21]/60">
                How this case study looks on the public site · currently {status === "PUBLISHED" ? "published" : "a draft"}
              </Dialog.Description>
            </div>
            <Dialog.Close className={ui.btnSecondary}>
              <X className="size-4" aria-hidden="true" /> Close
            </Dialog.Close>
          </header>
          <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8">
            <div className="mx-auto max-w-5xl text-[#3c2f21]">{data && <ProjectArticle project={data} />}</div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
