import { CheckCircle2, FilePenLine, FolderKanban, Plus } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { StatusBadge } from "@/components/admin/status-badge";
import { ui } from "@/components/admin/styles";
import { formatDate } from "@/lib/format";
import { getDashboardStats } from "@/lib/projects/admin-queries";

export const metadata: Metadata = { title: "Dashboard" };

type Recent = Awaited<ReturnType<typeof getDashboardStats>>["recentlyAdded"];

function RecentList({ title, items, dateKey }: { title: string; items: Recent; dateKey: "createdAt" | "updatedAt" }) {
  return (
    <section className={ui.card} aria-labelledby={`recent-${dateKey}`}>
      <h2 id={`recent-${dateKey}`} className="text-lg font-black tracking-tight">
        {title}
      </h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm font-medium text-[#3c2f21]/60">Nothing here yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-[#3c2f21]/10">
          {items.map((project) => (
            <li key={project.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className={`block truncate rounded text-sm font-bold hover:text-[#d28a2d] ${ui.focus}`}
                >
                  {project.title}
                </Link>
                <p className="text-xs font-medium text-[#3c2f21]/60">{formatDate(project[dateKey])}</p>
              </div>
              <StatusBadge status={project.status} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Total projects", value: stats.total, icon: FolderKanban },
    { label: "Published", value: stats.published, icon: CheckCircle2 },
    { label: "Drafts", value: stats.drafts, icon: FilePenLine },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Dashboard</h1>
          <p className="mt-1 text-sm font-medium text-[#3c2f21]/60">An overview of your portfolio content.</p>
        </div>
        <Link href="/admin/projects/create" className={ui.btnAccent}>
          <Plus className="size-4" aria-hidden="true" /> New project
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className={`${ui.card} flex items-center gap-4`}>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#ffbc16]/20">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-3xl font-black leading-none">{value}</p>
              <p className="mt-1 text-xs font-bold tracking-wider text-[#3c2f21]/60 uppercase">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentList title="Recently added" items={stats.recentlyAdded} dateKey="createdAt" />
        <RecentList title="Recently updated" items={stats.recentlyUpdated} dateKey="updatedAt" />
      </div>
    </div>
  );
}
