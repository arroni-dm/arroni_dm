"use client";

import { ExternalLink, FolderKanban, LayoutDashboard, LogOut, Menu, PlusCircle, X } from "lucide-react";
import { Dialog } from "radix-ui";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { logout } from "@/actions/auth";

import { PortalContainerContext } from "./portal";
import { ui } from "./styles";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, match: (p: string) => p === "/admin" },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: FolderKanban,
    match: (p: string) => p.startsWith("/admin/projects") && p !== "/admin/projects/create",
  },
  { href: "/admin/projects/create", label: "New project", icon: PlusCircle, match: (p: string) => p === "/admin/projects/create" },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Admin" className="flex flex-col gap-1.5">
      {NAV.map(({ href, label, icon: Icon, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-colors ${ui.focus} ${
              active ? "bg-white/10 text-[#ffbc16]" : "text-white/75 hover:bg-white/5 hover:text-white"
            }`}
          >
            {active && <span className="absolute inset-y-2 left-0 w-1 rounded-full bg-[#ffbc16]" aria-hidden="true" />}
            <Icon className="size-5" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-8 p-5">
      <Link href="/admin" onClick={onNavigate} className={`block w-fit rounded-xl ${ui.focus}`}>
        <Image
          unoptimized
          alt="Credence"
          width={220}
          height={55}
          className="h-10 w-auto object-contain brightness-0 invert"
          src="/credence/credence-logo.png"
        />
      </Link>
      <NavLinks pathname={pathname} onNavigate={onNavigate} />
      <div className="mt-auto space-y-2 border-t border-white/10 pt-5">
        <Link
          href="/projects"
          target="_blank"
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/75 transition-colors hover:bg-white/5 hover:text-white ${ui.focus}`}
        >
          <ExternalLink className="size-5" aria-hidden="true" />
          View public site
        </Link>
      </div>
    </div>
  );
}

export function AdminChrome({ user, children }: { user: { name: string; email: string }; children: ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [root, setRoot] = useState<HTMLDivElement | null>(null);

  // Close the drawer when the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = () => query.matches && setDrawerOpen(false);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const initials = user.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={setRoot} className="min-h-screen lg:pl-72">
      <PortalContainerContext value={root}>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 bg-[#3c2f21] lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Dialog.Portal container={root}>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 lg:hidden" />
          <Dialog.Content
            data-lenis-prevent
            className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] overflow-y-auto bg-[#3c2f21] text-white shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-left lg:hidden"
          >
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <Dialog.Description className="sr-only">Admin navigation menu</Dialog.Description>
            <Dialog.Close className={`absolute top-4 right-4 rounded-xl p-2 text-white/80 hover:bg-white/10 ${ui.focus}`} aria-label="Close menu">
              <X className="size-5" />
            </Dialog.Close>
            <SidebarContent pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-4 border-b border-[#3c2f21]/10 bg-white/90 px-4 backdrop-blur-xl sm:px-8">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className={`${ui.btnIcon} lg:hidden`}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <p className="font-outfit hidden text-lg font-black tracking-tight lg:block">Content Manager</p>

        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <span
              className="flex size-10 items-center justify-center rounded-full bg-[#ffbc16] text-sm font-black text-[#3c2f21]"
              aria-hidden="true"
            >
              {initials || "A"}
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-bold">{user.name}</p>
              <p className="text-xs font-medium text-[#3c2f21]/60">{user.email}</p>
            </div>
          </div>
          <form action={logout}>
            <button type="submit" className={ui.btnSecondary}>
              <LogOut className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Log out</span>
              <span className="sr-only sm:hidden">Log out</span>
            </button>
          </form>
        </div>
      </header>

      <main id="admin-main" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
        {children}
      </main>
      </PortalContainerContext>
    </div>
  );
}
