// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Participant Actions
// -----------------------------------------------------------------------------
//
// Presentation of participant actions.
//
// The component does not perform mutations. The parent supplies callbacks
// after determining the applicable capability/authorization.
//
// `canParticipate` is consumed as a backend-provided capability fact.
// -----------------------------------------------------------------------------

'use client';

import type { JourneyDemandParticipant } from '@/features/journey-demand/models';
import { Button } from '@/components/ui';
import { cn } from '@/foundation';

export interface JourneyDemandParticipantActionsProps {
  readonly participant: JourneyDemandParticipant;
  readonly disabled?: boolean;
  readonly isWithdrawing?: boolean;
  readonly isRemoving?: boolean;
  readonly onWithdraw?: () => void;
  readonly onRemove?: () => void;
  readonly className?: string;
}

export function JourneyDemandParticipantActions({
  participant,
  disabled = false,
  isWithdrawing = false,
  isRemoving = false,
  onWithdraw,
  onRemove,
  className,
}: JourneyDemandParticipantActionsProps) {
  const actionDisabled =
    disabled ||
    isWithdrawing ||
    isRemoving;

  if (!onWithdraw && !onRemove) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex min-w-0 flex-wrap items-center gap-2',
        className,
      )}
    >
      {onWithdraw ? (
        <Button
          variant="outline"
          size="sm"
          loading={isWithdrawing}
          disabled={
            actionDisabled ||
            !participant.canParticipate
          }
          onClick={onWithdraw}
        >
          Withdraw
        </Button>
      ) : null}

      {onRemove ? (
        <Button
          variant="danger"
          size="sm"
          loading={isRemoving}
          disabled={
            actionDisabled ||
            !participant.canParticipate
          }
          onClick={onRemove}
        >
          Remove
        </Button>
      ) : null}
    </div>
  );
}