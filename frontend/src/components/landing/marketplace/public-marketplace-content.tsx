// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Content
// -----------------------------------------------------------------------------
//
// Client/application boundary for the public SisiMove marketplace.
//
// The Public Marketplace is composed from the independent public Journey and
// Journey Demand feature domains through usePublicMarketplace().
//
// This component owns:
//
// - marketplace query state;
// - marketplace query interaction;
// - consumption of the Public Marketplace hook;
// - translation of marketplace state into landing presentation props;
// - public route construction for marketplace actions.
//
// It does NOT:
//
// - call Journey APIs directly;
// - call Journey Demand APIs directly;
// - call fetch directly;
// - implement marketplace composition;
// - implement marketplace filtering or sorting;
// - fabricate pagination;
// - create marketplace server-state semantics;
// - render Journey or Demand cards.
//
// -----------------------------------------------------------------------------
// ARCHITECTURE
// -----------------------------------------------------------------------------
//
//   Public Route
//       │
//       ▼
//   PublicMarketplaceContent
//       │
//       │ usePublicMarketplace(query)
//       ▼
//   Public Marketplace Hook
//       │
//       ├── usePublicJourneys()
//       │
//       └── useJourneyDemands()
//       │
//       ▼
//   PublicMarketplaceItem[]
//       │
//       ▼
//   LandingPage
//       │
//       ▼
//   MarketplaceSection
//       │
//       ├── MarketplaceHeader
//       ├── MarketplaceFilters
//       ├── MarketplaceTabs
//       └── MarketplaceResults
//
// PublicMarketplaceContent is therefore the client/application orchestration
// boundary between the marketplace read model and the landing presentation.
//
// -----------------------------------------------------------------------------
// IMPORTANT — CURRENT MARKETPLACE CONTRACT
// -----------------------------------------------------------------------------
//
// The current Public Marketplace hook intentionally exposes:
//
//   items
//   isLoading
//   error
//
// It does NOT expose a unified marketplace pagination envelope.
//
// This component therefore does not invent:
//
//   limit
//   nextCursor
//   hasMore
//   page
//   refetch
//
// Unified marketplace pagination belongs to a future canonical marketplace
// read boundary when the independent Journey and Journey Demand pagination
// contracts can be composed truthfully.
//
// -----------------------------------------------------------------------------
// BROWSE-FIRST BEHAVIOR
// -----------------------------------------------------------------------------
//
// The initial query deliberately contains no route or date restrictions:
//
//   type: ALL
//   from: null
//   to: null
//   date: null
//
// This means the public landing page initially asks:
//
//     "What is available?"
//
// rather than:
//
//     "What are you searching for?"
//
// Filters subsequently refine the marketplace snapshot.
// -----------------------------------------------------------------------------

'use client';

import {
  useCallback,
  useState,
} from 'react';

import { LandingPage } from '@/components/landing/landing-page';

import {
  usePublicMarketplace,
} from '@/features/public-marketplace/hooks';

import type {
  PublicMarketplaceFilter,
  PublicMarketplaceQuery,
  PublicMarketplaceType,
} from '@/features/public-marketplace/models';


// =============================================================================
// Initial Query
// =============================================================================

/**
 * Default public marketplace query.
 *
 * The public marketplace starts unfiltered so visitors can immediately browse
 * the currently available Journey and Journey Demand inventory.
 *
 * Query controls subsequently refine this initial marketplace snapshot.
 */
const INITIAL_MARKETPLACE_QUERY: PublicMarketplaceQuery = {
  type: 'ALL',
  from: null,
  to: null,
  date: null,
  filter: null,
  sort: null,
};


// =============================================================================
// Component
// =============================================================================

/**
 * Client orchestration boundary for the public marketplace.
 *
 * This component intentionally remains thin.
 *
 * Responsibilities are split as follows:
 *
 * PublicMarketplaceContent
 *   → owns query state, hook consumption, and public route construction.
 *
 * usePublicMarketplace
 *   → composes Journey and Journey Demand public read models.
 *
 * LandingPage / MarketplaceSection
 *   → owns marketplace presentation.
 *
 * JourneyMarketplaceCard / DemandMarketplaceCard
 *   → own feature-specific presentation.
 */
export function PublicMarketplaceContent() {
  // ---------------------------------------------------------------------------
  // Marketplace query state
  // ---------------------------------------------------------------------------
  //
  // Query state belongs to the client/application boundary rather than inside
  // MarketplaceSection.
  //
  // MarketplaceSection remains a controlled presentation component.
  // ---------------------------------------------------------------------------

  const [
    query,
    setQuery,
  ] = useState<PublicMarketplaceQuery>(
    INITIAL_MARKETPLACE_QUERY,
  );


  // ---------------------------------------------------------------------------
  // Marketplace read state
  // ---------------------------------------------------------------------------
  //
  // usePublicMarketplace() is the sole marketplace composition point exposed
  // to this component.
  //
  // This boundary does not independently call Journey or Journey Demand hooks.
  // ---------------------------------------------------------------------------

  const {
    items,
    isLoading,
    error,
  } = usePublicMarketplace(query);


  // ---------------------------------------------------------------------------
  // Query interaction
  // ---------------------------------------------------------------------------
  //
  // Each handler updates only its corresponding controlled query property.
  //
  // The existing query object is preserved so future query properties can be
  // added without changing every handler.
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
    (from: string | null) => {
      setQuery((current) => ({
        ...current,
        from,
      }));
    },
    [],
  );


  const handleToChange = useCallback(
    (to: string | null) => {
      setQuery((current) => ({
        ...current,
        to,
      }));
    },
    [],
  );


  const handleDateChange = useCallback(
    (date: string | null) => {
      setQuery((current) => ({
        ...current,
        date,
      }));
    },
    [],
  );


  const handleFilterChange = useCallback(
    (
      filter: PublicMarketplaceFilter | null,
    ) => {
      setQuery((current) => ({
        ...current,
        filter,
      }));
    },
    [],
  );


  // ---------------------------------------------------------------------------
  // Public Journey routes
  // ---------------------------------------------------------------------------
  //
  // Marketplace presentation components do not know the application's route
  // structure.
  //
  // They receive already-resolved public hrefs from this application boundary.
  //
  // These callbacks are memoized because they are passed through several
  // presentation boundaries and do not need to be recreated on every render.
  // ---------------------------------------------------------------------------

  const getJourneyViewHref = useCallback(
    (publicId: string) =>
      `/journeys/${publicId}`,
    [],
  );


  const getJourneyBookHref = useCallback(
    (publicId: string) =>
      `/journeys/${publicId}?action=book`,
    [],
  );


  // ---------------------------------------------------------------------------
  // Public Journey Demand routes
  // ---------------------------------------------------------------------------

  const getDemandViewHref = useCallback(
    (publicId: string) =>
      `/demands/${publicId}`,
    [],
  );


  const getDemandJoinHref = useCallback(
    (publicId: string) =>
      `/demands/${publicId}?action=join`,
    [],
  );


  // ---------------------------------------------------------------------------
  // Presentation boundary
  // ---------------------------------------------------------------------------
  //
  // The marketplace read result is passed through without adding another
  // client-side representation or pagination model.
  //
  // LandingPage receives the controlled marketplace contract and remains
  // responsible for rendering the marketplace presentation tree.
  // ---------------------------------------------------------------------------

  return (
    <LandingPage
      marketplace={{
        items,

        query,

        isLoading,

        isError:
          error !== null,

        onTypeChange:
          handleTypeChange,

        onFromChange:
          handleFromChange,

        onToChange:
          handleToChange,

        onDateChange:
          handleDateChange,

        onFilterChange:
          handleFilterChange,

        getJourneyViewHref,

        getJourneyBookHref,

        getDemandViewHref,

        getDemandJoinHref,

        linkJourneyProviderToProfile:
          true,

        showJourneyProviderTrustBadges:
          true,

        linkDemandRequesterToProfile:
          true,

        showDemandRequesterTrustBadges:
          true,
      }}
    />
  );
}


// =============================================================================
// Default Export
// =============================================================================

export default PublicMarketplaceContent;