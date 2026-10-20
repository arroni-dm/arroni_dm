import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Header, Footer } from "@/app/projects/page";

interface ProjectDetail {
  slug: string;
  title: string;
  category: string;
  heroMetric: string;
  heroMetricLabel: string;
  description: string;
  fullOverview: string;
  image: string;
  highlights: string[];
  results: { value: string; label: string }[];
}

const projectsMap: Record<string, ProjectDetail> = {
  ecoshop: {
    slug: "ecoshop",
    title: "EcoShop Australia",
    category: "RETAIL",
    heroMetric: "1.2M",
    heroMetricLabel: "NEW LEADS CAPTURED",
    description: "End-to-end technical SEO and content strategy that transformed EcoShop into the dominant brand.",
    fullOverview: "EcoShop Australia needed a high-performing SEO strategy to scale organic acquisition. We overhauled their site architecture, implemented structured data, and deployed targeted high-intent campaigns.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80",
    highlights: [
      "Technical SEO Architecture Refactor",
      "Conversion Rate Optimization (CRO)",
      "High-Intent Paid Search Funnels",
    ],
    results: [
      { value: "+820%", label: "ORGANIC TRAFFIC" },
      { value: "1.2 Million", label: "LEADS CAPTURED" },
      { value: "4.8x", label: "ROAS INCREASE" },
    ],
  },
  "nexus-global": {
    slug: "nexus-global",
    title: "Nexus Global",
    category: "ENTERPRISE SAAS",
    heroMetric: "Top 3",
    heroMetricLabel: "RANKINGS FOR 500+ KEYWORDS",
    description: "Aggressive international SEO strategy that positioned Nexus Global as the top-ranking CRM solution.",
    fullOverview: "Scaled B2B acquisition funnels across North America and Europe via targeted Meta Ads, Google Ads optimization, and Looker Studio real-time attribution dashboards.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    highlights: [
      "International SEO Expansion",
      "Meta Ads & Pixel Conversions API",
      "Custom Looker Studio Attribution",
    ],
    results: [
      { value: "+450%", label: "ORGANIC TRAFFIC" },
      { value: "500+", label: "KEYWORD RANKINGS" },
      { value: "$2.4M", label: "PIPELINE GENERATED" },
    ],
  },
  healthcore: {
    slug: "healthcore",
    title: "HealthCore Clinic",
    category: "HEALTHCARE",
    heroMetric: "+312%",
    heroMetricLabel: "APPOINTMENT BOOKINGS",
    description: "Local SEO and Google Business Profile optimisation that made HealthCore the most booked clinic.",
    fullOverview: "Hyper-local geo-targeted Google Ads paired with seamless call and appointment booking conversion tracking.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
    highlights: [
      "Local Map Pack Dominance",
      "Automated Appointment Tracking",
      "High-converting Landing Pages",
    ],
    results: [
      { value: "+312%", label: "BOOKINGS" },
      { value: "#1", label: "LOCAL RANKING" },
      { value: "65%", label: "CPA REDUCTION" },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsMap[slug];
  if (!project) return { title: "Project Not Found" };
  return { title: `${project.title} | Case Study` };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectsMap[slug];

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-[#3c2f21]">
      <Header currentPage="projects" />

      <main className="pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 hover:text-[#ffbc16] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Case Studies
        </Link>

        <div className="bg-white rounded-3xl p-8 border border-[#3c2f21]/10 shadow-sm space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="bg-[#ffbc16]/20 text-[#3c2f21] text-xs font-black tracking-widest px-4 py-1.5 rounded-full uppercase">
              {project.category}
            </span>
            <span className="text-3xl font-black text-[#ffbc16]">
              {project.heroMetric} <span className="text-sm text-[#3c2f21] font-bold block">{project.heroMetricLabel}</span>
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#3c2f21]">
            {project.title}
          </h1>

          <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-inner">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Project Overview</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{project.fullOverview}</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xl font-bold">Key Deliverables & Execution</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-[#f8f9fa] p-4 rounded-2xl border border-black/5">
                  <CheckCircle2 className="w-5 h-5 text-[#ffbc16] shrink-0 mt-0.5" />
                  <span className="text-sm font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-xl font-bold">Impact & Performance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.results.map((res, idx) => (
                <div key={idx} className="bg-[#ffbc16]/10 border border-[#ffbc16]/30 p-6 rounded-2xl text-center">
                  <div className="text-3xl font-black text-[#3c2f21]">{res.value}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#3c2f21]/70 mt-1">{res.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}