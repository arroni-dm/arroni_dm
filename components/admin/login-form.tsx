"use client";

import { Eye, EyeOff, LoaderCircle, LockKeyhole } from "lucide-react";
import Image from "next/image";
import { useActionState, useState } from "react";

import { login, type LoginState } from "@/actions/auth";

import { ui } from "./styles";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex justify-center">
        <Image
          unoptimized
          preload
          alt="Credence"
          width={220}
          height={55}
          className="h-12 w-auto object-contain"
          src="/credence/credence-logo.png"
        />
      </div>

      <div className={ui.card}>
        <div className="mb-6 flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-[#ffbc16]">
            <LockKeyhole className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Admin sign in</h1>
            <p className="text-sm font-medium text-[#3c2f21]/60">Manage your portfolio content.</p>
          </div>
        </div>

        <form action={formAction} className="space-y-5" noValidate>
          {state.error && (
            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="email" className={ui.label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="username"
              required
              defaultValue={state.email}
              aria-invalid={Boolean(state.error)}
              disabled={pending}
              className={`${ui.input} mt-2`}
            />
          </div>

          <div>
            <label htmlFor="password" className={ui.label}>
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                aria-invalid={Boolean(state.error)}
                disabled={pending}
                className={`${ui.input} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className={`absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-2xl text-[#3c2f21]/60 hover:text-[#3c2f21] ${ui.focus}`}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={pending} className={`${ui.btnPrimary} w-full py-3.5`}>
            {pending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
