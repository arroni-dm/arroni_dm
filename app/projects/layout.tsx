import localFont from "next/font/local";
import type { ReactNode } from "react";

const inter = localFont({ src: "../../public/credence/fonts/inter.woff2", weight: "100 900", display: "swap" });
const outfit = localFont({ src: "../../public/credence/fonts/outfit.woff2", weight: "100 900", display: "swap", variable: "--font-credence-outfit" });

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${inter.className} ${outfit.variable} [&_h1]:font-[family-name:var(--font-credence-outfit)] [&_h2]:font-[family-name:var(--font-credence-outfit)] [&_h3]:font-[family-name:var(--font-credence-outfit)] [&_h4]:font-[family-name:var(--font-credence-outfit)] [&_h5]:font-[family-name:var(--font-credence-outfit)] [&_h6]:font-[family-name:var(--font-credence-outfit)] [&_.font-outfit]:font-[family-name:var(--font-credence-outfit)]`}>
      {children}
    </div>
  );
}
