// -----------------------------------------------------------------------------
// sisiMove — Public Journey Detail Route
// -----------------------------------------------------------------------------
//
// Public Journey detail boundary.
//
// Responsibilities:
// - receive the public Journey identifier from the URL;
// - compose the public Journey detail feature;
// - keep route concerns separate from feature data-fetching concerns.
//
// The route does not:
// - call the HTTP API directly;
// - reconstruct Journey models;
// - contain Journey business rules;
// - load Traveller or Trust independently;
// - handle authenticated Journey lifecycle state.
//
// Public URL:
//   /journeys/[publicId]
//
// Authenticated Journey detail intentionally lives under:
//   /my-journeys/[publicId]
//
// Route groups do not create distinct URL namespaces, so the explicit
// /my-journeys prefix prevents the public and authenticated dynamic routes
// from becoming ambiguous.
// -----------------------------------------------------------------------------

import { JourneyPublicDetailPage } from "@/components/journey/detail/journey-public-detail-page";

// =============================================================================
// Props
// =============================================================================

interface PublicJourneyPageProps {
  readonly params: Promise<{
    publicId: string;
  }>;
}

// =============================================================================
// Page
// =============================================================================

export default async function PublicJourneyPage({
  params,
}: PublicJourneyPageProps) {
  const { publicId } = await params;

  return <JourneyPublicDetailPage publicId={publicId} />;
}