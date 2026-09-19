// -----------------------------------------------------------------------------
// sisiMove — My Demand Card
// -----------------------------------------------------------------------------
//
// Authenticated owner-facing presentation of a Journey Demand.
//
// Responsibility:
// - Summarize one Journey Demand belonging to the authenticated user.
// - Present its lifecycle status.
// - Present route, schedule, requested seats, and pricing.
// - Present participant information.
// - Expose an optional view/manage action supplied by the parent.
//
// This component intentionally does NOT:
// - fetch Journey Demand data;
// - query Traveller or Trust;
// - determine ownership;
// - determine authorization;
// - mutate Journey Demand state;
// - contain Journey Demand domain logic.
//
// The MyJourneyDemand model is already an authenticated owner projection.
// -----------------------------------------------------------------------------

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/foundation/utils/cn';

import type {
  MyJourneyDemand,
} from '@/features/journey-demands/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MyDemandCardProps {
  /**
   * Authenticated owner projection of the Journey Demand.
   */
  readonly demand: MyJourneyDemand;

  /**
   * Optional callback for opening/managing the Journey Demand.
   *
   * Navigation remains outside this component.
   */
  readonly onView?: (demand: MyJourneyDemand) => void;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatStatus(status: string): string {
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDateTime(
  value: string | null | undefined,
): string {
  if (!value) {
    return 'Not scheduled';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not scheduled';
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatCurrency(
  amount: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString('en-KE')}`;
  }
}

function getStatusClasses(status: string): string {
  const normalizedStatus = status.toUpperCase();

  if (
    normalizedStatus === 'OPEN' ||
    normalizedStatus === 'PUBLISHED'
  ) {
    return [
      'bg-[var(--brand-soft)]',
      'text-[var(--brand)]',
    ].join(' ');
  }

  if (
    normalizedStatus === 'MATCHED' ||
    normalizedStatus === 'CONVERTED'
  ) {
    return [
      'bg-[var(--background-muted)]',
      'text-[var(--foreground-secondary)]',
    ].join(' ');
  }

  if (
    normalizedStatus === 'CANCELLED' ||
    normalizedStatus === 'EXPIRED'
  ) {
    return [
      'bg-[var(--danger-soft)]',
      'text-[var(--danger)]',
    ].join(' ');
  }

  return [
    'bg-[var(--background-muted)]',
    'text-[var(--foreground-secondary)]',
  ].join(' ');
}

// -----------------------------------------------------------------------------
// My Demand Card
// -----------------------------------------------------------------------------

export function MyDemandCard({
  demand,
  onView,
}: MyDemandCardProps) {
  const origin = demand.corridor?.origin;
  const destination = demand.corridor?.destination;

  const routeLabel =
    origin && destination
      ? `${origin.name} → ${destination.name}`
      : 'Route not configured';

  const departureLabel = formatDateTime(
    demand.schedule?.departureAt,
  );

  const statusLabel = formatStatus(demand.status);

  const priceLabel = demand.pricing
    ? formatCurrency(
        demand.pricing.amount,
        demand.pricing.currency,
      )
    : 'Price not set';

  const seatsLabel = demand.capacity
    ? `${demand.capacity.seats} seat${
        demand.capacity.seats === 1 ? '' : 's'
      } requested`
    : 'Seats not configured';

  return (
    <Card
      padding="lg"
      className="overflow-hidden"
    >
      <div className="space-y-5">
        {/* ----------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Travel demand
            </p>

            <h2 className="mt-1 truncate text-lg font-semibold text-[var(--foreground)]">
              {routeLabel}
            </h2>
          </div>

          <span
            className={cn(
              'inline-flex',
              'w-fit',
              'shrink-0',
              'items-center',
              'rounded-[var(--radius-full)]',
              'px-2.5',
              'py-1',
              'text-xs',
              'font-medium',
              getStatusClasses(demand.status),
            )}
          >
            {statusLabel}
          </span>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Demand details                                                    */}
        {/* ----------------------------------------------------------------- */}

        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium text-[var(--foreground-muted)]">
              Departure
            </dt>

            <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {departureLabel}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-[var(--foreground-muted)]">
              Seats
            </dt>

            <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {seatsLabel}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-[var(--foreground-muted)]">
              Budget
            </dt>

            <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {priceLabel}

              {demand.pricing && (
                <span className="ml-1 font-normal text-[var(--foreground-muted)]">
                  / seat
                </span>
              )}
            </dd>
          </div>
        </dl>

        {/* ----------------------------------------------------------------- */}
        {/* Participants                                                      */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--foreground-muted)]">
          <span>
            {demand.participantCount} participant
            {demand.participantCount === 1 ? '' : 's'}
          </span>

          {demand.hasMatchedJourney && (
            <span>
              Journey matched
            </span>
          )}
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Actions                                                           */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-4">
          <p className="min-w-0 truncate text-xs text-[var(--foreground-muted)]">
            {demand.publicId}
          </p>

          {onView && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onView(demand)}
            >
              Manage demand
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}