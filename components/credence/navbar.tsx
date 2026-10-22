"use client";

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { usePathname } from "next/navigation";
import {
  BookingButton,
  CredenceInteractions,
  MobileNavigation,
  ServicesNavigation,
} from "./interactions";
import type { BookingPersona } from "./systems/system-data";

const inter = localFont({ src: "../../public/credence/fonts/inter.woff2", weight: "100 900", display: "swap" });
const outfit = localFont({ src: "../../public/credence/fonts/outfit.woff2", weight: "100 900", display: "swap", variable: "--font-credence-outfit" });

const systemPersonas: Record<string, BookingPersona> = {
  "google-ads-setup": "Email",
  "google-ads-management": "LinkedIn",
  "meta-ads-setup": "Social",
  "meta-ads-management": "LinkedIn",
  "looker-studio": "Web",
};

export function Navbar() {
  const pathname = usePathname();
  const currentSystem = pathname.startsWith("/systems/") ? pathname.split("/")[2] : undefined;
  const currentPage = pathname === "/" ? "home"
    : pathname === "/contact" ? "contact"
    : pathname === "/projects" || pathname.startsWith("/projects/") ? "projects"
    : currentSystem ? "systems" : undefined;
  const bookingPersona = currentSystem ? systemPersonas[currentSystem] : undefined;
  const className = currentPage === "home" ? "credence-home"
    : currentPage === "contact" || currentPage === "systems" || currentPage === "projects"
      ? `${inter.className} ${outfit.variable} text-[#3c2f21] selection:bg-[#ffbc16] selection:text-[#3c2f21] [&_.font-outfit]:font-[family-name:var(--font-credence-outfit)] [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-[#d28a2d] [&_button]:cursor-pointer [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-[#d28a2d] [&_.animate-ping]:motion-reduce:animate-none ${currentPage === "systems" ? "[&_*]:motion-reduce:transition-none" : ""}`
      : undefined;

  return (
    <div className={className}>
      <CredenceInteractions key={pathname} bookingPersona={bookingPersona}>
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
      </CredenceInteractions>
    </div>
  );
}
