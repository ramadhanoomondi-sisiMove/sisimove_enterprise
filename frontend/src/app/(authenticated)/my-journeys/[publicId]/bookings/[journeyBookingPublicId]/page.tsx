'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Detail Page
// -----------------------------------------------------------------------------
//
// Authenticated detail surface for a single Journey Booking.
//
// Responsibilities:
// - Resolve the booking public ID from the route.
// - Load the booking through the Journey Booking query hook.
// - Present the booking's historical snapshot, pricing, payment, and
//   cancellation information.
// - Present booking lifecycle state.
// - Present query loading and query error states.
//
// Non-responsibilities:
// - Fetching current Journey data.
// - Reconstructing historical booking data.
// - Recalculating pricing.
// - Implementing API calls directly.
// - Owning reusable booking presentation logic.
// - Performing booking lifecycle mutations.
//
// IMPORTANT:
//
// JourneyBooking.snapshot is authoritative for historical journey information
// captured when the booking was created. This page must not replace snapshot
// information with current Journey information.
//
// React Query errors are handled explicitly here because useJourneyBooking()
// returns errors through the query result rather than throwing synchronously
// into the Next.js route error boundary.
//
// Lifecycle mutations remain outside this page until their query-cache
// invalidation strategy is defined at the mutation-hook layer.
// -----------------------------------------------------------------------------

import Link from 'next/link';
import { useParams } from 'next/navigation';

import {
  JourneyBookingCancellation,
  JourneyBookingPayment,
  JourneyBookingPricing,
  JourneyBookingSnapshot,
  JourneyBookingStatusBadge,
} from '@/components/journey-booking';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';
import {
  type JourneyBooking,
  useJourneyBooking,
} from '@/features/journey-booking';

export default function JourneyBookingDetailPage() {
  const params = useParams<{
    journeyBookingPublicId: string;
  }>();

  const journeyBookingPublicId = params.journeyBookingPublicId;

  const {
    data: booking,
    error,
    isLoading,
  } = useJourneyBooking(journeyBookingPublicId);

  if (isLoading) {
    return <BookingDetailLoadingState />;
  }

  if (error) {
    return <BookingDetailErrorState />;
  }

  if (!booking) {
    return <BookingNotFoundState />;
  }

  return (
    <main className="page-shell">
      <div className="page-container">
        <section className="section-sm">
          <div className="flex flex-col gap-4">
            <Link
              href={AUTHENTICATED_ROUTES.MY_BOOKINGS}
              className="inline-flex w-fit items-center text-sm font-medium text-[var(--foreground-secondary)] transition-colors hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
            >
              <span aria-hidden="true">←</span>
              <span className="ml-2">My bookings</span>
            </Link>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                  Booking
                </p>

                <h1 className="mt-1 break-all text-xl font-semibold tracking-tight text-[var(--foreground)]">
                  {booking.publicId}
                </h1>
              </div>

              <JourneyBookingStatusBadge status={booking.status} />
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          {booking.snapshot && (
            <section
              aria-labelledby="booking-snapshot-section"
              className="section-sm"
            >
              <div id="booking-snapshot-section">
                <JourneyBookingSnapshot
                  snapshot={booking.snapshot}
                />
              </div>
            </section>
          )}

          {booking.pricing && (
            <section
              aria-labelledby="booking-pricing-section"
              className="section-sm"
            >
              <div id="booking-pricing-section">
                <JourneyBookingPricing
                  pricing={booking.pricing}
                />
              </div>
            </section>
          )}

          {booking.payment && (
            <section
              aria-labelledby="booking-payment-section"
              className="section-sm"
            >
              <div id="booking-payment-section">
                <JourneyBookingPayment
                  payment={booking.payment}
                />
              </div>
            </section>
          )}

          {booking.cancellation && (
            <section
              aria-labelledby="booking-cancellation-section"
              className="section-sm"
            >
              <div id="booking-cancellation-section">
                <JourneyBookingCancellation
                  cancellation={booking.cancellation}
                />
              </div>
            </section>
          )}

          <BookingMetadata booking={booking} />
        </div>
      </div>
    </main>
  );
}

// -----------------------------------------------------------------------------
// Query states
// -----------------------------------------------------------------------------

function BookingDetailLoadingState() {
  return (
    <main className="page-shell" aria-busy="true">
      <div className="page-container">
        <section className="section-sm">
          <div className="flex flex-col gap-3">
            <div
              aria-hidden="true"
              className="h-4 w-24 animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]"
            />

            <div
              aria-hidden="true"
              className="h-6 w-48 animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]"
            />

            <div
              aria-hidden="true"
              className="h-24 w-full animate-pulse rounded-[var(--radius-lg)] bg-[var(--background-muted)]"
            />
          </div>

          <span className="sr-only">
            Loading booking details.
          </span>
        </section>
      </div>
    </main>
  );
}

function BookingDetailErrorState() {
  return (
    <main className="page-shell">
      <div className="page-container">
        <section className="section-sm">
          <div className="rounded-[var(--radius-lg)] border border-[var(--danger)] bg-[var(--danger-soft)] p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--danger)]">
              Booking
            </p>

            <h1 className="mt-1 text-base font-semibold text-[var(--foreground)]">
              We couldn&apos;t load this booking
            </h1>

            <p className="mt-2 max-w-md text-sm text-[var(--foreground-secondary)]">
              The booking could not be loaded. Please return to your bookings
              and try again.
            </p>

            <div className="mt-4">
              <Link
                href={AUTHENTICATED_ROUTES.MY_BOOKINGS}
                className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand)] px-4 text-sm font-medium text-[var(--brand-foreground)] transition-colors hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
              >
                My bookings
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function BookingNotFoundState() {
  return (
    <main className="page-shell">
      <div className="page-container">
        <section className="section-sm">
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Booking
            </p>

            <h1 className="mt-1 text-base font-semibold text-[var(--foreground)]">
              Booking not found
            </h1>

            <p className="mt-2 max-w-md text-sm text-[var(--foreground-secondary)]">
              This booking could not be found or is no longer available.
            </p>

            <div className="mt-4">
              <Link
                href={AUTHENTICATED_ROUTES.MY_BOOKINGS}
                className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--foreground-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
              >
                Back to bookings
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// -----------------------------------------------------------------------------
// Booking metadata
// -----------------------------------------------------------------------------

interface BookingMetadataProps {
  booking: JourneyBooking;
}

function BookingMetadata({
  booking,
}: BookingMetadataProps) {
  return (
    <section
      aria-labelledby="booking-metadata-title"
      className="section-sm"
    >
      <div className="border-t border-[var(--border-subtle)] pt-5">
        <h2
          id="booking-metadata-title"
          className="text-sm font-semibold text-[var(--foreground)]"
        >
          Booking information
        </h2>

        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MetadataValue
            label="Journey"
            value={booking.journeyPublicId}
          />

          <MetadataValue
            label="Reserved seats"
            value={String(booking.seats)}
          />

          <MetadataValue
            label="Created"
            value={formatDateTime(booking.createdAt)}
          />

          <MetadataValue
            label="Last updated"
            value={formatDateTime(booking.updatedAt)}
          />

          {booking.confirmedAt && (
            <MetadataValue
              label="Confirmed"
              value={formatDateTime(booking.confirmedAt)}
            />
          )}

          {booking.cancelledAt && (
            <MetadataValue
              label="Cancelled"
              value={formatDateTime(booking.cancelledAt)}
            />
          )}

          {booking.completedAt && (
            <MetadataValue
              label="Completed"
              value={formatDateTime(booking.completedAt)}
            />
          )}

          {booking.expiredAt && (
            <MetadataValue
              label="Expired"
              value={formatDateTime(booking.expiredAt)}
            />
          )}
        </dl>
      </div>
    </section>
  );
}

interface MetadataValueProps {
  label: string;
  value: string;
}

function MetadataValue({
  label,
  value,
}: MetadataValueProps) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-[var(--foreground-muted)]">
        {label}
      </dt>

      <dd
        className="mt-1 truncate text-sm text-[var(--foreground)]"
        title={value}
      >
        {value}
      </dd>
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