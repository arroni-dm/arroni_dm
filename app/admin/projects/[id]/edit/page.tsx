import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectForm } from "@/components/admin/project-form";
import { getProjectForEdit } from "@/lib/projects/admin-queries";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]/edit">) {
  const { id } = await params;
  const project = await getProjectForEdit(id);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Edit project</h1>
        <p className="mt-1 text-sm font-medium text-[#3c2f21]/60">{project.values.title}</p>
      </div>
      {/* Remount when the saved version changes so the form baseline stays in sync. */}
      <ProjectForm key={project.updatedAt.toISOString()} mode="edit" id={project.id} initial={project.values} />
    </div>
  );
}
