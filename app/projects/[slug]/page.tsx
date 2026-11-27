import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Footer } from "@/components/credence/projects-footer";
import { ProjectArticle } from "@/components/credence/project-article";
import { docToPlainText } from "@/lib/projects/rich-text";
import { getPublishedProject, getPublishedSlugs } from "@/lib/projects/queries";

// Next.js 16 Partial Prerendering / Instant Shell Fix
export const instant = false;

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  // Cache Components requires at least one param at build time. The placeholder
  // 404s (it can never match a real slug) and only exists for an empty database.
  return (slugs.length ? slugs : ["__placeholder__"]).map((slug) => ({ slug }));
}

async function loadProject(slug: string) {
  // Render per request (the data below is still cached + tag-invalidated). A prerendered /
  // ISR copy of this route could serve a stale page once after an admin publishes, edits,
  // unpublishes or deletes a project, and would answer unknown slugs with status 200.
  await connection();
  // Check the (single, cached) slug list first so arbitrary URLs never create
  // per-slug cache entries. Drafts are not in the list, so they 404 here.
  const slugs = await getPublishedSlugs();
  if (!slugs.includes(slug)) return null;
  return getPublishedProject(slug);
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) return { title: "Project Not Found", robots: { index: false } };

  const title = project.seoTitle || `${project.title} | Case Study`;
  const description = project.seoDescription || project.description || docToPlainText(project.content).slice(0, 160);
  const url = `/projects/${project.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: project.image, alt: project.imageAlt || project.title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [project.image] },
  };
}

export default async function ProjectDetailPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = await loadProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-[#3c2f21]">
      <main className="pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 hover:text-[#ffbc16] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Case Studies
        </Link>

        <ProjectArticle project={project} preloadImage />
      </main>

      <Footer />
    </div>
  );
}
