import { ChevronLeft, ChevronRight, FolderPlus, Plus, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ProjectRowActions } from "@/components/admin/project-row-actions";
import { StatusBadge } from "@/components/admin/status-badge";
import { ui } from "@/components/admin/styles";
import { formatDate } from "@/lib/format";
import { listAdminProjects } from "@/lib/projects/admin-queries";

export const metadata: Metadata = { title: "Projects" };

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function AdminProjectsPage({ searchParams }: PageProps<"/admin/projects">) {
  const raw = await searchParams;
  const q = first(raw.q)?.trim().slice(0, 100) || undefined;
  const statusParam = first(raw.status);
  const status = statusParam === "PUBLISHED" || statusParam === "DRAFT" ? statusParam : undefined;
  const sort = first(raw.sort) === "oldest" ? "oldest" : "newest";
  const page = Math.max(1, Math.floor(Number(first(raw.page))) || 1);

  const { items, total, pageCount } = await listAdminProjects({ q, status, sort, page });
  const filtered = Boolean(q || status);

  const pageHref = (target: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    if (sort !== "newest") params.set("sort", sort);
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return `/admin/projects${query ? `?${query}` : ""}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Projects</h1>
          <p className="mt-1 text-sm font-medium text-[#3c2f21]/60">
            {total} {total === 1 ? "project" : "projects"}
            {filtered ? " match your filters" : " in total"}.
          </p>
        </div>
        <Link href="/admin/projects/create" className={ui.btnAccent}>
          <Plus className="size-4" aria-hidden="true" /> New project
        </Link>
      </div>

      {/* Plain GET form: works without JavaScript and keeps filters in the URL. */}
      <form method="get" role="search" className={`${ui.card} grid gap-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end`}>
        <div>
          <label htmlFor="q" className={ui.label}>
            Search by title
          </label>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#3c2f21]/50" aria-hidden="true" />
            <input id="q" name="q" type="search" defaultValue={q} placeholder="Search projects…" className={`${ui.input} pl-11`} />
          </div>
        </div>
        <div>
          <label htmlFor="status" className={ui.label}>
            Status
          </label>
          <select id="status" name="status" defaultValue={status ?? ""} className={`${ui.input} mt-2 sm:w-40`}>
            <option value="">All</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
        <div>
          <label htmlFor="sort" className={ui.label}>
            Sort
          </label>
          <select id="sort" name="sort" defaultValue={sort} className={`${ui.input} mt-2 sm:w-40`}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className={ui.btnPrimary}>
            Apply
          </button>
          {filtered && (
            <Link href="/admin/projects" className={ui.btnSecondary}>
              Reset
            </Link>
          )}
        </div>
      </form>

      {items.length === 0 ? (
        <div className={`${ui.card} flex flex-col items-center gap-4 py-16 text-center`}>
          <span className="flex size-16 items-center justify-center rounded-3xl bg-[#ffbc16]/20">
            <FolderPlus className="size-8" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-xl font-black tracking-tight">{filtered ? "No projects match" : "No projects yet"}</h2>
            <p className="mt-1 text-sm font-medium text-[#3c2f21]/60">
              {filtered ? "Try a different search or clear the filters." : "Create your first case study to get started."}
            </p>
          </div>
          {!filtered && (
            <Link href="/admin/projects/create" className={ui.btnAccent}>
              <Plus className="size-4" aria-hidden="true" /> Create project
            </Link>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((project) => (
            <li key={project.id} className={`${ui.card} flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- small admin thumbnail */}
              <img
                src={project.image}
                alt={project.imageAlt || ""}
                width={96}
                height={64}
                loading="lazy"
                decoding="async"
                className="h-16 w-24 shrink-0 rounded-xl border border-[#3c2f21]/10 object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className={`truncate rounded text-base font-black hover:text-[#d28a2d] ${ui.focus}`}
                  >
                    {project.title}
                  </Link>
                  <StatusBadge status={project.status} />
                  {project.featured && (
                    <span className="rounded-full bg-[#ffbc16]/25 px-3 py-1 text-xs font-black">Featured</span>
                  )}
                </div>
                <p className="mt-1 truncate text-xs font-medium text-[#3c2f21]/60">
                  /projects/{project.slug} · {project.category} · Updated {formatDate(project.updatedAt)}
                </p>
              </div>
              <ProjectRowActions id={project.id} slug={project.slug} title={project.title} status={project.status} />
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 && (
        <nav aria-label="Pagination" className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-[#3c2f21]/60">
            Page {page} of {pageCount}
          </p>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link href={pageHref(page - 1)} className={ui.btnSecondary}>
                <ChevronLeft className="size-4" aria-hidden="true" /> Previous
              </Link>
            ) : null}
            {page < pageCount ? (
              <Link href={pageHref(page + 1)} className={ui.btnSecondary}>
                Next <ChevronRight className="size-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </nav>
      )}
    </div>
  );
}
