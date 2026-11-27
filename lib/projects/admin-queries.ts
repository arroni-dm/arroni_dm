import "server-only";

import type { Prisma, ProjectStatus } from "@prisma/client";

import { prisma } from "@/lib/db";

import { toDoc } from "./queries";
import type { ProjectFormValues } from "./schema";

// Admin reads. Never cached — the dashboard must always show the truth. Callers
// must have passed requireAdmin() (these functions are not exposed to clients).

export const ADMIN_PAGE_SIZE = 10;

// On MongoDB, Prisma compiles insensitive `contains` into a regex without escaping the input,
// so metacharacters ("(", "[", ".") would either error or match unintended text.
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export type AdminListParams = {
  q?: string;
  status?: ProjectStatus;
  sort?: "newest" | "oldest";
  page?: number;
};

export async function listAdminProjects({ q, status, sort = "newest", page = 1 }: AdminListParams) {
  const where: Prisma.ProjectWhereInput = {
    ...(q ? { title: { contains: escapeRegex(q), mode: "insensitive" } } : {}),
    ...(status ? { status } : {}),
  };
  const [total, items] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.findMany({
      where,
      orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" },
      skip: (page - 1) * ADMIN_PAGE_SIZE,
      take: ADMIN_PAGE_SIZE,
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        image: true,
        imageAlt: true,
        status: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);
  return { total, items, pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)) };
}

const recentSelect = { id: true, title: true, slug: true, status: true, createdAt: true, updatedAt: true } as const;

export async function getDashboardStats() {
  const [total, published, recentlyAdded, recentlyUpdated] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.project.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: recentSelect }),
    prisma.project.findMany({ orderBy: { updatedAt: "desc" }, take: 5, select: recentSelect }),
  ]);
  return { total, published, drafts: total - published, recentlyAdded, recentlyUpdated };
}

export const isObjectId = (value: string) => /^[a-f0-9]{24}$/i.test(value);

/** Project as the edit form needs it, or null. */
export async function getProjectForEdit(id: string) {
  if (!isObjectId(id)) return null;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return null;

  const values: ProjectFormValues = {
    title: project.title,
    slug: project.slug,
    category: project.category,
    heroMetric: project.heroMetric,
    heroMetricLabel: project.heroMetricLabel,
    description: project.description,
    content: toDoc(project.content),
    image: project.image,
    imageAlt: project.imageAlt,
    gallery: project.gallery,
    highlights: project.highlights,
    results: project.results.map(({ value, label }) => ({ value, label })),
    technologies: project.technologies,
    liveUrl: project.liveUrl ?? "",
    githubUrl: project.githubUrl ?? "",
    clientName: project.clientName ?? "",
    completedAt: project.completedAt ? project.completedAt.toISOString().slice(0, 10) : "",
    featured: project.featured,
    status: project.status,
    seoTitle: project.seoTitle ?? "",
    seoDescription: project.seoDescription ?? "",
  };
  return { id: project.id, values, updatedAt: project.updatedAt };
}
