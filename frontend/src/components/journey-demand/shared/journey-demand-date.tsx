// src/features/journey-demands/components/shared/journey-demand-date.tsx

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Date
// -----------------------------------------------------------------------------
//
// Compact reusable presentation component for a Journey Demand departure date.
//
// Responsibilities:
// - Present the calendar date represented by the backend departure schedule.
// - Use the canonical PublicJourneyDemandSchedule model.
// - Use the shared foundation date formatter.
// - Preserve the backend-provided schedule as the source of truth.
//
// This component does NOT:
// - perform queries;
// - perform mutations;
// - determine lifecycle state;
// - infer scheduling rules;
// - determine whether departure is flexible;
// - calculate or display the departure-time window;
// - reconstruct schedule semantics from timestamps.
//
// The departure-time window is presented separately by
// JourneyDemandScheduleSummary.
//
// Marketplace presentation:
// - Dense and visually lightweight.
// - Optimized for the compact Journey Demand card.
// - Avoids nested surfaces and unnecessary padding.
// - Uses the frozen design-token variables.
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandSchedule } from '@/features/journey-demand/models';

import { cn, formatDate } from '@/foundation';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyDemandDateProps {
  /**
   * Journey Demand schedule containing the requested departure window.
   */
  readonly schedule: PublicJourneyDemandSchedule;

  /**
   * Optional additional classes for the date presentation.
   */
  readonly className?: string;

  /**
   * Controls the visual emphasis of the date.
   *
   * Compact is appropriate for marketplace cards.
   * Default is appropriate for detail and management surfaces.
   */
  readonly emphasis?: 'compact' | 'default';
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandDate({
  schedule,
  className,
  emphasis = 'default',
}: JourneyDemandDateProps) {
  const isCompact = emphasis === 'compact';

  return (
    <div
      className={cn(
        'min-w-0',
        className,
      )}
    >
      <time
        dateTime={schedule.earliestDeparture}
        className={cn(
          'block truncate font-semibold leading-tight',
          'text-[var(--foreground)]',
          isCompact ? 'text-sm' : 'text-base',
        )}
      >
        {formatDate(schedule.earliestDeparture)}
      </time>
    </div>
  );
}