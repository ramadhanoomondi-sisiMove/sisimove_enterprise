
"use client";

import { Card } from "@/components/ui/card";
import type { TrustReviewApiResponse } from '@/features/admin/trust/types/trust.types';

// -----------------------------------------------------------------------------
// sisiMove — Trust Review Card
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display review content and available identifiers.
// - Display creation and update timestamps.
// - Expose optional parent-controlled actions.
//
// Non-responsibilities:
// - Fetching review or rating data.
// - Inferring reviewer identity or moderation status.
// - Performing moderation mutations or authorization.
// -----------------------------------------------------------------------------

export interface TrustReviewCardAction {
  label: string;
  onClick: (review: TrustReviewApiResponse) => void;
  variant?: "default" | "danger" | "outline";
  disabled?: boolean;
}

export interface TrustReviewCardProps {
  review: TrustReviewApiResponse;
  onSelect?: (review: TrustReviewApiResponse) => void;
  actions?: TrustReviewCardAction[];
  disabled?: boolean;
  className?: string;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function Reference({ value }: { value: string }) {
  return (
    <p className="break-all font-mono text-xs text-[var(--foreground-muted)]">
      {value}
    </p>
  );
}

export function TrustReviewCard({
  review,
  onSelect,
  actions = [],
  disabled = false,
  className,
}: TrustReviewCardProps) {
  return (
    <Card
      variant="outlined"
      padding="md"
      className={["space-y-4", className].filter(Boolean).join(" ")}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Review
          </h3>

          <Reference value={review.publicId} />
        </div>

        <div className="flex flex-wrap gap-2">
          {onSelect && (
            <button
              type="button"
              disabled={disabled}
              onClick={() => onSelect(review)}
              className="min-h-9 rounded-md border border-[var(--border)] px-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              View details
            </button>
          )}

          {actions.map((action) => {
            const isDanger = action.variant === "danger";
            const isDefault = action.variant === "default";

            return (
              <button
                key={action.label}
                type="button"
                disabled={disabled || action.disabled}
                onClick={() => action.onClick(review)}
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
      </div>

      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-4">
        {review.content.trim() ? (
          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[var(--foreground)]">
            {review.content}
          </p>
        ) : (
          <p className="text-sm italic text-[var(--foreground-muted)]">
            No review content provided.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-[var(--border-subtle)] pt-3 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-xs text-[var(--foreground-muted)]">
            Associated rating
          </p>
          <Reference value={review.ratingId} />
        </div>

        <div className="space-y-1">
          <p className="text-xs text-[var(--foreground-muted)]">Created</p>
          <p className="text-sm text-[var(--foreground-secondary)]">
            {formatDate(review.createdAt)}
          </p>
        </div>

        <div className="space-y-1 sm:col-span-2">
          <p className="text-xs text-[var(--foreground-muted)]">
            Last updated
          </p>
          <p className="text-sm text-[var(--foreground-secondary)]">
            {formatDate(review.updatedAt)}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default TrustReviewCard;
