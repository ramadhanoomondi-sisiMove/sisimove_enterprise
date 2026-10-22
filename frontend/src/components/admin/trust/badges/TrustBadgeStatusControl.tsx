"use client";

import type { TrustBadgeModel } from "@/features/admin/trust/models";

import { TrustStatusBadge } from "../shared/TrustStatusBadge";

// -----------------------------------------------------------------------------
// sisiMove — Trust Badge Status Control
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Present a badge's active/inactive state consistently.
// - Optionally expose a parent-controlled activation toggle.
// - Display pending and disabled states.
//
// Non-responsibilities:
// - Updating the backend directly.
// - Making permission decisions.
// - Defining badge lifecycle rules.
// -----------------------------------------------------------------------------

export interface TrustBadgeStatusControlProps {
  badge: Pick<TrustBadgeModel, "publicId" | "name" | "active">;
  onChange?: (nextActive: boolean) => void;
  disabled?: boolean;
  isPending?: boolean;
  showToggle?: boolean;
  className?: string;
}

export function TrustBadgeStatusControl({
  badge,
  onChange,
  disabled = false,
  isPending = false,
  showToggle = true,
  className,
}: TrustBadgeStatusControlProps) {
  const isActive = badge.active;
  const controlDisabled = disabled || isPending || !onChange;

  return (
    <div
      className={[
        "flex flex-wrap items-center justify-between gap-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex min-w-0 items-center gap-2">
        <TrustStatusBadge
          status={isActive ? "active" : "inactive"}
          size="sm"
        />

        <span className="truncate text-sm text-[var(--foreground-secondary)]">
          {badge.name}
        </span>
      </div>

      {showToggle && onChange && (
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          aria-label={`${isActive ? "Deactivate" : "Activate"} ${badge.name}`}
          disabled={controlDisabled}
          onClick={() => onChange(!isActive)}
          className={[
            "inline-flex min-h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            isActive
              ? "border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-subtle)]"
              : "border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-foreground)] hover:bg-[var(--brand-hover)]",
          ].join(" ")}
        >
          {isPending ? (
            <>
              <span
                aria-hidden="true"
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
              />
              Updating…
            </>
          ) : isActive ? (
            "Deactivate"
          ) : (
            "Activate"
          )}
        </button>
      )}
    </div>
  );
}

export default TrustBadgeStatusControl;