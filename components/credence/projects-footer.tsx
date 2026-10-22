import Link from "next/link";

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
              and how you look online. That gap is costing you money. I will
              close that gap. Every time.
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
            <Link
              className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors"
              href="/"
            >
              Home
            </Link>
            <Link
              className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors"
              href="/#gap"
              scroll={false}
            >
              The Gap
            </Link>
            <Link
              className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors"
              href="/#proof"
              scroll={false}
            >
              Results
            </Link>
            <Link
              className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors"
              href="/projects"
              scroll={false}
            >
              Projects
            </Link>
            <Link
              className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors"
              href="/contact"
            >
              Contact
            </Link>
          </div>
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
            <h5 className="font-bold text-[#ffbc16] uppercase tracking-[0.2em] text-[10px] mb-2">
              Services
            </h5>
            <Link
              className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors"
              href="/systems/google-ads-setup/"
            >
              System 01: Google Ads Setup
            </Link>
            <Link
              className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors"
              href="/systems/google-ads-management/"
            >
              System 02: Google Ads Management
            </Link>
            <Link
              className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors"
              href="/systems/meta-ads-setup/"
            >
              System 03: Meta Ads Setup
            </Link>
            <Link
              className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors"
              href="/systems/meta-ads-management/"
            >
              System 04: Meta Ads Management
            </Link>
            <Link
              className="text-sm text-white/60 hover:text-[#ffbc16] transition-colors"
              href="/systems/looker-studio/"
            >
              System 05: Looker Studio
            </Link>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-sm text-white/30">
            © 2026 Growth With Roni.
          </span>
          <a
            href="mailto:arroni.dm@gmail.com"
            className="text-sm text-white/40 hover:text-white transition-colors font-medium"
          >
            arroni.dm@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}

