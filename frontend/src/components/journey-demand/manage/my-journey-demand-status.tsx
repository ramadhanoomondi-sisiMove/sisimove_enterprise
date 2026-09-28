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
// It deliberately does NOT reuse JourneyDemandStatusBadge because that badge
// belongs to the public Journey Demand projection and accepts only:
//
//   PublicJourneyDemandStatus
//
// The owner lifecycle contains additional states that are intentionally not
// part of the public marketplace status contract.
//
// Architecture rules:
// - Presentation only.
// - Receives an already-loaded MyJourneyDemand.
// - Does not fetch the demand.
// - Does not determine ownership.
// - Does not perform authorization.
// - Does not call lifecycle mutations.
// - Does not infer lifecycle history.
// - Does not reconstruct backend state transitions.
// - Does not cast authenticated status into a public status.
//
// -----------------------------------------------------------------------------

'use client';

import type { MyJourneyDemand } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

// =============================================================================
// Props
// =============================================================================

/**
 * Props for the authenticated owner's Journey Demand status section.
 */
export interface MyJourneyDemandStatusProps {
  readonly demand: MyJourneyDemand;
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Presents the current Journey Demand lifecycle status.
 *
 * The status is rendered exactly from the authenticated-owner read contract.
 *
 * This component deliberately does not:
 *
 * - infer lifecycle history;
 * - determine available management actions;
 * - perform authorization;
 * - call lifecycle mutations;
 * - reconstruct backend state transitions;
 * - convert the status into a public-only status.
 */
export function MyJourneyDemandStatus({
  demand,
  className,
}: MyJourneyDemandStatusProps) {
  return (
    <section
      className={cn(
        'surface min-w-0 p-4 sm:p-5',
        className,
      )}
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

/**
 * Owner-facing status badge.
 *
 * This badge intentionally accepts the complete authenticated Journey Demand
 * status union rather than PublicJourneyDemandStatus.
 */
function MyJourneyDemandStatusBadge({
  status,
}: MyJourneyDemandStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full',
        'border border-border bg-background',
        'px-2.5 py-1',
        'text-xs font-medium text-foreground',
      )}
      aria-label={`Journey Demand status: ${formatJourneyDemandStatus(status)}`}
    >
      {formatJourneyDemandStatus(status)}
    </span>
  );
}

// =============================================================================
// Formatting
// =============================================================================

/**
 * Converts the backend enum representation into readable UI text.
 *
 * This is presentation formatting only. It does not transform the underlying
 * lifecycle state or map it to another status contract.
 */
function formatJourneyDemandStatus(
  status: MyJourneyDemand['status'],
): string {
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

