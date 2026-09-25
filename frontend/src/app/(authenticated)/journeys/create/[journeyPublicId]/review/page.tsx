// -----------------------------------------------------------------------------
// sisiMove — Journey Review Route
// -----------------------------------------------------------------------------
//
// Final route entry point for the Journey creation workflow.
//
// The Journey already exists as a DRAFT before this page is reached.
//
// Responsibilities:
// - Resolve the Journey public identifier from the route.
// - Render the feature-level Journey review page.
//
// The route itself does not:
// - call APIs directly;
// - construct Journey state;
// - attach Journey components;
// - validate publication requirements;
// - perform the DRAFT -> PUBLISHED transition.
//
// Those responsibilities remain in the Journey feature/application layers.
//
// The presentation-only JourneyReviewStep is rendered by the feature-level
// JourneyReviewPage, which owns query/mutation orchestration.
// -----------------------------------------------------------------------------

'use client';

import { use } from 'react';

import { JourneyReviewPage } from '@/features/journey/components/journeys/creation';

interface JourneyReviewRouteProps {
  params: Promise<{
    journeyPublicId: string;
  }>;
}

/**
 * Journey review route.
 *
 * Route:
 *
 * /journeys/create/[journeyPublicId]/review
 */
export default function Page({
  params,
}: JourneyReviewRouteProps) {
  const { journeyPublicId } = use(params);

  return (
    <JourneyReviewPage
      journeyPublicId={journeyPublicId}
    />
  );
}