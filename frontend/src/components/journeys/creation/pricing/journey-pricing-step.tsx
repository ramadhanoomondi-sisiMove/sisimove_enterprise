// -----------------------------------------------------------------------------
// sisiMove — Journey Pricing Step
// -----------------------------------------------------------------------------
//
// Composes the Pricing step of Journey creation.
//
// Responsibilities:
// - Provide the shared presentation boundary for Journey pricing.
// - Render the pricing form supplied by the route/workflow owner.
// - Keep pricing persistence outside this component.
//
// Architectural boundary:
// - Pricing is a Journey-owned component.
// - The Journey aggregate owns pricing configuration.
// - The route/workflow invokes the Journey pricing command through the
//   feature mutation hook.
// - This component does NOT create domain entities.
// - It does NOT calculate commission.
// - It does NOT calculate provider income.
// - It does NOT convert currencies.
// - It does NOT call the Journey API directly.
// - It does NOT own navigation.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyPricingStepProps {
  /**
   * Pricing configuration UI supplied by the route/workflow owner.
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

export function JourneyPricingStep({
  children,
  className,
}: JourneyPricingStepProps) {
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
        aria-labelledby="journey-pricing-heading"
      >
        <div className="mb-3">
          <h2
            id="journey-pricing-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Journey pricing
          </h2>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            Set the amount passengers will contribute toward this Journey.
          </p>
        </div>

        {children}
      </section>
    </div>
  );
}