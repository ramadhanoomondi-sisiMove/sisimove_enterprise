'use client';

import type { MyJourneyDemand } from '@/features/journey-demand/models';
import { Badge } from '@/components/ui';
import { cn } from '@/foundation';

import { JourneyDemandPrice } from '../shared/journey-demand-price';

export interface MyJourneyDemandCardProps {
  readonly demand: MyJourneyDemand;
  readonly onView?: (demand: MyJourneyDemand) => void;
  readonly className?: string;
}

/**
 * Compact card for a Journey Demand owned by the authenticated member.
 *
 * This component consumes the authenticated-owner Journey Demand contract.
 *
 * It deliberately does not:
 * - fetch Journey Demands;
 * - call mutation APIs;
 * - authorize ownership;
 * - reconstruct the public Journey Demand projection;
 * - convert authenticated models into public models;
 * - derive lifecycle state from the status;
 * - derive relationship state from component presence.
 *
 * Ownership, lifecycle state, component availability, and participant counts
 * are supplied by the backend MyJourneyDemand response.
 */
export function MyJourneyDemandCard({
  demand,
  onView,
  className,
}: MyJourneyDemandCardProps) {
  const handleView = () => {
    onView?.(demand);
  };

  return (
    <article
      className={cn(
        'surface min-w-0 p-4',
        'transition-[box-shadow,border-color]',
        'hover:shadow-[var(--shadow-sm)]',
        className,
      )}
      aria-labelledby={`my-journey-demand-${demand.publicId}-heading`}
    >
      <div className="min-w-0">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
              Travel need
            </p>

            <h2
              id={`my-journey-demand-${demand.publicId}-heading`}
              className="mt-1 truncate text-base font-semibold text-foreground"
            >
              {demand.corridor?.originName ?? 'Origin'}

              <span
                className="px-2 text-foreground-subtle"
                aria-hidden="true"
              >
                →
              </span>

              {demand.corridor?.destinationName ?? 'Destination'}
            </h2>
          </div>

          <div className="shrink-0">
            <MyJourneyDemandStatus status={demand.status} />
          </div>
        </div>

        <div className="mt-4 min-w-0 space-y-4">
          {demand.corridor ? (
            <div className="min-w-0">
              <p className="text-sm text-foreground-secondary">
                {demand.corridor.originName}
                <span
                  className="px-2 text-foreground-subtle"
                  aria-hidden="true"
                >
                  →
                </span>
                {demand.corridor.destinationName}
              </p>

              {demand.corridor.waypoints.length > 0 ? (
                <p className="mt-1 text-xs text-foreground-muted">
                  {demand.corridor.waypoints.length}{' '}
                  {demand.corridor.waypoints.length === 1
                    ? 'waypoint'
                    : 'waypoints'}
                </p>
              ) : null}
            </div>
          ) : null}

          {demand.schedule ? (
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {formatScheduleWindow(demand.schedule)}
              </p>

              <p className="mt-1 text-xs text-foreground-muted">
                {demand.schedule.timezone}
              </p>
            </div>
          ) : null}

          {demand.capacity ? (
            <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
              <div className="min-w-0">
                <p className="text-xs text-foreground-muted">
                  Seats requested
                </p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {demand.capacity.requestedSeats}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-xs text-foreground-muted">
                  Matched seats
                </p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {demand.capacity.matchedSeats}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-xs text-foreground-muted">
                  Participants
                </p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {demand.participantCount}
                </p>
              </div>
            </div>
          ) : null}

          {demand.pricing ? (
            <JourneyDemandPrice
              pricing={demand.pricing}
              emphasis="compact"
            />
          ) : null}
        </div>

        {onView ? (
          <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
            <button
              type="button"
              onClick={handleView}
              className={cn(
                'text-sm font-semibold text-[var(--brand)]',
                'transition-colors hover:text-[var(--brand-hover)]',
                'focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
                'focus-visible:ring-offset-2',
                'focus-visible:ring-offset-[var(--background)]',
              )}
            >
              View demand
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

interface MyJourneyDemandStatusProps {
  readonly status: MyJourneyDemand['status'];
}

function MyJourneyDemandStatus({
  status,
}: MyJourneyDemandStatusProps) {
  const presentation = getStatusPresentation(status);

  return (
    <Badge
      variant={presentation.variant}
      size="sm"
    >
      {presentation.label}
    </Badge>
  );
}

function getStatusPresentation(
  status: MyJourneyDemand['status'],
): {
  readonly label: string;
  readonly variant:
    | 'default'
    | 'brand'
    | 'success'
    | 'warning'
    | 'danger'
    | 'outline';
} {
  switch (status) {
    case 'DRAFT':
      return { label: 'Draft', variant: 'outline' };

    case 'OPEN':
      return { label: 'Open', variant: 'brand' };

    case 'MATCHED':
      return { label: 'Matched', variant: 'brand' };

    case 'CONVERTED':
      return { label: 'Converted', variant: 'success' };

    case 'FULFILLED':
      return { label: 'Fulfilled', variant: 'success' };

    case 'CANCELLED':
      return { label: 'Cancelled', variant: 'danger' };

    case 'EXPIRED':
      return { label: 'Expired', variant: 'warning' };

    default:
      return { label: status, variant: 'default' };
  }
}

function formatScheduleWindow(
  schedule: NonNullable<MyJourneyDemand['schedule']>,
): string {
  const earliest = formatTime(schedule.scheduleWindow.earliestDeparture);
  const latest = formatTime(schedule.scheduleWindow.latestDeparture);

  return `${earliest} – ${latest}`;
}

function formatTime(value: Date): string {
  return new Intl.DateTimeFormat('en-KE', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(value);
}

