// -----------------------------------------------------------------------------
// Path: src/features/journey-demand/components/manage/my-journey-demand-detail.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — My Journey Demand Detail
//
// Authenticated owner's read-only Journey Demand detail composition.
//
// Architecture:
// - Consumes MyJourneyDemand only.
// - Receives an already-loaded owner projection.
// - Does not fetch.
// - Does not determine ownership.
// - Does not authorize.
// - Does not mutate.
// - Does not infer lifecycle transitions.
// - Does not compose editing sections.
// - Does not reconstruct backend domain objects.
//
// IMPORTANT
// ---------
// Editing is now owned by JourneyDemandEditor.
//
// The composition is:
//
//     JourneyDemandManagementPanel
//          ↓
//     JourneyDemandManagement
//          ├── JourneyDemandEditor
//          │      └── JourneyDemandEditorSections
//          │
//          └── JourneyDemandActions
//
// Therefore this component must remain a read-only owner-detail surface.
// It must not retain the old MyJourneyDemandSections abstraction.
//
// -----------------------------------------------------------------------------
//
// Read model boundary:
//
//     MyJourneyDemand
//             ↓
//     MyJourneyDemandDetail
//
// This component must never consume PublicJourneyDemand and must never cast
// between the two read models.
//
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import type { MyJourneyDemand } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { MyJourneyDemandOverview } from './my-journey-demand-overview';

// =============================================================================
// Props
// =============================================================================

/**
 * Props for the authenticated owner's read-only Journey Demand detail.
 *
 * The parent/container supplies the already-loaded authenticated owner's
 * projection.
 *
 * Management UI remains external because editing and lifecycle actions have
 * their own ownership boundaries.
 */
export interface MyJourneyDemandDetailProps {
  /**
   * Authenticated owner's Journey Demand read model.
   */
  readonly demand: MyJourneyDemand;

  /**
   * Optional management UI supplied by the owning container.
   *
   * This is deliberately a ReactNode rather than a lifecycle-specific API.
   * This component does not decide which management controls should exist.
   */
  readonly management?: ReactNode;

  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Composes the authenticated owner's Journey Demand detail.
 *
 * This component is intentionally small.
 *
 * It presents:
 *
 *     MyJourneyDemandOverview
 *             +
 *     optional externally supplied management UI
 *
 * It does NOT:
 *
 * - fetch the Journey Demand;
 * - determine ownership;
 * - perform authorization;
 * - call mutations;
 * - infer lifecycle capabilities;
 * - compose editing sections;
 * - construct backend commands;
 * - reconstruct backend domain objects;
 * - convert a public Journey Demand into an owner Journey Demand.
 *
 * Editing section composition belongs to JourneyDemandEditor.
 */
export function MyJourneyDemandDetail({
  demand,
  management,
  className,
}: MyJourneyDemandDetailProps) {
  return (
    <div className={cn('min-w-0 space-y-4', className)}>
      {/* ------------------------------------------------------------------- */}
      {/* Read-only owner projection                                         */}
      {/* ------------------------------------------------------------------- */}
      <MyJourneyDemandOverview demand={demand} />

      {/* ------------------------------------------------------------------- */}
      {/* External management surface                                         */}
      {/* ------------------------------------------------------------------- */}
      {management ? (
        <section
          className="min-w-0"
          aria-labelledby="my-journey-demand-management-heading"
        >
          <h2
            id="my-journey-demand-management-heading"
            className="sr-only"
          >
            Journey Demand management
          </h2>

          {management}
        </section>
      ) : null}
    </div>
  );
}