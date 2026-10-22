/**
 * sisiMove — Trust Badge Catalogue
 *
 * Responsibilities:
 * - Display Trust badge models.
 * - Filter badges by active status.
 * - Show loading, error, and empty states.
 * - Delegate badge selection and lifecycle actions to the parent.
 *
 * Non-responsibilities:
 * - Fetching or mapping API responses.
 * - Enforcing permissions or lifecycle rules.
 * - Performing badge mutations directly.
 */

"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import {
  TrustEmptyState,
  TrustErrorState,
  TrustLoadingState,
} from "@/components/admin/trust";

import {
  TrustBadgeCard,
  type TrustBadgeCardAction,
} from "./TrustBadgeCard";

import type { TrustBadgeModel } from "@/features/admin/trust/models";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type TrustBadgeCatalogueFilter =
  | "all"
  | "active"
  | "inactive";

export interface TrustBadgeCatalogueProps {
  badges: TrustBadgeModel[];

  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;

  onSelectBadge?: (badge: TrustBadgeModel) => void;
  onCreateBadge?: () => void;

  onBadgeStatusChange?: (
    badge: TrustBadgeModel,
    nextActive: boolean,
  ) => void;

  getBadgeActions?: (
    badge: TrustBadgeModel,
  ) => TrustBadgeCardAction[];

  selectedBadgePublicId?: string | null;
  isMutationPending?: boolean;
  disabled?: boolean;

  initialFilter?: TrustBadgeCatalogueFilter;
  showCreateAction?: boolean;

  title?: string;
  description?: string;
  className?: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const FILTER_OPTIONS: {
  value: TrustBadgeCatalogueFilter;
  label: string;
}[] = [
  { value: "all", label: "All badges" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustBadgeCatalogue({
  badges,
  isLoading = false,
  error = null,
  onRetry,
  onSelectBadge,
  onCreateBadge,
  onBadgeStatusChange,
  getBadgeActions,
  selectedBadgePublicId = null,
  isMutationPending = false,
  disabled = false,
  initialFilter = "all",
  showCreateAction = true,
  title = "Badge catalogue",
  description = "Manage the badges available across the Trust system.",
  className,
}: TrustBadgeCatalogueProps) {
  const [filter, setFilter] =
    useState<TrustBadgeCatalogueFilter>(initialFilter);

  const counts = useMemo(
    () => ({
      all: badges.length,
      active: badges.filter((badge) => badge.active).length,
      inactive: badges.filter((badge) => !badge.active).length,
    }),
    [badges],
  );

  const filteredBadges = useMemo(() => {
    const matchingBadges = badges.filter((badge) => {
      if (filter === "active") {
        return badge.active;
      }

      if (filter === "inactive") {
        return !badge.active;
      }

      return true;
    });

    return [...matchingBadges].sort((first, second) => {
      if (first.active !== second.active) {
        return first.active ? -1 : 1;
      }

      return first.name.localeCompare(second.name);
    });
  }, [badges, filter]);

  const retryAction = onRetry
    ? {
        label: "Try again",
        onClick: onRetry,
      }
    : undefined;

  const canCreate =
    showCreateAction &&
    Boolean(onCreateBadge) &&
    !disabled &&
    !isMutationPending;

  return (
    <section
      className={className}
      aria-labelledby="trust-badge-catalogue-title"
    >
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2
            id="trust-badge-catalogue-title"
            className="text-lg font-semibold text-[var(--foreground)]"
          >
            {title}
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">
            {description}
          </p>
        </div>

        {showCreateAction && onCreateBadge && (
          <Button
            type="button"
            onClick={onCreateBadge}
            disabled={!canCreate}
            className="shrink-0"
          >
            Create badge
          </Button>
        )}
      </div>

      {/* Status filters */}
      <div
        className="mb-5 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter badges by status"
      >
        {FILTER_OPTIONS.map((option) => {
          const selected = filter === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              aria-pressed={selected}
              disabled={isLoading}
              className={[
                "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2",
                selected
                  ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-secondary)] hover:bg-[var(--background-subtle)]",
                "disabled:cursor-not-allowed disabled:opacity-60",
              ].join(" ")}
            >
              <span>{option.label}</span>

              <span
                className={[
                  "rounded-full px-2 py-0.5 text-xs tabular-nums",
                  selected
                    ? "bg-[var(--surface)] text-[var(--brand)]"
                    : "bg-[var(--background-muted)] text-[var(--foreground-muted)]",
                ].join(" ")}
              >
                {counts[option.value]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Loading, error, empty, and catalogue states */}
      {error ? (
        <TrustErrorState
          variant="load"
          title="Unable to load badges"
          description={error}
          retryAction={retryAction}
        />
      ) : isLoading ? (
        <TrustLoadingState
          variant="skeleton"
          label="Loading badge catalogue"
          rows={4}
        />
      ) : badges.length === 0 ? (
        <TrustEmptyState
          variant="badges"
          title="No badges created yet"
          description="Create a badge to begin building your Trust badge catalogue."
          primaryAction={
            showCreateAction && onCreateBadge
              ? {
                  label: "Create badge",
                  onClick: onCreateBadge,
                }
              : undefined
          }
        />
      ) : filteredBadges.length === 0 ? (
        <TrustEmptyState
          variant="search"
          title={`No ${filter} badges`}
          description="Try another filter to see more badges in the catalogue."
          primaryAction={{
            label: "Show all badges",
            onClick: () => setFilter("all"),
          }}
        />
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p
              className="text-sm text-[var(--foreground-muted)]"
              aria-live="polite"
            >
              Showing {filteredBadges.length}{" "}
              {filteredBadges.length === 1 ? "badge" : "badges"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredBadges.map((badge) => {
              const selected =
                selectedBadgePublicId === badge.publicId;

              const actions = getBadgeActions?.(badge);

              return (
                <div
                  key={badge.publicId}
                  className={[
                    "min-w-0 rounded-xl",
                    selected
                      ? "ring-2 ring-[var(--brand)] ring-offset-2"
                      : "",
                  ].join(" ")}
                >
                  <TrustBadgeCard
                    badge={badge}
                    disabled={disabled || isMutationPending}
                    isStatusPending={isMutationPending}
                    onSelect={
                      onSelectBadge
                        ? () => onSelectBadge(badge)
                        : undefined
                    }
                    onStatusChange={
                      onBadgeStatusChange
                        ? (nextActive) =>
                            onBadgeStatusChange(badge, nextActive)
                        : undefined
                    }
                    actions={actions}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

export default TrustBadgeCatalogue;
