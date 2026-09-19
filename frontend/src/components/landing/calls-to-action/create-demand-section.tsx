// -----------------------------------------------------------------------------
// sisiMove — Create Demand Section
// -----------------------------------------------------------------------------
//
// Landing-page call-to-action for travellers who cannot find a suitable
// published Journey.
//
// -----------------------------------------------------------------------------
// MARKETPLACE ROLE
// -----------------------------------------------------------------------------
//
// Journey Demand is a first-class marketplace object.
//
// When a suitable published Journey is not available, a visitor can make
// their travel need visible by creating a Demand.
//
// The marketplace can then expose that Demand to:
//
// - other travellers who may want to join the same plan;
// - potential providers who may be able to publish a suitable Journey.
//
// The important distinction is:
//
//     Create Demand
//          │
//          ├── Other travellers may join
//          │
//          └── Potential providers may discover the need
//
// Creating a Demand does NOT require another traveller to join before a
// provider can discover it.
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
// - create a Journey Demand;
// - publish a Journey;
// - book a Journey;
// - join a Journey Demand.
//
// Therefore:
//
//     Create travel demand
//              │
//              ▼
//          Sign in
//
// Authentication is the first access boundary. Verification is handled
// later by the authenticated marketplace when the user attempts to perform
// the protected action.
//
// This component does not perform that access check itself.
//
// -----------------------------------------------------------------------------
// ARCHITECTURE
// -----------------------------------------------------------------------------
//
// This component is presentation-only.
//
// It does NOT:
//
// - create a Journey Demand;
// - call an API;
// - access authentication state;
// - own authentication logic;
// - determine permissions;
// - determine verification status;
// - resolve marketplace matching;
// - resolve authentication state;
// - determine the final post-login destination.
//
// Navigation is expressed through `href` so the surrounding application can
// decide how authenticated and unauthenticated visitors should be handled.
//
// The public landing page supplies the sign-in destination for this CTA.
//
// -----------------------------------------------------------------------------
// NAVIGATION
// -----------------------------------------------------------------------------
//
// The CTA is a Next.js Link because its purpose is navigation.
//
// For the public landing marketplace, the default destination is the
// canonical authentication route:
//
//     /login
//
// The actual Demand creation flow remains an authenticated concern.
//
// -----------------------------------------------------------------------------
// VISUAL ROLE
// -----------------------------------------------------------------------------
//
// This is intentionally quieter than the LandingHero.
//
// The marketplace inventory remains the primary product surface.
//
// This section acts as a useful fallback:
//
//     "I don't see what I need → make the need visible."
//
// The CTA still communicates the intended user action:
//
//     Create travel demand
//
// but the landing page routes the unauthenticated visitor through sign-in
// before they can create the Demand.
//
// -----------------------------------------------------------------------------
// FUTURE AUTHENTICATED MARKETPLACE
// -----------------------------------------------------------------------------
//
// The authenticated marketplace may reuse this presentation component with
// an authenticated destination or action boundary.
//
// That future composition must apply:
//
//     Authenticated
//          │
//          └── Create Demand
//                  │
//                  └── Verification guidance when required
//
// Authentication and verification therefore remain outside this component.
//
// -----------------------------------------------------------------------------

import Link from 'next/link';

import {
  ArrowRight,
  MapPinned,
  UsersRound,
} from 'lucide-react';

import { cn } from '@/foundation';

// =============================================================================
// Props
// =============================================================================

export interface CreateDemandSectionProps {
  /**
   * Destination used by the CTA.
   *
   * The public landing marketplace defaults to the canonical sign-in route
   * because Demand creation is an authenticated marketplace action.
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

export function CreateDemandSection({
  href = '/login',
  className,
}: CreateDemandSectionProps) {
  return (
    <section
      aria-labelledby="create-demand-heading"
      className={cn(
        'w-full min-w-0',
        'border-y border-[var(--border-subtle)]',
        'bg-[var(--background-subtle)]',
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
            'border border-[var(--brand)]/15',
            'bg-[var(--surface)]',
            'shadow-[var(--shadow-sm)]',
          )}
        >
          {/* =================================================================
              Decorative demand treatment
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
              'bg-[var(--brand-soft)]',
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
                Demand identity
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
                <MapPinned
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
                <UsersRound
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                />

                <span>Can&apos;t find your journey?</span>
              </div>

              <h2
                id="create-demand-heading"
                className={cn(
                  'mt-1.5',
                  'text-xl font-semibold',
                  'leading-tight tracking-[-0.025em]',
                  'text-[var(--foreground)]',
                  'sm:text-2xl',
                )}
              >
                Tell the market where you need to go.
              </h2>

              <p
                className={cn(
                  'mt-2 max-w-2xl',
                  'text-sm leading-6',
                  'text-[var(--foreground-secondary)]',
                  'sm:text-base sm:leading-7',
                )}
              >
                Create a travel demand and make your plan visible to people
                who may want to join or providers who may be able to offer
                the journey.
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
                  'bg-[var(--brand)]',
                  'px-4 py-2',
                  'text-sm font-semibold',
                  'text-[var(--brand-foreground)]',
                  'shadow-[var(--shadow-sm)]',
                  'transition-all duration-150',
                  'hover:border-[var(--brand-hover)]',
                  'hover:bg-[var(--brand-hover)]',
                  'hover:shadow-[var(--shadow-md)]',
                  'focus-visible:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-[var(--brand)]',
                  'focus-visible:ring-offset-2',
                  'focus-visible:ring-offset-[var(--surface)]',
                  'sm:w-auto',
                )}
              >
                <span>Create travel demand</span>

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
