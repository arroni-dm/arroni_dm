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
  // Safe lookup: 无法匹配 slug 时自动使用 defaultAccent
  const accent = accents[system?.slug] ?? defaultAccent;

  return (
    <section aria-labelledby="philosophy-heading" className="relative overflow-hidden border-y border-[#ffbc16]/20 bg-[#1A1A1A] py-24 sm:py-32">
      <div 
        aria-hidden="true" 
        className={`pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] ${accent.glow}`} 
      />
      <div className="relative z-10 container mx-auto flex max-w-5xl flex-col items-center rounded-3xl border border-[#333333] bg-[#1A1A1A] p-8 text-center shadow-2xl sm:p-12">
        <div className={`relative mb-8 size-28 overflow-hidden rounded-full border-2 shadow-2xl sm:size-32 ${accent.portrait}`}>
          <Image 
            unoptimized 
            src="/credence/blossom-headshot.png" 
            alt="Blossom Affia" 
            width={128} 
            height={128} 
            className="h-full w-full object-cover object-[70%_20%] grayscale-[20%]" 
          />
        </div>
        {/* বাকি কন্টেন্ট */}
      </div>
    </section>
  );
}