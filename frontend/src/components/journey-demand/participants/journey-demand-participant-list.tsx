// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Participant List
// -----------------------------------------------------------------------------
//
// Collection presentation for Journey Demand participants.
//
// The supplied backend ordering is preserved. The frontend does not sort,
// filter, or reconstruct participant lifecycle state.
// -----------------------------------------------------------------------------

import type { JourneyDemandParticipant } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { JourneyDemandParticipantItem } from './journey-demand-participant-item';

export interface JourneyDemandParticipantListProps {
  readonly participants: readonly JourneyDemandParticipant[];
  readonly emphasis?: 'compact' | 'default';
  readonly disabled?: boolean;
  readonly withdrawingParticipantPublicId?: string;
  readonly removingParticipantPublicId?: string;
  readonly onWithdraw?: (
    participant: JourneyDemandParticipant,
  ) => void;
  readonly onRemove?: (
    participant: JourneyDemandParticipant,
  ) => void;
  readonly className?: string;
}

export function JourneyDemandParticipantList({
  participants,
  emphasis = 'default',
  disabled = false,
  withdrawingParticipantPublicId,
  removingParticipantPublicId,
  onWithdraw,
  onRemove,
  className,
}: JourneyDemandParticipantListProps) {
  if (participants.length === 0) {
    return null;
  }

  return (
    <ul className={cn('min-w-0 space-y-3', className)}>
      {participants.map((participant) => (
        <JourneyDemandParticipantItem
          key={participant.publicId}
          participant={participant}
          emphasis={emphasis}
          disabled={disabled}
          isWithdrawing={
            withdrawingParticipantPublicId === participant.publicId
          }
          isRemoving={
            removingParticipantPublicId === participant.publicId
          }
          onWithdraw={
            onWithdraw
              ? () => onWithdraw(participant)
              : undefined
          }
          onRemove={
            onRemove
              ? () => onRemove(participant)
              : undefined
          }
        />
      ))}
    </ul>
  );
}