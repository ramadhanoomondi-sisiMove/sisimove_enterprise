// -----------------------------------------------------------------------------
// Path: src/app/(authenticated)/bookings/[publicId]/page.tsx
// -----------------------------------------------------------------------------
// sisiMove — Authenticated Journey Booking Detail Route
// -----------------------------------------------------------------------------
//
// Canonical route:
//
//   /bookings/[publicId]
//
// Responsibilities:
// - Resolve the persisted Booking public ID from the URL.
// - Load the authenticated Journey Booking detail.
// - Hand the loaded application model to the feature detail component.
//
// Non-responsibilities:
// - Defining booking presentation.
// - Reproducing booking domain logic.
// - Performing booking mutations.
// - Constructing API requests directly.
// - Reconstructing Journey state.
//
// Authentication is provided by the `(authenticated)` application shell.
// The Journey Booking detail query hook remains the React-facing data boundary.
// -----------------------------------------------------------------------------

'use client';

import { useParams } from 'next/navigation';

import { JourneyBookingDetailPage } from '@/components/journey-booking/detail/journey-booking-detail-page';

import { useJourneyBookingDetail } from '@/features/journey-booking';

// -----------------------------------------------------------------------------
// Route
// -----------------------------------------------------------------------------

export default function JourneyBookingDetailRoute() {
  const params = useParams<{ publicId: string }>();

  const publicId =
    typeof params?.publicId === 'string'
      ? params.publicId
      : undefined;

  const query = useJourneyBookingDetail(publicId);

  return (
    <JourneyBookingDetailPage
      publicId={publicId}
      booking={query.data?.booking}
      isLoading={query.isLoading}
      isFetching={query.isFetching}
      error={query.error}
      onRetry={() => {
        void query.refetch();
      }}
    />
  );
}
