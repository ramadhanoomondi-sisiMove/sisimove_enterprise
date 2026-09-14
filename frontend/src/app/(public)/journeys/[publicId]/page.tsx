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
// This route does NOT:
//
// - call Journey APIs directly;
// - call Traveller Profile, Trust, or Asset APIs directly;
// - contain marketplace logic;
// - render the Journey card used by the marketplace;
// - duplicate Journey domain models.
//
// Keeping the route thin preserves the separation between Next.js routing and
// the public Journey feature/application boundary.
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

