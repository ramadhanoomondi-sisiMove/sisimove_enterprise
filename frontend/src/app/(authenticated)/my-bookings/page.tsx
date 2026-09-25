'use client';

// -----------------------------------------------------------------------------
// sisiMove — My Journey Bookings Page
// -----------------------------------------------------------------------------
//
// Authenticated booking-management surface.
//
// Responsibilities:
// - Load the authenticated user's Journey Bookings.
// - Present bookings using the feature's JourneyBookingCard.
// - Provide navigation from a booking summary to its detail surface.
// - Present the empty state when the user has no bookings.
//
// Non-responsibilities:
// - Fetching Journey data.
// - Mapping API responses.
// - Implementing booking lifecycle mutations.
// - Reconstructing current Journey state.
// - Recalculating booking pricing.
// - Implementing loading/error boundaries.
//
// Data flow:
//
//   useMyJourneyBookings()
//          |
//          v
//   JourneyBooking[]
//          |
//          v
//   JourneyBookingCard
//
// The page deliberately consumes the Journey Booking feature boundary rather
// than reaching into individual API, mapper, or component implementation files.
// -----------------------------------------------------------------------------

import Link from 'next/link';

import { JourneyBookingCard } from '@/components/journey-booking';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';
import { useMyJourneyBookings } from '@/features/journey-booking';

export default function MyBookingsPage() {
  const { data: bookings = [] } = useMyJourneyBookings();

  return (
    <main className="page-shell">
      <div className="page-container">
        <section className="section-sm">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Your travel
            </p>

            <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
              My bookings
            </h1>

            <p className="text-sm text-[var(--foreground-secondary)]">
              View and manage the journeys you have booked.
            </p>
          </div>
        </section>

        {bookings.length === 0 ? (
          <EmptyBookings />
        ) : (
          <section
            aria-labelledby="my-bookings-list-title"
            className="section-sm"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2
                id="my-bookings-list-title"
                className="text-sm font-semibold text-[var(--foreground)]"
              >
                Your bookings
              </h2>

              <span className="text-xs text-[var(--foreground-muted)]">
                {bookings.length}{' '}
                {bookings.length === 1 ? 'booking' : 'bookings'}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {bookings.map((booking) => (
                <JourneyBookingCard
                  key={booking.publicId}
                  booking={booking}
                  actions={
                    <div className="flex justify-end">
                      <Link
                        href={AUTHENTICATED_ROUTES.BOOKING(booking.publicId)}
                        className="inline-flex min-h-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-medium text-[var(--foreground-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
                      >
                        View booking
                      </Link>
                    </div>
                  }
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

// -----------------------------------------------------------------------------
// Empty state
// -----------------------------------------------------------------------------

function EmptyBookings() {
  return (
    <section
      aria-labelledby="empty-bookings-title"
      className="section-sm"
    >
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-muted)] p-5 text-center">
        <h2
          id="empty-bookings-title"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          No bookings yet
        </h2>

        <p className="mx-auto mt-1 max-w-md text-sm text-[var(--foreground-secondary)]">
          Your journey bookings will appear here after you book a journey.
        </p>

        <div className="mt-4">
          <Link
            href={AUTHENTICATED_ROUTES.HOME}
            className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand)] px-4 text-sm font-medium text-[var(--brand-foreground)] transition-colors hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
          >
            Find a journey
          </Link>
        </div>
      </div>
    </section>
  );
}