"use client";

import type { ProjectStatus } from "@prisma/client";
import { Eye, EyeOff, ExternalLink, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteProject, setProjectStatus } from "@/actions/projects";

import { ConfirmDialog } from "./confirm-dialog";
import { ui } from "./styles";

type Props = { id: string; slug: string; title: string; status: ProjectStatus };

export function ProjectRowActions({ id, slug, title, status }: Props) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [statusPending, startStatus] = useTransition();
  const [deletePending, startDelete] = useTransition();

  const published = status === "PUBLISHED";

  const toggleStatus = () =>
    startStatus(async () => {
      const result = await setProjectStatus(id, published ? "DRAFT" : "PUBLISHED");
      if (result.ok) {
        toast.success(published ? `"${title}" is now a draft.` : `"${title}" is now live.`);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });

  const confirmDelete = () =>
    startDelete(async () => {
      const result = await deleteProject(id);
      if (result.ok) {
        toast.success(`"${title}" was deleted.`);
        setConfirmOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
        setConfirmOpen(false);
      }
    });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link href={`/admin/projects/${id}/edit`} className={ui.btnIcon} aria-label={`Edit ${title}`} title="Edit">
        <Pencil className="size-4" />
      </Link>
      <button
        type="button"
        onClick={toggleStatus}
        disabled={statusPending}
        className={ui.btnIcon}
        aria-label={published ? `Unpublish ${title}` : `Publish ${title}`}
        title={published ? "Unpublish" : "Publish"}
      >
        {statusPending ? <LoaderCircle className="size-4 animate-spin" /> : published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
      {published && (
        <Link href={`/projects/${slug}`} target="_blank" className={ui.btnIcon} aria-label={`View ${title} on the site`} title="View on site">
          <ExternalLink className="size-4" />
        </Link>
      )}
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className={`${ui.btnIcon} hover:border-red-300 hover:bg-red-50 hover:text-red-600`}
        aria-label={`Delete ${title}`}
        title="Delete"
      >
        <Trash2 className="size-4" />
      </button>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this project?"
        description={
          <>
            <strong>{title}</strong> will be permanently removed and its public page will stop working. This cannot be undone.
          </>
        }
        confirmLabel="Delete project"
        pending={deletePending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
