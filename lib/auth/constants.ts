// Safe to import from proxy.ts (no Node-only or server-only imports here).
const isProduction = process.env.NODE_ENV === "production";

// `__Host-` cookies must be Secure, Path=/ and host-only — the strictest scope.
export const SESSION_COOKIE = isProduction ? "__Host-credence_session" : "credence_session";

export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const LOGIN_PATH = "/login";
export const ADMIN_HOME = "/admin";
