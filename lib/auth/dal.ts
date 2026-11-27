import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { LOGIN_PATH } from "./constants";
import { findSessionUser } from "./session";

export type AdminUser = NonNullable<Awaited<ReturnType<typeof findSessionUser>>>;

// Deduplicated per request, so layouts, pages and actions can all ask.
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  const user = await findSessionUser();
  return user?.role === "ADMIN" ? user : null;
});

/** For pages/layouts: redirects to /login when there is no valid admin session. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) redirect(LOGIN_PATH);
  return admin;
}
