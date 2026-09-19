// -----------------------------------------------------------------------------
// sisiMove — How It Works Section
// -----------------------------------------------------------------------------
//
// Public landing-page explanation of how the sisiMove marketplace works.
//
// The marketplace has two primary objects:
//
//     JOURNEY
//     Someone is already travelling and has available seats.
//
//     JOURNEY DEMAND
//     Someone wants to travel and is looking for a suitable journey.
//
// The section explains the marketplace loop:
//
//     Browse → Find a match → Travel
//
// It also shows the two ways a person can participate:
//
//     Already travelling → Publish a Journey
//     Need to travel     → Create a Journey Demand
//
// -----------------------------------------------------------------------------
// ARCHITECTURE
// -----------------------------------------------------------------------------
//
// Presentation-only.
//
// This component does NOT:
//
// - fetch marketplace data;
// - create Journeys;
// - create Journey Demands;
// - perform bookings;
// - perform authentication;
// - determine permissions;
// - resolve marketplace matches;
// - manage Journey or Demand lifecycle state.
//
// IMPORTANT PUBLIC-MARKETPLACE RULE:
//
// This section is rendered on the public landing page.
//
// Therefore the participation CTAs must NOT navigate directly to protected
// creation routes.
//
// Public visitor:
//
//     Publish a journey  → Sign in
//     Create demand      → Sign in
//
// After authentication, the authenticated marketplace/application boundary
// determines whether the user can continue or must complete verification.
//
// Route ownership remains in the routing foundation. This component consumes
// the authentication route rather than hardcoding `/login`.
//
// Links are navigation destinations supplied through props.
//
// -----------------------------------------------------------------------------
// BRANDING
// -----------------------------------------------------------------------------
//
// Visible sisiMove wordmarks use:
//
//     sisi → foreground / black
//     Move → brand / blue
//
// -----------------------------------------------------------------------------

import Link from 'next/link';

import {
  ArrowRight,
  CarFront,
  CheckCircle2,
  MapPin,
  Search,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/foundation';
import { AUTHENTICATION_ROUTES } from '@/foundation/routing';

// =============================================================================
// Props
// =============================================================================

export interface HowItWorksSectionProps {
  /**
   * Destination for creating a Journey Demand.
   *
   * On the public landing page this defaults to the authentication boundary.
   * An authenticated marketplace can provide its own destination/orchestration
   * when this presentation component is reused.
   */
  readonly createDemandHref?: string;

  /**
   * Destination for publishing a Journey.
   *
   * On the public landing page this defaults to the authentication boundary.
   * An authenticated marketplace can provide its own destination/orchestration
   * when this presentation component is reused.
   */
  readonly publishJourneyHref?: string;

  /**
   * Optional additional class name.
   */
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function HowItWorksSection({
  createDemandHref = AUTHENTICATION_ROUTES.LOGIN,
  publishJourneyHref = AUTHENTICATION_ROUTES.LOGIN,
  className,
}: HowItWorksSectionProps) {
  return (
    <section
      aria-labelledby="how-it-works-heading"
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
          'px-1 py-8',
          'sm:px-1.5 sm:py-10',
          'md:px-2 md:py-12',
          'lg:px-3 lg:py-14',
        )}
      >
        {/* ===================================================================
            Section introduction
        =================================================================== */}

        <div className="max-w-2xl">
          <div
            className={cn(
              'inline-flex items-center gap-2',
              'text-xs font-semibold uppercase tracking-[0.16em]',
              'text-[var(--brand)]',
            )}
          >
            <Sparkles
              aria-hidden="true"
              className="h-3.5 w-3.5"
            />

            <span>
              How{' '}
              <span aria-label="sisiMove">
                <span className="text-[var(--foreground)]">sisi</span>
                <span className="text-[var(--brand)]">Move</span>
              </span>{' '}
              works
            </span>
          </div>

          <h2
            id="how-it-works-heading"
            className={cn(
              'mt-2',
              'text-2xl font-semibold',
              'leading-tight tracking-[-0.03em]',
              'text-[var(--foreground)]',
              'sm:text-3xl',
            )}
          >
            A simpler way to find your way there.
          </h2>

          <p
            className={cn(
              'mt-3 max-w-xl',
              'text-sm leading-6',
              'text-[var(--foreground-secondary)]',
              'sm:text-base sm:leading-7',
            )}
          >
            Browse journeys already happening, make your travel need visible,
            and connect around a route that works for everyone.
          </p>
        </div>

        {/* ===================================================================
            Primary marketplace flow
        =================================================================== */}

        <div className="relative mt-7 sm:mt-8">
          {/*
           * Desktop-only connector.
           *
           * Decorative only. The semantic sequence is represented by the
           * numbered steps themselves.
           */}
          <div
            aria-hidden="true"
            className={cn(
              'absolute left-[16.66%] right-[16.66%] top-7',
              'hidden border-t border-dashed',
              'border-[var(--border-strong)]',
              'sm:block',
            )}
          />

          <div
            className={cn(
              'relative grid min-w-0',
              'gap-3',
              'sm:grid-cols-3 sm:gap-4',
            )}
          >
            <HowItWorksStep
              number="01"
              icon={Search}
              title="Browse"
              description="See journeys and travel demands already visible in the marketplace."
            />

            <HowItWorksStep
              number="02"
              icon={MapPin}
              title="Find a match"
              description="Choose an available seat or find a travel plan that fits your route."
            />

            <HowItWorksStep
              number="03"
              icon={CheckCircle2}
              title="Travel"
              description="Arrange the details, meet at the agreed place, and travel together."
            />
          </div>
        </div>

        {/* ===================================================================
            Participation paths
        =================================================================== */}

        <div className="mt-7 sm:mt-8">
          <div className="mb-3 flex items-center gap-2">
            <div
              aria-hidden="true"
              className="h-px flex-1 bg-[var(--border-subtle)]"
            />

            <span
              className={cn(
                'shrink-0 px-2',
                'text-[10px] font-semibold uppercase',
                'tracking-[0.16em]',
                'text-[var(--foreground-subtle)]',
              )}
            >
              Your side of the marketplace
            </span>

            <div
              aria-hidden="true"
              className="h-px flex-1 bg-[var(--border-subtle)]"
            />
          </div>

          <div
            className={cn(
              'grid min-w-0',
              'gap-3',
              'md:grid-cols-2 md:gap-4',
            )}
          >
            <MarketplacePath
              eyebrow="Already travelling?"
              title="Turn an empty seat into a shared journey."
              description="Publish the Journey you are already making and let travellers going your way discover the available seats."
              href={publishJourneyHref}
              actionLabel="Publish a journey"
              variant="journey"
            />

            <MarketplacePath
              eyebrow="Need a journey?"
              title="Put your travel plan on the map."
              description="Create a Journey Demand with where and when you want to travel, then let suitable journeys find the opportunity."
              href={createDemandHref}
              actionLabel="Create travel demand"
              variant="demand"
            />
          </div>
        </div>

        {/* ===================================================================
            Marketplace loop
        =================================================================== */}

        <div
          className={cn(
            'relative mt-5 overflow-hidden',
            'rounded-[var(--radius-xl)]',
            'border border-[var(--border)]',
            'bg-[var(--background-subtle)]',
            'px-4 py-4',
            'sm:px-5 sm:py-5',
          )}
        >
          {/* Decorative brand glow. */}
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute -right-12 -top-16',
              'h-36 w-36 rounded-full',
              'bg-[var(--brand-soft)]',
              'blur-3xl',
            )}
          />

          <div
            className={cn(
              'relative flex min-w-0 flex-col',
              'gap-4',
              'sm:flex-row sm:items-center sm:justify-between',
            )}
          >
            <div className="flex min-w-0 items-start gap-3">
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center',
                  'rounded-[var(--radius-md)]',
                  'bg-[var(--brand-soft)]',
                  'text-[var(--brand)]',
                )}
              >
                <UsersRound
                  aria-hidden="true"
                  className="h-4 w-4"
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  Supply meets demand.
                </p>

                <p
                  className={cn(
                    'mt-0.5 max-w-2xl',
                    'text-xs leading-5',
                    'text-[var(--foreground-muted)]',
                    'sm:text-sm',
                  )}
                >
                  The more journeys and travel plans people share, the more
                  opportunities there are to travel the same way.
                </p>
              </div>
            </div>

            <div
              aria-hidden="true"
              className={cn(
                'hidden h-9 w-9 shrink-0 items-center justify-center',
                'rounded-full',
                'border border-[var(--border)]',
                'bg-[var(--surface)]',
                'text-[var(--brand)]',
                'sm:flex',
              )}
            >
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Marketplace Path
// =============================================================================

interface MarketplacePathProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly actionLabel: string;
  readonly variant: 'journey' | 'demand';
}

function MarketplacePath({
  eyebrow,
  title,
  description,
  href,
  actionLabel,
  variant,
}: MarketplacePathProps) {
  const isJourney = variant === 'journey';

  /*
   * Resolve the visual treatment once instead of passing conditional arrays
   * into cn(). This keeps every cn() argument compatible with the project's
   * class-name utility.
   */
  const cardTone = isJourney
    ? 'border-[var(--success)]/20 bg-[var(--success-soft)]'
    : 'border-[var(--brand)]/20 bg-[var(--brand-soft)]';

  const iconTone = isJourney
    ? 'text-[var(--success)]'
    : 'text-[var(--brand)]';

  const labelTone = isJourney
    ? 'text-[var(--success)]'
    : 'text-[var(--brand)]';

  const glowTone = isJourney
    ? 'bg-[var(--success)]/10'
    : 'bg-[var(--brand)]/10';

  return (
    <div
      className={cn(
        'group relative min-w-0 overflow-hidden',
        'rounded-[var(--radius-xl)]',
        'border',
        'p-5',
        'transition-shadow duration-200',
        'hover:shadow-[var(--shadow-md)]',
        'sm:p-6',
        cardTone,
      )}
    >
      {/* Decorative corner treatment. */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -right-10 -top-10',
          'h-28 w-28 rounded-full',
          'blur-2xl',
          glowTone,
        )}
      />

      <div className="relative">
        {/* Path identity. */}
        <div className="flex min-w-0 items-center justify-between gap-3">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center',
              'rounded-[var(--radius-md)]',
              'bg-[var(--surface)]',
              iconTone,
            )}
          >
            {isJourney ? (
              <CarFront
                aria-hidden="true"
                className="h-5 w-5"
              />
            ) : (
              <UsersRound
                aria-hidden="true"
                className="h-5 w-5"
              />
            )}
          </div>

          <span
            className={cn(
              'rounded-full',
              'bg-[var(--surface)]/80',
              'px-2.5 py-1',
              'text-[10px] font-semibold uppercase tracking-[0.12em]',
              labelTone,
            )}
          >
            {isJourney ? 'Journey' : 'Demand'}
          </span>
        </div>

        <p
          className={cn(
            'mt-4',
            'text-[10px] font-semibold uppercase',
            'tracking-[0.16em]',
            labelTone,
          )}
        >
          {eyebrow}
        </p>

        <h3
          className={cn(
            'mt-1.5 max-w-lg',
            'text-lg font-semibold',
            'leading-snug tracking-[-0.02em]',
            'text-[var(--foreground)]',
            'sm:text-xl',
          )}
        >
          {title}
        </h3>

        <p
          className={cn(
            'mt-2 max-w-xl',
            'text-sm leading-6',
            'text-[var(--foreground-secondary)]',
          )}
        >
          {description}
        </p>

        <div className="mt-5">
          <Link
            href={href}
            className={cn(
              'inline-flex min-h-10 items-center justify-center gap-2',
              'rounded-[var(--radius-md)]',
              'border border-[var(--border)]',
              'bg-[var(--surface)]',
              'px-4 py-2',
              'text-sm font-semibold',
              labelTone,
              'shadow-[var(--shadow-sm)]',
              'transition-all',
              'hover:border-[var(--border-strong)]',
              'hover:shadow-[var(--shadow-md)]',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]',
              'focus-visible:ring-offset-2',
            )}
          >
            <span>{actionLabel}</span>

            <ArrowRight
              aria-hidden="true"
              className={cn(
                'h-4 w-4',
                'transition-transform duration-200',
                'group-hover:translate-x-0.5',
              )}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// How It Works Step
// =============================================================================

interface HowItWorksStepProps {
  readonly number: string;

  /**
   * Lucide icon component used purely for visual presentation.
   *
   * LucideIcon is used directly so its SVG/ARIA props remain compatible
   * with lucide-react's own component definition.
   */
  readonly icon: LucideIcon;

  readonly title: string;
  readonly description: string;
}

function HowItWorksStep({
  number,
  icon: Icon,
  title,
  description,
}: HowItWorksStepProps) {
  return (
    <div
      className={cn(
        'relative min-w-0',
        'rounded-[var(--radius-xl)]',
        'border border-[var(--border)]',
        'bg-[var(--surface)]',
        'p-4',
        'shadow-[var(--shadow-sm)]',
        'sm:p-5',
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center',
            'rounded-full',
            'bg-[var(--brand-soft)]',
            'text-[var(--brand)]',
          )}
        >
          <Icon
            aria-hidden="true"
            className="h-4 w-4"
          />
        </div>

        <div className="min-w-0">
          <span
            className={cn(
              'text-[10px] font-semibold',
              'tracking-[0.12em]',
              'text-[var(--foreground-subtle)]',
            )}
          >
            {number}
          </span>

          <h3
            className={cn(
              'mt-0.5',
              'text-sm font-semibold',
              'text-[var(--foreground)]',
            )}
          >
            {title}
          </h3>
        </div>
      </div>

      <p
        className={cn(
          'mt-3',
          'text-sm leading-6',
          'text-[var(--foreground-muted)]',
        )}
      >
        {description}
      </p>
    </div>
  );
}
