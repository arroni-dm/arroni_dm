import localFont from "next/font/local";

// Same font files as the public site (see app/projects/layout.tsx).
export const inter = localFont({ src: "../../public/credence/fonts/inter.woff2", weight: "100 900", display: "swap" });
export const outfit = localFont({
  src: "../../public/credence/fonts/outfit.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-credence-outfit",
});

/** Root wrapper classes shared by /login and /admin. `data-lenis-prevent` (set on the element) keeps native scrolling. */
export const adminRootClass = `${inter.className} ${outfit.variable} min-h-screen bg-[#f8f9fa] text-[#3c2f21] selection:bg-[#ffbc16] selection:text-[#3c2f21] [&_h1]:font-[family-name:var(--font-credence-outfit)] [&_h2]:font-[family-name:var(--font-credence-outfit)] [&_h3]:font-[family-name:var(--font-credence-outfit)] [&_.font-outfit]:font-[family-name:var(--font-credence-outfit)]`;
