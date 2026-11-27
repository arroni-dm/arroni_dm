import { z } from "zod";

import { isDocEmpty, isInvalidDocError, sanitizeDoc, type RichDoc } from "./rich-text";
import { isAllowedImageUrl, isHttpUrl } from "./urls";

const text = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, min === 1 ? `${label} is required.` : `${label} must be at least ${min} characters.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

const optionalText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be ${max} characters or fewer.`)
    .nullish()
    .transform((value) => value || null);

const optionalUrl = (label: string) =>
  z
    .string()
    .trim()
    .max(500, `${label} is too long.`)
    .refine((value) => value === "" || isHttpUrl(value), `${label} must start with http:// or https://`)
    .nullish()
    .transform((value) => value || null);

const imageUrl = z.string().trim().refine(isAllowedImageUrl, "Upload an image to use here.");

const content = z.unknown().transform((value, ctx): RichDoc => {
  try {
    const doc = sanitizeDoc(value);
    if (isDocEmpty(doc)) {
      ctx.addIssue({ code: "custom", message: "Add some project content." });
      return z.NEVER;
    }
    return doc;
  } catch (error) {
    ctx.addIssue({
      code: "custom",
      message: isInvalidDocError(error) ? error.message : "Invalid content.",
    });
    return z.NEVER;
  }
});

export const projectInputSchema = z.object({
  title: text("Title", 2, 120),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters.")
    .max(80, "Slug must be 80 characters or fewer.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens only."),
  category: text("Category", 2, 60),
  heroMetric: text("Headline metric", 1, 30),
  heroMetricLabel: text("Metric label", 1, 80),
  description: text("Short description", 10, 300),
  content,
  image: imageUrl,
  imageAlt: z
    .string()
    .trim()
    .max(160, "Alt text must be 160 characters or fewer.")
    .nullish()
    .transform((value) => value ?? ""),
  gallery: z.array(imageUrl).max(12, "You can add up to 12 gallery images."),
  highlights: z.array(text("Deliverable", 1, 120)).max(8, "Up to 8 deliverables."),
  results: z
    .array(z.object({ value: text("Result value", 1, 30), label: text("Result label", 1, 60) }))
    .max(6, "Up to 6 results."),
  technologies: z.array(text("Technology", 1, 40)).max(20, "Up to 20 technologies."),
  liveUrl: optionalUrl("Live URL"),
  githubUrl: optionalUrl("GitHub URL"),
  clientName: optionalText("Client name", 100),
  completedAt: z
    .string()
    .trim()
    .refine((value) => value === "" || (/^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value))), "Use a valid date.")
    .nullish()
    .transform((value) => value || null),
  featured: z.boolean(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  seoTitle: optionalText("SEO title", 70),
  seoDescription: optionalText("SEO description", 170),
});

/** What the form holds (before validation / sanitising). */
export type ProjectFormValues = z.input<typeof projectInputSchema>;
/** What the server persists. */
export type ProjectInput = z.output<typeof projectInputSchema>;
