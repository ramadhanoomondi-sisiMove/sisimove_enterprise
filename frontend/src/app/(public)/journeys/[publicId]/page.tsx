// -----------------------------------------------------------------------------
// SisiMove — Public Journey Detail Route
// -----------------------------------------------------------------------------
//
// Public route for viewing a published Journey.
//
// This route is responsible only for:
// - Next.js routing
// - route parameter resolution
// - public page metadata
// - composing the Journey presentation component
//
// Journey retrieval remains inside the Journey feature/API layer.
// Booking, Commercial, Financial, and other authenticated operations do not
// belong in this public route.
// -----------------------------------------------------------------------------

import type { Metadata } from 'next';

import { JourneyDetailPage } from '@/features/journeys/components/journey-detail-page';

// -----------------------------------------------------------------------------
// Route Types
// -----------------------------------------------------------------------------

interface JourneyDetailRouteProps {
  params: Promise<{
    publicId: string;
  }>;
}

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: JourneyDetailRouteProps): Promise<Metadata> {
  const { publicId } = await params;

  const normalizedPublicId = publicId.trim();

  return {
    title: 'Journey',
    description:
      'View a SisiMove journey, including its route, schedule, vehicle, availability, and journey preferences.',
    alternates: {
      canonical: `/journeys/${encodeURIComponent(normalizedPublicId)}`,
    },
  };
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default async function JourneyDetailRoute({
  params,
}: JourneyDetailRouteProps) {
  const { publicId } = await params;

  return (
    <JourneyDetailPage
      publicId={publicId}
    />
  );
}