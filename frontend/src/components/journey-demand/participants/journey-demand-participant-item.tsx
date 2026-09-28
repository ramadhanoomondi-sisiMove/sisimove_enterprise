// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Participant Item
// -----------------------------------------------------------------------------
//
// Read-only presentation of an authenticated Journey Demand participant.
//
// Architecture:
// - Consumes JourneyDemandParticipant.
// - Does not fetch or mutate participant data.
// - Does not reconstruct backend lifecycle state.
// - Uses backend-provided participant state flags.
// - Participant identity remains an opaque memberPublicId.
// -----------------------------------------------------------------------------

import type { JourneyDemandParticipant } from '@/features/journey-demand/models';
import { Badge } from '@/components/ui';
import { cn } from '@/foundation';

import { JourneyDemandParticipantActions } from './journey-demand-participant-actions';

export interface JourneyDemandParticipantItemProps {
  readonly participant: JourneyDemandParticipant;
  readonly emphasis?: 'compact' | 'default';
  readonly disabled?: boolean;
  readonly isWithdrawing?: boolean;
  readonly isRemoving?: boolean;
  readonly onWithdraw?: () => void;
  readonly onRemove?: () => void;
  readonly className?: string;
}

export function JourneyDemandParticipantItem({
  participant,
  emphasis = 'default',
  disabled = false,
  isWithdrawing = false,
  isRemoving = false,
  onWithdraw,
  onRemove,
  className,
}: JourneyDemandParticipantItemProps) {
  const isCompact = emphasis === 'compact';

  return (
    <li
      className={cn(
        'min-w-0 rounded-[var(--radius-lg)]',
        'border border-[var(--border)]',
        'bg-[var(--surface)]',
        isCompact ? 'p-3' : 'p-4',
        className,
      )}
    >
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'truncate font-medium text-foreground',
              isCompact ? 'text-sm' : 'text-base',
            )}
          >
            Participant
          </p>

          <p
            className={cn(
              'mt-0.5 truncate text-foreground-muted',
              isCompact ? 'text-xs' : 'text-sm',
            )}
          >
            Member {participant.memberPublicId}
          </p>
        </div>

        <Badge
          variant={getStatusVariant(participant)}
          size={isCompact ? 'sm' : 'md'}
        >
          {getStatusLabel(participant)}
        </Badge>
      </div>

      <div className="mt-4 grid min-w-0 grid-cols-2 gap-3">
        <ParticipantValue
          label="Seats"
          value={String(participant.seats)}
          emphasis={emphasis}
        />

        <ParticipantValue
          label="Joined"
          value={formatParticipantDate(participant.joinedAt)}
          emphasis={emphasis}
        />
      </div>

      <div className="mt-4">
        <JourneyDemandParticipantActions
          participant={participant}
          disabled={disabled}
          isWithdrawing={isWithdrawing}
          isRemoving={isRemoving}
          onWithdraw={onWithdraw}
          onRemove={onRemove}
        />
      </div>
    </li>
  );
}

// -----------------------------------------------------------------------------
// Status
// -----------------------------------------------------------------------------

function getStatusLabel(
  participant: JourneyDemandParticipant,
): string {
  if (participant.isActive) {
    return 'Active';
  }

  if (participant.isWithdrawn) {
    return 'Withdrawn';
  }

  if (participant.isRemoved) {
    return 'Removed';
  }

  return participant.status;
}

function getStatusVariant(
  participant: JourneyDemandParticipant,
): 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'outline' {
  if (participant.isActive) {
    return 'success';
  }

  if (participant.isWithdrawn) {
    return 'warning';
  }

  if (participant.isRemoved) {
    return 'danger';
  }

  return 'default';
}

// -----------------------------------------------------------------------------
// Value
// -----------------------------------------------------------------------------

interface ParticipantValueProps {
  readonly label: string;
  readonly value: string;
  readonly emphasis: 'compact' | 'default';
}

function ParticipantValue({
  label,
  value,
  emphasis,
}: ParticipantValueProps) {
  return (
    <div className="min-w-0">
      <p
        className={cn(
          'text-foreground-muted',
          emphasis === 'compact' ? 'text-[11px]' : 'text-xs',
        )}
      >
        {label}
      </p>

      <p
        className={cn(
          'mt-0.5 truncate font-medium text-foreground',
          emphasis === 'compact' ? 'text-xs' : 'text-sm',
        )}
      >
        {value}
      </p>
    </div>
  );
}

function formatParticipantDate(date: Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
  }).format(date);
}