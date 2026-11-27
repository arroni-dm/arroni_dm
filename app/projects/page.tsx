import type { Metadata } from "next";

import { CredenceInteractions } from "@/components/credence/interactions";
import { ProjectCard } from "@/components/credence/project-card";
import { Footer } from "@/components/credence/projects-footer";
import { ScrollToTop } from "@/components/credence/scroll-to-top";
import { getPublishedProjects } from "@/lib/projects/queries";

export const metadata: Metadata = {
  title: "Projects | Case Studies",
  description: "Explore how I help businesses scale with data-driven marketing and technical expertise.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Case Studies",
    description: "Explore how I help businesses scale with data-driven marketing and technical expertise.",
    url: "/projects",
    type: "website",
  },
};

export default async function ProjectsPage() {
  // Cached + tagged: admin changes expire this entry immediately.
  const projects = await getPublishedProjects();

  return (
    <div>
      <ScrollToTop />
      <CredenceInteractions>
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

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">New case studies are on the way. Check back soon.</p>
            )}
          </div>
        </main>

        <Footer />
      </CredenceInteractions>
    </div>
  );
}
