// -----------------------------------------------------------------------------
// sisiMove — Traveller Discovery Content
// -----------------------------------------------------------------------------
//
// Client-side composition boundary for public traveller discovery.
//
// Responsibilities:
// - Own public traveller discovery request state through the existing hook.
// - Connect discovery search state to the presentation section.
// - Connect the selected discovery tab to the existing discovery query.
// - Trigger the initial public discovery request.
// - Transform feature read-model data into presentation list items.
//
// Architectural boundary:
//
// - This is the feature/application composition layer.
// - It may use discovery hooks and feature models.
// - It may compose presentation components.
// - It does not contain API calls, repositories, or domain rules.
// - It does not duplicate discovery state.
// - It does not own authentication.
//
// The presentation components remain responsible only for rendering.
// The hook remains responsible for discovery request state.
// The landing page remains a Server Component.
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useCallback,
  useEffect,
  useMemo,
} from 'react';

// -----------------------------------------------------------------------------
// Traveller Discovery Feature
// -----------------------------------------------------------------------------

import {
  DEFAULT_PUBLIC_TRAVELLER_DISCOVERY_ACTIVITY_FILTER,
  usePublicTravellerSearch,
  type PublicTravellerDiscoveryActivityFilter,
} from '@/features/traveller-discovery';

// -----------------------------------------------------------------------------
// Presentation
// -----------------------------------------------------------------------------

import {
  TravellerDemand,
  TravellerDiscoverySection,
  TravellerJourney,
} from '.';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface TravellerDiscoveryContentProps {
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerDiscoveryContent({
  className,
}: TravellerDiscoveryContentProps) {
  const {
    query,
    data,
    isLoading,
    error,
    search,
    searchWith,
  } = usePublicTravellerSearch();

  // ---------------------------------------------------------------------------
  // Initial Discovery
  // ---------------------------------------------------------------------------
  //
  // The discovery hook deliberately does not fetch automatically.
  //
  // The landing-page composition boundary is responsible for deciding that
  // public discovery should begin when this content is mounted.
  // ---------------------------------------------------------------------------

  useEffect(() => {
    void search();
  }, [search]);

  // ---------------------------------------------------------------------------
  // Selected Tab
  // ---------------------------------------------------------------------------
  //
  // ALL is represented by an undefined API filter.
  //
  // The presentation layer still needs an explicit tab value, so ALL is used
  // whenever the current query has no activity filter.
  // ---------------------------------------------------------------------------

  const selectedTab =
    query.type ??
    DEFAULT_PUBLIC_TRAVELLER_DISCOVERY_ACTIVITY_FILTER;

  // ---------------------------------------------------------------------------
  // Tab Change
  // ---------------------------------------------------------------------------
  //
  // searchWith() updates the query and executes the search using that exact
  // query. This avoids maintaining duplicate tab state in the component.
  // ---------------------------------------------------------------------------

  const handleTabChange = useCallback(
    (
      tab: PublicTravellerDiscoveryActivityFilter,
    ): void => {
      void searchWith({
        ...query,
        type:
          tab ===
          DEFAULT_PUBLIC_TRAVELLER_DISCOVERY_ACTIVITY_FILTER
            ? undefined
            : tab,
      });
    },
    [query, searchWith],
  );

  // ---------------------------------------------------------------------------
  // Presentation Items
  // ---------------------------------------------------------------------------
  //
  // A discovery result represents one traveller and may contain multiple
  // public activities.
  //
  // Each activity becomes one presentation list item.
  //
  // The activity publicId is used as the stable list-item identifier.
  // The complete discovery result remains attached so the activity card can
  // render the traveller and trust projections alongside the activity.
  // ---------------------------------------------------------------------------

  const items = useMemo(() => {
    if (!data?.results?.length) {
      return [];
    }

    return data.results.flatMap(
      (result) =>
        result.activities.map(
          (activity, activityIndex) => ({
            publicId: activity.publicId,
            discovery: result,
            activityIndex,

            content:
              activity.type === 'JOURNEY' ? (
                <TravellerJourney
                  journey={activity.journey}
                />
              ) : (
                <TravellerDemand
                  demand={activity.demand}
                />
              ),
          }),
        ),
    );
  }, [data]);

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  const status =
    isLoading
      ? 'loading'
      : error
        ? 'error'
        : data
          ? 'success'
          : 'idle';

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <TravellerDiscoverySection
      className={className}
      status={status}
      items={items}
      tab={selectedTab}
      onTabChange={handleTabChange}
      showTabs
      showEmptyState
    />
  );
}