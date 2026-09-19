// -----------------------------------------------------------------------------
// sisiMove — My Journey Card
// -----------------------------------------------------------------------------
//
// Authenticated owner-facing presentation of a Journey.
//
// Responsibility:
// - Summarize one Journey belonging to the authenticated user.
// - Present its lifecycle status.
// - Present route, schedule, capacity, and pricing.
// - Expose an optional view action supplied by the parent.
//
// This component intentionally does NOT:
// - fetch Journey data;
// - query Traveller or Trust;
// - determine ownership;
// - determine authorization;
// - mutate Journey state;
// - contain Journey domain logic.
//
// The MyJourney model is already an authenticated owner projection.
// -----------------------------------------------------------------------------

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/foundation/utils/cn';

import type { MyJourney } from '@/features/journeys/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MyJourneyCardProps {
  /**
   * Authenticated owner projection of the Journey.
   */
  readonly journey: MyJourney;

  /**
   * Optional callback for opening the Journey.
   *
   * Navigation remains outside this component.
   */
  readonly onView?: (journey: MyJourney) => void;
}

// -----------------------------------------------------------------------------
// Helpers
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
    normalizedStatus === 'PUBLISHED' ||
    normalizedStatus === 'ACTIVE'
  ) {
    return [
      'bg-[var(--brand-soft)]',
      'text-[var(--brand)]',
    ].join(' ');
  }

  if (normalizedStatus === 'COMPLETED') {
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
// My Journey Card
// -----------------------------------------------------------------------------

export function MyJourneyCard({
  journey,
  onView,
}: MyJourneyCardProps) {
  const origin = journey.corridor?.origin;
  const destination = journey.corridor?.destination;

  const routeLabel =
    origin && destination
      ? `${origin.name} → ${destination.name}`
      : 'Route not configured';

  const departureLabel = formatDateTime(
    journey.schedule?.departureAt,
  );

  const statusLabel = formatStatus(journey.status);

  const priceLabel = journey.pricing
    ? formatCurrency(
        journey.pricing.amount,
        journey.pricing.currency,
      )
    : 'Price not set';

  return (
    <Card
      padding="lg"
      className="overflow-hidden"
    >
      <div className="space-y-5">
        {/* -------------------------------------------------------------------
            Header
        ------------------------------------------------------------------- */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Journey
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
              getStatusClasses(journey.status),
            )}
          >
            {statusLabel}
          </span>
        </div>

        {/* -------------------------------------------------------------------
            Journey details
        ------------------------------------------------------------------- */}

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
              {journey.capacity
                ? `${journey.capacity.availableSeats} of ${journey.capacity.totalSeats} available`
                : 'Not configured'}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-medium text-[var(--foreground-muted)]">
              Price
            </dt>

            <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
              {priceLabel}

              {journey.pricing && (
                <span className="ml-1 font-normal text-[var(--foreground-muted)]">
                  / seat
                </span>
              )}
            </dd>
          </div>
        </dl>

        {/* -------------------------------------------------------------------
            Booking summary
        ------------------------------------------------------------------- */}

        {journey.capacity && (
          <p className="text-xs text-[var(--foreground-muted)]">
            {journey.capacity.bookedSeats} seat
            {journey.capacity.bookedSeats === 1 ? '' : 's'} booked
          </p>
        )}

        {/* -------------------------------------------------------------------
            Footer
        ------------------------------------------------------------------- */}

        <div className="flex items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-4">
          <p className="min-w-0 truncate text-xs text-[var(--foreground-muted)]">
            {journey.publicId}
          </p>

          {onView && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onView(journey)}
            >
              View journey
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}