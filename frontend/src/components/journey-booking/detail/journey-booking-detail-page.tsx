// -----------------------------------------------------------------------------
// Path: src/components/journey-booking/detail/journey-booking-detail-page.tsx
// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Detail Page
// -----------------------------------------------------------------------------
//
// Presentation surface for one persisted Journey Booking.
//
// Canonical route:
//
//   /bookings/[publicId]
//
// Responsibilities:
// - Present the persisted Journey Booking.
// - Present the booking-owned Journey snapshot.
// - Present the booking-owned pricing snapshot.
// - Present payment information when available.
// - Present cancellation information when available.
// - Present loading, error, and empty states.
// - Provide navigation back to the authenticated booking collection.
//
// Non-responsibilities:
// - Fetching data.
// - Authentication.
// - Authorization.
// - Booking lifecycle decisions.
// - Payment transitions.
// - Cancellation mutations.
// - Reconstructing current Journey information.
//
// The backend/API/query layers remain authoritative for booking state.
//
// -----------------------------------------------------------------------------

'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

import {
  ArrowLeft,
  CircleAlert,
  CircleHelp,
} from 'lucide-react';

import {
  Card,
  Button,
} from '@/components/ui';

import {
  JourneyBookingSummary,
  JourneyBookingSnapshot,
  JourneyBookingPricing,
  JourneyBookingPayment,
  JourneyBookingCancellation,
} from '@/components/journey-booking';

import type { JourneyBookingDetail } from '@/features/journey-booking/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBookingDetailPageProps {
  /**
   * Public booking identifier resolved from the route.
   */
  publicId?: string;

  /**
   * Persisted Journey Booking returned by the query layer.
   */
  booking?: JourneyBookingDetail;

  /**
   * Initial query loading state.
   */
  isLoading?: boolean;

  /**
   * Background refetch state.
   */
  isFetching?: boolean;

  /**
   * Query error, when loading failed.
   */
  error?: Error | null;

  /**
   * Retry callback supplied by the route/query boundary.
   */
  onRetry?: () => void | Promise<unknown>;

  /**
   * Optional additional page content.
   */
  children?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBookingDetailPage({
  publicId,
  booking,
  isLoading = false,
  isFetching = false,
  error = null,
  onRetry,
  children,
}: JourneyBookingDetailPageProps) {
  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return <JourneyBookingDetailLoading />;
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (error) {
    return (
      <JourneyBookingDetailError
        publicId={publicId}
        error={error}
        onRetry={onRetry}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Missing booking
  // ---------------------------------------------------------------------------

  if (!booking) {
    return (
      <JourneyBookingDetailEmpty
        publicId={publicId}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Detail
  // ---------------------------------------------------------------------------

  return (
    <main className="page-shell">
      <div className="page-container py-5 sm:py-8 lg:py-10">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 sm:gap-8">
          {/* ----------------------------------------------------------------- */}
          {/* Page Header                                                       */}
          {/* ----------------------------------------------------------------- */}

          <header className="flex flex-col gap-5">
            <Link
              href="/my-bookings"
              className={[
                'group inline-flex w-fit items-center gap-2',
                'text-sm font-medium',
                'text-[var(--foreground-secondary)]',
                'transition-colors',
                'hover:text-[var(--brand)]',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-[var(--brand)]',
                'focus-visible:ring-offset-2',
              ].join(' ')}
            >
              <ArrowLeft
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />

              <span>My bookings</span>
            </Link>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-muted)]">
                  Journey booking
                </p>

                <div className="mt-1.5 flex flex-wrap items-center gap-3">
                  <h1 className="break-words text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
                    Booking details
                  </h1>

                  {isFetching && (
                    <span
                      className="inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--background-subtle)] px-2.5 py-1 text-[11px] font-medium text-[var(--foreground-muted)]"
                      aria-live="polite"
                    >
                      Updating…
                    </span>
                  )}
                </div>

                <p
                  className="mt-2 break-all font-mono text-[11px] text-[var(--foreground-subtle)]"
                  title={booking.publicId}
                >
                  {booking.publicId}
                </p>
              </div>
            </div>
          </header>

          {/* ----------------------------------------------------------------- */}
          {/* Booking Summary                                                   */}
          {/* ----------------------------------------------------------------- */}

          <JourneyBookingSummary booking={booking} />

          {/* ----------------------------------------------------------------- */}
          {/* Main Booking Content                                              */}
          {/* ----------------------------------------------------------------- */}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)] lg:gap-6">
            {/* =============================================================== */}
            {/* Primary Column                                                   */}
            {/* =============================================================== */}

            <div className="flex min-w-0 flex-col gap-5 lg:gap-6">
              {booking.snapshot && (
                <Card
                  padding="md"
                  className="overflow-hidden"
                >
                  <JourneyBookingSnapshot
                    snapshot={booking.snapshot}
                  />
                </Card>
              )}

              {booking.pricing && (
                <Card
                  padding="md"
                  className="overflow-hidden"
                >
                  <JourneyBookingPricing
                    pricing={booking.pricing}
                  />
                </Card>
              )}

              {booking.cancellation && (
                <Card
                  padding="md"
                  className="overflow-hidden"
                >
                  <JourneyBookingCancellation
                    cancellation={booking.cancellation}
                  />
                </Card>
              )}

              {children}
            </div>

            {/* =============================================================== */}
            {/* Secondary Column                                                 */}
            {/* =============================================================== */}

            <aside className="flex min-w-0 flex-col gap-5 lg:gap-6">
              {booking.payment && (
                <Card
                  padding="md"
                  className="overflow-hidden"
                >
                  <JourneyBookingPayment
                    payment={booking.payment}
                  />
                </Card>
              )}

              <BookingReferenceCard booking={booking} />
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

// -----------------------------------------------------------------------------
// Booking Reference
// -----------------------------------------------------------------------------

interface BookingReferenceCardProps {
  booking: JourneyBookingDetail;
}

function BookingReferenceCard({
  booking,
}: BookingReferenceCardProps) {
  return (
    <Card
      padding="md"
      className={[
        'overflow-hidden',
        'border-[var(--border-subtle)]',
        'bg-[var(--background-brand)]',
      ].join(' ')}
    >
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--foreground-muted)]">
            Booking reference
          </p>

          <p
            className="mt-2 break-all font-mono text-sm font-semibold leading-5 text-[var(--foreground)]"
            title={booking.publicId}
          >
            {booking.publicId}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <ReferenceValue
            label="Journey"
            value={booking.journeyPublicId}
          />

          <ReferenceValue
            label="Passenger"
            value={booking.passengerPublicId}
          />

          <ReferenceValue
            label="Seats"
            value={String(booking.seats)}
          />
        </div>

        <div className="border-t border-[var(--border-subtle)] pt-4">
          <p className="text-xs leading-5 text-[var(--foreground-muted)]">
            Keep this booking reference available when contacting sisiMove
            support about this booking.
          </p>
        </div>
      </div>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Reference Value
// -----------------------------------------------------------------------------

interface ReferenceValueProps {
  label: string;
  value: string;
}

function ReferenceValue({
  label,
  value,
}: ReferenceValueProps) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium text-[var(--foreground-muted)]">
        {label}
      </p>

      <p
        className="mt-1 truncate font-mono text-xs text-[var(--foreground-secondary)]"
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

function JourneyBookingDetailLoading() {
  return (
    <main className="page-shell">
      <div className="page-container py-5 sm:py-8 lg:py-10">
        <div
          className="mx-auto flex w-full max-w-5xl flex-col gap-6 sm:gap-8"
          aria-busy="true"
          aria-label="Loading booking"
        >
          <div className="flex flex-col gap-3">
            <div className="h-5 w-28 animate-pulse rounded bg-[var(--background-muted)]" />

            <div className="h-9 w-56 animate-pulse rounded bg-[var(--background-muted)]" />

            <div className="h-4 w-40 animate-pulse rounded bg-[var(--background-muted)]" />
          </div>

          <LoadingCard className="min-h-40" />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)] lg:gap-6">
            <div className="flex flex-col gap-5 lg:gap-6">
              <LoadingCard className="min-h-72" />
              <LoadingCard className="min-h-56" />
            </div>

            <div className="flex flex-col gap-5 lg:gap-6">
              <LoadingCard className="min-h-56" />
              <LoadingCard className="min-h-48" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// -----------------------------------------------------------------------------
// Loading Card
// -----------------------------------------------------------------------------

interface LoadingCardProps {
  className?: string;
}

function LoadingCard({
  className,
}: LoadingCardProps) {
  return (
    <div
      className={[
        'animate-pulse',
        'rounded-[var(--radius-xl)]',
        'border',
        'border-[var(--border-subtle)]',
        'bg-[var(--surface)]',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

// -----------------------------------------------------------------------------
// Error State
// -----------------------------------------------------------------------------

interface JourneyBookingDetailErrorProps {
  publicId?: string;
  error: Error;
  onRetry?: () => void | Promise<unknown>;
}

function JourneyBookingDetailError({
  publicId,
  error,
  onRetry,
}: JourneyBookingDetailErrorProps) {
  return (
    <main className="page-shell">
      <div className="page-container py-5 sm:py-8 lg:py-10">
        <div className="mx-auto flex min-h-[60vh] w-full max-w-xl items-center justify-center">
          <Card
            padding="lg"
            className="w-full"
          >
            <div className="flex flex-col items-center gap-5 text-center">
              <div
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--danger-soft)] text-[var(--danger)]"
              >
                <CircleAlert
                  size={22}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--foreground-muted)]">
                  Booking
                </p>

                <h1 className="mt-1 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                  We couldn&apos;t load this booking
                </h1>

                <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
                  The booking details could not be retrieved right now.
                  Please try again.
                </p>

                {publicId && (
                  <p className="mt-3 break-all font-mono text-xs text-[var(--foreground-muted)]">
                    {publicId}
                  </p>
                )}

                {process.env.NODE_ENV === 'development' &&
                  error.message && (
                    <p className="mt-3 break-words text-xs text-[var(--danger)]">
                      {error.message}
                    </p>
                  )}
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                {onRetry && (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      void onRetry();
                    }}
                  >
                    Try again
                  </Button>
                )}

                <Link
                  href="/my-bookings"
                  className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--background-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
                >
                  Back to my bookings
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

// -----------------------------------------------------------------------------
// Empty State
// -----------------------------------------------------------------------------

interface JourneyBookingDetailEmptyProps {
  publicId?: string;
}

function JourneyBookingDetailEmpty({
  publicId,
}: JourneyBookingDetailEmptyProps) {
  return (
    <main className="page-shell">
      <div className="page-container py-5 sm:py-8 lg:py-10">
        <div className="mx-auto flex min-h-[60vh] w-full max-w-xl items-center justify-center">
          <Card
            padding="lg"
            className="w-full"
          >
            <div className="flex flex-col items-center gap-5 text-center">
              <div
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-muted)] text-[var(--foreground-muted)]"
              >
                <CircleHelp
                  size={22}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--foreground-muted)]">
                  Booking
                </p>

                <h1 className="mt-1 text-xl font-semibold tracking-tight text-[var(--foreground)]">
                  Booking not found
                </h1>

                <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
                  We could not find a persisted booking for this reference.
                </p>

                {publicId && (
                  <p className="mt-3 break-all font-mono text-xs text-[var(--foreground-muted)]">
                    {publicId}
                  </p>
                )}
              </div>

              <Link
                href="/my-bookings"
                className="inline-flex min-h-10 w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand)] px-4 text-sm font-semibold text-[var(--brand-foreground)] transition-colors hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 sm:w-auto"
              >
                Back to my bookings
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
