// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Participants
// -----------------------------------------------------------------------------
//
// Composition-only participant section.
//
// Parent/container owns:
// - participant query state
// - mutations
// - authorization
// - capability decisions
// - authoritative refresh
// -----------------------------------------------------------------------------

import type { JourneyDemandParticipant } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { JourneyDemandParticipantEmptyState } from './journey-demand-participant-empty-state';
import { JourneyDemandParticipantList } from './journey-demand-participant-list';

export interface JourneyDemandParticipantsProps {
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

export function JourneyDemandParticipants({
  participants,
  emphasis = 'default',
  disabled = false,
  withdrawingParticipantPublicId,
  removingParticipantPublicId,
  onWithdraw,
  onRemove,
  className,
}: JourneyDemandParticipantsProps) {
  const isCompact = emphasis === 'compact';

  return (
    <section
      className={cn('min-w-0', className)}
      aria-labelledby="journey-demand-participants-heading"
    >
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <h2
            id="journey-demand-participants-heading"
            className={cn(
              'font-semibold text-foreground',
              isCompact ? 'text-sm' : 'text-base',
            )}
          >
            Participants
          </h2>

          <p
            className={cn(
              'mt-0.5 text-foreground-muted',
              isCompact ? 'text-xs' : 'text-sm',
            )}
          >
            People currently associated with this travel need.
          </p>
        </div>

        {participants.length > 0 ? (
          <span
            className={cn(
              'shrink-0 text-foreground-muted',
              isCompact ? 'text-xs' : 'text-sm',
            )}
          >
            {participants.length}{' '}
            {participants.length === 1
              ? 'participant'
              : 'participants'}
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        {participants.length > 0 ? (
          <JourneyDemandParticipantList
            participants={participants}
            emphasis={emphasis}
            disabled={disabled}
            withdrawingParticipantPublicId={
              withdrawingParticipantPublicId
            }
            removingParticipantPublicId={
              removingParticipantPublicId
            }
            onWithdraw={onWithdraw}
            onRemove={onRemove}
          />
        ) : (
          <JourneyDemandParticipantEmptyState
            emphasis={emphasis}
          />
        )}
      </div>
    </section>
  );
}