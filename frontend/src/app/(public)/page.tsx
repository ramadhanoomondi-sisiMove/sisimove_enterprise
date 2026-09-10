// src/app/(public)/page.tsx

// -----------------------------------------------------------------------------
// SisiMove — Public Home Page
// -----------------------------------------------------------------------------
//
// Public route entry point for the SisiMove landing experience.
//
// Responsibilities:
// - Read public landing-page URL search parameters.
// - Normalize the Journey search criteria.
// - Pass valid search criteria into the landing composition.
//
// Architectural boundary:
// - This page does not fetch Journeys.
// - This page does not search or filter Journey data.
// - This page does not own discovery state.
// - Journey retrieval remains inside TravellerDiscoveryContent through the
//   existing Journey feature hook and API.
//
// Search flow:
//
// /?from=Nairobi&to=Kisumu&date=2026-09-15
//      │
//      ▼
// HomePage
//      │
//      ▼
// LandingPage
//      │
//      ▼
// TravellerDiscoveryContent
//      │
//      ▼
// useJourneys.search()
//      │
//      ▼
// GET /journeys/search
//
// -----------------------------------------------------------------------------

import { LandingPage } from '@/components/landing';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface HomePageSearchParams {
  from?: string | string[];
  to?: string | string[];
  date?: string | string[];
}

interface HomePageProps {
  searchParams: Promise<HomePageSearchParams>;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getSearchParameter(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0]?.trim() || undefined;
  }

  return value?.trim() || undefined;
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default async function HomePage({
  searchParams,
}: HomePageProps) {
  const params = await searchParams;

  const from = getSearchParameter(params.from);
  const to = getSearchParameter(params.to);
  const date = getSearchParameter(params.date);

  const searchValues =
    from && to && date
      ? {
          from,
          to,
          date,
        }
      : undefined;

  return (
    <LandingPage
      searchValues={searchValues}
    />
  );
}

