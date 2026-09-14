// -----------------------------------------------------------------------------
// SisiMove — Public Traveller Profile Route
// -----------------------------------------------------------------------------
//
// Public route entry point for a traveller profile.
//
// The route identifies a traveller by their public handle. The presentation
// and data-loading responsibilities belong to the Public Traveller Profile
// component rather than the App Router page itself.
//
// URL:
//   /travellers/[handle]
//
// The route parameter is deliberately kept as a handle instead of exposing
// an internal identity identifier.
//
// -----------------------------------------------------------------------------

import { PublicTravellerContent } from '@/components/travellers/public-traveller-content';

// -----------------------------------------------------------------------------
// Route Props
// -----------------------------------------------------------------------------

export interface PublicTravellerPageProps {
  readonly params: Promise<{
    readonly handle: string;
  }>;
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default async function PublicTravellerPage({
  params,
}: PublicTravellerPageProps) {
  const { handle } = await params;

  return (
    <PublicTravellerContent
      handle={decodeURIComponent(handle)}
    />
  );
}

