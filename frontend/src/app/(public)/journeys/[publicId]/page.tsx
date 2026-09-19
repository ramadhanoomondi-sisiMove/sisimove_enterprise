// -----------------------------------------------------------------------------
// sisiMove — Public Journey Route
// -----------------------------------------------------------------------------
//
// Public route for viewing one published Journey.
//
// URL:
//
//   /journeys/[publicId]
//
// -----------------------------------------------------------------------------
// ACCESS MODEL
// -----------------------------------------------------------------------------
//
// Viewing a published Journey is a public marketplace capability.
//
// An unauthenticated visitor is allowed to:
//
// - open this route;
// - view the published Journey;
// - view its public Traveller information;
// - view its public Trust information;
// - view public vehicle and Journey details;
// - view availability, pricing, and preferences exposed publicly.
//
// Authentication is NOT required to view the Journey.
//
// Authentication is required only when the visitor attempts a protected
// marketplace action such as:
//
//     Book
//       │
//       └── unauthenticated → sign in
//
// Verification is a subsequent concern handled after authentication by the
// protected Journey action flow.
//
// Therefore this route itself must remain publicly accessible.
//
// -----------------------------------------------------------------------------
// ROUTE RESPONSIBILITY
// -----------------------------------------------------------------------------
//
// The route is intentionally thin. It is responsible only for receiving the
// App Router route parameter and passing it to the public Journey presentation
// boundary.
//
// The public Journey boundary owns the actual composition of:
//
// - Journey
// - Traveller Profile
// - Trust
// - Vehicle
// - Asset
// - Journey availability
// - Journey pricing
// - Journey preferences
//
// -----------------------------------------------------------------------------
// WHAT THIS ROUTE DOES NOT DO
// -----------------------------------------------------------------------------
//
// This route does NOT:
//
// - call Journey APIs directly;
// - call Traveller Profile, Trust, or Asset APIs directly;
// - contain marketplace logic;
// - perform authentication checks;
// - perform verification checks;
// - determine booking eligibility;
// - render the Journey card used by the marketplace;
// - duplicate Journey domain models.
//
// The public Journey presentation/application boundary owns those concerns.
//
// Keeping the route thin preserves the separation between Next.js routing and
// the public Journey feature/application boundary.
//
// -----------------------------------------------------------------------------
// AUTHENTICATION BOUNDARY
// -----------------------------------------------------------------------------
//
// The page being public does NOT make booking public.
//
// The distinction is:
//
//     VIEW JOURNEY
//          │
//          └── public
//
//     BOOK JOURNEY
//          │
//          ├── unauthenticated → sign in
//          │
//          └── authenticated → verification guidance when required
//
// The same Journey page can therefore serve both unauthenticated and
// authenticated visitors without duplicating the public Journey route.
// -----------------------------------------------------------------------------

import { PublicJourneyContent } from '@/components/journeys/public-journey-content';

export interface PublicJourneyPageProps {
  readonly params: Promise<{
    readonly publicId: string;
  }>;
}

export default async function PublicJourneyPage({
  params,
}: PublicJourneyPageProps) {
  const { publicId } = await params;

  return <PublicJourneyContent publicId={publicId} />;
}

