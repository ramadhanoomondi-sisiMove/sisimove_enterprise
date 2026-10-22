"use client";

import type { HTMLAttributes } from "react";

import { Card } from "@/components/ui/card";
import type { TrustBadgeModel } from "@/features/admin/trust/models";
import type { TrustProfileBadgeApiResponse } from "@/features/admin/trust/types/trust.types";

import { TrustStatusBadge } from "../shared/TrustStatusBadge";
import { TrustEmptyState } from "../shared/TrustEmptyState";
import { TrustLoadingState } from "../shared/TrustLoadingState";

// -----------------------------------------------------------------------------
// sisiMove — Trust Profile Badge List
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display badge assignments associated with a trust profile.
// - Match assignment badgeId values to badge definition IDs.
// - Present assignment status and award/revocation dates.
// - Delegate award/revoke actions to the parent.
//
// Non-responsibilities:
// - Fetching badge data.
// - Awarding or revoking badges.
// - Making authorization decisions.
// -----------------------------------------------------------------------------

export interface TrustProfileBadgeListProps
  extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  profileBadges: TrustProfileBadgeApiResponse[];
  badges: TrustBadgeModel[];

  onAwardBadge?: () => void;
  onRevokeBadge?: (assignment: TrustProfileBadgeApiResponse) => void;

  isLoading?: boolean;
  disabled?: boolean;

  emptyTitle?: string;
  emptyDescription?: string;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function TrustProfileBadgeList({
  profileBadges,
  badges,
  onAwardBadge,
  onRevokeBadge,
  isLoading = false,
  disabled = false,
  emptyTitle = "No badges assigned",
  emptyDescription = "Badges awarded to this profile will appear here.",
  className,
  ...props
}: TrustProfileBadgeListProps) {
  const badgeById = new Map(
    badges.map((badge) => [badge.id, badge]),
  );

  const sortedAssignments = [...profileBadges].sort((a, b) => {
    const aTime = new Date(a.awardedAt).getTime();
    const bTime = new Date(b.awardedAt).getTime();

    return (
      (Number.isNaN(bTime) ? 0 : bTime) -
      (Number.isNaN(aTime) ? 0 : aTime)
    );
  });

  return (
    <section
      aria-label="Trust profile badges"
      aria-busy={isLoading}
      className={["space-y-4", className].filter(Boolean).join(" ")}
      {...props}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Profile badges
          </h2>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Badge assignments and their current status.
          </p>
        </div>

        {onAwardBadge && (
          <button
            type="button"
            disabled={disabled || isLoading}
            onClick={onAwardBadge}
            className="inline-flex min-h-9 items-center justify-center rounded-md border border-[var(--brand)] bg-[var(--brand)] px-3 text-sm font-medium text-[var(--brand-foreground)] transition-colors hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Award badge
          </button>
        )}
      </div>

      {isLoading && profileBadges.length === 0 ? (
        <TrustLoadingState
          variant="skeleton"
          label="Loading profile badges"
          rows={2}
          showHeading={false}
          showDescription={false}
        />
      ) : profileBadges.length === 0 ? (
        <TrustEmptyState
          variant="badges"
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <div className="space-y-3">
          {sortedAssignments.map((assignment) => {
            const badge = badgeById.get(assignment.badgeId);
            const assignmentActive =
              assignment.active && !assignment.revokedAt;

            return (
              <Card
                key={assignment.publicId}
                variant="outlined"
                padding="md"
                className="space-y-3"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <h3 className="break-words text-sm font-semibold text-[var(--foreground)]">
                      {badge?.name ?? "Unknown badge"}
                    </h3>

                    <p className="break-all font-mono text-xs text-[var(--foreground-muted)]">
                      Assignment: {assignment.publicId}
                    </p>

                    {badge && (
                      <p className="text-xs text-[var(--foreground-secondary)]">
                        Type: {badge.type}
                      </p>
                    )}

                    {!badge && (
                      <p className="break-all text-xs text-[var(--foreground-muted)]">
                        Badge definition ID: {assignment.badgeId}
                      </p>
                    )}
                  </div>

                  <TrustStatusBadge
                    status={assignmentActive ? "active" : "revoked"}
                    size="sm"
                  />
                </div>

                {badge?.description && (
                  <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
                    {badge.description}
                  </p>
                )}

                <div className="grid grid-cols-1 gap-3 border-t border-[var(--border-subtle)] pt-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs text-[var(--foreground-muted)]">
                      Awarded
                    </p>

                    <p className="text-sm text-[var(--foreground-secondary)]">
                      {formatDate(assignment.awardedAt)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-[var(--foreground-muted)]">
                      Revoked
                    </p>

                    <p className="text-sm text-[var(--foreground-secondary)]">
                      {formatDate(assignment.revokedAt)}
                    </p>
                  </div>
                </div>

                {assignmentActive && onRevokeBadge && (
                  <div className="flex justify-end border-t border-[var(--border-subtle)] pt-3">
                    <button
                      type="button"
                      disabled={disabled || isLoading}
                      onClick={() => onRevokeBadge(assignment)}
                      className="min-h-9 rounded-md border border-[var(--danger)] px-3 text-sm font-medium text-[var(--danger)] transition-colors hover:bg-[var(--background-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Revoke badge
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default TrustProfileBadgeList;