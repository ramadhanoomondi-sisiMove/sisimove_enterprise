// -----------------------------------------------------------------------------
// sisiMove — My Journey Demand Edit Page
// -----------------------------------------------------------------------------
//
// Authenticated owner edit route.
//
// Route responsibility is intentionally limited to:
// - receiving the App Router dynamic route parameter;
// - passing the Journey Demand public ID to the edit route/container.
//
// Data loading, editing state, validation, authorization, persistence, and
// mutation orchestration remain inside the feature/component layer.
//
// Route:
//   /my-demands/[publicId]/edit
//
// -----------------------------------------------------------------------------

import { MyJourneyDemandEditRoute } from '@/components/journey-demand/manage/my-journey-demand-edit-route';

// =============================================================================
// Route Props
// =============================================================================

interface MyJourneyDemandEditPageProps {
  readonly params: Promise<{
    publicId: string;
  }>;
}

// =============================================================================
// Page
// =============================================================================

export default async function MyJourneyDemandEditPage({
  params,
}: MyJourneyDemandEditPageProps) {
  const { publicId } = await params;

  return (
    <MyJourneyDemandEditRoute
      journeyDemandPublicId={publicId}
    />
  );
}

