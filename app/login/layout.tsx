import type { Metadata } from "next";
import type { ReactNode } from "react";

import { adminRootClass } from "@/components/admin/fonts";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div data-lenis-prevent className={adminRootClass}>
      {children}
    </div>
  );
}
