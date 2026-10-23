
'use client';

/**
 * sisiMove — Journey Booking Table
 *
 * Displays booking records associated with a journey.
 *
 * Responsibilities:
 * - Display booking and passenger identifiers.
 * - Show booking status, seats, route snapshot, and fare.
 * - Display payment status and booking creation date.
 * - Handle missing optional booking data gracefully.
 *
 * This component is presentation-only. It does not modify bookings.
 */

import {
  CalendarClock,
  MapPin,
  Users,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { JourneyBooking } from '@/features/admin/journeys/models/journey-booking.model';

export interface JourneyBookingTableProps {
  bookings: readonly JourneyBooking[];
  className?: string;
  loading?: boolean;
}

function formatLabel(value: string | null | undefined): string {
  if (!value?.trim()) {
    return 'Unknown';
  }

  return value
    .trim()
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getStatusStyles(status: string): string {
  const normalized = status.trim().toUpperCase();

  if (
    ['CONFIRMED', 'COMPLETED', 'PAID', 'CAPTURED', 'SUCCESS'].includes(
      normalized,
    )
  ) {
    return 'bg-[var(--success-soft)] text-[var(--success)]';
  }

  if (
    ['CANCELLED', 'CANCELED', 'FAILED', 'REJECTED', 'EXPIRED'].includes(
      normalized,
    )
  ) {
    return 'bg-[var(--danger-soft)] text-[var(--danger)]';
  }

  if (
    ['PENDING', 'PENDING_PAYMENT', 'PROCESSING', 'AUTHORIZED'].includes(
      normalized,
    )
  ) {
    return 'bg-[var(--warning-soft)] text-[var(--foreground-secondary)]';
  }

  return 'bg-[var(--background-subtle)] text-[var(--foreground-secondary)]';
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return 'Not recorded';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatMoney(
  amount: number | null | undefined,
  currency: string | null | undefined,
): string {
  if (
    amount == null ||
    !Number.isFinite(amount) ||
    !currency?.trim()
  ) {
    return 'Not available';
  }

  const normalizedCurrency = currency.trim().toUpperCase();

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: normalizedCurrency,
    }).format(amount);
  } catch {
    return `${normalizedCurrency} ${amount.toLocaleString()}`;
  }
}

function BookingStatus({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium',
        getStatusStyles(status),
      )}
    >
      {formatLabel(status)}
    </span>
  );
}

export default function JourneyBookingTable({
  bookings,
  className,
  loading = false,
}: JourneyBookingTableProps) {
  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn(
          'rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center',
          className,
        )}
      >
        <div
          aria-hidden="true"
          className="mx-auto size-6 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--brand)]"
        />
        <p className="mt-3 text-sm text-[var(--foreground-muted)]">
          Loading journey bookings…
        </p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div
        className={cn(
          'rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--background-subtle)] px-5 py-10 text-center',
          className,
        )}
      >
        <Users
          aria-hidden="true"
          className="mx-auto size-7 text-[var(--foreground-muted)]"
        />

        <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">
          No bookings found
        </h3>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          No booking records are available for this journey.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'min-w-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background-subtle)]">
              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]"
              >
                Booking
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]"
              >
                Passenger
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]"
              >
                Route snapshot
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]"
              >
                Seats
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]"
              >
                Booking status
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]"
              >
                Fare
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]"
              >
                Payment
              </th>

              <th
                scope="col"
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]"
              >
                Created
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]">
            {bookings.map((booking) => {
              const snapshot = booking.snapshot;
              const payment = booking.payment;
              const pricing = booking.pricing;

              return (
                <tr
                  key={booking.publicId}
                  className="align-top transition-colors hover:bg-[var(--background-subtle)]"
                >
                  <td className="px-4 py-4">
                    <p
                      className="max-w-40 break-all font-mono text-xs font-medium text-[var(--foreground)]"
                      title={booking.publicId}
                    >
                      {booking.publicId}
                    </p>

                    <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                      v{booking.version}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <p
                      className="max-w-40 break-all font-mono text-xs text-[var(--foreground-secondary)]"
                      title={booking.passengerPublicId}
                    >
                      {booking.passengerPublicId || 'Unknown'}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex min-w-0 items-start gap-2">
                      <MapPin
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-[var(--foreground-muted)]"
                      />

                      <div className="min-w-0">
                        <p className="max-w-48 break-words text-sm font-medium text-[var(--foreground)]">
                          {snapshot?.originName || 'Origin unavailable'}
                        </p>

                        <p className="my-1 text-xs text-[var(--foreground-muted)]">
                          to
                        </p>

                        <p className="max-w-48 break-words text-sm text-[var(--foreground-secondary)]">
                          {snapshot?.destinationName ||
                            'Destination unavailable'}
                        </p>

                        {snapshot?.departureAt && (
                          <p className="mt-2 text-xs text-[var(--foreground-muted)]">
                            {formatDate(snapshot.departureAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium tabular-nums text-[var(--foreground)]">
                      <Users
                        aria-hidden="true"
                        className="size-4 text-[var(--foreground-muted)]"
                      />
                      {Number.isFinite(booking.seats)
                        ? booking.seats
                        : '—'}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <BookingStatus status={booking.status} />
                  </td>

                  <td className="px-4 py-4">
                    <p className="whitespace-nowrap text-sm font-semibold tabular-nums text-[var(--foreground)]">
                      {formatMoney(
                        pricing?.totalAmount,
                        pricing?.currency,
                      )}
                    </p>

                    {pricing && (
                      <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                        {pricing.seats} priced seat
                        {pricing.seats === 1 ? '' : 's'}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    {payment ? (
                      <div className="space-y-2">
                        <BookingStatus status={payment.status} />

                        <p className="whitespace-nowrap text-xs text-[var(--foreground-muted)]">
                          {formatMoney(payment.amount, payment.currency)}
                        </p>

                        {payment.transactionPublicId && (
                          <p
                            className="max-w-36 break-all font-mono text-[11px] text-[var(--foreground-muted)]"
                            title={payment.transactionPublicId}
                          >
                            {payment.transactionPublicId}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--foreground-muted)]">
                        No payment record
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-start gap-2">
                      <CalendarClock
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-[var(--foreground-muted)]"
                      />

                      <span className="whitespace-nowrap text-xs text-[var(--foreground-secondary)]">
                        {formatDate(booking.createdAt)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[var(--border)] px-4 py-3">
        <p className="text-xs text-[var(--foreground-muted)]">
          Showing {bookings.length} booking
          {bookings.length === 1 ? '' : 's'} supplied to this table.
        </p>
      </div>
    </div>
  );
}
