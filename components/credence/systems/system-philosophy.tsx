import Image from "next/image";
import type { SystemContent } from "./system-data";

const defaultAccent = {
  glow: "bg-[#ffbc16]/10",
  portrait: "border-[#ffbc16]/40",
};

const accents: Record<string, typeof defaultAccent> = {
  linkedin: { glow: "bg-[#ffbc16]/10", portrait: "border-[#ffbc16]/40" },
  social: { glow: "bg-[#00c896]/10", portrait: "border-[#00c896]/40" },
  email: { glow: "bg-[#ffbc16]/10", portrait: "border-[#ffbc16]/40" },
  web: { glow: "bg-[#64748b]/10", portrait: "border-[#64748b]/40" },
  meta: { glow: "bg-[#64748b]/10", portrait: "border-[#64748b]/40" },
};

export function SystemPhilosophy({ system }: { system: SystemContent }) {
  // Safe lookup: fallback to defaultAccent if slug not found
  const accent = accents[system?.slug] ?? defaultAccent;

  return (
    <section aria-labelledby="philosophy-heading" className="relative overflow-hidden border-y border-[#ffbc16]/20 bg-[#1A1A1A] py-24 sm:py-32">
      <div 
        aria-hidden="true" 
        className={`pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] ${accent.glow}`} 
      />
      <div className="relative z-10 container mx-auto flex max-w-5xl flex-col items-center rounded-3xl border border-[#333333] bg-[#1A1A1A] p-8 text-center shadow-2xl sm:p-12">
        {/* Profile Image Container */}
        <div className={`relative mb-4 size-28 overflow-hidden rounded-full border-2 shadow-2xl sm:size-32 ${accent.portrait}`}>
          <Image 
            unoptimized 
            src="/credence/blossom-headshot.png" 
            alt="Anisur Rahman Roni" 
            width={128} 
            height={128} 
            className="h-full w-full object-cover object-[70%_20%]" 
          />
        </div>

        {/* Name and Designation Block */}
        <div className="flex flex-col items-center space-y-1 text-center">
          <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Anisur Rahman Roni
          </h3>
          <p className="text-sm font-medium tracking-wide text-[#ffbc16] sm:text-base">
            Full-Stack Digital Marketing Manager
          </p>
        </div>

        {/* Baki Content Ekhane Thakbe */}
      </div>
    </section>
  );
}