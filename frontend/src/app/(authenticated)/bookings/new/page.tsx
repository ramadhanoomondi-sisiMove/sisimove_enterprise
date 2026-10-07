// -----------------------------------------------------------------------------
// Path:
// src/app/(authenticated)/bookings/new/page.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — New Journey Booking Route
//
// This route is intentionally thin.
//
// The route is responsible only for:
// - reading the URL search parameter;
// - passing the Journey public ID into the booking workflow.
//
// The booking workflow itself belongs to:
//     components/journey-booking/new/
// -----------------------------------------------------------------------------

import {
  NewJourneyBookingPage,
} from '@/components/journey-booking/new/new-journey-booking-page';

// -----------------------------------------------------------------------------
// Route Props
// -----------------------------------------------------------------------------

interface NewJourneyBookingRouteProps {
  readonly searchParams: Promise<{
    journeyPublicId?: string;
  }>;
}

// -----------------------------------------------------------------------------
// Route
// -----------------------------------------------------------------------------

export default async function NewJourneyBookingRoute({
  searchParams,
}: NewJourneyBookingRouteProps) {
  const { journeyPublicId } = await searchParams;

  return (
    <NewJourneyBookingPage
      journeyPublicId={journeyPublicId}
    />
  );
}