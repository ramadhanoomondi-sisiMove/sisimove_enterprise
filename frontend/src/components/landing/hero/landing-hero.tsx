// -----------------------------------------------------------------------------
// sisiMove — Landing Hero
// -----------------------------------------------------------------------------
//
// The hero is intentionally presented as ONE unified visual block.
//
// The copy and the journey illustration belong to the same surface and tell
// the same marketplace story:
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │                                                                           │
// │  Going somewhere?                    Nairobi ────────→ Mombasa            │
// │  Someone may be going your way.     Journey          Demand               │
// │  [Explore journeys] [Share plan]                                           │
// │                                                                           │
// └───────────────────────────────────────────────────────────────────────────┘
//
// The illustration is supporting visual context, not a separate feature card.
//
// -----------------------------------------------------------------------------

import Link from 'next/link';

import {
  ArrowRight,
  CarFront,
  MapPin,
  UsersRound,
} from 'lucide-react';

import { cn } from '@/foundation';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface LandingHeroProps {
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function LandingHero({
  className,
}: LandingHeroProps) {
  return (
    <section
      aria-labelledby="landing-hero-heading"
      className={cn(
        'w-full px-1 py-3',
        'sm:px-1.5 sm:py-4',
        'md:px-2 md:py-5',
        'lg:px-3 lg:py-6',
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Unified hero surface                                                */}
      {/* ------------------------------------------------------------------- */}
      <div
        className={cn(
          'relative isolate overflow-hidden',
          'w-full',
          'rounded-[var(--radius-2xl)]',
          'border border-[var(--border)]',
          'bg-[var(--surface)]',
          'shadow-[var(--shadow-md)]',
        )}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Shared atmospheric background                                      */}
        {/* ----------------------------------------------------------------- */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div
            className={cn(
              'absolute -left-24 -top-24',
              'h-64 w-64',
              'rounded-full',
              'bg-[var(--brand-soft)]',
              'blur-3xl',
            )}
          />

          <div
            className={cn(
              'absolute -bottom-32 -right-16',
              'h-72 w-72',
              'rounded-full',
              'bg-[var(--background-brand)]',
              'blur-3xl',
            )}
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Hero content                                                       */}
        {/* ----------------------------------------------------------------- */}
        <div
          className={cn(
            'grid min-w-0 items-center',
            'grid-cols-1',
            'gap-5',
            'p-4',
            'sm:gap-6 sm:p-6',
            'md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]',
            'md:gap-7 md:p-7',
            'lg:gap-10 lg:p-9',
          )}
        >
          {/* =============================================================== */}
          {/* Copy                                                             */}
          {/* =============================================================== */}
          <div className="min-w-0">
            {/* Small contextual label. */}
            <div
              className={cn(
                'mb-3 flex items-center gap-2',
                'text-xs font-semibold uppercase tracking-[0.16em]',
                'text-[var(--brand)]',
                'sm:mb-4',
              )}
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]"
              />

              <span>Travel, shared</span>
            </div>

            {/* Primary proposition. */}
            <h1
              id="landing-hero-heading"
              className={cn(
                'max-w-xl',
                'text-3xl font-semibold',
                'leading-[1.08]',
                'tracking-[-0.04em]',
                'text-[var(--foreground)]',
                'sm:text-4xl',
                'lg:text-5xl',
              )}
            >
              Going somewhere?
              <span className="block text-[var(--brand)]">
                Someone may be going your way.
              </span>
            </h1>

            <p
              className={cn(
                'mt-4 max-w-lg',
                'text-sm leading-6',
                'text-[var(--foreground-secondary)]',
                'sm:text-base sm:leading-7',
              )}
            >
              Find available seats, join a travel plan, or share where you
              need to go. Discover journeys already moving across Kenya.
            </p>

            {/* ------------------------------------------------------------- */}
            {/* Hero actions                                                   */}
            {/* ------------------------------------------------------------- */}
            <div
              className={cn(
                'mt-5 flex flex-wrap items-center',
                'gap-2.5',
                'sm:mt-6',
              )}
            >
              <Link
                href="#marketplace"
                className={cn(
                  'inline-flex min-h-10 items-center justify-center gap-2',
                  'rounded-[var(--radius-md)]',
                  'bg-[var(--brand)] px-4 py-2',
                  'text-sm font-semibold',
                  'text-[var(--brand-foreground)]',
                  'transition-colors',
                  'hover:bg-[var(--brand-hover)]',
                  'focus-visible:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-[var(--brand)]',
                  'focus-visible:ring-offset-2',
                )}
              >
                Explore journeys

                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4"
                />
              </Link>

              <Link
                href="/demands/create"
                className={cn(
                  'inline-flex min-h-10 items-center justify-center',
                  'rounded-[var(--radius-md)]',
                  'border border-[var(--border-strong)]',
                  'bg-[var(--surface)] px-4 py-2',
                  'text-sm font-semibold',
                  'text-[var(--foreground)]',
                  'transition-colors',
                  'hover:border-[var(--brand)]',
                  'hover:bg-[var(--brand-soft)]',
                  'hover:text-[var(--brand)]',
                  'focus-visible:outline-none',
                  'focus-visible:ring-2',
                  'focus-visible:ring-[var(--brand)]',
                  'focus-visible:ring-offset-2',
                )}
              >
                Share a travel plan
              </Link>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Marketplace legend                                             */}
            {/* ------------------------------------------------------------- */}
            <div
              className={cn(
                'mt-5 flex flex-wrap',
                'gap-x-4 gap-y-2',
                'text-xs',
                'text-[var(--foreground-muted)]',
                'sm:mt-6',
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                <CarFront
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-[var(--brand)]"
                />

                Published journeys
              </span>

              <span className="inline-flex items-center gap-1.5">
                <UsersRound
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-[var(--brand)]"
                />

                Travel demands
              </span>
            </div>
          </div>

          {/* =============================================================== */}
          {/* Connected marketplace illustration                              */}
          {/* =============================================================== */}
          <div className="relative min-w-0">
            {/*
             * This is intentionally NOT a separate card.
             *
             * It has no independent background surface or shadow. The hero's
             * single outer surface remains the visual container.
             */}
            <div
              className={cn(
                'relative min-w-0',
                'overflow-hidden',
                'rounded-[var(--radius-xl)]',
                'border border-[var(--border-subtle)]',
                'bg-[var(--brand-soft)]/45',
                'p-3',
                'sm:p-4',
              )}
            >
              {/* ----------------------------------------------------------- */}
              {/* Route heading                                                */}
              {/* ----------------------------------------------------------- */}
              <div className="flex min-w-0 items-center justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className={cn(
                      'text-[10px] font-semibold uppercase',
                      'tracking-[0.14em]',
                      'text-[var(--foreground-muted)]',
                    )}
                  >
                    A shared way
                  </p>

                  <p
                    className={cn(
                      'mt-1 truncate',
                      'text-sm font-semibold',
                      'text-[var(--foreground)]',
                      'sm:text-base',
                    )}
                  >
                    Nairobi to Mombasa
                  </p>
                </div>

                <span
                  className={cn(
                    'shrink-0 rounded-full',
                    'bg-[var(--surface)]',
                    'px-2 py-1',
                    'text-[10px] font-semibold',
                    'text-[var(--brand)]',
                    'shadow-[var(--shadow-sm)]',
                  )}
                >
                  sisiMove
                </span>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* Connected route                                              */}
              {/* ----------------------------------------------------------- */}
              <div
                className={cn(
                  'relative',
                  'my-5 px-2',
                  'sm:my-6',
                )}
              >
                {/* Route line. */}
                <div
                  aria-hidden="true"
                  className={cn(
                    'absolute left-5 right-5 top-1/2',
                    'border-t border-dashed',
                    'border-[var(--border-strong)]',
                  )}
                />

                {/* Route points. */}
                <div className="relative flex items-center justify-between">
                  <div
                    aria-hidden="true"
                    className={cn(
                      'h-4 w-4 shrink-0 rounded-full',
                      'border-4 border-[var(--brand)]',
                      'bg-[var(--surface)]',
                    )}
                  />

                  <div
                    aria-hidden="true"
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center',
                      'rounded-full',
                      'border border-[var(--brand)]',
                      'bg-[var(--surface)]',
                      'text-[var(--brand)]',
                      'shadow-[var(--shadow-sm)]',
                    )}
                  >
                    <CarFront className="h-4 w-4" />
                  </div>

                  <div
                    aria-hidden="true"
                    className={cn(
                      'h-4 w-4 shrink-0 rounded-full',
                      'border-4 border-[var(--brand)]',
                      'bg-[var(--surface)]',
                    )}
                  />
                </div>

                <div
                  className={cn(
                    'mt-2 flex justify-between gap-3',
                    'text-[11px] font-medium',
                    'text-[var(--foreground-secondary)]',
                  )}
                >
                  <span>Nairobi</span>
                  <span>Mombasa</span>
                </div>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* Journey ↔ Demand connection                                 */}
              {/* ----------------------------------------------------------- */}
              <div
                className={cn(
                  'grid',
                  'grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]',
                  'items-center gap-2',
                )}
              >
                {/* Journey */}
                <div
                  className={cn(
                    'min-w-0',
                    'rounded-[var(--radius-lg)]',
                    'border border-[var(--border)]',
                    'bg-[var(--surface)]',
                    'p-2.5',
                    'sm:p-3',
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center gap-1.5',
                      'text-[10px] font-semibold uppercase',
                      'tracking-wide',
                      'text-[var(--brand)]',
                    )}
                  >
                    <CarFront
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0"
                    />

                    <span>Journey</span>
                  </div>

                  <p
                    className={cn(
                      'mt-2 truncate',
                      'text-xs font-semibold',
                      'text-[var(--foreground)]',
                      'sm:text-sm',
                    )}
                  >
                    Available seats
                  </p>

                  <p className="mt-1 text-[11px] text-[var(--foreground-muted)]">
                    Share the ride
                  </p>
                </div>

                {/* Connection */}
                <div
                  aria-hidden="true"
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center',
                    'rounded-full',
                    'border border-[var(--border-strong)]',
                    'bg-[var(--surface)]',
                    'text-[var(--brand)]',
                  )}
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>

                {/* Demand */}
                <div
                  className={cn(
                    'min-w-0',
                    'rounded-[var(--radius-lg)]',
                    'border border-[var(--border)]',
                    'bg-[var(--surface)]',
                    'p-2.5',
                    'sm:p-3',
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center gap-1.5',
                      'text-[10px] font-semibold uppercase',
                      'tracking-wide',
                      'text-[var(--brand)]',
                    )}
                  >
                    <UsersRound
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0"
                    />

                    <span>Demand</span>
                  </div>

                  <p
                    className={cn(
                      'mt-2 truncate',
                      'text-xs font-semibold',
                      'text-[var(--foreground)]',
                      'sm:text-sm',
                    )}
                  >
                    Looking to travel
                  </p>

                  <p className="mt-1 text-[11px] text-[var(--foreground-muted)]">
                    Find a match
                  </p>
                </div>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* Illustration caption                                          */}
              {/* ----------------------------------------------------------- */}
              <div
                className={cn(
                  'mt-4 flex items-center gap-2',
                  'border-t border-[var(--border-subtle)]',
                  'pt-3',
                  'text-[11px]',
                  'text-[var(--foreground-muted)]',
                )}
              >
                <MapPin
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-[var(--brand)]"
                />

                <span>
                  One marketplace. More ways to get there.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}