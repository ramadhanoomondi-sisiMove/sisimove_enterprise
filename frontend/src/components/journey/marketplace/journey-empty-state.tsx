// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Empty State
// -----------------------------------------------------------------------------
//
// Journey-specific empty state for the public Journey marketplace.
//
// Responsibilities:
// - Explain that no matching Journeys were found.
// - Provide Journey-marketplace-specific copy.
// - Expose an optional action for clearing the current search criteria.
// - Delegate presentation to the shared EmptyState primitive.
//
// This component does NOT:
// - fetch Journeys;
// - own marketplace filter state;
// - perform navigation;
// - modify query parameters;
// - decide why the backend returned no results.
//
// The parent marketplace component owns the actual clear operation.
// -----------------------------------------------------------------------------

import { EmptyState } from "@/components/ui";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyEmptyStateProps {
  /**
   * Called when the user chooses to clear the current marketplace search.
   *
   * The parent remains responsible for resetting its controlled filters and
   * triggering the appropriate marketplace query.
   */
  readonly onClearFilters?: () => void;

  /**
   * Whether the current marketplace search has active filters.
   *
   * When false, the clear-search action is omitted because there is nothing
   * for the user to clear.
   */
  readonly hasActiveFilters?: boolean;

  /**
   * Optional additional classes for the empty-state root.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Icon
// -----------------------------------------------------------------------------

function JourneyEmptyIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 18.5V7.8a2 2 0 0 1 1.4-1.9l6-2a2 2 0 0 1 1.2 0l6 2A2 2 0 0 1 20 7.8v10.7a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 8 12 10.5 19.5 8M12 10.5V20"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 14h2M14 14h2M8 17h2M14 17h2"
      />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyEmptyState({
  onClearFilters,
  hasActiveFilters = false,
  className,
}: JourneyEmptyStateProps) {
  const canClearFilters =
    hasActiveFilters && onClearFilters !== undefined;

  return (
    <EmptyState
      icon={<JourneyEmptyIcon />}
      title="No Journeys found"
      description={
        hasActiveFilters
          ? "We could not find a Journey matching your current search. Try adjusting your filters."
          : "There are no Journeys available in the marketplace right now."
      }
      primaryAction={
        canClearFilters
          ? {
              label: "Clear filters",
              variant: "outline",
              onClick: onClearFilters,
            }
          : undefined
      }
      className={className}
    />
  );
}