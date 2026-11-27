import { Suspense } from "react";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { ADMIN_HOME } from "@/lib/auth/constants";
import { getAdmin } from "@/lib/auth/dal";

// Authenticated administrators never see the login form. (Anonymous visitors
// and expired cookies fall through to the form, so there is no redirect loop
// with the /admin gate.)
async function RedirectIfSignedIn() {
  if (await getAdmin()) redirect(ADMIN_HOME);
  return null;
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <LoginForm />
    </main>
  );
}
