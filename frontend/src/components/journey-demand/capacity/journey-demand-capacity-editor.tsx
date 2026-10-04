// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Capacity Editor
// -----------------------------------------------------------------------------
//
// Controlled editor for Journey Demand capacity.
//
// Architecture:
// - Consumes JourneyDemandCapacity.
// - Composes JourneyDemandSeatControl.
// - Does not fetch data.
// - Does not call mutation hooks.
// - Does not persist data directly.
// - Does not own authorization/capability decisions.
// - Emits the edited capacity through onChange.
//
// The parent/container owns persistence, validation orchestration,
// authorization, mutation state, and backend error handling.
//
// -----------------------------------------------------------------------------

'use client';

import type { JourneyDemandCapacity } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { JourneyDemandSeatControl } from './journey-demand-seat-control';

export interface JourneyDemandCapacityEditorProps {
  readonly capacity: JourneyDemandCapacity;
  readonly onChange?: (capacity: JourneyDemandCapacity) => void;
  readonly onSave?: () => void;
  readonly isSaving?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function JourneyDemandCapacityEditor({
  capacity,
  onChange,
  onSave,
  isSaving = false,
  disabled = false,
  className,
}: JourneyDemandCapacityEditorProps) {
  const isDisabled = disabled || isSaving;

  const handleSeatsChange = (requestedSeats: number): void => {
    onChange?.({
      ...capacity,
      requestedSeats,
    });
  };

  return (
    <section
      className={cn(
        'surface min-w-0',
        'p-4 sm:p-5',
        className,
      )}
      aria-labelledby="journey-demand-capacity-editor-heading"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div className="min-w-0">
        <h2
          id="journey-demand-capacity-editor-heading"
          className="text-base font-semibold text-foreground"
        >
          Seats
        </h2>

        <p className="mt-1 text-sm text-foreground-muted">
          Set how many seats are needed for this Journey Demand.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Requested Seats                                                     */}
      {/* ------------------------------------------------------------------- */}

      <div className="mt-5 max-w-sm">
        <JourneyDemandSeatControl
          value={capacity.requestedSeats}
          onChange={handleSeatsChange}
          disabled={isDisabled}
        />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Matched Seats                                                       */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          'mt-4 rounded-[var(--radius-md)]',
          'border border-[var(--border-subtle)]',
          'bg-[var(--background-subtle)]',
          'p-3',
        )}
      >
        <p className="text-xs text-foreground-muted">
          Matched seats
        </p>

        <p className="mt-1 text-sm font-semibold text-foreground">
          {capacity.matchedSeats}
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Save                                                                */}
      {/* ------------------------------------------------------------------- */}

      {onSave ? (
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onSave}
            disabled={isDisabled}
            className={cn(
              'inline-flex min-h-10 items-center justify-center',
              'rounded-[var(--radius-md)]',
              'bg-[var(--brand)]',
              'px-4 text-sm font-semibold',
              'text-[var(--brand-foreground)]',
              'transition-colors',
              'hover:bg-[var(--brand-hover)]',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]',
              'focus-visible:ring-offset-2',
              'disabled:pointer-events-none',
              'disabled:opacity-50',
            )}
          >
            {isSaving ? 'Saving…' : 'Save capacity'}
          </button>
        </div>
      ) : null}
    </section>
  );
}
