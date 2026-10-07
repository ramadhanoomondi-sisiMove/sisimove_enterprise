'use client';

// -----------------------------------------------------------------------------
// Path:
// src/features/journey-demand/components/manage/journey-demand-management-panel.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Demand Management Panel
//
// Authenticated single-Journey-Demand management query boundary.
//
// -----------------------------------------------------------------------------
//
// RESPONSIBILITIES
// -----------------------------------------------------------------------------
//
// This component owns the authenticated read-model boundary for one Journey
// Demand.
//
// It is responsible for:
//
// - receiving the Journey Demand public ID;
// - normalizing the route-provided identifier;
// - invoking useMyJourneyDemand();
// - handling loading state;
// - handling query errors;
// - handling an absent Journey Demand projection;
// - providing the authoritative MyJourneyDemand projection to management;
// - providing refetch to the management composition;
// - transporting management inputs supplied by the owning page/container.
//
// -----------------------------------------------------------------------------
//
// NON-RESPONSIBILITIES
// -----------------------------------------------------------------------------
//
// This component does NOT:
//
// - implement Journey Demand lifecycle mutations;
// - implement Journey Demand editing/persistence;
// - compose editor sections;
// - own section-level editor state;
// - infer lifecycle capabilities;
// - make authorization decisions;
// - construct domain commands;
// - reconstruct backend aggregates;
// - construct navigation URLs;
// - own cancellation confirmation state;
// - own publication mutation state;
// - own matching mutation state;
// - own conversion mutation state;
// - own fulfilment mutation state.
//
// -----------------------------------------------------------------------------
//
// ARCHITECTURE
// -----------------------------------------------------------------------------
//
//   /my-demands/[publicId]
//          │
//          ▼
//   JourneyDemandManagementPanel
//          │
//          ├── useMyJourneyDemand(publicId)
//          │
//          ├── loading / error / invalid-ID boundary
//          │
//          ▼
//   JourneyDemandManagement
//          │
//          ├── JourneyDemandEditor
//          │       │
//          │       └── JourneyDemandEditorSections
//          │               ├── Overview
//          │               ├── Corridor
//          │               ├── Schedule
//          │               ├── Capacity
//          │               └── Pricing
//          │
//          └── JourneyDemandActions
//                  │
//                  ├── Publish
//                  ├── Cancel
//                  ├── Match
//                  ├── Convert
//                  └── Fulfill
//
// -----------------------------------------------------------------------------
//
// QUERY OWNERSHIP
// -----------------------------------------------------------------------------
//
// The panel is the single authenticated read-model query boundary.
//
//     useMyJourneyDemand(publicId)
//              │
//              ▼
//     MyJourneyDemand
//
// Lower-level management components receive the already-loaded projection.
//
// They do not independently query the same Journey Demand.
//
// -----------------------------------------------------------------------------
//
// MUTATION OWNERSHIP
// -----------------------------------------------------------------------------
//
// Lifecycle mutations remain owned by their individual lifecycle action
// components.
//
// Editing mutations remain owned by JourneyDemandEditor and its specialized
// update hooks.
//
// This panel does not know how any mutation is implemented.
//
// -----------------------------------------------------------------------------
//
// PROJECTION REFRESH
// -----------------------------------------------------------------------------
//
//     successful editor/lifecycle mutation
//                  │
//                  ▼
//       JourneyDemandManagement
//                  │
//                  │ onRefresh()
//                  ▼
//       JourneyDemandManagementPanel
//                  │
//                  │ refetch()
//                  ▼
//       useMyJourneyDemand()
//                  │
//                  ▼
//       authoritative MyJourneyDemand
//
// The panel therefore owns the read-model refresh mechanism.
//
// It does not merge mutation results into the existing `demand` object.
//
// The next render receives the authoritative backend projection.
//
// -----------------------------------------------------------------------------
//
// EDITOR OWNERSHIP
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// `JourneyDemandEditor` now owns its section composition.
//
// Therefore this panel MUST NOT receive, construct, or pass:
//
//     sections
//
// The previous architecture allowed:
//
//     JourneyDemandManagement
//              ↓
//          sections
//              ↓
//       JourneyDemandEditor
//
// The current architecture is:
//
//     JourneyDemandManagement
//              ↓
//       JourneyDemandEditor
//              ↓
//       JourneyDemandEditorSections
//
// This keeps the management layer independent of the editor's internal
// presentation structure.
//
// -----------------------------------------------------------------------------
//
// REACT HOOK RULE
// -----------------------------------------------------------------------------
//
// The query hook MUST be invoked unconditionally.
//
// Route validation therefore occurs after the hook invocation.
//
// The hook itself is responsible for safely avoiding an HTTP request when
// the supplied identifier is empty.
//
// -----------------------------------------------------------------------------
//
// AUTHORIZATION
// -----------------------------------------------------------------------------
//
// This component does not determine whether the authenticated member owns
// the requested Journey Demand.
//
// The authenticated backend `/me` query remains authoritative.
//
// A public ID only identifies the resource being requested; it does not grant
// ownership.
//
// -----------------------------------------------------------------------------
//


import { cn } from '@/foundation';

import { ErrorState, Spinner } from '@/components/ui';

import { useMyJourneyDemand } from '@/features/journey-demand/hooks/queries/use-my-journey-demand';

import type { JourneyDemandManagementProps } from './journey-demand-management';
import { JourneyDemandManagement } from './journey-demand-management';

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandManagementPanelProps
  extends Omit<
    JourneyDemandManagementProps,
    'demand' | 'onRefresh'
  > {
  /**
   * Public identifier of the Journey Demand being managed.
   *
   * The authenticated backend read model is resolved from this identifier.
   *
   * Ownership is NOT inferred from the identifier and is NOT checked here.
   */
  readonly journeyDemandPublicId: string;
}

// =============================================================================
// Loading State
// =============================================================================

function JourneyDemandManagementLoadingState() {
  return (
    <div
      className={cn(
        'flex',
        'min-h-64',
        'items-center',
        'justify-center',
        'rounded-[var(--radius-lg)]',
        'border',
        'border-[var(--border)]',
        'bg-[var(--surface)]',
        'shadow-[var(--shadow-sm)]',
      )}
      role="status"
      aria-label="Loading Journey Demand"
    >
      <div className="flex items-center gap-3">
        <Spinner size="md" />

        <span className="text-sm text-[var(--foreground-muted)]">
          Loading Journey Demand…
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// Component
// =============================================================================

export function JourneyDemandManagementPanel({
  journeyDemandPublicId,
  ...managementProps
}: JourneyDemandManagementPanelProps) {
  // ===========================================================================
  // Normalize Route Identifier
  // ===========================================================================
  //
  // This is intentionally minimal route-input normalization.
  //
  // The panel does not transform the identifier into a domain value and does
  // not attempt to validate whether it belongs to the authenticated member.
  //
  // ===========================================================================

  const normalizedJourneyDemandPublicId =
    journeyDemandPublicId.trim();

  // ===========================================================================
  // Query
  // ===========================================================================
  //
  // IMPORTANT:
  //
  // This hook is intentionally invoked before every conditional return.
  //
  // React Hooks must execute in a stable order on every render.
  //
  // The hook itself safely avoids the HTTP request when the identifier is
  // empty.
  //
  // ===========================================================================

  const {
    demand,
    isLoading,
    error,
    refetch,
  } = useMyJourneyDemand(
    normalizedJourneyDemandPublicId,
  );

  // ===========================================================================
  // Invalid Identifier
  // ===========================================================================
  //
  // An empty route identifier cannot address a Journey Demand.
  //
  // This is a route/read-model boundary concern only.
  //
  // It is NOT an ownership or authorization decision.
  //
  // ===========================================================================

  if (normalizedJourneyDemandPublicId.length === 0) {
    return (
      <div className={managementProps.className}>
        <ErrorState
          title="Journey Demand unavailable"
          description="A valid Journey Demand identifier is required."
        />
      </div>
    );
  }

  // ===========================================================================
  // Loading
  // ===========================================================================

  if (isLoading) {
    return (
      <div className={managementProps.className}>
        <JourneyDemandManagementLoadingState />
      </div>
    );
  }

  // ===========================================================================
  // Query Error
  // ===========================================================================
  //
  // The authenticated backend/query boundary remains authoritative for
  // existence and ownership failures.
  //
  // The panel exposes that failure without attempting to interpret it as a
  // lifecycle or authorization capability.
  //
  // ===========================================================================

  if (error) {
    return (
      <div className={managementProps.className}>
        <ErrorState
          title="Unable to load Journey Demand"
          description={error.message}
          retryAction={{
            label: 'Try Again',
            onClick: async () => {
              await refetch();
            },
          }}
        />
      </div>
    );
  }

  // ===========================================================================
  // Missing Projection
  // ===========================================================================
  //
  // The authenticated query normally represents a missing/inaccessible
  // Journey Demand through `error`.
  //
  // This defensive guard ensures that lower-level management components never
  // receive an undefined Journey Demand projection.
  //
  // ===========================================================================

  if (!demand) {
    return (
      <div className={managementProps.className}>
        <ErrorState
          title="Journey Demand not found"
          description="This Journey Demand could not be found or is no longer available to manage."
          retryAction={{
            label: 'Try Again',
            onClick: async () => {
              await refetch();
            },
          }}
        />
      </div>
    );
  }

  // ===========================================================================
  // Loaded Management Surface
  // ===========================================================================
  //
  // At this point the panel has an authoritative MyJourneyDemand projection.
  //
  // The panel passes only:
  //
  //     demand
  //     onRefresh
  //     management inputs
  //
  // No editor sections are constructed here.
  //
  // JourneyDemandEditor owns its own section composition.
  //
  // ===========================================================================

  return (
    <div className={managementProps.className}>
      <JourneyDemandManagement
        {...managementProps}
        demand={demand}
        onRefresh={refetch}
      />
    </div>
  );
}