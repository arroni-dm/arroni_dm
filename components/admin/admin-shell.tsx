import type { ReactNode } from "react";

import { requireAdmin } from "@/lib/auth/dal";

import { AdminChrome } from "./admin-chrome";

/**
 * Server-side gate for every /admin route: verifies the session against the
 * database on each request (the proxy only does an optimistic cookie check).
 */
export async function AdminShell({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();
  return <AdminChrome user={{ name: admin.name, email: admin.email }}>{children}</AdminChrome>;
}

export function AdminShellSkeleton() {
  return (
    <div className="flex min-h-screen" aria-busy="true" aria-label="Loading admin">
      <div className="hidden w-72 shrink-0 bg-[#3c2f21] lg:block" />
      <div className="flex-1">
        <div className="h-20 border-b border-[#3c2f21]/10 bg-white" />
        <div className="space-y-4 p-8">
          <div className="h-10 w-64 animate-pulse rounded-2xl bg-[#3c2f21]/10" />
          <div className="h-40 animate-pulse rounded-3xl bg-[#3c2f21]/10" />
        </div>
      </div>
    </div>
  );
}
