"use client";

import { LoaderCircle } from "lucide-react";
import { AlertDialog } from "radix-ui";
import type { ReactNode } from "react";

import { usePortalContainer } from "./portal";
import { ui } from "./styles";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  pending?: boolean;
  onConfirm: () => void;
};

export function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel, pending = false, onConfirm }: Props) {
  const container = usePortalContainer();

  return (
    <AlertDialog.Root open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <AlertDialog.Portal container={container}>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-[#3c2f21]/10 bg-white p-6 shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <AlertDialog.Title className="font-outfit text-xl font-black tracking-tight">{title}</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm leading-relaxed font-medium text-[#3c2f21]/70">
            {description}
          </AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel disabled={pending} className={ui.btnSecondary}>
              Cancel
            </AlertDialog.Cancel>
            <button
              type="button"
              disabled={pending}
              onClick={(event) => {
                event.preventDefault();
                onConfirm();
              }}
              className={ui.btnDanger}
            >
              {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
              {confirmLabel}
            </button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
