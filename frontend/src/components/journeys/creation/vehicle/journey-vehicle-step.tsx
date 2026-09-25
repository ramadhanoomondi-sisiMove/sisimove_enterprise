import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle Step
// -----------------------------------------------------------------------------
//
// Composes the Vehicle step of Journey creation.
//
// Responsibilities:
// - Provide the shared presentation boundary for vehicle configuration.
// - Render the vehicle form supplied by the route/workflow owner.
// - Keep Journey API orchestration outside the component.
// - Provide the user-facing context for the Vehicle configuration step.
//
// Architectural boundary:
// - Journey Vehicle is a Journey-owned component.
// - Vehicle configuration is submitted through the Journey aggregate workflow.
// - The Journey application layer creates/configures the Journey Vehicle and
//   attaches it to the Journey aggregate.
// - `assetPublicId`, when supplied, references an existing Asset owned by the
//   Assets domain.
// - This component does NOT call the Journey API directly.
// - It does NOT own persistence.
// - It does NOT own navigation.
// - It does NOT create or upload Assets.
// - It does NOT perform authorization or Journey lifecycle validation.
//
// The concrete vehicle form is responsible for presenting fields such as:
// - make;
// - model;
// - year;
// - color;
// - registration;
// - optional vehicle Asset selection.
//
// The route/workflow owner remains responsible for:
// - loading the persisted Journey Vehicle;
// - collecting form changes;
// - invoking the appropriate Journey mutation;
// - handling API errors;
// - navigating between creation steps.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyVehicleStepProps {
  /**
   * Vehicle configuration UI supplied by the route/workflow owner.
   *
   * The concrete vehicle form owns vehicle-specific input presentation and
   * local editing state. This step remains a presentation-level composition
   * boundary and does not perform persistence or navigation.
   */
  children: ReactNode;

  /**
   * Optional additional classes supplied by the parent workflow.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyVehicleStep({
  children,
  className,
}: JourneyVehicleStepProps) {
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
        aria-labelledby="journey-vehicle-heading"
      >
        <div className="mb-3">
          <h2
            id="journey-vehicle-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Vehicle
          </h2>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            Tell travellers which vehicle you will use for this Journey.
          </p>
        </div>

        {children}
      </section>
    </div>
  );
}