'use client';

// -----------------------------------------------------------------------------
// sisiMove — My Journey Demands List
// -----------------------------------------------------------------------------
//
// Authenticated collection presentation for the current member's Journey
// Demands.
//
// Responsibilities:
// - render the authenticated member's Journey Demands;
// - preserve the collection order supplied by the backend;
// - pass presentation callbacks to each Journey Demand card.
//
// Non-responsibilities:
// - no page-width management;
// - no data fetching;
// - no sorting or filtering;
// - no lifecycle/business-state derivation;
// - no mutations;
// - no ownership reconstruction;
// - no management-capability decisions.
//
// Layout responsibility:
//
//   MyJourneyDemandsRoute
//          ↓
//   page/content width
//          ↓
//   MyJourneyDemandsList
//          ↓
//   MyJourneyDemandCard
// -----------------------------------------------------------------------------

import type { MyJourneyDemand } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import {
  MyJourneyDemandCard,
  type MyJourneyDemandCardProps,
} from './my-journey-demand-card';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MyJourneyDemandsListProps {
  readonly demands: readonly MyJourneyDemand[];
  readonly onManage?: MyJourneyDemandCardProps['onManage'];
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Collection
// -----------------------------------------------------------------------------

/**
 * Renders the authenticated member's Journey Demands.
 *
 * The collection order supplied by the backend is preserved.
 *
 * This component does not:
 * - fetch Journey Demands;
 * - sort or filter the collection;
 * - derive lifecycle state;
 * - perform mutations;
 * - determine ownership or management capabilities.
 */
export function MyJourneyDemandsList({
  demands,
  onManage,
  className,
}: MyJourneyDemandsListProps) {
  if (demands.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'min-w-0 space-y-3',
        className,
      )}
      aria-label="My travel needs"
    >
      {demands.map((demand) => (
        <MyJourneyDemandCard
          key={demand.publicId}
          demand={demand}
          onManage={onManage}
        />
      ))}
    </div>
  );
}
