'use client';

import type { MyJourneyDemand } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import {
  MyJourneyDemandCard,
  type MyJourneyDemandCardProps,
} from './my-journey-demand-card';

export interface MyJourneyDemandsListProps {
  readonly demands: readonly MyJourneyDemand[];
  readonly onView?: MyJourneyDemandCardProps['onView'];
  readonly className?: string;
}

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
  onView,
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
          onView={onView}
        />
      ))}
    </div>
  );
}

