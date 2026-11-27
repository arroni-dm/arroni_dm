# Admin CMS

Projects (case studies) live in MongoDB and are managed from `/admin`. The public
`/projects` and `/projects/[slug]` pages read the same data, so there is one
source of truth.

## Stack

| Concern | Choice |
| --- | --- |
| Database | MongoDB through **Prisma 6.19** (Prisma 7 has no MongoDB support yet — do not upgrade the major) |
| Auth | Email + password, scrypt hashes, server-side sessions (`Session` collection), HttpOnly cookie |
| Rich text | Tiptap editor → stored as JSON → rendered by our own React renderer (no raw HTML anywhere) |
| Images | Cloudinary (signed upload, no SDK) in production; local disk fallback for dev |
| Validation | Zod, shared by the form (client) and the server actions |
| Cache | `use cache` + tags, invalidated with `updateTag` / `revalidatePath` on every mutation |

## Routes

`/login` · `/admin` · `/admin/projects` · `/admin/projects/create` · `/admin/projects/[id]/edit`

`proxy.ts` redirects cookie-less requests for `/admin/*` to `/login`. That is only
an optimistic check: every admin layout/page, server action and the upload route
handler re-verifies the session against the database (`lib/auth/dal.ts`).

## Setup

```bash
npm install              # also runs `prisma generate`
cp .env.example .env     # then fill it in
npm run db:push          # creates collections + unique indexes in MongoDB
npm run db:seed          # creates the first admin + imports the 3 original projects
npm run dev
```

### First administrator

`npm run db:seed` reads `ADMIN_EMAIL`, `ADMIN_PASSWORD` (and optional `ADMIN_NAME`)
from the environment, hashes the password with scrypt and creates the user **only
if that email does not exist** — running it again never creates a duplicate or
overwrites anything. No credentials are hardcoded in the source. The seed also
imports the three projects that used to be hardcoded (same slugs, so existing URLs
and SEO are preserved), skipping any slug that already exists.

### Changing the password

```bash
npm run admin:set-password -- admin@example.com
```

You are prompted (hidden input) for the new password (min. 12 characters), or set
`NEW_PASSWORD` for non-interactive use. All existing sessions for that user are
signed out. Do this after the first login — the seed password sits in `.env`.

## Image storage

* **Production (Vercel/serverless):** set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
  `CLOUDINARY_API_SECRET`. Without them uploads fail with a clear message in production.
* **Development:** files are written to `.data/uploads` (git-ignored) and served from `/uploads/<id>`.
* **Self-hosted with persistent disk:** set `ALLOW_LOCAL_UPLOADS=true`.

Uploads accept JPEG/PNG/WebP/GIF up to 5 MB; the real type is detected from the
file's magic bytes (SVG is rejected). Replaced/removed images are not deleted from
storage (orphans are harmless; clean up from the Cloudinary dashboard if desired).

## How the public site stays in sync

Public reads (`lib/projects/queries.ts`) are cached with tags `projects` and
`project:<slug>`. Every create / update / publish / unpublish / delete calls
`updateTag` for the affected tags (both old and new slug on a rename) and
`revalidatePath` for `/projects` and the detail page. The detail route also renders
per request (`connection()`), so a stale page can never be served after a change.
Drafts are filtered in the query itself — a draft has no public page.

Note: because the project uses Cache Components, an unknown/unpublished slug renders the
not-found UI (with `noindex`) but the HTTP status line is 200, not 404.

## Security notes

* Passwords: scrypt (N=2^15), per-user salt, constant-time compare, dummy hash for unknown emails.
* Sessions: 256-bit random token in an HttpOnly, SameSite=Lax cookie (`__Host-` prefix + Secure in production); only its SHA-256 is stored; 7-day expiry; logout deletes the row.
* Login throttling: 5 failed attempts per email / 20 per IP per 15 minutes (`LoginAttempt` collection).
* Rich text is rebuilt from an allow-list on save *and* on read (`lib/projects/rich-text.ts`); links must be http(s)/mailto/relative, images must come from our storage.
* The IP used for throttling comes from `x-forwarded-for`; keep the app behind a trusted proxy/CDN.

## Deploying (Vercel example)

1. Create a MongoDB Atlas database; allow your host's IPs (Vercel: allow `0.0.0.0/0` or use their integration).
2. Add all variables from `.env.example` in the project settings (`ADMIN_*` only needed for the one-off seed).
3. Run `npm run db:push && npm run db:seed` once from your machine against the production `DATABASE_URL`.
4. Deploy. `postinstall` runs `prisma generate`.
5. Sign in at `/login`, then change the password with `npm run admin:set-password`.

If you run more than one server instance, the default in-memory cache is per instance;
configure a shared cache handler (see Next.js `cacheHandlers`) so invalidations reach every instance.
