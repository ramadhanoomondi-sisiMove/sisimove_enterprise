// -----------------------------------------------------------------------------
// app/(authenticated)/my-demands/[publicId]/page.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Authenticated My Journey Demand Detail Route
//
// Route:
//
//     /my-demands/[publicId]
//          ↓
//     MyJourneyDemandDetailContainer
//
// Architecture:
// - Extracts the dynamic URL parameter.
// - Delegates the authenticated detail flow to the feature container.
//
// This route deliberately does not:
// - fetch the Journey Demand;
// - call mutation APIs;
// - determine lifecycle capabilities;
// - perform ownership checks;
// - transform the Journey Demand read model;
// - compose detail presentation.
//
// The feature container owns loading, error handling, owner-boundary
// presentation, and management composition.
//
// -----------------------------------------------------------------------------

import { MyJourneyDemandDetailContainer } from '@/features/journey-demand/containers';

// =============================================================================
// Route Props
// =============================================================================

interface MyJourneyDemandDetailPageProps {
  readonly params: Promise<{
    publicId: string;
  }>;
}

// =============================================================================
// Page
// =============================================================================

export default async function MyJourneyDemandDetailPage({
  params,
}: MyJourneyDemandDetailPageProps) {
  const { publicId } = await params;

  return (
    <MyJourneyDemandDetailContainer publicId={publicId} />
  );
}
