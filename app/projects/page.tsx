"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Outfit } from "next/font/google";

import {
  BookingButton,
  MobileNavigation,
  ServicesNavigation,
  CredenceInteractions,
} from "@/components/credence/interactions";
import type { SystemSlug } from "@/components/credence/systems/system-data";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

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
    description: "End-to-end technical SEO and content strategy that transformed EcoShop into the dominant brand.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
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
    description: "Aggressive international SEO strategy that positioned Nexus Global as the top-ranking CRM solution.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
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
    description: "Local SEO and Google Business Profile optimisation that made HealthCore the most booked clinic.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    stats: [
      { value: "+312%", label: "APPOINTMENT BOOKINGS" },
      { value: "#1 in 18 areas", label: "LOCAL PACK RANKINGS" },
    ],
    link: "/projects/healthcore",
  },
];

export function Header({
  currentPage = "projects",
  currentSystem,
}: {
  currentPage?: "home" | "contact" | "systems" | "projects";
  currentSystem?: SystemSlug;
}) {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 transition-all duration-300">
      <nav className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white/90 dark:bg-[#452213]/90 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-full shadow-sm transition-colors duration-500">
        <Link
          className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 duration-300"
          href="/"
        >
          <Image
            unoptimized
            preload
            alt="Credence Logo"
            width={220}
            height={55}
            decoding="async"
            className="h-10 md:h-12 w-auto object-contain drop-shadow-sm dark:invert"
            src="/credence/credence-logo.png"
          />
        </Link>
        <div className="hidden min-[1000px]:flex items-center gap-8 text-sm font-bold text-[#1a1a1a] dark:text-[#F5F5F5]">
          <Link
            aria-current={currentPage === "home" ? "page" : undefined}
            className={`transition-colors duration-300 hover:text-[#ffbc16] relative pb-1 ${
              currentPage === "home"
                ? "text-[#ffbc16]"
                : "opacity-80 hover:opacity-100"
            }`}
            href="/"
          >
            Home
            {currentPage === "home" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ffbc16]" />
            )}
          </Link>
          <ServicesNavigation currentSystem={currentSystem} />
          <Link
            className="transition-colors duration-300 hover:text-[#ffbc16] opacity-80 hover:opacity-100 relative pb-1"
            href="/#gap"
            scroll={false}
          >
            The Gap
          </Link>
          <Link
            className="transition-colors duration-300 hover:text-[#ffbc16] opacity-80 hover:opacity-100 relative pb-1"
            href="/#proof"
            scroll={false}
          >
            Results
          </Link>
          <Link
            aria-current={currentPage === "projects" ? "page" : undefined}
            className={`transition-colors duration-300 hover:text-[#ffbc16] relative pb-1 ${
              currentPage === "projects"
                ? "text-[#ffbc16]"
                : "opacity-80 hover:opacity-100"
            }`}
            href="/projects"
            scroll={false}
          >
            Projects
            {currentPage === "projects" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ffbc16]" />
            )}
          </Link>
          <Link
            aria-current={currentPage === "contact" ? "page" : undefined}
            className={`transition-colors duration-300 hover:text-[#ffbc16] relative pb-1 ${
              currentPage === "contact"
                ? "text-[#ffbc16]"
                : "opacity-80 hover:opacity-100"
            }`}
            href="/contact"
          >
            Contact
            {currentPage === "contact" && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ffbc16]" />
            )}
          </Link>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 w-auto justify-end shrink-0">
          <MobileNavigation />
          <div className="hidden min-[1000px]:block">
            <div>
              <BookingButton
                className="px-5 py-2 text-sm font-black bg-[#ffbc16] text-[#3c2f21] rounded-full hover:shadow-[0_4px_20px_0_rgba(255,188,22,0.4)] transition-all block whitespace-nowrap uppercase tracking-widest"
                tabIndex={0}
              >
                Book a Free Audit Session
              </BookingButton>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#3c2f21] text-white py-16 md:py-24 border-t border-[#ffbc16]/20">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-5 flex flex-col gap-6">
            <h4 className="text-2xl font-black tracking-tight">
              Growth with a #1 Full-stack Digital Marketing Manager.
            </h4>
            <p className="text-white/70 text-sm leading-relaxed max-w-md">
              There is a gap between how good your product/service actually are
              and how you look online. That gap is costing you money. I will close
              that gap. Every time.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-black/30 border border-[#ffbc16]/30 inline-block w-fit">
              <span className="text-[#ffbc16] font-bold text-sm tracking-wide flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffbc16] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffbc16]"></span>
                </span>
                Accepting 5 Projects for Now | 2 Slots Remaining
              </span>
            </div>
          </div>
          <div className="hidden md:block md:col-span-2 md:col-start-7"></div>
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <h5 className="font-bold text-[#ffbc16] uppercase tracking-[0.2em] text-[10px] mb-2">
              Explore
            </h5>
            <Link className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors" href="/">Home</Link>
            <Link className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors" href="/#gap" scroll={false}>The Gap</Link>
            <Link className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors" href="/#proof" scroll={false}>Results</Link>
            <Link className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors" href="/projects" scroll={false}>Projects</Link>
            <Link className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors" href="/contact">Contact</Link>
          </div>
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <h5 className="font-bold text-[#ffbc16] uppercase tracking-[0.2em] text-[10px] mb-2">
              Services
            </h5>
            <Link className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors" href="/systems/google-ads-setup/">System 01: Google Ads Setup</Link>
            <Link className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors" href="/systems/google-ads-management/">System 02: Google Ads Management</Link>
            <Link className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors" href="/systems/meta-ads-setup/">System 03: Meta Ads Setup</Link>
            <Link className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors" href="/systems/meta-ads-management/">System 04: Meta Ads Management</Link>
            <Link className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors" href="/systems/looker-studio/">System 05: Looker Studio</Link>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-sm text-white/30">© 2026 Growth With Roni.</span>
          <a href="mailto:arroni.dm@gmail.com" className="text-sm text-white/40 hover:text-white transition-colors font-medium">
            arroni.dm@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function ProjectsPage() {
  return (
    <div className={outfit.className}>
      <CredenceInteractions>
        <Header currentPage="projects" />

        <main className="min-h-screen bg-[#f8f9fa] pt-36 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-black text-[#3c2f21] tracking-tight">
                Take a look at my recent projects
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Explore how I help businesses scale with data-driven marketing and technical expertise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projectsData.map((project) => (
                <div
                  key={project.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-[#3c2f21]/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                      <span className="text-[10px] font-bold tracking-widest text-white uppercase">
                        {project.category}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 bg-[#ffbc16] text-[#3c2f21] p-2.5 rounded-full shadow-md">
                      <ArrowUpRight className="w-4 h-4 stroke-[3]" />
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
                            className="bg-[#ffbc16]/10 border border-[#ffbc16]/30 rounded-2xl px-3 py-2 text-center min-w-[90px]"
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