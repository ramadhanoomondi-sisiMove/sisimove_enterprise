// -----------------------------------------------------------------------------
// sisiMove — Public Traveller Profile Route
// -----------------------------------------------------------------------------
//
// Route:
// /travellers/[handle]
//
// Responsibilities:
// - Provide the public Next.js route for a traveller profile.
// - Normalize the route parameter.
// - Generate public profile metadata.
// - Render the public traveller profile page.
//
// This route does not:
// - require authentication;
// - expose private traveller information;
// - access Prisma or repositories;
// - contain trust calculations;
// - contain booking logic;
// - contain Commercial or Financial information.
//
// The route is intentionally thin.
// Application behavior belongs to the Traveller Profile feature and page
// composition layers.
//
// -----------------------------------------------------------------------------

import type {
  Metadata,
} from 'next';

import {
  TravellerProfilePage,
} from '@/components/landing/travellers/traveller-profile-page';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface TravellerProfileRouteProps {
  readonly params: Promise<{
    handle: string;
  }>;
}

// -----------------------------------------------------------------------------
// Handle Normalization
// -----------------------------------------------------------------------------

function normalizeTravellerHandle(
  value: string,
): string {
  const trimmedValue =
    value.trim();

  if (!trimmedValue) {
    return '';
  }

  try {
    return decodeURIComponent(
      trimmedValue,
    ).trim();
  } catch {
    // -------------------------------------------------------------------------
    // Invalid URI Encoding
    // -------------------------------------------------------------------------
    //
    // Keep the original trimmed value rather than allowing malformed route
    // input to crash metadata generation or page rendering.
    //
    return trimmedValue;
  }
}

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: TravellerProfileRouteProps): Promise<Metadata> {
  const { handle } = await params;

  const normalizedHandle =
    normalizeTravellerHandle(handle);

  if (!normalizedHandle) {
    return {
      title: 'Traveller',
      description:
        'View a public SisiMove traveller profile.',
    };
  }

  return {
    title: `@${normalizedHandle}`,
    description:
      `View @${normalizedHandle}'s public SisiMove traveller profile and journey activity.`,
  };
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default async function TravellerProfileRoute({
  params,
}: TravellerProfileRouteProps) {
  const { handle } = await params;

  const normalizedHandle =
    normalizeTravellerHandle(handle);

  return (
    <TravellerProfilePage
      handle={normalizedHandle}
    />
  );
}