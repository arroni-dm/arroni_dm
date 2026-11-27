import { notFound } from "next/navigation";

// Unknown /admin/* URLs (e.g. the removed /admin/dashboard) 404 *inside* the
// admin layout, so the admin chrome and not-found page render consistently.
export default function AdminCatchAll() {
  notFound();
}
