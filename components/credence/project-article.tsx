import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

import type { RichDoc } from "@/lib/projects/rich-text";

import { RichText } from "./rich-text";

export type ProjectArticleData = {
  title: string;
  category: string;
  heroMetric: string;
  heroMetricLabel: string;
  image: string;
  imageAlt: string;
  content: RichDoc;
  gallery: string[];
  highlights: string[];
  results: { value: string; label: string }[];
  technologies: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  clientName: string | null;
  completedAt: Date | null;
};

const formatMonth = (date: Date) =>
  date.toLocaleDateString("en-US", { year: "numeric", month: "long", timeZone: "UTC" });

/** The case-study card. Shared by the public detail page and the admin preview. */
export function ProjectArticle({ project, preloadImage = false }: { project: ProjectArticleData; preloadImage?: boolean }) {
  const hasMeta = project.clientName || project.completedAt || project.liveUrl || project.githubUrl;

  return (
    <article className="bg-white rounded-3xl p-8 border border-[#3c2f21]/10 shadow-sm space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="bg-[#ffbc16]/20 text-[#3c2f21] text-xs font-black tracking-widest px-4 py-1.5 rounded-full uppercase">
          {project.category}
        </span>
        <span className="text-3xl font-black text-[#ffbc16]">
          {project.heroMetric}{" "}
          <span className="text-sm text-[#3c2f21] font-bold block">{project.heroMetricLabel}</span>
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#3c2f21]">{project.title}</h1>

      <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-inner">
        <Image
          src={project.image}
          alt={project.imageAlt || project.title}
          fill
          sizes="(max-width: 1023px) 100vw, 1024px"
          preload={preloadImage}
          className="w-full h-full object-cover"
        />
      </div>

      <section className="space-y-4" aria-labelledby="project-overview">
        <h2 id="project-overview" className="text-2xl font-bold">
          Project Overview
        </h2>
        <RichText doc={project.content} />
      </section>

      {(hasMeta || project.technologies.length > 0) && (
        <section className="space-y-5 pt-4 border-t border-gray-100" aria-label="Project details">
          {hasMeta && (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {project.clientName && (
                <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-black/5">
                  <dt className="text-xs font-bold uppercase tracking-wider text-[#3c2f21]/60">Client</dt>
                  <dd className="mt-1 font-bold">{project.clientName}</dd>
                </div>
              )}
              {project.completedAt && (
                <div className="bg-[#f8f9fa] p-4 rounded-2xl border border-black/5">
                  <dt className="text-xs font-bold uppercase tracking-wider text-[#3c2f21]/60">Completed</dt>
                  <dd className="mt-1 font-bold">{formatMonth(project.completedAt)}</dd>
                </div>
              )}
            </dl>
          )}
          {project.technologies.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Technologies used">
              {project.technologies.map((tech) => (
                <li key={tech} className="rounded-full border border-[#3c2f21]/10 bg-[#f8f9fa] px-3.5 py-1.5 text-xs font-bold">
                  {tech}
                </li>
              ))}
            </ul>
          )}
          {(project.liveUrl || project.githubUrl) && (
            <div className="flex flex-wrap gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#3c2f21] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#ffbc16] hover:text-[#3c2f21]"
                >
                  Visit live project <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-[#3c2f21]/20 px-5 py-3 text-sm font-bold transition-colors hover:border-[#ffbc16] hover:bg-[#ffbc16]/10"
                >
                  View on GitHub <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </section>
      )}

      {project.highlights.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-xl font-bold">Key Deliverables &amp; Execution</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {project.highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 bg-[#f8f9fa] p-4 rounded-2xl border border-black/5">
                <CheckCircle2 className="w-5 h-5 text-[#ffbc16] shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm font-bold">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {project.results.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-xl font-bold">Impact &amp; Performance</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {project.results.map((res) => (
              <li key={`${res.value}-${res.label}`} className="bg-[#ffbc16]/10 border border-[#ffbc16]/30 p-6 rounded-2xl text-center">
                <div className="text-3xl font-black text-[#3c2f21]">{res.value}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#3c2f21]/70 mt-1">{res.label}</div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {project.gallery.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="text-xl font-bold">Gallery</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.gallery.map((src, index) => (
              <li key={src} className="relative aspect-video overflow-hidden rounded-2xl border border-[#3c2f21]/10">
                <Image
                  src={src}
                  alt={`${project.title} screenshot ${index + 1}`}
                  fill
                  sizes="(max-width: 639px) 100vw, 480px"
                  className="object-cover"
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
