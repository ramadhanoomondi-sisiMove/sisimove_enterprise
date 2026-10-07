// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Capacity Editor
// -----------------------------------------------------------------------------
//
// Controlled editor for Journey Demand capacity.
//
// Architecture:
//
// - consumes the authenticated JourneyDemandCapacity model;
// - composes JourneyDemandSeatControl;
// - owns no server state;
// - performs no API requests;
// - does not call mutation hooks;
// - does not persist data directly;
// - does not own authorization;
// - does not own Journey Demand lifecycle decisions;
// - does not infer matching capability;
// - does not construct backend domain objects;
// - emits the complete edited capacity through onChange.
//
// Parent ownership:
//
//     draft state
//          ↓
//     validation / workflow
//          ↓
//     updateJourneyDemandCapacity(...)
//          ↓
//     authoritative refetch
//          ↓
//     success / error acknowledgement
//
// Saving is intentionally independent from the other Journey Demand sections.
// A traveller can therefore edit and save requested capacity without requiring
// corridor, schedule, or pricing to be submitted at the same time.
//
// -----------------------------------------------------------------------------
// sisiMove — Edit / Review surface
// -----------------------------------------------------------------------------
//
// The component is deliberately neutral between:
//
//     /my-demands/[publicId]
//
// and any future dedicated edit route.
//
// It does not distinguish between "edit" and "review".
//
// The parent controls whether the component is editable by supplying:
//
//     disabled
//
// and controls persistence through:
//
//     onSave
//
// -----------------------------------------------------------------------------
//
// Capacity ownership:
//
//     requestedSeats
//          ↑
//          │ editable by requester
//          │
//     JourneyDemandCapacityEditor
//          │
//          └── JourneyDemandSeatControl
//
//     matchedSeats
//          ↑
//          │ authoritative lifecycle information
//          │
//          └── read-only presentation
//
// `requestedSeats` is the traveller's requested capacity.
// `matchedSeats` belongs to the matching/lifecycle projection and must not be
// treated as an editable field.
//
// -----------------------------------------------------------------------------

'use client';

import type { JourneyDemandCapacity } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { JourneyDemandSeatControl } from './journey-demand-seat-control';

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandCapacityEditorProps {
  /**
   * Controlled Journey Demand capacity draft.
   *
   * The parent owns this value. The editor never creates a separate server
   * representation of the capacity.
   */
  readonly capacity: JourneyDemandCapacity;

  /**
   * Emits the complete edited capacity.
   *
   * The editor does not decide whether the change is valid for persistence.
   * The owning workflow performs validation and translates the draft into the
   * existing Journey Demand update request.
   */
  readonly onChange?: (
    capacity: JourneyDemandCapacity,
  ) => void;

  /**
   * Optional independent save action for this section.
   *
   * The parent owns the mutation, refetch, error handling, and success
   * acknowledgement.
   */
  readonly onSave?: () => void | Promise<void>;

  /**
   * Indicates that the parent is currently persisting this section.
   */
  readonly isSaving?: boolean;

  /**
   * External disabled state supplied by the parent.
   */
  readonly disabled?: boolean;

  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyDemandCapacityEditor({
  capacity,
  onChange,
  onSave,
  isSaving = false,
  disabled = false,
  className,
}: JourneyDemandCapacityEditorProps) {
  /**
   * Persistence state is treated as input-disabled state.
   *
   * This prevents the controlled draft from changing while its current value
   * is being persisted and prevents accidental duplicate submissions.
   */
  const isDisabled =
    disabled ||
    isSaving;

  // ---------------------------------------------------------------------------
  // Requested seats
  // ---------------------------------------------------------------------------

  /**
   * The seat control only edits the requester's desired number of seats.
   *
   * matchedSeats is intentionally not included here because it is backend
   * lifecycle/matching information rather than editable requester input.
   */
  function handleSeatsChange(
    requestedSeats: number,
  ): void {
    onChange?.({
      ...capacity,
      requestedSeats,
    });
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <section
      className={cn(
        'surface',
        'min-w-0',
        'p-4',
        'sm:p-5',
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
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Seats
        </h2>

        <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
          Set how many seats you need for this Journey Demand.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Requested seats                                                     */}
      {/* ------------------------------------------------------------------- */}

      <div className="mt-5 max-w-sm">
        <JourneyDemandSeatControl
          value={capacity.requestedSeats}
          onChange={
            handleSeatsChange
          }
          disabled={isDisabled}
        />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Matched seats                                                       */}
      {/* ------------------------------------------------------------------- */}

      {/*
       * matchedSeats is authoritative backend matching information.
       *
       * It is intentionally displayed as read-only context. The requester
       * controls requestedSeats; the matching workflow controls matchedSeats.
       */}
      <div
        className={cn(
          'mt-4',
          'rounded-[var(--radius-md)]',
          'border',
          'border-[var(--border-subtle)]',
          'bg-[var(--background-subtle)]',
          'p-3',
        )}
      >
        <p className="text-xs text-[var(--foreground-muted)]">
          Matched seats
        </p>

        <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
          {capacity.matchedSeats}
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Independent section save                                            */}
      {/* ------------------------------------------------------------------- */}

      {/*
       * The Save control is deliberately optional.
       *
       * The editor can therefore be used in two valid compositions:
       *
       * 1. standalone section editing:
       *
       *       CapacityEditor
       *            ↓
       *       onSave()
       *
       * 2. a larger management workflow where the owning container controls
       *    when and how the section is persisted.
       *
       * In both cases this component does not call the mutation itself.
       */}
      {onSave ? (
        <div className="mt-5 flex justify-end border-t border-[var(--border)] pt-4">
          <button
            type="button"
            onClick={() => {
              void onSave();
            }}
            disabled={isDisabled}
            className={cn(
              'inline-flex',
              'min-h-10',
              'items-center',
              'justify-center',
              'rounded-[var(--radius-md)]',
              'bg-[var(--brand)]',
              'px-4',
              'py-2',
              'text-sm',
              'font-semibold',
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
            {isSaving
              ? 'Saving…'
              : 'Save capacity'}
          </button>
        </div>
      ) : null}
    </section>
  );
}