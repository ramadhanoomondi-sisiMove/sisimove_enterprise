// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Owner Detail
// -----------------------------------------------------------------------------
//
// Authenticated owner-facing Journey Demand detail composition.
//
// Architecture:
// - Consumes MyJourneyDemand only.
// - Receives an already-authorized owner read model.
// - Delegates detail presentation to MyJourneyDemandDetail.
// - Receives management UI from the parent/container.
// - Does not own mutation state or mutation execution.
//
// Responsibilities deliberately excluded:
// - data fetching;
// - ownership checks;
// - authorization decisions;
// - lifecycle decisions;
// - mutation calls;
// - public-model conversion;
// - backend aggregate reconstruction.
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

export interface JourneyDemandOwnerDetailProps {
  /**
   * Authenticated-owner Journey Demand read contract.
   *
   * Ownership and authorization are established by the parent route/container.
   */
  readonly demand: MyJourneyDemand;

  /**
   * Optional management UI supplied by the owning container.
   *
   * This component does not determine which actions are available.
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
 * Management remains external to this component's responsibility. The parent
 * decides what management UI to provide; MyJourneyDemandDetail composes it
 * with the owner detail presentation.
 */
export function JourneyDemandOwnerDetail({
  demand,
  actions,
  className,
}: JourneyDemandOwnerDetailProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <MyJourneyDemandDetail
        demand={demand}
        management={actions}
      />
    </div>
  );
}
