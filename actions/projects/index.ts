"use server";

import { Prisma, type ProjectStatus } from "@prisma/client";
import { revalidatePath, updateTag } from "next/cache";

import { getAdmin } from "@/lib/auth/dal";
import { prisma } from "@/lib/db";
import { isObjectId } from "@/lib/projects/admin-queries";
import { projectInputSchema, type ProjectInput } from "@/lib/projects/schema";
import { PROJECTS_TAG, projectTag } from "@/lib/projects/tags";

export type ActionResult<T extends object = object> =
  | ({ ok: true } & T)
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const UNAUTHORIZED = { ok: false, error: "Your session has expired. Please sign in again." } as const;
const NOT_FOUND = { ok: false, error: "That project no longer exists." } as const;
const DUPLICATE_SLUG = {
  ok: false,
  error: "Please fix the highlighted fields.",
  fieldErrors: { slug: "Another project already uses this slug." },
} as const;

/**
 * Make the public site reflect a change right away: expire the tagged cache
 * entries (listing + each affected detail page) and the route cache.
 */
function invalidatePublicSite(...slugs: string[]) {
  updateTag(PROJECTS_TAG);
  revalidatePath("/projects");
  for (const slug of new Set(slugs)) {
    updateTag(projectTag(slug));
    revalidatePath(`/projects/${slug}`);
  }
}

function parseInput(values: unknown): { data: ProjectInput } | { error: ActionResult & { ok: false } } {
  const parsed = projectInputSchema.safeParse(values);
  if (parsed.success) return { data: parsed.data };

  const fieldErrors: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path.join(".") || "form";
    fieldErrors[key] ??= issue.message;
  }
  return { error: { ok: false, error: "Please fix the highlighted fields.", fieldErrors } };
}

const toRecord = (input: ProjectInput) => ({
  ...input,
  content: input.content as unknown as Prisma.InputJsonValue,
  completedAt: input.completedAt ? new Date(`${input.completedAt}T00:00:00.000Z`) : null,
});

const isUniqueViolation = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";

export async function createProject(values: unknown): Promise<ActionResult<{ id: string }>> {
  if (!(await getAdmin())) return UNAUTHORIZED;

  const parsed = parseInput(values);
  if ("error" in parsed) return parsed.error;
  const { data } = parsed;

  if (await prisma.project.findUnique({ where: { slug: data.slug }, select: { id: true } })) return DUPLICATE_SLUG;

  try {
    const project = await prisma.project.create({
      data: { ...toRecord(data), publishedAt: data.status === "PUBLISHED" ? new Date() : null },
      select: { id: true },
    });
    invalidatePublicSite(data.slug);
    return { ok: true, id: project.id };
  } catch (error) {
    if (isUniqueViolation(error)) return DUPLICATE_SLUG;
    console.error("createProject failed", error);
    return { ok: false, error: "Could not save the project. Please try again." };
  }
}

export async function updateProject(id: string, values: unknown): Promise<ActionResult> {
  if (!(await getAdmin())) return UNAUTHORIZED;
  if (!isObjectId(id)) return NOT_FOUND;

  const parsed = parseInput(values);
  if ("error" in parsed) return parsed.error;
  const { data } = parsed;

  const existing = await prisma.project.findUnique({ where: { id }, select: { slug: true, publishedAt: true } });
  if (!existing) return NOT_FOUND;

  const clash = await prisma.project.findUnique({ where: { slug: data.slug }, select: { id: true } });
  if (clash && clash.id !== id) return DUPLICATE_SLUG;

  try {
    await prisma.project.update({
      where: { id },
      data: {
        ...toRecord(data),
        publishedAt: data.status === "PUBLISHED" ? (existing.publishedAt ?? new Date()) : existing.publishedAt,
      },
    });
    invalidatePublicSite(existing.slug, data.slug);
    return { ok: true };
  } catch (error) {
    if (isUniqueViolation(error)) return DUPLICATE_SLUG;
    console.error("updateProject failed", error);
    return { ok: false, error: "Could not save the project. Please try again." };
  }
}

export async function setProjectStatus(id: string, status: ProjectStatus): Promise<ActionResult> {
  if (!(await getAdmin())) return UNAUTHORIZED;
  if (!isObjectId(id) || (status !== "DRAFT" && status !== "PUBLISHED")) return NOT_FOUND;

  const existing = await prisma.project.findUnique({ where: { id }, select: { slug: true, publishedAt: true } });
  if (!existing) return NOT_FOUND;

  await prisma.project.update({
    where: { id },
    data: { status, publishedAt: status === "PUBLISHED" ? (existing.publishedAt ?? new Date()) : existing.publishedAt },
  });
  invalidatePublicSite(existing.slug);
  return { ok: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  if (!(await getAdmin())) return UNAUTHORIZED;
  if (!isObjectId(id)) return NOT_FOUND;

  const existing = await prisma.project.findUnique({ where: { id }, select: { slug: true } });
  if (!existing) return NOT_FOUND;

  await prisma.project.delete({ where: { id } });
  invalidatePublicSite(existing.slug);
  return { ok: true };
}
