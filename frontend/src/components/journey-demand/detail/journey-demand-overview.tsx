// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Overview
// -----------------------------------------------------------------------------
//
// Public overview of one Journey Demand.
//
// Responsibilities:
// - present the PublicJourneyDemand marketplace read model;
// - compose public Journey Demand presentation components;
// - expose the core travel-need facts clearly;
// - remain read-only and navigation agnostic.
//
// Non-responsibilities:
// - no data fetching;
// - no mutations;
// - no route construction;
// - no lifecycle decisions;
// - no capability inference;
// - no reconstruction of backend aggregate state;
// - no participant identity loading;
// - no derivation of business rules.
//
// PublicJourneyDemand is the authoritative public-read contract.
// -----------------------------------------------------------------------------

import {
  JourneyDemandDemandSummary,
  JourneyDemandRequesterSummary,
  JourneyDemandRoute,
  JourneyDemandScheduleSummary,
  JourneyDemandStatusBadge,
} from '../shared';

import { JourneyDemandPricing } from './journey-demand-pricing';

import type { PublicJourneyDemand } from '@/features/journey-demand/models';

import { cn } from '@/foundation';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandOverviewProps {
  /**
   * Public Journey Demand read model.
   */
  readonly demand: PublicJourneyDemand;

  /**
   * Controls presentation density.
   */
  readonly emphasis?: 'compact' | 'default';

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandOverview({
  demand,
  emphasis = 'default',
  className,
}: JourneyDemandOverviewProps) {
  const isCompact = emphasis === 'compact';

  return (
    <section
      aria-labelledby="journey-demand-overview-heading"
      className={cn(
        'min-w-0',
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Heading                                                             */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          'flex min-w-0 items-start justify-between gap-3',
          isCompact ? 'mb-4' : 'mb-5',
        )}
      >
        <div className="min-w-0">
          <h2
            id="journey-demand-overview-heading"
            className={cn(
              'text-base font-semibold',
              'text-[var(--foreground)]',
            )}
          >
            Travel need
          </h2>

          <p
            className={cn(
              'mt-1 text-sm',
              'text-[var(--foreground-muted)]',
            )}
          >
            What this traveller is looking for.
          </p>
        </div>

        <JourneyDemandStatusBadge
          status={demand.status}
          className="shrink-0"
        />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Requester                                                           */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          'min-w-0',
          'rounded-[var(--radius-lg)]',
          'border',
          'border-[var(--border-subtle)]',
          'bg-[var(--surface)]',
          isCompact ? 'p-3' : 'p-4',
        )}
      >
        <JourneyDemandRequesterSummary
          requester={demand.requester}
          emphasis={emphasis}
        />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Route                                                               */}
      {/* ------------------------------------------------------------------- */}

      <div className="mt-5 min-w-0">
        <div
          className={cn(
            'mb-2',
            'text-xs',
            'font-medium',
            'uppercase',
            'tracking-wide',
            'text-[var(--foreground-muted)]',
          )}
        >
          Route
        </div>

        <JourneyDemandRoute
          route={demand.route}
          emphasis={emphasis}
        />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Travel conditions                                                   */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          'mt-5',
          'grid',
          'min-w-0',
          'grid-cols-1',
          'gap-4',
          'sm:grid-cols-2',
        )}
      >
        <div
          className={cn(
            'min-w-0',
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--border-subtle)]',
            'bg-[var(--surface)]',
            isCompact ? 'p-3' : 'p-4',
          )}
        >
          <JourneyDemandScheduleSummary
            schedule={demand.schedule}
            emphasis={emphasis}
          />
        </div>

        <div
          className={cn(
            'min-w-0',
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--border-subtle)]',
            'bg-[var(--surface)]',
            isCompact ? 'p-3' : 'p-4',
          )}
        >
          <JourneyDemandDemandSummary
            capacity={demand.capacity}
            demand={demand.demand}
            emphasis={emphasis}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Pricing                                                             */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          'mt-4',
          'min-w-0',
          'rounded-[var(--radius-lg)]',
          'border',
          'border-[var(--border-subtle)]',
          'bg-[var(--surface)]',
          isCompact ? 'p-3' : 'p-4',
        )}
      >
        <JourneyDemandPricing
          pricing={demand.pricing}
          emphasis={emphasis}
        />
      </div>
    </section>
  );
}

