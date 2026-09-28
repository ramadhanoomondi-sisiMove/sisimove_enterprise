// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Lifecycle
// -----------------------------------------------------------------------------
//
// Presentation-only lifecycle summary for a public Journey Demand.
//
// Architecture rules:
// - Consumes the public Journey Demand projection.
// - Does not fetch data.
// - Does not perform mutations.
// - Does not reconstruct the backend lifecycle/state machine.
// - Does not infer missing lifecycle timestamps.
// - Does not manufacture business states such as "active", "expired", etc.
// - Only renders lifecycle information explicitly exposed by the public model.
//
// The public marketplace model intentionally exposes only:
//
//   OPEN
//   MATCHED
//   CONVERTED
//   FULFILLED
//
// Internal states such as DRAFT, CANCELLED and EXPIRED are not part of the
// ordinary public marketplace projection and therefore must not be recreated
// by this component.
// -----------------------------------------------------------------------------

import type { PublicJourneyDemand } from '@/features/journey-demand/models';
import { JourneyDemandStatusBadge } from '../shared/journey-demand-status-badge';
import { cn } from '@/foundation';

export interface JourneyDemandLifecycleProps {
  readonly demand: PublicJourneyDemand;
  readonly emphasis?: 'compact' | 'default';
  readonly className?: string;
}

export function JourneyDemandLifecycle({
  demand,
  emphasis = 'default',
  className,
}: JourneyDemandLifecycleProps) {
  const isCompact = emphasis === 'compact';

  return (
    <section
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface)]',
        isCompact ? 'p-4' : 'p-5',
        className,
      )}
      aria-labelledby="journey-demand-lifecycle-heading"
    >
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <h2
            id="journey-demand-lifecycle-heading"
            className={cn(
              'font-semibold text-foreground',
              isCompact ? 'text-sm' : 'text-base',
            )}
          >
            Demand status
          </h2>

          <p
            className={cn(
              'mt-1 text-foreground-muted',
              isCompact ? 'text-xs' : 'text-sm',
            )}
          >
            Current public status of this travel need.
          </p>
        </div>

        <JourneyDemandStatusBadge
          status={demand.status}
          className="shrink-0"
        />
      </div>

      <div
        className={cn(
          'mt-4 border-t border-[var(--border-subtle)] pt-4',
          isCompact ? 'text-xs' : 'text-sm',
        )}
      >
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="min-w-0">
            <dt className="text-foreground-muted">Current status</dt>
            <dd className="mt-1 font-medium text-foreground">
              <span className="sr-only">The current demand status is </span>
              {getStatusLabel(demand.status)}
            </dd>
          </div>

          <div className="min-w-0">
            <dt className="text-foreground-muted">Lifecycle</dt>
            <dd className="mt-1 text-foreground-secondary">
              Public marketplace lifecycle
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function getStatusLabel(status: PublicJourneyDemand['status']): string {
  switch (status) {
    case 'OPEN':
      return 'Open';

    case 'MATCHED':
      return 'Matched';

    case 'CONVERTED':
      return 'Converted';

    case 'FULFILLED':
      return 'Fulfilled';

    default:
      return status;
  }
}
