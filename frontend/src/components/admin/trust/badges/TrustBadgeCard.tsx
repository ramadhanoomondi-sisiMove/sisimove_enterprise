"use client";

import { Card } from "@/components/ui/card";
import type { TrustBadgeModel } from "@/features/admin/trust/models";
import { TrustBadgeStatusControl } from "./TrustBadgeStatusControl";

// -----------------------------------------------------------------------------
// sisiMove — Trust Badge Card
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display a trust badge's name, type, description, and available metadata.
// - Reuse TrustBadgeStatusControl for active/inactive status.
// - Expose optional selection and parent-controlled actions.
//
// Non-responsibilities:
// - Fetching badge data.
// - Performing badge mutations.
// - Making authorization decisions.
// -----------------------------------------------------------------------------

export interface TrustBadgeCardAction {
  label: string;
  onClick: (badge: TrustBadgeModel) => void;
  variant?: "default" | "danger" | "outline";
  disabled?: boolean;
}

export interface TrustBadgeCardProps {
  badge: TrustBadgeModel;
  onSelect?: (badge: TrustBadgeModel) => void;
  onStatusChange?: (nextActive: boolean) => void;
  actions?: TrustBadgeCardAction[];
  disabled?: boolean;
  isStatusPending?: boolean;
  className?: string;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function Reference({ value }: { value: string }) {
  return (
    <p className="break-all font-mono text-xs text-[var(--foreground-muted)]">
      {value}
    </p>
  );
}

export function TrustBadgeCard({
  badge,
  onSelect,
  onStatusChange,
  actions = [],
  disabled = false,
  isStatusPending = false,
  className,
}: TrustBadgeCardProps) {
  return (
    <Card
      variant="outlined"
      padding="md"
      className={["space-y-4", className].filter(Boolean).join(" ")}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background-subtle)] text-lg font-semibold text-[var(--foreground-secondary)]"
          >
            {badge.name.trim().charAt(0).toUpperCase() || "B"}
          </div>

          <div className="min-w-0 space-y-1">
            <h3 className="break-words text-base font-semibold text-[var(--foreground)]">
              {badge.name}
            </h3>

            <Reference value={badge.publicId} />

            <p className="text-sm text-[var(--foreground-secondary)]">
              Type: {badge.type}
            </p>
          </div>
        </div>

        {onSelect && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onSelect(badge)}
            className="min-h-9 shrink-0 rounded-md border border-[var(--border)] px-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            View details
          </button>
        )}
      </div>

      {badge.description ? (
        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[var(--foreground-secondary)]">
          {badge.description}
        </p>
      ) : (
        <p className="text-sm italic text-[var(--foreground-muted)]">
          No description provided.
        </p>
      )}

      <div className="space-y-3 border-t border-[var(--border-subtle)] pt-3">
        <TrustBadgeStatusControl
          badge={badge}
          onChange={onStatusChange}
          disabled={disabled}
          isPending={isStatusPending}
          showToggle={Boolean(onStatusChange)}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs text-[var(--foreground-muted)]">
              Created
            </p>
            <p className="text-sm text-[var(--foreground-secondary)]">
              {formatDate(badge.createdAt)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-[var(--foreground-muted)]">
              Last updated
            </p>
            <p className="text-sm text-[var(--foreground-secondary)]">
              {formatDate(badge.updatedAt)}
            </p>
          </div>

          {badge.assetPublicId && (
            <div className="space-y-1 sm:col-span-2">
              <p className="text-xs text-[var(--foreground-muted)]">
                Asset reference
              </p>
              <Reference value={badge.assetPublicId} />
            </div>
          )}
        </div>
      </div>

      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-[var(--border-subtle)] pt-3">
          {actions.map((action) => {
            const isDanger = action.variant === "danger";
            const isDefault = action.variant === "default";

            return (
              <button
                key={action.label}
                type="button"
                disabled={disabled || action.disabled}
                onClick={() => action.onClick(badge)}
                className={[
                  "min-h-9 rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50",
                  isDanger
                    ? "border-[var(--danger)] text-[var(--danger)] hover:bg-[var(--background-subtle)]"
                    : isDefault
                      ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-foreground)] hover:bg-[var(--brand-hover)]"
                      : "border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-subtle)]",
                ].join(" ")}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default TrustBadgeCard;