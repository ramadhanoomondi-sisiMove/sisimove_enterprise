"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminHeaderProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
}

export default function AdminHeader({
  collapsed,
  onToggleSidebar,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
      <div>
        <p className="text-sm font-semibold text-slate-900">
          Admin Workspace
        </p>
        <p className="text-xs text-slate-500">
          sisiMove platform operations
        </p>
      </div>

      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </header>
  );
}