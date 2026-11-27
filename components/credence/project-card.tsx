import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { ProjectCardData } from "@/lib/projects/queries";

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-[#3c2f21]/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.imageAlt || project.title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />

        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
          <span className="text-[10px] font-bold tracking-widest text-white uppercase">{project.category}</span>
        </div>

        <div className="absolute top-4 right-4 bg-[#ffbc16] text-[#3c2f21] p-2.5 rounded-full shadow-md">
          <ArrowUpRight className="w-4 h-4 stroke-3" />
        </div>

        <div className="absolute bottom-4 left-5 right-5 text-white">
          <div className="text-3xl font-black tracking-tight leading-none">{project.heroMetric}</div>
          <div className="text-[10px] font-bold tracking-wider text-gray-300 mt-1 uppercase">{project.heroMetricLabel}</div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
        <div>
          <h3 className="text-xl font-extrabold text-[#3c2f21] group-hover:text-[#ffbc16] transition-colors">{project.title}</h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2 leading-relaxed">{project.description}</p>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar">
            {project.results.slice(0, 2).map((stat) => (
              <div
                key={`${stat.value}-${stat.label}`}
                className="bg-[#ffbc16]/10 border border-[#ffbc16]/30 rounded-2xl px-3 py-2 text-center min-w-22.5"
              >
                <div className="text-xs font-black text-[#3c2f21]">{stat.value}</div>
                <div className="text-[8px] font-bold text-[#3c2f21]/70 tracking-tighter uppercase leading-tight mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <Link
            href={`/projects/${project.slug}`}
            className="w-11 h-11 bg-[#3c2f21] text-white rounded-2xl flex items-center justify-center shrink-0 hover:bg-[#ffbc16] hover:text-[#3c2f21] transition-colors shadow-sm"
            aria-label={`View ${project.title}`}
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
