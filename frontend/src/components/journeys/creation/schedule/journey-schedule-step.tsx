// -----------------------------------------------------------------------------
// sisiMove — Journey Schedule Step
// -----------------------------------------------------------------------------
//
// Composes the Schedule step of Journey creation.
//
// Responsibilities:
// - Present the schedule configuration surface.
// - Pass the existing Journey schedule to the schedule form.
// - Delegate schedule persistence to the parent workflow.
//
// This component does NOT:
// - Create schedule records.
// - Call the Journey API directly.
// - Own routing.
// - Persist form state.
// - Decide schedule business rules.
//
// The schedule form remains responsible for collecting schedule-specific
// values, while the route/page owns API orchestration and navigation.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyScheduleStepProps {
  /**
   * Existing schedule configuration supplied by the parent workflow.
   *
   * The concrete schedule form owns the schedule model and field-level
   * presentation. Keeping this boundary generic prevents the step container
   * from duplicating schedule-domain knowledge.
   */
  schedule?: unknown | null;

  /**
   * Schedule form supplied by the route/page.
   *
   * The schedule step intentionally does not own schedule persistence or
   * field-level business rules.
   */
  children: ReactNode;

  /**
   * Optional additional classes.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyScheduleStep({
  children,
  className,
}: JourneyScheduleStepProps) {
  return (
    <div
      className={[
        'space-y-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <section
        aria-labelledby="journey-schedule-heading"
      >
        <div className="mb-3">
          <h2
            id="journey-schedule-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Journey schedule
          </h2>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            Set when this Journey takes place so travellers know when to
            expect departure and arrival.
          </p>
        </div>

        {children}
      </section>
    </div>
  );
}