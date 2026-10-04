// -----------------------------------------------------------------------------
// sisiMove — My Journey Demand Status
// -----------------------------------------------------------------------------
//
// Authenticated owner's Journey Demand status presentation.
//
// This component consumes MyJourneyDemand directly because the authenticated
// owner read contract exposes the complete Journey Demand lifecycle:
//
//   DRAFT
//   OPEN
//   MATCHED
//   CONVERTED
//   FULFILLED
//   CANCELLED
//   EXPIRED
//
// It deliberately does not reuse JourneyDemandStatusBadge because that badge
// belongs to the public Journey Demand projection and accepts only the public
// marketplace status contract.
//
// Architecture:
// - presentation only;
// - receives an already-loaded MyJourneyDemand;
// - does not fetch the demand;
// - does not determine ownership;
// - does not perform authorization;
// - does not call lifecycle mutations;
// - does not determine available management actions;
// - does not infer lifecycle history;
// - does not reconstruct backend state transitions;
// - does not cast owner status into a public status.
//
// -----------------------------------------------------------------------------

'use client';

import type { MyJourneyDemand } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

// =============================================================================
// Props
// =============================================================================

export interface MyJourneyDemandStatusProps {
  readonly demand: MyJourneyDemand;
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function MyJourneyDemandStatus({
  demand,
  className,
}: MyJourneyDemandStatusProps) {
  return (
    <section
      className={cn('surface min-w-0 p-4 sm:p-5', className)}
      aria-labelledby="my-journey-demand-status-heading"
    >
      <div className="flex min-w-0 items-center justify-between gap-4">
        <div className="min-w-0">
          <h2
            id="my-journey-demand-status-heading"
            className="text-base font-semibold text-foreground"
          >
            Status
          </h2>

          <p className="mt-1 text-sm text-foreground-muted">
            Current status of this travel need.
          </p>
        </div>

        <div className="shrink-0">
          <MyJourneyDemandStatusBadge status={demand.status} />
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Owner Status Badge
// =============================================================================

interface MyJourneyDemandStatusBadgeProps {
  readonly status: MyJourneyDemand['status'];
}

function MyJourneyDemandStatusBadge({
  status,
}: MyJourneyDemandStatusBadgeProps) {
  const label = formatJourneyDemandStatus(status);

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full',
        'border border-border bg-background',
        'px-2.5 py-1',
        'text-xs font-medium text-foreground',
      )}
      aria-label={`Journey Demand status: ${label}`}
    >
      {label}
    </span>
  );
}

// =============================================================================
// Formatting
// =============================================================================

/**
 * Presentation-only formatting of the backend lifecycle enum.
 *
 * This does not transform the lifecycle state or map it to another status
 * contract.
 */
function formatJourneyDemandStatus(
  status: MyJourneyDemand['status'],
): string {
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
