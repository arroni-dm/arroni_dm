import type { Metadata } from "next";

import { ProjectForm } from "@/components/admin/project-form";

export const metadata: Metadata = { title: "New project" };

export default function CreateProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">New project</h1>
        <p className="mt-1 text-sm font-medium text-[#3c2f21]/60">Add a case study to your portfolio.</p>
      </div>
      <ProjectForm mode="create" />
    </div>
  );
}
