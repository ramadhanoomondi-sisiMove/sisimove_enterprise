// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Schedule Editor
// -----------------------------------------------------------------------------
//
// Controlled editor for the complete authenticated Journey Demand schedule.
//
// Architecture:
// - Consumes JourneyDemandSchedule.
// - Composes JourneyDemandScheduleFields (103).
// - Does not fetch data.
// - Does not call mutation hooks.
// - Does not persist data directly.
// - Does not own authorization/capability decisions.
// - Emits the edited schedule through onChange.
// - May expose an explicit save boundary to its parent.
//
// The parent/container owns:
// - loading the schedule;
// - authorization;
// - capability checks;
// - persistence;
// - mutation hooks;
// - success/error handling;
// - refreshing the authoritative backend response.
//
// This component owns schedule-editor composition only.
//
// Backend-provided convenience flags are deliberately preserved while the
// editable date fields change. They are not reconstructed in the frontend.
//
// -----------------------------------------------------------------------------

'use client';

import type { JourneyDemandSchedule } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { JourneyDemandScheduleFields } from './journey-demand-schedule-fields';

export interface JourneyDemandScheduleEditorProps {
  readonly schedule: JourneyDemandSchedule;
  readonly onChange?: (schedule: JourneyDemandSchedule) => void;
  readonly onSave?: () => void;
  readonly isSaving?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function JourneyDemandScheduleEditor({
  schedule,
  onChange,
  onSave,
  isSaving = false,
  disabled = false,
  className,
}: JourneyDemandScheduleEditorProps) {
  const isDisabled = disabled || isSaving;

  return (
    <section
      className={cn(
        'surface min-w-0',
        'p-4 sm:p-5',
        className,
      )}
      aria-labelledby="journey-demand-schedule-editor-heading"
    >
      {/* ---------------------------------------------------------------------
          Editor heading
      --------------------------------------------------------------------- */}
      <div className="min-w-0">
        <h2
          id="journey-demand-schedule-editor-heading"
          className="text-base font-semibold text-foreground"
        >
          Travel time
        </h2>

        <p className="mt-1 text-sm text-foreground-muted">
          Set when you can depart and any arrival requirements.
        </p>
      </div>

      {/* ---------------------------------------------------------------------
          Schedule fields
      --------------------------------------------------------------------- */}
      <div className="mt-5">
        <JourneyDemandScheduleFields
          schedule={schedule}
          onChange={onChange}
          disabled={isDisabled}
        />
      </div>

      {/* ---------------------------------------------------------------------
          Save boundary
          ---------------------------------------------------------------------

          Persistence remains outside this component. The parent decides
          whether a save action should be rendered by supplying onSave.
      --------------------------------------------------------------------- */}
      {onSave ? (
        <div
          className={cn(
            'mt-5 flex flex-col-reverse gap-3',
            'sm:flex-row sm:items-center sm:justify-end',
          )}
        >
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
            {isSaving ? 'Saving…' : 'Save schedule'}
          </button>
        </div>
      ) : null}
    </section>
  );
}

