// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Detail Loading State
// -----------------------------------------------------------------------------
//
// Route-level loading UI for:
//
//   /bookings/[journeyBookingPublicId]
//
// Responsibilities:
// - Provide immediate visual feedback while the booking detail page loads.
// - Preserve the compact authenticated-page layout.
// - Reuse the shared UI primitives and frozen sisiMove design tokens.
//
// Non-responsibilities:
// - Fetching booking data.
// - Performing navigation.
// - Reproducing booking-detail business logic.
// - Introducing feature-specific loading state.
//
// Next.js renders this file automatically while the route segment is loading.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

export default function JourneyBookingDetailLoading() {
  return (
    <main className="page-shell">
      <div className="page-container">
        <section className="section-sm">
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {/* -----------------------------------------------------------------
                Page header skeleton
               ----------------------------------------------------------------- */}
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="h-4 w-24 animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]" />
                <div className="mt-2 h-7 w-48 max-w-full animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]" />
              </div>

              <div className="h-6 w-24 animate-pulse rounded-[var(--radius-full)] bg-[var(--background-muted)]" />
            </div>

            {/* -----------------------------------------------------------------
                Booking summary skeleton
               ----------------------------------------------------------------- */}
            <Card padding="md">
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <SkeletonField />
                  <SkeletonField />
                  <SkeletonField />
                  <SkeletonField />
                </div>

                {/* Historical route snapshot */}
                <div className="rounded-[var(--radius-md)] border border-[var(--border)] p-4">
                  <div className="h-4 w-28 animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]" />

                  <div className="mt-4 space-y-3">
                    <SkeletonField />
                    <SkeletonField />
                  </div>
                </div>
              </div>
            </Card>

            {/* -----------------------------------------------------------------
                Pricing / payment skeleton
               ----------------------------------------------------------------- */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card padding="md">
                <div className="flex flex-col gap-4">
                  <div className="h-5 w-24 animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]" />
                  <SkeletonField />
                  <SkeletonField />
                  <SkeletonField />
                </div>
              </Card>

              <Card padding="md">
                <div className="flex flex-col gap-4">
                  <div className="h-5 w-24 animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]" />
                  <SkeletonField />
                  <SkeletonField />
                  <SkeletonField />
                </div>
              </Card>
            </div>

            {/* -----------------------------------------------------------------
                Actions skeleton
               ----------------------------------------------------------------- */}
            <div className="flex flex-wrap gap-2">
              <div className="h-10 w-28 animate-pulse rounded-[var(--radius-md)] bg-[var(--background-muted)]" />
              <div className="h-10 w-28 animate-pulse rounded-[var(--radius-md)] bg-[var(--background-muted)]" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// -----------------------------------------------------------------------------
// Local presentation helper
// -----------------------------------------------------------------------------

function SkeletonField() {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-3 w-20 animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]" />
      <div className="h-5 w-32 max-w-full animate-pulse rounded-[var(--radius-sm)] bg-[var(--background-muted)]" />
    </div>
  );
}