// -----------------------------------------------------------------------------
// sisiMove — Authenticated Home
// -----------------------------------------------------------------------------
//
// Authenticated marketplace entry point.
//
// Route:
//
//     /home
//
// The authenticated Home page reuses the existing marketplace presentation.
// It does not create a second authenticated marketplace implementation.
//
// -----------------------------------------------------------------------------
//
// ARCHITECTURE
// -----------------------------------------------------------------------------
//
//     /home
//       │
//       ├── AuthenticatedMarketplaceActions
//       │     ├── Publish a journey
//       │     └── Create travel demand
//       │
//       │  PublicMarketplaceQuery
//       ▼
//     usePublicMarketplace(query)
//       │
//       │  items + loading + error
//       ▼
//     MarketplaceSection
//       │
//       ├── MarketplaceHeader
//       ├── MarketplaceTabs
//       ├── MarketplaceFilters
//       ├── MarketplaceResults
//       └── Marketplace states
//
// Query state belongs to this application composition layer.
//
// MarketplaceSection remains a controlled presentation component.
// It does not fetch marketplace data and does not own marketplace query
// state.
//
// -----------------------------------------------------------------------------
//
// MARKETPLACE OWNERSHIP
// -----------------------------------------------------------------------------
//
// The marketplace continues to compose:
//
//     Journeys  → supply
//     Demands   → need
//
// The underlying feature APIs remain owned by:
//
//     features/journeys
//     features/journey-demands
//
// The public marketplace feature composes those sources through:
//
//     usePublicMarketplace()
//     mapMarketplaceQuery()
//
// -----------------------------------------------------------------------------
//
// AUTHENTICATED ACTIONS
// -----------------------------------------------------------------------------
//
// The authenticated marketplace provides two direct participation paths:
//
//     Traveller has available seats
//              │
//              ▼
//     Publish a journey
//
//     Traveller searched but did not find the journey they need
//              │
//              ▼
//     Create travel demand
//
// AuthenticatedMarketplaceActions is presentation-only. The Home page owns
// the destination routes supplied to the component.
//
// -----------------------------------------------------------------------------
//
// AUTHORIZATION
// -----------------------------------------------------------------------------
//
// Authentication is established by the parent `(authenticated)` route layout.
//
// This page does not implement:
//
// - verification;
// - booking authorization;
// - demand participation authorization;
// - demand creation authorization;
// - Journey publishing authorization.
//
// Those concerns belong to the corresponding action/capability boundaries.
//
// -----------------------------------------------------------------------------
//
// NON-RESPONSIBILITIES
// -----------------------------------------------------------------------------
//
// This page does not:
//
// - fetch Traveller Profile data directly;
// - fetch Journey data directly;
// - fetch Journey Demand data directly;
// - create a second marketplace;
// - create a member-specific marketplace;
// - create a driver-specific marketplace;
// - parse URLSearchParams;
// - construct marketplace API queries manually from URL strings.
//
// -----------------------------------------------------------------------------
//
// NOTE
// -----------------------------------------------------------------------------
//
// AuthenticatedMarketplaceActions belongs to the authenticated Home page,
// not AuthenticatedShell or AuthenticatedHeader.
//
// The shell remains responsible only for the persistent authenticated
// application chrome.
//
// -----------------------------------------------------------------------------

'use client';

import { useCallback, useState } from 'react';

import {
  AuthenticatedMarketplaceActions,
} from '@/components/authenticated';

import { MarketplaceSection } from '@/components/landing/marketplace';

import { usePublicMarketplace } from '@/features/public-marketplace';

import type {
  PublicMarketplaceFilter,
  PublicMarketplaceQuery,
  PublicMarketplaceType,
} from '@/features/public-marketplace/models';

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------
//
// These are page-level destinations for authenticated marketplace actions.
//
// They are intentionally kept separate from the marketplace query state.
// -----------------------------------------------------------------------------

const PUBLISH_JOURNEY_ROUTE = '/journeys/create';
const CREATE_TRAVEL_DEMAND_ROUTE = '/journey-demands/create';

// -----------------------------------------------------------------------------
// Initial Query
// -----------------------------------------------------------------------------
//
// The authenticated Home route currently has no URL-driven marketplace query.
//
// Keep the initial query explicit and canonical. If Home later becomes
// URL-driven, the route/search-param boundary should use mapMarketplaceQuery()
// rather than duplicating normalization here.
// -----------------------------------------------------------------------------

const INITIAL_MARKETPLACE_QUERY: PublicMarketplaceQuery = {
  type: 'ALL',
  from: null,
  to: null,
  date: null,
  filter: null,
  sort: null,
};

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function HomePage() {
  // ---------------------------------------------------------------------------
  // Marketplace query state
  // ---------------------------------------------------------------------------
  //
  // MarketplaceSection is controlled. The Home page therefore owns the
  // canonical query state and passes changes back into the marketplace hook.
  // ---------------------------------------------------------------------------

  const [query, setQuery] = useState<PublicMarketplaceQuery>(
    INITIAL_MARKETPLACE_QUERY,
  );

  // ---------------------------------------------------------------------------
  // Public Marketplace Read Model
  // ---------------------------------------------------------------------------
  //
  // The hook owns composition of Journey + Journey Demand.
  //
  // This page does not call either domain hook directly.
  // ---------------------------------------------------------------------------

  const {
    items,
    isLoading,
    error,
  } = usePublicMarketplace(query);

  // ---------------------------------------------------------------------------
  // Query Mutations
  // ---------------------------------------------------------------------------
  //
  // Each handler changes only the relevant portion of the canonical query.
  // ---------------------------------------------------------------------------

  const handleTypeChange = useCallback(
    (type: PublicMarketplaceType) => {
      setQuery((current) => ({
        ...current,
        type,
      }));
    },
    [],
  );

  const handleFromChange = useCallback(
    (value: string | null) => {
      setQuery((current) => ({
        ...current,
        from: normalizeNullableString(value),
      }));
    },
    [],
  );

  const handleToChange = useCallback(
    (value: string | null) => {
      setQuery((current) => ({
        ...current,
        to: normalizeNullableString(value),
      }));
    },
    [],
  );

  const handleDateChange = useCallback(
    (value: string | null) => {
      setQuery((current) => ({
        ...current,
        date: normalizeNullableString(value),
      }));
    },
    [],
  );

  const handleFilterChange = useCallback(
    (filter: PublicMarketplaceFilter | null) => {
      setQuery((current) => ({
        ...current,
        filter,
      }));
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Presentation
  // ---------------------------------------------------------------------------

  return (
    <div className="w-full">
      {/* ---------------------------------------------------------------------
          Authenticated marketplace participation prompt
          --------------------------------------------------------------------- */}

      <AuthenticatedMarketplaceActions
        publishJourneyHref={PUBLISH_JOURNEY_ROUTE}
        createDemandHref={CREATE_TRAVEL_DEMAND_ROUTE}
      />

      {/* ---------------------------------------------------------------------
          Marketplace
          --------------------------------------------------------------------- */}

      <MarketplaceSection
        items={items}
        query={query}
        isLoading={isLoading}
        isError={error !== null}
        onTypeChange={handleTypeChange}
        onFromChange={handleFromChange}
        onToChange={handleToChange}
        onDateChange={handleDateChange}
        onFilterChange={handleFilterChange}
        getJourneyViewHref={(publicId) =>
          `/journeys/${encodeURIComponent(publicId)}`
        }
        getDemandViewHref={(publicId) =>
          `/demands/${encodeURIComponent(publicId)}`
        }
        linkJourneyProviderToProfile
        showJourneyProviderTrustBadges
        linkDemandRequesterToProfile
        showDemandRequesterTrustBadges
      />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Normalizes optional marketplace text input at the application boundary.
 *
 * The controlled marketplace query uses null to represent an inactive filter.
 * Empty strings therefore must not leak into the query state.
 */
function normalizeNullableString(
  value: string | null,
): string | null {
  if (value === null) {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0 ? normalized : null;
}