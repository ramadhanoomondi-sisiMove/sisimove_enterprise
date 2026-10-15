"use client";

import { Menu, X } from "lucide-react";

interface AdminMobileHeaderProps {
  mobileOpen: boolean;
  onToggleMenu: () => void;
}

export default function AdminMobileHeader({
  mobileOpen,
  onToggleMenu,
}: AdminMobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
          sM
        </div>

        <div>
          <p className="text-sm font-bold text-slate-900">sisiMove</p>
          <p className="text-xs text-slate-500">Administration</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggleMenu}
        aria-label={mobileOpen ? "Close admin menu" : "Open admin menu"}
        aria-expanded={mobileOpen}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700"
      >
        {mobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>
    </header>
  );
}