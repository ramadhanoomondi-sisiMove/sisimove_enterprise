// -----------------------------------------------------------------------------
// sisiMove — My Journey Demand Detail Page
// -----------------------------------------------------------------------------
//
// Authenticated Journey Demand detail route.
//
// Responsibilities:
// - receive the dynamic route parameter;
// - pass the Journey Demand public ID to the feature route/container.
//
// This page deliberately does NOT:
// - fetch the Journey Demand;
// - call the Journey Demand API directly;
// - determine ownership;
// - perform authorization;
// - compare requesterPublicId values;
// - transform MyJourneyDemand;
// - contain Journey Demand business logic.
//
// Data loading belongs to:
//     MyJourneyDemandDetailRoute
//
// Route:
//     /my-demands/[publicId]
//
// -----------------------------------------------------------------------------

import { MyJourneyDemandDetailRoute } from '@/components/journey-demand/detail/journey-demand-detail-route';

interface MyJourneyDemandPageProps {
  readonly params: Promise<{
    publicId: string;
  }>;
}

export default async function MyJourneyDemandPage({
  params,
}: MyJourneyDemandPageProps) {
  const { publicId } = await params;

  return (
    <MyJourneyDemandDetailRoute
      journeyDemandPublicId={publicId}
    />
  );
}

