"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CredenceInteractions } from "@/components/credence/interactions";
import { Footer } from "@/components/credence/projects-footer";
import { useEffect } from "react";

interface Project {
  id: string;
  category: string;
  heroMetric: string;
  heroMetricLabel: string;
  title: string;
  description: string;
  image: string;
  stats: { value: string; label: string }[];
  link: string;
}

const projectsData: Project[] = [
  {
    id: "1",
    category: "RETAIL",
    heroMetric: "1.2M",
    heroMetricLabel: "NEW LEADS CAPTURED",
    title: "EcoShop Australia",
    description:
      "End-to-end technical SEO and content strategy that transformed EcoShop into the dominant brand.",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    stats: [
      { value: "+820%", label: "ORGANIC TRAFFIC" },
      { value: "1.2 Million", label: "LEADS CAPTURED" },
    ],
    link: "/projects/ecoshop",
  },
  {
    id: "2",
    category: "ENTERPRISE SAAS",
    heroMetric: "Top 3",
    heroMetricLabel: "RANKINGS FOR 500+ KEYWORDS",
    title: "Nexus Global",
    description:
      "Aggressive international SEO strategy that positioned Nexus Global as the top-ranking CRM solution.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    stats: [
      { value: "+450%", label: "ORGANIC TRAFFIC" },
      { value: "500+", label: "KEYWORD RANKINGS" },
    ],
    link: "/projects/nexus-global",
  },
  {
    id: "3",
    category: "HEALTHCARE",
    heroMetric: "+312%",
    heroMetricLabel: "APPOINTMENT BOOKINGS",
    title: "HealthCore Clinic",
    description:
      "Local SEO and Google Business Profile optimisation that made HealthCore the most booked clinic.",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    stats: [
      { value: "+312%", label: "APPOINTMENT BOOKINGS" },
      { value: "#1 in 18 areas", label: "LOCAL PACK RANKINGS" },
    ],
    link: "/projects/healthcore",
  },
];

export default function ProjectsPage() {
  useEffect(() => {
    // পেজ লোড হওয়ার সাথে সাথে একদম উপরে স্ক্রোল করবে
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <CredenceInteractions>
        <main className="min-h-screen bg-[#f8f9fa] pt-36 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-[#3c2f21] tracking-tight">
                Take a look at my recent projects
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Explore how I help businesses scale with data-driven marketing
                and technical expertise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projectsData.map((project) => (
                <div
                  key={project.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-[#3c2f21]/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />

                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                      <span className="text-[10px] font-bold tracking-widest text-white uppercase">
                        {project.category}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 bg-[#ffbc16] text-[#3c2f21] p-2.5 rounded-full shadow-md">
                      <ArrowUpRight className="w-4 h-4 stroke-3" />
                    </div>

                    <div className="absolute bottom-4 left-5 right-5 text-white">
                      <div className="text-3xl font-black tracking-tight leading-none">
                        {project.heroMetric}
                      </div>
                      <div className="text-[10px] font-bold tracking-wider text-gray-300 mt-1 uppercase">
                        {project.heroMetricLabel}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div>
                      <h3 className="text-xl font-extrabold text-[#3c2f21] group-hover:text-[#ffbc16] transition-colors">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2">
                      <div className="flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar">
                        {project.stats.map((stat, idx) => (
                          <div
                            key={idx}
                            className="bg-[#ffbc16]/10 border border-[#ffbc16]/30 rounded-2xl px-3 py-2 text-center min-w-22.5"
                          >
                            <div className="text-xs font-black text-[#3c2f21]">
                              {stat.value}
                            </div>
                            <div className="text-[8px] font-bold text-[#3c2f21]/70 tracking-tighter uppercase leading-tight mt-0.5">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      <Link
                        href={project.link}
                        className="w-11 h-11 bg-[#3c2f21] text-white rounded-2xl flex items-center justify-center shrink-0 hover:bg-[#ffbc16] hover:text-[#3c2f21] transition-colors shadow-sm"
                        aria-label={`View ${project.title}`}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </CredenceInteractions>
    </div>
  );
}
