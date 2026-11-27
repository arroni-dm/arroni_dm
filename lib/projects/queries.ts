import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "@/lib/db";

import { EMPTY_DOC, sanitizeDoc, type RichDoc } from "./rich-text";
import { PROJECTS_TAG, projectTag } from "./tags";

// Public reads. Everything here is cached and tagged: admin mutations call
// updateTag(PROJECTS_TAG | projectTag(slug)) so the public site is current
// immediately. `hours` is only a safety net (e.g. multi-instance deployments).

export type ProjectResult = { value: string; label: string };

export type ProjectCardData = {
  slug: string;
  title: string;
  category: string;
  heroMetric: string;
  heroMetricLabel: string;
  description: string;
  image: string;
  imageAlt: string;
  results: ProjectResult[];
};

export type ProjectDetailData = ProjectCardData & {
  content: RichDoc;
  gallery: string[];
  highlights: string[];
  technologies: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  clientName: string | null;
  completedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export function toDoc(value: unknown): RichDoc {
  try {
    return sanitizeDoc(value);
  } catch {
    return EMPTY_DOC;
  }
}

export async function getPublishedProjects(): Promise<ProjectCardData[]> {
  "use cache";
  cacheTag(PROJECTS_TAG);
  cacheLife("hours");

  const projects = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      slug: true,
      title: true,
      category: true,
      heroMetric: true,
      heroMetricLabel: true,
      description: true,
      image: true,
      imageAlt: true,
      results: true,
    },
  });
  return projects.map((project) => ({ ...project, results: project.results.map(({ value, label }) => ({ value, label })) }));
}

export async function getPublishedSlugs(): Promise<string[]> {
  "use cache";
  cacheTag(PROJECTS_TAG);
  cacheLife("hours");

  const projects = await prisma.project.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } });
  return projects.map((project) => project.slug);
}

/** Returns null for unknown slugs *and* for drafts — drafts are never public. */
export async function getPublishedProject(slug: string): Promise<ProjectDetailData | null> {
  "use cache";
  cacheTag(PROJECTS_TAG, projectTag(slug));
  cacheLife("hours");

  const project = await prisma.project.findFirst({ where: { slug, status: "PUBLISHED" } });
  if (!project) return null;

  return {
    slug: project.slug,
    title: project.title,
    category: project.category,
    heroMetric: project.heroMetric,
    heroMetricLabel: project.heroMetricLabel,
    description: project.description,
    image: project.image,
    imageAlt: project.imageAlt,
    results: project.results.map(({ value, label }) => ({ value, label })),
    content: toDoc(project.content),
    gallery: project.gallery,
    highlights: project.highlights,
    technologies: project.technologies,
    liveUrl: project.liveUrl,
    githubUrl: project.githubUrl,
    clientName: project.clientName,
    completedAt: project.completedAt,
    seoTitle: project.seoTitle,
    seoDescription: project.seoDescription,
  };
}
