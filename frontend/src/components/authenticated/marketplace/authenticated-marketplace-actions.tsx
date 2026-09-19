// -----------------------------------------------------------------------------
// sisiMove — Authenticated Marketplace Actions
// -----------------------------------------------------------------------------
//
// Compact action prompt for the authenticated marketplace.
//
// Marketplace participation:
//
//     Existing journey found
//              │
//              └── Book / continue to journey
//
//     Journey not found
//              │
//              └── Create travel demand
//                       │
//                       └── Demand stays visible in the marketplace
//                              │
//                              └── When a suitable journey becomes available,
//                                  the member can be notified
//
//     Traveller has available seats
//              │
//              └── Publish a journey
//
// The component explains how travellers can participate in both sides of the
// SisiMove marketplace: publishing available seats or expressing unmet travel
// demand.
//
// A travel demand is not simply a failed search. It gives the marketplace a
// clear signal of where someone needs to travel. When a suitable journey
// becomes available, the member can be notified so they have an opportunity
// to act on the new supply.
//
// This component is presentation-only. It does not perform search, matching,
// notification delivery, or authorization.
// -----------------------------------------------------------------------------

import Link from 'next/link';

import {
  ArrowRight,
  CarFront,
  UsersRound,
} from 'lucide-react';

import { cn } from '@/foundation';

// =============================================================================
// Props
// =============================================================================

export interface AuthenticatedMarketplaceActionsProps {
  /**
   * Destination for the authenticated journey-publishing flow.
   */
  readonly publishJourneyHref: string;

  /**
   * Destination for the authenticated travel-demand creation flow.
   */
  readonly createDemandHref: string;

  /**
   * Optional additional classes supplied by the composition boundary.
   */
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function AuthenticatedMarketplaceActions({
  publishJourneyHref,
  createDemandHref,
  className,
}: AuthenticatedMarketplaceActionsProps) {
  return (
    <section
      aria-labelledby="authenticated-marketplace-actions-heading"
      className={cn(
        'w-full',
        'border-b border-[var(--border-subtle)]',
        'bg-[var(--background-brand)]',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div
          className={cn(
            'flex flex-col gap-4',
            'sm:flex-row sm:items-center sm:justify-between',
          )}
        >
          {/* -----------------------------------------------------------------
              Message
              ----------------------------------------------------------------- */}

          <div className="min-w-0">
            <h1
              id="authenticated-marketplace-actions-heading"
              className={cn(
                'text-lg font-semibold tracking-tight',
                'text-[var(--foreground)]',
                'sm:text-xl',
              )}
            >
              What are you looking to do?
            </h1>

            <p
              className={cn(
                'mt-1 max-w-2xl',
                'text-sm leading-5',
                'text-[var(--foreground-secondary)]',
              )}
            >
              Have available seats? Publish your journey and make your trip
              discoverable. Can’t find the journey you need? Create a travel
              demand so your travel need is visible to the marketplace. When a
              suitable journey becomes available, you can be notified.
            </p>
          </div>

          {/* -----------------------------------------------------------------
              Marketplace actions
              ----------------------------------------------------------------- */}

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {/* ---------------------------------------------------------------
                Publish a journey
                --------------------------------------------------------------- */}

            <Link
              href={publishJourneyHref}
              className={cn(
                'inline-flex min-h-10 items-center justify-center gap-2',
                'rounded-[var(--radius-md)]',
                'bg-[var(--brand)] px-3.5 py-2',
                'text-sm font-semibold',
                'text-[var(--brand-foreground)]',
                'transition-colors duration-150 ease-out',
                'hover:bg-[var(--brand-hover)]',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-[var(--brand)]',
                'focus-visible:ring-offset-2',
                'focus-visible:ring-offset-[var(--background-brand)]',
              )}
            >
              <CarFront
                aria-hidden="true"
                className="h-4 w-4"
              />

              <span>Publish a journey</span>
            </Link>

            {/* ---------------------------------------------------------------
                Create travel demand
                --------------------------------------------------------------- */}

            <Link
              href={createDemandHref}
              className={cn(
                'inline-flex min-h-10 items-center justify-center gap-2',
                'rounded-[var(--radius-md)]',
                'border border-[var(--border-strong)]',
                'bg-[var(--surface)] px-3.5 py-2',
                'text-sm font-semibold',
                'text-[var(--foreground)]',
                'transition-colors duration-150 ease-out',
                'hover:border-[var(--brand)]',
                'hover:bg-[var(--brand-soft)]',
                'hover:text-[var(--brand)]',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-[var(--brand)]',
                'focus-visible:ring-offset-2',
                'focus-visible:ring-offset-[var(--background-brand)]',
              )}
            >
              <UsersRound
                aria-hidden="true"
                className="h-4 w-4"
              />

              <span>Create travel demand</span>

              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthenticatedMarketplaceActions;