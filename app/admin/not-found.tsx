import Link from "next/link";

import { ui } from "@/components/admin/styles";

export default function AdminNotFound() {
  return (
    <div className={`${ui.card} mx-auto mt-10 max-w-lg space-y-4 py-14 text-center`}>
      <p className="text-6xl font-black text-[#ffbc16]">404</p>
      <h1 className="text-2xl font-black tracking-tight">Page not found</h1>
      <p className="text-sm font-medium text-[#3c2f21]/60">That admin page or project doesn&apos;t exist.</p>
      <Link href="/admin" className={ui.btnPrimary}>
        Back to dashboard
      </Link>
    </div>
  );
}
