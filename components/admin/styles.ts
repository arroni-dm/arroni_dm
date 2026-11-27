// Brand-consistent building blocks for the admin UI (same palette, radii and
// weights as the public portfolio: #3c2f21 ink, #ffbc16 accent, rounded-2xl/3xl).

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d28a2d]";

const button =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-60 " +
  focus;

export const ui = {
  card: "rounded-3xl border border-[#3c2f21]/10 bg-white p-5 shadow-sm sm:p-7",
  label: "block text-sm font-bold text-[#3c2f21]",
  hint: "mt-1.5 text-xs font-medium text-[#3c2f21]/60",
  error: "mt-1.5 text-xs font-bold text-red-600",
  input:
    "w-full rounded-2xl border border-[#3c2f21]/15 bg-white px-4 py-3 text-sm font-medium text-[#3c2f21] outline-none transition placeholder:text-[#3c2f21]/40 focus:border-[#ffbc16] focus:ring-4 focus:ring-[#ffbc16]/25 disabled:opacity-60 aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500/15",
  btnPrimary: `${button} bg-[#3c2f21] text-white hover:bg-[#ffbc16] hover:text-[#3c2f21]`,
  btnAccent: `${button} bg-[#ffbc16] text-[#3c2f21] hover:bg-[#e6a90f]`,
  btnSecondary: `${button} border border-[#3c2f21]/20 bg-white text-[#3c2f21] hover:border-[#ffbc16] hover:bg-[#ffbc16]/10`,
  btnDanger: `${button} bg-red-600 text-white hover:bg-red-700`,
  btnIcon:
    "inline-flex size-9 items-center justify-center rounded-xl border border-[#3c2f21]/15 bg-white text-[#3c2f21] transition-colors cursor-pointer hover:border-[#ffbc16] hover:bg-[#ffbc16]/10 disabled:pointer-events-none disabled:opacity-50 " +
    focus,
  focus,
} as const;

export const statusStyles = {
  PUBLISHED: "bg-emerald-100 text-emerald-800",
  DRAFT: "bg-[#3c2f21]/10 text-[#3c2f21]/80",
} as const;
