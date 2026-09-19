// -----------------------------------------------------------------------------
// sisiMove — Publish Journey Section
// -----------------------------------------------------------------------------
//
// Landing-page call-to-action for people who can provide a Journey.
//
// -----------------------------------------------------------------------------
// MARKETPLACE ROLE
// -----------------------------------------------------------------------------
//
// A Journey represents existing travel supply.
//
// Someone is already planning to travel and may have available seats. By
// publishing that Journey, they make the opportunity visible in the
// marketplace so travellers looking for that route can discover it.
//
// The marketplace relationship is:
//
//     Existing travel plan
//            │
//            ▼
//     Publish Journey
//            │
//            ▼
//     Available seats become discoverable
//            │
//            ▼
//     Travellers can find and book
//
// Publishing a Journey does NOT mean that this component itself creates,
// publishes, validates, or matches anything.
//
// -----------------------------------------------------------------------------
// LANDING-PAGE ACCESS RULE
// -----------------------------------------------------------------------------
//
// This component is used on the public landing marketplace.
//
// An unauthenticated visitor may:
//
// - view published Journeys;
// - view Journey Demands.
//
// An unauthenticated visitor may NOT:
//
// - publish a Journey;
// - create a Journey Demand;
// - book a Journey;
// - join a Journey Demand.
//
// Therefore:
//
//     Publish a journey
//            │
//            ▼
//         Sign in
//
// Authentication is the first access boundary. Verification is handled later
// by the authenticated marketplace when the user attempts to perform the
// protected action.
//
// This component does not perform that access check itself.
//
// -----------------------------------------------------------------------------
// ARCHITECTURE
// -----------------------------------------------------------------------------
//
// Presentation-only.
//
// This component does NOT:
//
// - create a Journey;
// - publish a Journey;
// - call an API;
// - access authentication state;
// - determine permissions;
// - determine verification status;
// - resolve provider eligibility;
// - perform booking or matching logic;
// - determine the final post-login destination.
//
// The CTA receives an `href` from the surrounding application.
//
// -----------------------------------------------------------------------------
// NAVIGATION
// -----------------------------------------------------------------------------
//
// The CTA is a Next.js Link because its purpose is navigation.
//
// For the public landing marketplace, the default destination is the
// canonical sign-in route:
//
//     /login
//
// The actual Journey creation and publishing flow remains an authenticated
// concern.
//
// -----------------------------------------------------------------------------
// VISUAL ROLE
// -----------------------------------------------------------------------------
//
// This section complements CreateDemandSection:
//
//     CREATE DEMAND
//     "I need a journey."
//
//     PUBLISH JOURNEY
//     "I am already travelling."
//
// The CTA remains secondary. The marketplace inventory remains the primary
// product surface.
//
// -----------------------------------------------------------------------------

import Link from 'next/link';

import {
  ArrowRight,
  CarFront,
  Route,
} from 'lucide-react';

import { cn } from '@/foundation';

// =============================================================================
// Props
// =============================================================================

export interface PublishJourneySectionProps {
  /**
   * Destination used by the CTA.
   *
   * The public landing marketplace defaults to the canonical sign-in route
   * because publishing a Journey is an authenticated marketplace action.
   *
   * The destination remains configurable so the surrounding composition
   * boundary can provide the appropriate route when this presentation
   * component is reused elsewhere.
   */
  readonly href?: string;

  /**
   * Optional additional class name.
   */
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function PublishJourneySection({
  href = '/login',
  className,
}: PublishJourneySectionProps) {
  return (
    <section
      aria-labelledby="publish-journey-heading"
      className={cn(
        'w-full min-w-0',
        'border-t border-[var(--border-subtle)]',
        'bg-[var(--background)]',
        className,
      )}
    >
      <div
        className={cn(
          'mx-auto w-full max-w-7xl',
          'px-1 py-6',
          'sm:px-1.5 sm:py-7',
          'md:px-2 md:py-8',
          'lg:px-3 lg:py-9',
        )}
      >
        <div
          className={cn(
            'relative mx-auto w-full max-w-4xl',
            'overflow-hidden',
            'rounded-[var(--radius-xl)]',
            'border border-[var(--border)]',
            'bg-[var(--surface)]',
            'shadow-[var(--shadow-sm)]',
          )}
        >
          {/* =================================================================
              Decorative journey treatment
          ================================================================= */}

          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute -right-16 -top-20',
              'h-48 w-48 rounded-full',
              'bg-[var(--brand-soft)]',
              'blur-3xl',
            )}
          />

          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute -bottom-20 -left-16',
              'h-40 w-40 rounded-full',
              'bg-[var(--success-soft)]',
              'blur-3xl',
            )}
          />

          <div
            className={cn(
              'relative grid min-w-0',
              'gap-6',
              'px-4 py-5',
              'sm:px-6 sm:py-6',
              'md:grid-cols-[auto_minmax(0,1fr)_auto]',
              'md:items-center md:gap-6',
              'lg:px-7',
            )}
          >
            {/* ===============================================================
                Journey identity
            =============================================================== */}

            <div
              className={cn(
                'flex shrink-0 items-center justify-center',
                'md:self-center',
              )}
            >
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center',
                  'rounded-[var(--radius-lg)]',
                  'bg-[var(--brand-soft)]',
                  'text-[var(--brand)]',
                  'ring-1 ring-[var(--brand)]/10',
                )}
              >
                <CarFront
                  aria-hidden="true"
                  className="h-5 w-5"
                />
              </div>
            </div>

            {/* ===============================================================
                Message
            =============================================================== */}

            <div className="min-w-0">
              <div
                className={cn(
                  'inline-flex items-center gap-2',
                  'text-[10px] font-semibold uppercase',
                  'tracking-[0.16em]',
                  'text-[var(--brand)]',
                )}
              >
                <Route
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                />

                <span>Already travelling?</span>
              </div>

              <h2
                id="publish-journey-heading"
                className={cn(
                  'mt-1.5',
                  'text-xl font-semibold',
                  'leading-tight tracking-[-0.025em]',
                  'text-[var(--foreground)]',
                  'sm:text-2xl',
                )}
              >
                Make your available seats discoverable.
              </h2>

              <p
                className={cn(
                  'mt-2 max-w-2xl',
                  'text-sm leading-6',
                  'text-[var(--foreground-secondary)]',
                  'sm:text-base sm:leading-7',
                )}
              >
                Publish the Journey you are already making and let travellers
                looking for the same route discover the available seats.
              </p>
            </div>

            {/* ===============================================================
                CTA
            =============================================================== */}

            <div className="shrink-0 md:justify-self-end">
              <Link
                href={href}
                className={cn(
                  'group inline-flex min-h-10 w-full',
                  'items-center justify-center gap-2',
                  'rounded-[var(--radius-md)]',
                  'border border-[var(--brand)]',
                  'bg-[var(--surface)]',
                  'px-4 py-2',
                  'text-sm font-semibold',
                  'text-[var(--brand)]',
                  'shadow-[var(--shadow-sm)]',
                  'transition-all duration-150',
                  'hover:border-[var(--brand-hover)]',
                  'hover:bg-[var(--brand-soft)]',
                  'hover:text-[var(--brand-hover)]',
                  'hover:shadow-[var(--shadow-md)]',
                  'focus-visible:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-[var(--brand)]',
                  'focus-visible:ring-offset-2',
                  'focus-visible:ring-offset-[var(--surface)]',
                  'sm:w-auto',
                )}
              >
                <span>Publish a journey</span>

                <ArrowRight
                  aria-hidden="true"
                  className={cn(
                    'h-4 w-4',
                    'transition-transform duration-150',
                    'group-hover:translate-x-0.5',
                  )}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

