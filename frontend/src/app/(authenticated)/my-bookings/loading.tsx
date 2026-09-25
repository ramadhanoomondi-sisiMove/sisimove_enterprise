import { Card } from '@/components/ui';

// -----------------------------------------------------------------------------
// sisiMove — My Journey Bookings Loading State
// -----------------------------------------------------------------------------
//
// Route-level loading UI for /my-bookings.
//
// Responsibilities:
// - Provide immediate visual feedback while the booking list is loading.
// - Preserve the compact authenticated-page layout.
// - Approximate the final booking-list structure without introducing a
//   second booking-card implementation.
//
// Non-responsibilities:
// - Fetching booking data.
// - Calling Journey Booking hooks.
// - Handling API errors.
// - Rendering real booking information.
//
// This file is intentionally independent from the Journey Booking feature.
// Next.js controls when this route-level loading boundary is displayed.
// -----------------------------------------------------------------------------

export default function MyBookingsLoading() {
  return (
    <main className="page-shell" aria-busy="true" aria-live="polite">
      <div className="page-container">
        <section className="section-sm">
          <div className="flex flex-col gap-2">
            <div
              aria-hidden="true"
              className="h-3 w-20 animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]"
            />

            <div
              aria-hidden="true"
              className="h-6 w-36 animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]"
            />

            <div
              aria-hidden="true"
              className="h-4 w-full max-w-sm animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]"
            />
          </div>
        </section>

        <section
          aria-label="Loading bookings"
          className="section-sm"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div
              aria-hidden="true"
              className="h-4 w-28 animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]"
            />

            <div
              aria-hidden="true"
              className="h-3 w-16 animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]"
            />
          </div>

          <div className="flex flex-col gap-3">
            <BookingCardSkeleton />
            <BookingCardSkeleton />
          </div>
        </section>

        <span className="sr-only">Loading your bookings.</span>
      </div>
    </main>
  );
}

// -----------------------------------------------------------------------------
// Booking skeleton
// -----------------------------------------------------------------------------

function BookingCardSkeleton() {
  return (
    <Card padding="md">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-2">
            <div
              aria-hidden="true"
              className="h-3 w-14 animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]"
            />

            <div
              aria-hidden="true"
              className="h-3 w-28 animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]"
            />
          </div>

          <div
            aria-hidden="true"
            className="h-6 w-20 animate-pulse rounded-[var(--radius-full)] bg-[var(--background-muted)]"
          />
        </div>

        <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--background-muted)] p-3">
          <div className="flex flex-col gap-4">
            <SkeletonRouteRow />
            <div
              aria-hidden="true"
              className="ml-1 h-4 border-l border-dashed border-[var(--border-strong)]"
            />
            <SkeletonRouteRow />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SkeletonValue />
          <SkeletonValue />
        </div>
      </div>
    </Card>
  );
}

function SkeletonRouteRow() {
  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden="true"
        className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-[var(--background-muted)]"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div
          aria-hidden="true"
          className="h-2.5 w-10 animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]"
        />

        <div
          aria-hidden="true"
          className="h-4 w-2/3 max-w-48 animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]"
        />
      </div>
    </div>
  );
}

function SkeletonValue() {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        aria-hidden="true"
        className="h-3 w-12 animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]"
      />

      <div
        aria-hidden="true"
        className="h-4 w-20 animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]"
      />
    </div>
  );
}