/**
 * Idempotent database seed. Run with `npm run db:seed`.
 *
 *  1. Creates the first administrator from ADMIN_EMAIL / ADMIN_PASSWORD
 *     (read from the environment — never hardcoded). If a user with that email
 *     already exists nothing is changed.
 *  2. Migrates the three case studies that used to be hardcoded in the pages
 *     into the database (skipped per slug if they already exist).
 */
import { PrismaClient, type Prisma } from "@prisma/client";

import { hashPassword } from "../lib/auth/password";
import { textToDoc } from "../lib/projects/rich-text";

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Administrator";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set (see .env.example).");
  }
  if (password.length < 8) throw new Error("ADMIN_PASSWORD must be at least 8 characters.");

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    console.log(`Admin ${email} already exists - left unchanged (no duplicate created).`);
    return;
  }

  await prisma.user.create({ data: { email, name, passwordHash: await hashPassword(password), role: "ADMIN" } });
  console.log(`Admin ${email} created.`);
}

const legacyProjects: Array<Omit<Prisma.ProjectCreateInput, "content" | "status" | "publishedAt"> & { overview: string }> = [
  {
    slug: "ecoshop",
    title: "EcoShop Australia",
    category: "RETAIL",
    heroMetric: "1.2M",
    heroMetricLabel: "NEW LEADS CAPTURED",
    description: "End-to-end technical SEO and content strategy that transformed EcoShop into the dominant brand.",
    overview:
      "EcoShop Australia needed a high-performing SEO strategy to scale organic acquisition. We overhauled their site architecture, implemented structured data, and deployed targeted high-intent campaigns.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80",
    imageAlt: "EcoShop Australia storefront",
    highlights: ["Technical SEO Architecture Refactor", "Conversion Rate Optimization (CRO)", "High-Intent Paid Search Funnels"],
    results: [
      { value: "+820%", label: "ORGANIC TRAFFIC" },
      { value: "1.2 Million", label: "LEADS CAPTURED" },
      { value: "4.8x", label: "ROAS INCREASE" },
    ],
  },
  {
    slug: "nexus-global",
    title: "Nexus Global",
    category: "ENTERPRISE SAAS",
    heroMetric: "Top 3",
    heroMetricLabel: "RANKINGS FOR 500+ KEYWORDS",
    description: "Aggressive international SEO strategy that positioned Nexus Global as the top-ranking CRM solution.",
    overview:
      "Scaled B2B acquisition funnels across North America and Europe via targeted Meta Ads, Google Ads optimization, and Looker Studio real-time attribution dashboards.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    imageAlt: "Nexus Global analytics dashboard",
    highlights: ["International SEO Expansion", "Meta Ads & Pixel Conversions API", "Custom Looker Studio Attribution"],
    results: [
      { value: "+450%", label: "ORGANIC TRAFFIC" },
      { value: "500+", label: "KEYWORD RANKINGS" },
      { value: "$2.4M", label: "PIPELINE GENERATED" },
    ],
  },
  {
    slug: "healthcore",
    title: "HealthCore Clinic",
    category: "HEALTHCARE",
    heroMetric: "+312%",
    heroMetricLabel: "APPOINTMENT BOOKINGS",
    description: "Local SEO and Google Business Profile optimisation that made HealthCore the most booked clinic.",
    overview: "Hyper-local geo-targeted Google Ads paired with seamless call and appointment booking conversion tracking.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
    imageAlt: "HealthCore Clinic reception",
    highlights: ["Local Map Pack Dominance", "Automated Appointment Tracking", "High-converting Landing Pages"],
    results: [
      { value: "+312%", label: "APPOINTMENT BOOKINGS" },
      { value: "#1 in 18 areas", label: "LOCAL PACK RANKINGS" },
      { value: "65%", label: "CPA REDUCTION" },
    ],
  },
];

async function seedProjects() {
  const now = Date.now();
  for (const [index, { overview, ...project }] of legacyProjects.entries()) {
    const exists = await prisma.project.findUnique({ where: { slug: project.slug }, select: { id: true } });
    if (exists) {
      console.log(`Project "${project.slug}" already exists - skipped.`);
      continue;
    }
    // Staggered timestamps keep the original listing order (newest first).
    const stamp = new Date(now - index * 1000);
    await prisma.project.create({
      data: {
        ...project,
        content: textToDoc(overview) as unknown as Prisma.InputJsonValue,
        status: "PUBLISHED",
        publishedAt: stamp,
        createdAt: stamp,
      },
    });
    console.log(`Project "${project.slug}" created (published).`);
  }
}

async function main() {
  await seedAdmin();
  await seedProjects();
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
