// -----------------------------------------------------------------------------
// sisiMove — Journey Management Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Load the authenticated owner's Journey.
// - Own the single-Journey query boundary.
// - Handle loading, error, and successful states.
// - Provide refetch to the management composition.
// - Keep route/query concerns outside the lower-level management components.
//
// Non-responsibilities:
// - No Journey lifecycle mutation logic.
// - No Journey editing/persistence logic.
// - No capability inference.
// - No authorization decisions.
// - No recreation of the Journey aggregate.
//
// Architecture:
//
//   Journey management route
//          │
//          ▼
//   JourneyManagementPanel
//          │
//          ├── useMyJourney(publicId)
//          │
//          ├── loading / error boundary
//          │
//          ▼
//   JourneyManagement
//          │
//          ├── JourneyEditor
//          └── JourneyActions
//
// Important React rule:
//
// The query hook MUST be called unconditionally. Route validation therefore
// happens after the hook invocation rather than before it.
//
// The hook itself is responsible for safely ignoring an empty identifier.
//
// -----------------------------------------------------------------------------

"use client";

import { ErrorState, Spinner } from "@/components/ui";

import { useMyJourney } from "@/features/journey/hooks/queries/use-my-journey";

import { JourneyManagement } from "./journey-management";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyManagementPanelProps {
  /**
   * Public identifier of the Journey being managed.
   *
   * The authenticated backend projection is resolved from this public ID.
   */
  readonly journeyPublicId: string;

  /**
   * Optional additional class name.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

function JourneyManagementLoadingState() {
  return (
    <div
      className={[
        "flex",
        "min-h-64",
        "items-center",
        "justify-center",
        "rounded-[var(--radius-lg)]",
        "border",
        "border-[var(--border)]",
        "bg-[var(--surface)]",
      ].join(" ")}
      role="status"
      aria-label="Loading Journey"
    >
      <div className="flex items-center gap-3">
        <Spinner size="md" />

        <span className="text-sm text-[var(--foreground-muted)]">
          Loading Journey…
        </span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyManagementPanel({
  journeyPublicId,
  className,
}: JourneyManagementPanelProps) {
  const normalizedJourneyPublicId = journeyPublicId.trim();

  // ---------------------------------------------------------------------------
  // Query
  // ---------------------------------------------------------------------------
  //
  // IMPORTANT:
  // This hook intentionally runs before any conditional return.
  //
  // React Hooks must execute in the same order on every render. Do not move
  // this invocation below the empty-ID guard.
  //
  // The hook receives the normalized identifier and is responsible for
  // avoiding an HTTP request when the identifier is empty.
  // ---------------------------------------------------------------------------

  const {
    journey,
    isLoading,
    error,
    refetch,
  } = useMyJourney(normalizedJourneyPublicId);

  // ---------------------------------------------------------------------------
  // Invalid identifier
  // ---------------------------------------------------------------------------
  //
  // Route-level parameter validation should normally prevent this state, but
  // the panel still protects the management boundary from operating without
  // a valid public ID.
  //
  // This check occurs AFTER the hook invocation so Hook ordering remains
  // unconditional.
  // ---------------------------------------------------------------------------

  if (normalizedJourneyPublicId.length === 0) {
    return (
      <div className={className}>
        <ErrorState
          title="Journey unavailable"
          description="A valid Journey identifier is required."
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className={className}>
        <JourneyManagementLoadingState />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (error) {
    return (
      <div className={className}>
        <ErrorState
          title="Unable to load Journey"
          description={
            error instanceof Error
              ? error.message
              : "We could not load this Journey. Please try again."
          }
          retryAction={{
            label: "Try Again",
            onClick: async () => {
              await refetch();
            },
          }}
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Not found
  // ---------------------------------------------------------------------------
  //
  // The query completed without an error but did not produce a Journey.
  // Keep this separate from the transport/error state because the management
  // layer should never receive an undefined Journey.
  // ---------------------------------------------------------------------------

  if (!journey) {
    return (
      <div className={className}>
        <ErrorState
          title="Journey not found"
          description="This Journey could not be found or is no longer available to manage."
          retryAction={{
            label: "Try Again",
            onClick: async () => {
              await refetch();
            },
          }}
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Loaded
  // ---------------------------------------------------------------------------

  return (
    <div className={className}>
      <JourneyManagement
        journey={journey}
        onRefresh={refetch}
      />
    </div>
  );
}
