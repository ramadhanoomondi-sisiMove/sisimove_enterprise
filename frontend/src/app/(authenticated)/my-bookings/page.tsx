
'use client';

// -----------------------------------------------------------------------------
// sisiMove — My Journey Bookings Page
// -----------------------------------------------------------------------------

import Link from 'next/link';

import { JourneyBookingCard } from '@/components/journey-booking';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';
import { useMyJourneyBookings } from '@/features/journey-booking';

export default function MyBookingsPage() {
  const { data: bookings = [] } = useMyJourneyBookings();

  return (
    <main className="page-shell">
      <div className="page-container py-5 sm:py-8">
        <div className="mx-auto w-full max-w-5xl">
          <header className="mb-6 sm:mb-8">
            <div className="max-w-2xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-muted)]">
                Your travel
              </p>

              <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
                My bookings
              </h1>

              <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)] sm:text-base">
                View and manage the journeys you have booked.
              </p>
            </div>
          </header>

          {bookings.length === 0 ? (
            <EmptyBookings />
          ) : (
            <section
              aria-labelledby="my-bookings-list-title"
              className="space-y-4"
            >
              <div className="flex items-center justify-between gap-3 px-0.5">
                <div className="min-w-0">
                  <h2
                    id="my-bookings-list-title"
                    className="text-sm font-semibold text-[var(--foreground)]"
                  >
                    Your bookings
                  </h2>

                  <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
                    Your recent journey reservations
                  </p>
                </div>

                <span className="shrink-0 rounded-full border border-[var(--border-subtle)] bg-[var(--background-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--foreground-muted)]">
                  {bookings.length}{' '}
                  {bookings.length === 1 ? 'booking' : 'bookings'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {bookings.map((booking) => (
                  <JourneyBookingCard
                    key={booking.publicId}
                    booking={booking}
                    navigation={{
                      bookingsHref: AUTHENTICATED_ROUTES.BOOKING(
                        booking.publicId,
                      ),
                      messagesHref: `/my-bookings/${booking.publicId}/messages`,
                      participantsHref: `/my-bookings/${booking.publicId}/participants`,
                    }}
                    actions={
                      <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                        <Link
                          href={AUTHENTICATED_ROUTES.BOOKING(
                            booking.publicId,
                          )}
                          className={[
                            'inline-flex min-h-10 w-full items-center justify-center',
                            'rounded-[var(--radius-md)]',
                            'border border-[var(--border)]',
                            'bg-[var(--surface)]',
                            'px-4',
                            'text-sm font-medium',
                            'text-[var(--foreground-secondary)]',
                            'transition-all',
                            'hover:border-[var(--border-strong)]',
                            'hover:bg-[var(--background-muted)]',
                            'hover:text-[var(--foreground)]',
                            'focus-visible:outline-none',
                            'focus-visible:ring-2',
                            'focus-visible:ring-[var(--brand)]',
                            'focus-visible:ring-offset-2',
                            'sm:w-auto',
                          ].join(' ')}
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
      </div>
    </main>
  );
}

function EmptyBookings() {
  return (
    <section
      aria-labelledby="empty-bookings-title"
      className={[
        'rounded-[var(--radius-xl)]',
        'border border-[var(--border-subtle)]',
        'bg-[var(--background-muted)]',
        'px-5 py-8 text-center',
        'sm:px-8 sm:py-10',
      ].join(' ')}
    >
      <div className="mx-auto max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-muted)]">
          Your travel
        </p>

        <h2
          id="empty-bookings-title"
          className="mt-2 text-lg font-semibold tracking-tight text-[var(--foreground)] sm:text-xl"
        >
          No bookings yet
        </h2>

        <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
          Your journey bookings will appear here after you book a journey.
        </p>

        <div className="mt-5">
          <Link
            href={AUTHENTICATED_ROUTES.HOME}
            className={[
              'inline-flex min-h-10 w-full items-center justify-center',
              'rounded-[var(--radius-md)]',
              'bg-[var(--brand)]',
              'px-4',
              'text-sm font-semibold',
              'text-[var(--brand-foreground)]',
              'transition-all',
              'hover:bg-[var(--brand-hover)]',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]',
              'focus-visible:ring-offset-2',
              'sm:w-auto',
            ].join(' ')}
          >
            Find a journey
          </Link>
        </div>
      </div>
    </section>
  );
}
