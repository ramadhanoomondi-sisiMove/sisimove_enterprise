// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Participant Empty State
// -----------------------------------------------------------------------------

import { EmptyState } from '@/components/ui';
import { cn } from '@/foundation';

export interface JourneyDemandParticipantEmptyStateProps {
  readonly emphasis?: 'compact' | 'default';
  readonly className?: string;
}

export function JourneyDemandParticipantEmptyState({
  emphasis = 'default',
  className,
}: JourneyDemandParticipantEmptyStateProps) {
  return (
    <EmptyState
      title="No participants yet"
      description="No participant records are currently available for this travel need."
      className={cn(
        emphasis === 'compact' ? 'py-8' : 'py-10',
        className,
      )}
    />
  );
}