// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Owner Detail
// -----------------------------------------------------------------------------
//
// Authenticated owner-facing Journey Demand detail composition.
//
// This component consumes MyJourneyDemand because the backend exposes a
// dedicated authenticated-owner read contract.
//
// It must remain separate from the public JourneyDemandDetail:
//
//   PublicJourneyDemand
//       → public marketplace/detail presentation
//
//   MyJourneyDemand
//       → authenticated owner's detail/presentation
//
// The owner boundary may receive management actions from its parent, but it
// does not decide which actions are permitted.
//
// Architecture rules:
// - No data fetching.
// - No ownership checks.
// - No authorization decisions.
// - No mutation calls.
// - No lifecycle inference.
// - No public-model casts.
// - No reconstruction of backend aggregates/value objects.
//
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import type { MyJourneyDemand } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { MyJourneyDemandDetail } from './my-journey-demand-detail';

// =============================================================================
// Props
// =============================================================================

/**
 * Props for the authenticated owner's Journey Demand detail view.
 *
 * Ownership and authorization are established by the parent route/container.
 * This component receives the already-authorized owner read model.
 */
export interface JourneyDemandOwnerDetailProps {
  /**
   * Authenticated-owner Journey Demand read contract.
   */
  readonly demand: MyJourneyDemand;

  /**
   * Optional management actions supplied by the owning container.
   */
  readonly actions?: ReactNode;

  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Presents the authenticated owner's Journey Demand detail.
 *
 * This component deliberately does not:
 *
 * - fetch the demand;
 * - determine ownership;
 * - perform authorization;
 * - call mutations;
 * - infer lifecycle capabilities;
 * - cast MyJourneyDemand to PublicJourneyDemand;
 * - expose or reconstruct internal Journey Demand identifiers.
 *
 * Management actions are supplied separately by the owning container.
 */
export function JourneyDemandOwnerDetail({
  demand,
  actions,
  className,
}: JourneyDemandOwnerDetailProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <MyJourneyDemandDetail demand={demand} />

      {actions ? (
        <div className="mt-5 min-w-0 border-t border-border pt-5">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

