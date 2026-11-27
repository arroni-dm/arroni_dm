import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { Toaster } from "sonner";

import { AdminShell, AdminShellSkeleton } from "@/components/admin/admin-shell";
import { adminRootClass } from "@/components/admin/fonts";

// Admin pages are request-time and authenticated; they are never prerendered into a static shell.
// (Also required because the root layout reads usePathname(), which blocks prerendering of dynamic routes.)
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div data-lenis-prevent className={adminRootClass}>
      {/* The session read is request-time data, so it streams in behind Suspense. */}
      <Suspense fallback={<AdminShellSkeleton />}>
        <AdminShell>{children}</AdminShell>
      </Suspense>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
