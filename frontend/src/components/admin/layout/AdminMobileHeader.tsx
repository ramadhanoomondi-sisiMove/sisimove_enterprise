
"use client";

import { Menu, X } from "lucide-react";

export interface AdminMobileHeaderProps {
  readonly mobileOpen: boolean;
  readonly onToggleMenu: () => void;
}

export default function AdminMobileHeader({
  mobileOpen,
  onToggleMenu,
}: AdminMobileHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex min-h-14 items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)]/95 px-4 backdrop-blur lg:hidden">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--foreground)]">
          Admin Workspace
        </p>

        <p className="truncate text-xs text-[var(--muted-foreground)]">
          sisiMove platform operations
        </p>
      </div>

      <button
        type="button"
        onClick={onToggleMenu}
        aria-label={mobileOpen ? "Close admin menu" : "Open admin menu"}
        aria-expanded={mobileOpen}
        aria-controls="admin-mobile-navigation"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        {mobileOpen ? (
          <X aria-hidden="true" className="h-5 w-5" />
        ) : (
          <Menu aria-hidden="true" className="h-5 w-5" />
        )}
      </button>
    </header>
  );
}
