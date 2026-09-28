// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Participant Editor
// -----------------------------------------------------------------------------
//
// Controlled participant editor.
//
// Backend-owned lifecycle state is never edited directly here.
// The component exposes only the participant data represented by the editor
// contract. Persistence remains the responsibility of the parent/container.
// -----------------------------------------------------------------------------

'use client';

import type { JourneyDemandParticipant } from '@/features/journey-demand/models';
import { Button, Input } from '@/components/ui';
import { cn } from '@/foundation';

export interface JourneyDemandParticipantEditorProps {
  readonly participant: JourneyDemandParticipant;
  readonly onChange?: (
    participant: JourneyDemandParticipant,
  ) => void;
  readonly onRemove?: () => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function JourneyDemandParticipantEditor({
  participant,
  onChange,
  onRemove,
  disabled = false,
  className,
}: JourneyDemandParticipantEditorProps) {
  return (
    <section
      className={cn(
        'surface p-4 sm:p-5',
        className,
      )}
      aria-labelledby="journey-demand-participant-editor-heading"
    >
      <div>
        <h2
          id="journey-demand-participant-editor-heading"
          className="text-base font-semibold text-foreground"
        >
          Participant
        </h2>

        <p className="mt-1 text-sm text-foreground-muted">
          Manage the participant details supplied by the backend.
        </p>
      </div>

      <div className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
        <Input
          label="Member"
          value={participant.memberPublicId}
          disabled
          readOnly
        />

        <Input
          label="Seats"
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          value={participant.seats}
          disabled={disabled}
          onChange={(event) => {
            const nextValue = Number(event.target.value);

            if (
              Number.isInteger(nextValue) &&
              nextValue >= 1
            ) {
              onChange?.({
                ...participant,
                seats: nextValue,
              });
            }
          }}
        />

        <Input
          label="Status"
          value={formatStatus(participant.status)}
          disabled
          readOnly
        />

        <Input
          label="Joined"
          value={formatDate(participant.joinedAt)}
          disabled
          readOnly
        />
      </div>

      {onRemove ? (
        <div className="mt-5 flex justify-end">
          <Button
            variant="danger"
            size="sm"
            disabled={disabled}
            onClick={onRemove}
          >
            Remove participant
          </Button>
        </div>
      ) : null}
    </section>
  );
}

function formatStatus(
  status: JourneyDemandParticipant['status'],
): string {
  switch (status) {
    case 'ACTIVE':
      return 'Active';

    case 'WITHDRAWN':
      return 'Withdrawn';

    case 'REMOVED':
      return 'Removed';

    default:
      return status;
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
  }).format(date);
}