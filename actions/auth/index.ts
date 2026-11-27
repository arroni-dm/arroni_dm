"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { ADMIN_HOME, LOGIN_PATH } from "@/lib/auth/constants";
import { DUMMY_HASH, verifyPassword } from "@/lib/auth/password";
import { clearFailedLogins, isLoginBlocked, recordFailedLogin } from "@/lib/auth/rate-limit";
import { createSession, destroySession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export type LoginState = { error?: string; email?: string };

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(200),
});

const INVALID = "Invalid email or password.";

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const submittedEmail = typeof formData.get("email") === "string" ? String(formData.get("email")) : "";
  if (!parsed.success) return { error: INVALID, email: submittedEmail };

  const { email, password } = parsed.data;
  // x-forwarded-for is set by the platform proxy (e.g. Vercel). The per-email
  // limit below still applies if a client forges this header.
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (await isLoginBlocked(email, ip)) {
    return { error: "Too many failed attempts. Please try again in 15 minutes.", email };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  // Always run one hash verification so timing does not reveal whether the account exists.
  const valid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !valid || user.role !== "ADMIN") {
    await recordFailedLogin(email, ip);
    return { error: INVALID, email };
  }

  await clearFailedLogins(email);
  await createSession(user.id);
  redirect(ADMIN_HOME);
}

export async function logout() {
  await destroySession();
  redirect(LOGIN_PATH);
}
