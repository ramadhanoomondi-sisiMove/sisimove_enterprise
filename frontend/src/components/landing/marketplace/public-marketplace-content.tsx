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
// Architecture:
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
//
// IMPORTANT:
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
//
// Unified marketplace pagination belongs to a future marketplace read
// boundary when the underlying Journey and Journey Demand pagination contracts
// can be composed truthfully.
// -----------------------------------------------------------------------------

'use client';

import {
  useCallback,
  useState,
} from 'react';

import {
  LandingPage,
} from '@/components/landing/landing-page';

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
 * An empty discovery scope is intentional.
 *
 * The public landing page starts by showing what is currently available in
 * the marketplace. Route, date, and other filters refine that initial stream.
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
 * This component is deliberately thin.
 *
 * The marketplace feature hook owns composition of Journey and Journey Demand.
 * The landing components own presentation.
 *
 * This component connects those two boundaries.
 */
export function PublicMarketplaceContent() {
  // ---------------------------------------------------------------------------
  // Marketplace query state
  // ---------------------------------------------------------------------------
  //
  // Query state belongs here rather than inside MarketplaceSection because
  // MarketplaceSection is a presentation component.
  // ---------------------------------------------------------------------------

  const [query, setQuery] = useState<PublicMarketplaceQuery>(
    INITIAL_MARKETPLACE_QUERY,
  );


  // ---------------------------------------------------------------------------
  // Marketplace read state
  // ---------------------------------------------------------------------------
  //
  // The marketplace hook is the sole composition point for the public Journey
  // and Journey Demand streams.
  // ---------------------------------------------------------------------------

  const {
    items,
    isLoading,
    error,
  } = usePublicMarketplace(query);


  // ---------------------------------------------------------------------------
  // Query interaction
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
    (filter: PublicMarketplaceFilter | null) => {
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
  // Route construction belongs at the application/presentation boundary.
  //
  // Marketplace presentation components receive already-resolved hrefs rather
  // than knowing the application's route structure.
  // ---------------------------------------------------------------------------

  const getJourneyViewHref = useCallback(
    (publicId: string) => `/journeys/${publicId}`,
    [],
  );


  const getJourneyBookHref = useCallback(
    (publicId: string) => `/journeys/${publicId}?action=book`,
    [],
  );


  // ---------------------------------------------------------------------------
  // Public Journey Demand routes
  // ---------------------------------------------------------------------------

  const getDemandViewHref = useCallback(
    (publicId: string) => `/demands/${publicId}`,
    [],
  );


  const getDemandJoinHref = useCallback(
    (publicId: string) => `/demands/${publicId}?action=join`,
    [],
  );


  // ---------------------------------------------------------------------------
  // Presentation
  // ---------------------------------------------------------------------------
  //
  // IMPORTANT:
  //
  // `items` is passed through from usePublicMarketplace() without inventing a
  // marketplace pagination model.
  //
  // The presentation layer should therefore consume the actual marketplace
  // composition result rather than expecting server pagination that does not
  // currently exist.
  // ---------------------------------------------------------------------------

  return (
    <LandingPage
      marketplace={{
        items,

        query,

        isLoading,

        isError: error !== null,

        onTypeChange: handleTypeChange,
        onFromChange: handleFromChange,
        onToChange: handleToChange,
        onDateChange: handleDateChange,

        onFilterChange: handleFilterChange,

        getJourneyViewHref,
        getJourneyBookHref,

        getDemandViewHref,
        getDemandJoinHref,

        linkJourneyProviderToProfile: true,
        showJourneyProviderTrustBadges: true,

        linkDemandRequesterToProfile: true,
        showDemandRequesterTrustBadges: true,
      }}
    />
  );
}


export default PublicMarketplaceContent;
