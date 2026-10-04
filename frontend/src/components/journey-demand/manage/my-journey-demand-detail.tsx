
// -----------------------------------------------------------------------------
// sisiMove — My Journey Demand Detail
// -----------------------------------------------------------------------------
//
// Authenticated owner's Journey Demand detail composition.
//
// Architecture rules:
// - Presentation/composition only.
// - Receives an already-loaded MyJourneyDemand.
// - Does not fetch the Journey Demand.
// - Does not determine ownership.
// - Does not perform authorization.
// - Does not call mutations.
// - Does not infer lifecycle transitions.
// - Does not construct backend domain objects.
// - Delegates presentation to dedicated owner-detail components.
//
// The authenticated owner detail intentionally consumes:
//
//     MyJourneyDemand
//
// It must not consume PublicJourneyDemand or cast between the two read
// models.
//
// Data loading and management behaviour remain with the owning route/container.
//
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import type { MyJourneyDemand } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { MyJourneyDemandOverview } from './my-journey-demand-overview';
import {
  MyJourneyDemandSections,
  type MyJourneyDemandSection,
} from './my-journey-demand-sections';

// =============================================================================
// Props
// =============================================================================

/**
 * Props for the authenticated owner's Journey Demand detail.
 *
 * The parent/route container supplies the already-loaded authenticated
 * Journey Demand projection and any additional owner-specific sections or
 * management UI.
 */
export interface MyJourneyDemandDetailProps {
  /**
   * Authenticated owner's Journey Demand read model.
   */
  readonly demand: MyJourneyDemand;

  /**
   * Additional owner-specific detail sections.
   */
  readonly sections?: readonly MyJourneyDemandSection[];

  /**
   * Optional management UI supplied by the owning container.
   *
   * This component does not determine which management actions are available.
   */
  readonly management?: ReactNode;

  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Composes the authenticated owner's Journey Demand detail view.
 *
 * This component deliberately does not:
 *
 * - fetch the Journey Demand;
 * - determine ownership;
 * - perform authorization;
 * - call mutations;
 * - infer lifecycle transitions;
 * - construct backend domain objects.
 *
 * Data access and management behaviour remain with the owning container.
 */
export function MyJourneyDemandDetail({
  demand,
  sections = [],
  management,
  className,
}: MyJourneyDemandDetailProps) {
  return (
    <div className={cn('min-w-0 space-y-4', className)}>
      <MyJourneyDemandOverview demand={demand} />

      <MyJourneyDemandSections sections={sections} />

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
