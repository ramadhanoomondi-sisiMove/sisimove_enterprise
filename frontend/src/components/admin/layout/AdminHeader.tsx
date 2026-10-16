
"use client";

// -----------------------------------------------------------------------------
// Path: src/components/navigation/admin-header.tsx
// -----------------------------------------------------------------------------
// sisiMove — Admin Header
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - identify the administrative workspace;
// - expose notification and messaging entry points;
// - expose the sidebar collapse/expand control.
//
// Notification and messaging actions will be connected to their respective
// features when those integrations are available.
// -----------------------------------------------------------------------------

import {
  Bell,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface AdminHeaderProps {
  readonly collapsed: boolean;
  readonly onToggleSidebar: () => void;
}

// -----------------------------------------------------------------------------
// Shared utility button styling
// -----------------------------------------------------------------------------

const utilityButtonClassName = `
  relative
  inline-flex
  h-9
  w-9
  shrink-0
  items-center
  justify-center
  rounded-lg
  text-[var(--muted-foreground)]
  transition-colors
  hover:bg-[var(--muted)]
  hover:text-[var(--foreground)]
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-[var(--ring)]
`;

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function AdminHeader({
  collapsed,
  onToggleSidebar,
}: AdminHeaderProps) {
  return (
    <header
      className="
        sticky
        top-0
        z-20
        w-full
        border-b
        border-[var(--border)]
        bg-[var(--surface)]/95
        backdrop-blur
      "
    >
      <div
        className="
          flex
          min-h-[clamp(2.75rem,7vw,4rem)]
          w-full
          min-w-0
          items-center
          justify-between
          gap-[clamp(0.35rem,1.5vw,1rem)]
          px-[clamp(0.5rem,2.5vw,1.5rem)]
        "
      >
        {/* Workspace identity */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <p className="truncate text-sm font-semibold text-[var(--foreground)]">
            Admin Workspace
          </p>

          <p className="truncate text-xs text-[var(--muted-foreground)]">
            sisiMove platform operations
          </p>
        </div>

        {/* Administrative utilities */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            title="Notifications"
            className={utilityButtonClassName}
          >
            <Bell
              aria-hidden="true"
              className="h-[18px] w-[18px]"
            />
          </button>

          {/* Messages */}
          <button
            type="button"
            aria-label="Messages"
            title="Messages"
            className={utilityButtonClassName}
          >
            <MessageSquare
              aria-hidden="true"
              className="h-[18px] w-[18px]"
            />
          </button>

          {/* Sidebar toggle */}
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={
              collapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            aria-expanded={!collapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`
              ${utilityButtonClassName}
              border
              border-[var(--border)]
            `}
          >
            {collapsed ? (
              <ChevronRight
                aria-hidden="true"
                className="h-4 w-4"
              />
            ) : (
              <ChevronLeft
                aria-hidden="true"
                className="h-4 w-4"
              />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
