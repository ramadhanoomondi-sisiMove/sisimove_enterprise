// -----------------------------------------------------------------------------
// sisiMove — Journey Management Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Load the authenticated owner's Journey.
// - Own the single-Journey query boundary.
// - Handle loading, error, and successful states.
// - Provide refetch to the management composition.
// - Provide route-owned publication success actions to the management surface.
// - Keep route/query concerns outside the lower-level management components.
//
// Non-responsibilities:
// - No Journey lifecycle mutation logic.
// - No Journey editing/persistence logic.
// - No capability inference.
// - No authorization decisions.
// - No recreation of the Journey aggregate.
// - No navigation construction.
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
//          ├── loading / error / not-found boundary
//          │
//          ▼
//   JourneyManagement
//          │
//          ├── JourneyEditor
//          ├── JourneyActions
//          └── SuccessModal
//                   │
//                   └── publicationSuccessActions
//
// Navigation ownership:
//
//   MyJourneyPage
//          │
//          └── publicationSuccessActions
//                    │
//                    ▼
//             JourneyManagementPanel
//                    │
//                    ▼
//             JourneyManagement
//
// The panel forwards the route-owned acknowledgement actions without
// interpreting, constructing, or owning navigation destinations.
//
// Important React rule:
//
// The query hook MUST be called unconditionally. Route validation therefore
// happens after the hook invocation rather than before it.
//
// The hook itself is responsible for safely ignoring an empty identifier.
//
// Mutation acknowledgement:
//
// JourneyManagementPanel owns the authoritative projection refresh through
// `refetch`. Lower-level mutation components notify JourneyManagement when a
// mutation succeeds. JourneyManagement decides whether that refresh should be
// awaited or performed in the background depending on the mutation flow.
//
// In particular, publication success must not wait for projection refresh before
// showing its success acknowledgement.
//
// -----------------------------------------------------------------------------

"use client";

import type { ReactNode } from "react";

import { ErrorState, Spinner } from "@/components/ui";
import { cn } from "@/foundation/utils/cn";

import { useMyJourney } from "@/features/journey/hooks/queries/use-my-journey";

import { JourneyManagement } from "./journey-management";

// =============================================================================
// Props
// =============================================================================

export interface JourneyManagementPanelProps {
  /**
   * Public identifier of the Journey being managed.
   *
   * The authenticated backend projection is resolved from this public ID.
   */
  readonly journeyPublicId: string;

  /**
   * Optional actions rendered by the publication success acknowledgement.
   *
   * Navigation is owned by the route/page boundary. The management panel only
   * transports the already-composed presentation content to JourneyManagement.
   */
  readonly publicationSuccessActions?: ReactNode;

  /**
   * Optional additional class name.
   */
  readonly className?: string;
}

// =============================================================================
// Loading State
// =============================================================================

function JourneyManagementLoadingState() {
  return (
    <div
      className={cn(
        "flex",
        "min-h-64",
        "items-center",
        "justify-center",
        "rounded-[var(--radius-lg)]",
        "border",
        "border-[var(--border)]",
        "bg-[var(--surface)]",
        "shadow-[var(--shadow-sm)]",
      )}
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

// =============================================================================
// Component
// =============================================================================

export function JourneyManagementPanel({
  journeyPublicId,
  publicationSuccessActions,
  className,
}: JourneyManagementPanelProps) {
  const normalizedJourneyPublicId = journeyPublicId.trim();

  // ===========================================================================
  // Query
  // ===========================================================================
  //
  // IMPORTANT:
  // This hook intentionally runs before any conditional return.
  //
  // React Hooks must execute in the same order on every render. Do not move
  // this invocation below the empty-ID guard.
  //
  // The hook receives the normalized identifier and is responsible for
  // avoiding an HTTP request when the identifier is empty.
  //
  // ===========================================================================

  const {
    journey,
    isLoading,
    error,
    refetch,
  } = useMyJourney(normalizedJourneyPublicId);

  // ===========================================================================
  // Invalid Identifier
  // ===========================================================================

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

  // ===========================================================================
  // Loading
  // ===========================================================================

  if (isLoading) {
    return (
      <div className={className}>
        <JourneyManagementLoadingState />
      </div>
    );
  }

  // ===========================================================================
  // Error
  // ===========================================================================

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

  // ===========================================================================
  // Not Found
  // ===========================================================================
  //
  // The query completed without an error but did not produce a Journey.
  //
  // Keep this separate from the transport/error state because the management
  // layer should never receive an undefined Journey.
  //
  // ===========================================================================

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

  // ===========================================================================
  // Loaded
  // ===========================================================================

  return (
    <div className={className}>
      <JourneyManagement
        journey={journey}
        onRefresh={refetch}
        publicationSuccessActions={publicationSuccessActions}
      />
    </div>
  );
}