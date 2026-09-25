// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Card
// -----------------------------------------------------------------------------
//
// Compact presentation of a Journey Booking for authenticated booking lists.
//
// Responsibilities:
// - Present the booking's historical route.
// - Present booking status.
// - Present departure information when the snapshot exists.
// - Present reserved seats.
// - Present the booking's historical pricing when available.
// - Provide optional consumer-controlled actions.
//
// Non-responsibilities:
// - Fetching Journey data.
// - Reconstructing current Journey state.
// - Performing booking lifecycle mutations.
// - Navigating to booking detail.
// - Recalculating pricing.
//
// IMPORTANT:
//
// The JourneyBooking snapshot is historical booking-owned data. The card must
// not replace it with information fetched from the current Journey.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import type { JourneyBooking } from '@/features/journey-booking/models';
import { JourneyBookingStatusBadge } from '../booking-status';
import { Card } from '@/components/ui';

export interface JourneyBookingCardProps {
  booking: JourneyBooking;

  /**
   * Optional consumer-controlled content rendered as the card footer.
   *
   * Navigation and booking actions belong to the consuming surface rather
   * than this presentation component.
   */
  actions?: ReactNode;

  /**
   * Optional additional content rendered below the booking summary.
   */
  children?: ReactNode;

  className?: string;
}

export function JourneyBookingCard({
  booking,
  actions,
  children,
  className,
}: JourneyBookingCardProps) {
  const snapshot = booking.snapshot;
  const pricing = booking.pricing;

  return (
    <Card
      className={className}
      padding="md"
      header={
        <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Booking
            </p>

            <p
              className="mt-1 truncate font-mono text-xs text-[var(--foreground-secondary)]"
              title={booking.publicId}
            >
              {booking.publicId}
            </p>
          </div>

          <JourneyBookingStatusBadge status={booking.status} />
        </div>
      }
      footer={actions}
    >
      <div className="flex flex-col gap-4">
        {snapshot ? (
          <BookingRoute snapshot={snapshot} />
        ) : (
          <div className="rounded-[var(--radius-md)] bg-[var(--background-muted)] p-3">
            <p className="text-xs text-[var(--foreground-muted)]">
              Journey details are not available in this booking response.
            </p>

            <p className="mt-1 truncate text-sm font-medium text-[var(--foreground)]">
              Journey {booking.journeyPublicId}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <BookingValue
            label="Seats"
            value={String(booking.seats)}
          />

          {snapshot?.departureAt && (
            <BookingValue
              label="Departure"
              value={formatDateTime(snapshot.departureAt)}
            />
          )}

          {pricing && (
            <BookingValue
              label="Booking total"
              value={formatMoney(
                pricing.totalAmount,
                pricing.currency,
              )}
            />
          )}

          {booking.payment && (
            <BookingValue
              label="Payment"
              value={formatPaymentStatus(booking.payment.status)}
            />
          )}
        </div>

        {children}
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Route
// -----------------------------------------------------------------------------

interface BookingRouteProps {
  snapshot: NonNullable<JourneyBooking['snapshot']>;
}

function BookingRoute({ snapshot }: BookingRouteProps) {
  return (
    <div
      className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--background-muted)] p-3"
      aria-label={`Journey from ${snapshot.originName} to ${snapshot.destinationName}`}
    >
      <RouteLocation
        label="From"
        name={snapshot.originName}
      />

      <div
        aria-hidden="true"
        className="ml-1 h-4 border-l border-dashed border-[var(--border-strong)]"
      />

      <RouteLocation
        label="To"
        name={snapshot.destinationName}
      />
    </div>
  );
}

interface RouteLocationProps {
  label: string;
  name: string;
}

function RouteLocation({
  label,
  name,
}: RouteLocationProps) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden="true"
        className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--brand)]"
      />

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
          {label}
        </p>

        <p
          className="truncate text-sm font-semibold text-[var(--foreground)]"
          title={name}
        >
          {name}
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Values
// -----------------------------------------------------------------------------

interface BookingValueProps {
  label: string;
  value: string;
}

function BookingValue({
  label,
  value,
}: BookingValueProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-[var(--foreground-muted)]">
        {label}
      </p>

      <p
        className="mt-1 truncate text-sm font-medium text-[var(--foreground)]"
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

/**
 * Pricing amounts are represented by the API in the smallest currency unit.
 *
 * This function performs display formatting only. It does not recalculate
 * booking pricing.
 */
function formatMoney(
  amount: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount / 100);
  } catch {
    return `${currency} ${(amount / 100).toFixed(2)}`;
  }
}

function formatPaymentStatus(
  status: NonNullable<JourneyBooking['payment']>['status'],
): string {
  switch (status) {
    case 'PENDING':
      return 'Pending';

    case 'AUTHORIZED':
      return 'Authorized';

    case 'CAPTURED':
      return 'Paid';

    case 'FAILED':
      return 'Failed';

    case 'PARTIALLY_REFUNDED':
      return 'Partially refunded';

    case 'REFUNDED':
      return 'Refunded';
  }
}