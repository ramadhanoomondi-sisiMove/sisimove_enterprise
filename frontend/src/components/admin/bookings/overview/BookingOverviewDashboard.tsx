
'use client';

import { useMemo } from 'react';

import type {
  AdminBooking,
  } from '@/features/admin/bookings';
import type {
  AdminBookingFinancialSummary,
  AdminBookingSummary,
} from '@/features/admin/bookings/models/admin-booking-summary.model';

import {
  useAdminBookingCount,
  useAdminBookings,
} from '@/features/admin/bookings/hooks/useAdminBookings';

import { BookingLifecycleSummary } from './BookingLifecycleSummary';
import { BookingPaymentOverview } from './BookingPaymentOverview';

interface BookingOverviewDashboardProps {
  className?: string;
}

function buildLifecycleSummary(
  bookings: AdminBooking[],
  totalBookingCount: number,
): AdminBookingSummary {
  return bookings.reduce<AdminBookingSummary>(
    (summary, booking) => {
      switch (booking.status) {
        case 'PENDING':
          summary.pendingBookings += 1;
          break;
        case 'CONFIRMED':
          summary.confirmedBookings += 1;
          break;
        case 'CANCELLED':
          summary.cancelledBookings += 1;
          break;
        case 'COMPLETED':
          summary.completedBookings += 1;
          break;
        case 'EXPIRED':
          summary.expiredBookings += 1;
          break;
      }

      return summary;
    },
    {
      totalBookings: totalBookingCount,
      pendingBookings: 0,
      confirmedBookings: 0,
      cancelledBookings: 0,
      completedBookings: 0,
      expiredBookings: 0,
    },
  );
}

function buildFinancialSummaries(
  bookings: AdminBooking[],
): AdminBookingFinancialSummary[] {
  const summaries = new Map<string, AdminBookingFinancialSummary>();

  for (const booking of bookings) {
    const pricing = booking.pricing;

    if (pricing && Number.isFinite(pricing.totalAmount)) {
      const currency = pricing.currency;

      const summary = summaries.get(currency) ?? {
        currency,
        totalBookingValue: 0,
        totalCapturedAmount: 0,
        totalRefundedAmount: 0,
      };

      summary.totalBookingValue += pricing.totalAmount;
      summaries.set(currency, summary);
    }

    const payment = booking.payment;

    if (!payment || !Number.isFinite(payment.amount)) {
      continue;
    }

    const summary = summaries.get(payment.currency) ?? {
      currency: payment.currency,
      totalBookingValue: 0,
      totalCapturedAmount: 0,
      totalRefundedAmount: 0,
    };

    if (payment.status === 'CAPTURED') {
      summary.totalCapturedAmount += payment.amount;
    }

    if (
      payment.status === 'REFUNDED' ||
      payment.status === 'PARTIALLY_REFUNDED'
    ) {
      // The current payment model exposes payment.amount but not a
      // separate authoritative refunded amount. Do not infer the
      // refunded amount from the original payment amount.
    }

    summaries.set(payment.currency, summary);
  }

  return Array.from(summaries.values());
}

export function BookingOverviewDashboard({
  className = '',
}: BookingOverviewDashboardProps) {
  const bookingsQuery = useAdminBookings();
  const countQuery = useAdminBookingCount();

  const bookings = useMemo(
    () => bookingsQuery.data ?? [],
    [bookingsQuery.data],
  );

  const totalBookingCount =
    typeof countQuery.data === 'number'
      ? countQuery.data
      : bookings.length;

  const lifecycleSummary = useMemo(
    () => buildLifecycleSummary(bookings, totalBookingCount),
    [bookings, totalBookingCount],
  );

  const financialSummaries = useMemo(
    () => buildFinancialSummaries(bookings),
    [bookings],
  );

  const isLoading =
    bookingsQuery.isPending || countQuery.isPending;

  const hasError = bookingsQuery.isError || countQuery.isError;

  return (
    <section className={`space-y-8 ${className}`}>
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Booking overview
        </h1>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Booking lifecycle and payment summaries.
        </p>
      </header>

      {hasError ? (
        <div
          role="alert"
          className="rounded-[var(--radius-lg)] border border-[var(--border)] p-5"
        >
          <p className="font-medium text-[var(--foreground)]">
            Unable to load the complete booking overview.
          </p>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Refresh the booking data and try again.
          </p>
        </div>
      ) : isLoading ? (
        <div
          role="status"
          className="rounded-[var(--radius-lg)] border border-[var(--border)] p-8 text-sm text-[var(--foreground-secondary)]"
        >
          Loading booking overview…
        </div>
      ) : (
        <>
          <BookingLifecycleSummary summary={lifecycleSummary} />

          {financialSummaries.length > 0 ? (
            financialSummaries.map((summary) => (
              <BookingPaymentOverview
                key={summary.currency}
                summary={summary}
              />
            ))
          ) : (
            <section>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Payment overview
              </h2>
              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                No priced booking or payment records are available to summarize.
              </p>
            </section>
          )}
        </>
      )}
    </section>
  );
}

export type { BookingOverviewDashboardProps };
