
'use client';

import { Eye } from 'lucide-react';

import { BookingPaymentStatusBadge } from '../shared/BookingPaymentStatusBadge';
import { BookingPublicId } from '../shared/BookingPublicId';
import { BookingStatusBadge } from '../shared/BookingStatusBadge';

import type { AdminBooking } from '@/features/admin/bookings';

import {
  formatAdminBookingDate,
  formatAdminBookingMoney,
  formatAdminBookingRoute,
  formatAdminBookingSeats,
} from '@/features/admin/bookings';

interface BookingTableRowProps {
  booking: AdminBooking;
  onView?: (booking: AdminBooking) => void;
}

export function BookingTableRow({
  booking,
  onView,
}: BookingTableRowProps) {
  const departureAt = booking.snapshot?.departureAt;
  const pricing = booking.pricing;

  return (
    <tr className="border-b border-[var(--border-subtle)] transition-colors hover:bg-[var(--background-subtle)]">
      <td className="px-4 py-4 align-middle">
        <BookingPublicId
          publicId={booking.publicId}
          showCopyButton
        />

        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          Created {formatAdminBookingDate(booking.createdAt)}
        </p>
      </td>

      <td className="px-4 py-4 align-middle">
        <p className="text-sm font-medium text-[var(--foreground)]">
          {formatAdminBookingRoute(booking)}
        </p>

        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          Journey ID: {booking.journeyPublicId}
        </p>
      </td>

      <td className="px-4 py-4 align-middle">
        <BookingPublicId publicId={booking.passengerPublicId} />
      </td>

      <td className="px-4 py-4 align-middle">
        <BookingStatusBadge status={booking.status} />
      </td>

      <td className="px-4 py-4 align-middle">
        {booking.payment ? (
          <BookingPaymentStatusBadge
            status={booking.payment.status}
          />
        ) : (
          <span className="text-sm text-[var(--foreground-muted)]">
            No payment
          </span>
        )}
      </td>

      <td className="px-4 py-4 text-right align-middle">
        <span className="text-sm font-medium tabular-nums text-[var(--foreground)]">
          {pricing
            ? formatAdminBookingMoney(
                pricing.totalAmount,
                pricing.currency,
              )
            : '—'}
        </span>

        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          {formatAdminBookingSeats(booking.seats)}
        </p>
      </td>

      <td className="px-4 py-4 align-middle">
        <span className="text-sm text-[var(--foreground-secondary)]">
          {departureAt
            ? formatAdminBookingDate(departureAt)
            : '—'}
        </span>
      </td>

      <td className="px-4 py-4 text-right align-middle">
        <button
          type="button"
          onClick={() => onView?.(booking)}
          disabled={!onView}
          aria-label={`View booking ${booking.publicId}`}
          title="View booking"
          className="inline-flex size-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] text-[var(--foreground-secondary)] transition hover:bg-[var(--background-muted)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Eye size={16} aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
}
