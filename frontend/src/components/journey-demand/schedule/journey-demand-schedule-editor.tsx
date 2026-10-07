// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Schedule Editor
// -----------------------------------------------------------------------------
//
// Controlled editor for the complete authenticated Journey Demand schedule.
//
// Architecture:
// - consumes JourneyDemandSchedule;
// - composes JourneyDemandScheduleFields;
// - owns no server state;
// - performs no API requests;
// - does not call mutation hooks;
// - does not persist data directly;
// - does not own authorization or lifecycle capability decisions;
// - emits the complete edited schedule through onChange;
// - may expose an independent save boundary to the parent.
//
// The parent/container owns:
//
//     schedule draft
//          ↓
//     validation orchestration
//          ↓
//     updateJourneyDemandSchedule(...)
//          ↓
//     refetch()
//          ↓
//     success/error feedback
//
// Saving the schedule is independent from corridor, capacity, and pricing.
// There is intentionally no save-all operation here.
//
// Backend-provided convenience flags and metadata are preserved because this
// component passes the complete schedule object to the lower-level fields
// component. The frontend does not reconstruct backend-derived flags.
//
// This editor is suitable for the authenticated Edit / Review surface.
// "Edit" and "Review" remain the same workflow; this component simply exposes
// the schedule fields and an optional independent save action.
// -----------------------------------------------------------------------------

'use client';

import type { JourneyDemandSchedule } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { JourneyDemandScheduleFields } from './journey-demand-schedule-fields';

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandScheduleEditorProps {
  /**
   * Controlled Journey Demand schedule.
   */
  readonly schedule: JourneyDemandSchedule;

  /**
   * Emits the complete updated schedule.
   *
   * Persistence remains owned by the parent/container.
   */
  readonly onChange?: (schedule: JourneyDemandSchedule) => void;

  /**
   * Optional independent save action.
   */
  readonly onSave?: () => void | Promise<void>;

  /**
   * Indicates that this section is currently being persisted.
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

export function JourneyDemandScheduleEditor({
  schedule,
  onChange,
  onSave,
  isSaving = false,
  disabled = false,
  className,
}: JourneyDemandScheduleEditorProps) {
  /**
   * While saving, the schedule fields are disabled.
   *
   * This prevents the local draft from changing while the parent is
   * persisting the current schedule and avoids duplicate submissions.
   */
  const isDisabled = disabled || isSaving;

  return (
    <section
      className={cn(
        'surface',
        'min-w-0',
        'p-4',
        'sm:p-5',
        className,
      )}
      aria-labelledby="journey-demand-schedule-editor-heading"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Editor heading                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div className="min-w-0">
        <h2
          id="journey-demand-schedule-editor-heading"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Travel time
        </h2>

        <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
          Set when you can depart and any arrival requirements.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Schedule fields                                                     */}
      {/* ------------------------------------------------------------------- */}

      <div className="mt-5 min-w-0">
        <JourneyDemandScheduleFields
          schedule={schedule}
          onChange={onChange}
          disabled={isDisabled}
        />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Independent save boundary                                           */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * The save button belongs to this section because each Journey Demand
       * section is independently persisted.
       *
       * The button itself does not know how persistence works. The parent
       * supplies onSave and remains responsible for:
       *
       * - preparing the backend request;
       * - generating correlation identifiers;
       * - calling the mutation hook;
       * - refetching the authoritative response;
       * - showing success/error feedback.
       */}

      {onSave ? (
        <div
          className={cn(
            'mt-5',
            'flex',
            'flex-col-reverse',
            'gap-3',
            'border-t',
            'border-[var(--border)]',
            'pt-4',
            'sm:flex-row',
            'sm:items-center',
            'sm:justify-end',
          )}
        >
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
            {isSaving ? 'Saving…' : 'Save schedule'}
          </button>
        </div>
      ) : null}
    </section>
  );
}