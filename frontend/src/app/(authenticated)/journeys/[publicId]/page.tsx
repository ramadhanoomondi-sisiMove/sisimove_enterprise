// -----------------------------------------------------------------------------
// sisiMove — Authenticated Journey Detail Route
// -----------------------------------------------------------------------------
//
// Route:
//     /journeys/[publicId]
//
// Access:
//     AUTHENTICATED USERS ONLY
//
// This route is intentionally located inside the authenticated route group.
//
// Architectural distinction:
//
//     /journeys/[publicId]
//         → authenticated Journey discovery / detail
//
//     /my-journeys/[journeyPublicId]
//         → owner Journey management
//
// The Journey projection used by the detail surface may still be named
// `PublicJourney`. "Public" describes the projection/data contract, not
// anonymous page accessibility.
//
// Responsibilities of this route:
//
// - resolve the Next.js route parameter;
// - render the Journey detail feature;
//
// The route does NOT:
//
// - perform Journey API calls directly;
// - recreate backend domain objects;
// - contain Journey business rules;
// - create a Booking;
// - perform booking mutations;
// - implement authentication or authorization logic.
//
// Authentication is established by the authenticated route infrastructure.
// Backend authorization remains authoritative.
//
// Booking flow:
//
//     /journeys/[publicId]
//          ↓
//     /bookings/new?journeyPublicId=[publicId]
//          ↓
//     booking review / confirmation
//          ↓
//     create Booking
//          ↓
//     /bookings/[bookingPublicId]
//
// IMPORTANT:
//
// Do not add anonymous Login/Register redirects here.
// Unauthenticated users must not reach this route.
// -----------------------------------------------------------------------------

import {
  JourneyDetailPage as JourneyDetailFeaturePage,
} from "@/components/journey/detail/journey-detail-page";

// -----------------------------------------------------------------------------
// Route Props
// -----------------------------------------------------------------------------

interface JourneyDetailRouteProps {
  readonly params: Promise<{
    publicId: string;
  }>;
}

// -----------------------------------------------------------------------------
// Route
// -----------------------------------------------------------------------------

export default async function JourneyDetailRoute({
  params,
}: JourneyDetailRouteProps) {
  const { publicId } = await params;

  return (
    <JourneyDetailFeaturePage
      publicId={publicId}
    />
  );
}
