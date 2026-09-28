// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Matching Summary
// -----------------------------------------------------------------------------
//
// Public detail presentation of Journey Demand participation and matching
// evidence.
//
// The public Journey Demand projection deliberately separates:
//
// - demand participation:
//     participantCount
//     joinedSeats
//
// - capacity/matching:
//     requestedSeats
//     matchedSeats
//
// This component presents those backend-provided facts together so the
// traveller can understand the current Demand without reconstructing the
// Journey Demand aggregate.
//
// Responsibilities:
// - present public participation evidence;
// - present backend-provided matched-seat information;
// - present the public Demand lifecycle status;
// - explain the distinction between people who joined and seats currently
//   matched.
//
// Non-responsibilities:
// - no data fetching;
// - no mutations;
// - no remaining-seat calculation;
// - no "fully matched" inference;
// - no participant identity loading;
// - no matching decisions;
// - no lifecycle transitions;
// - no Journey creation logic.
//
// The backend public projection remains authoritative.
// -----------------------------------------------------------------------------

import type { PublicJourneyDemand } from '@/features/journey-demand/models';

import {
  JourneyDemandDemandSummary,
  JourneyDemandStatusBadge,
} from '../shared';

import { cn } from '@/foundation';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandMatchingSummaryProps {
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

export function JourneyDemandMatchingSummary({
  demand,
  emphasis = 'default',
  className,
}: JourneyDemandMatchingSummaryProps) {
  const isCompact = emphasis === 'compact';

  return (
    <section
      aria-labelledby="journey-demand-matching-summary-heading"
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
          'mb-3',
          'flex',
          'min-w-0',
          'items-center',
          'justify-between',
          'gap-3',
        )}
      >
        <h2
          id="journey-demand-matching-summary-heading"
          className={cn(
            'text-xs',
            'font-medium',
            'uppercase',
            'tracking-wide',
            'text-[var(--foreground-muted)]',
          )}
        >
          Demand matching
        </h2>

        <JourneyDemandStatusBadge
          status={demand.status}
          className="shrink-0"
        />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Participation                                                       */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          'rounded-[var(--radius-lg)]',
          'border',
          'border-[var(--border-subtle)]',
          'bg-[var(--surface)]',
          isCompact ? 'p-3' : 'p-4',
        )}
      >
        <div className="min-w-0">
          <h3
            className={cn(
              'text-sm',
              'font-semibold',
              'text-[var(--foreground)]',
            )}
          >
            Traveller participation
          </h3>

          <p
            className={cn(
              'mt-1',
              'text-xs',
              'text-[var(--foreground-muted)]',
            )}
          >
            People who have joined this travel need.
          </p>
        </div>

        <div className="mt-4">
          <JourneyDemandDemandSummary
            capacity={demand.capacity}
            demand={demand.demand}
            emphasis={emphasis}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Matching                                                            */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          'mt-3',
          'rounded-[var(--radius-lg)]',
          'border',
          'border-[var(--border-subtle)]',
          'bg-[var(--surface)]',
          isCompact ? 'p-3' : 'p-4',
        )}
      >
        <dl
          className={cn(
            'grid',
            'min-w-0',
            'grid-cols-1',
            'gap-4',
            'sm:grid-cols-2',
          )}
        >
          <div className="min-w-0">
            <dt
              className={cn(
                'text-xs',
                'text-[var(--foreground-muted)]',
              )}
            >
              Requested seats
            </dt>

            <dd
              className={cn(
                'mt-1',
                isCompact
                  ? 'text-sm font-medium'
                  : 'text-base font-semibold',
                'text-[var(--foreground)]',
              )}
            >
              {demand.capacity.requestedSeats}
            </dd>
          </div>

          <div className="min-w-0">
            <dt
              className={cn(
                'text-xs',
                'text-[var(--foreground-muted)]',
              )}
            >
              Matched seats
            </dt>

            <dd
              className={cn(
                'mt-1',
                isCompact
                  ? 'text-sm font-medium'
                  : 'text-base font-semibold',
                'text-[var(--foreground)]',
              )}
            >
              {demand.capacity.matchedSeats}
            </dd>
          </div>
        </dl>

        <p
          className={cn(
            'mt-4',
            'border-t',
            'border-[var(--border-subtle)]',
            'pt-3',
            'text-xs',
            'leading-5',
            'text-[var(--foreground-muted)]',
          )}
        >
          Matched seats represent the portion of the requested capacity
          currently associated with a Journey through the Demand matching
          process.
        </p>
      </div>
    </section>
  );
}
