import type { ProjectStatus } from "@prisma/client";

import { statusStyles } from "./styles";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black tracking-wide ${statusStyles[status]}`}>
      {status === "PUBLISHED" ? "Published" : "Draft"}
    </span>
  );
}
