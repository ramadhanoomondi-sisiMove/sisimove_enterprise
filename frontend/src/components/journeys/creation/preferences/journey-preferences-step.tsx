// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Step
// -----------------------------------------------------------------------------
//
// Presentation boundary for the Journey Preferences creation step.
//
// Responsibilities:
// - Provide the shared visual structure for Journey preferences.
// - Render the preferences UI supplied by the route/workflow owner.
// - Keep persistence, navigation, and domain behavior outside this component.
//
// Architectural boundary:
// - Preferences are a Journey-owned component.
// - The Journey aggregate owns the Preferences configuration.
// - The route/workflow invokes the corresponding feature mutation.
// - The backend creates/configures JourneyPreferences from the submitted values
//   and attaches it to the Journey aggregate.
// - This component does NOT:
//   - create domain entities,
//   - call the Journey API,
//   - enforce domain invariants,
//   - calculate derived values, or
//   - own navigation.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyPreferencesStepProps {
  /**
   * Preferences configuration UI supplied by the route/workflow owner.
   */
  children: ReactNode;

  /**
   * Optional additional classes supplied by the composition owner.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyPreferencesStep({
  children,
  className,
}: JourneyPreferencesStepProps) {
  return (
    <div
      className={[
        'space-y-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <section aria-labelledby="journey-preferences-heading">
        <div className="mb-3">
          <h2
            id="journey-preferences-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Journey preferences
          </h2>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            Set the travel preferences passengers should know before booking.
          </p>
        </div>

        {children}
      </section>
    </div>
  );
}