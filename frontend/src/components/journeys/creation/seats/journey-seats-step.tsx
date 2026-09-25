// -----------------------------------------------------------------------------
// sisiMove — Journey Seats Step
// -----------------------------------------------------------------------------
//
// Composes the Seats step of Journey creation.
//
// Responsibilities:
// - Provide the shared presentation boundary for Journey capacity.
// - Render the capacity form supplied by the route/workflow owner.
// - Keep capacity persistence outside this component.
//
// Architectural boundary:
// - Capacity is a Journey-owned component.
// - The Journey aggregate owns capacity configuration.
// - The route/workflow invokes the Journey capacity command through the
//   feature mutation hook.
// - A newly configured Journey starts with zero booked seats.
// - bookedSeats is not provider-editable through this creation form.
// - This component does NOT create domain entities.
// - It does NOT calculate booking availability.
// - It does NOT call the Journey API directly.
// - It does NOT own navigation.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneySeatsStepProps {
  /**
   * Capacity configuration UI supplied by the route/workflow owner.
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

export function JourneySeatsStep({
  children,
  className,
}: JourneySeatsStepProps) {
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
        aria-labelledby="journey-seats-heading"
      >
        <div className="mb-3">
          <h2
            id="journey-seats-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Available seats
          </h2>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            Set the number of passenger seats available on this Journey.
          </p>
        </div>

        {children}
      </section>
    </div>
  );
}