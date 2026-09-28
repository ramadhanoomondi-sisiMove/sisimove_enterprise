// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Detail Route
// -----------------------------------------------------------------------------
//
// Route:
//
//   /demands/[publicId]
//
// Responsibilities:
// - establish the public Journey Demand route boundary;
// - resolve the dynamic publicId route parameter;
// - pass the publicId to the feature route container.
//
// Non-responsibilities:
// - no data fetching;
// - no public projection mapping;
// - no detail presentation;
// - no lifecycle reconstruction;
// - no mutation handling.
//
// The feature route container owns the client-side query lifecycle.
// JourneyDemandDetail itself receives only an already-loaded
// PublicJourneyDemand.
// -----------------------------------------------------------------------------

import { JourneyDemandsDetailRoute } from '@/components/journey-demand/detail';

interface JourneyDemandDetailPageProps {
  readonly params: Promise<{
    readonly publicId: string;
  }>;
}

export default async function JourneyDemandDetailPage({
  params,
}: JourneyDemandDetailPageProps) {
  const { publicId } = await params;

  return (
    <JourneyDemandsDetailRoute
      publicId={decodeURIComponent(publicId)}
    />
  );
}

