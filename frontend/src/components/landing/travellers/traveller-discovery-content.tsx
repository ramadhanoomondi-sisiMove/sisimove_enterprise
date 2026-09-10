// -----------------------------------------------------------------------------
// sisiMove — Traveller Discovery Content
// -----------------------------------------------------------------------------
//
// Client-side composition boundary for public Journey discovery.
//
// Public discovery is Journey-first.
//
// The composition layer retrieves two legitimate public collections from their
// owning bounded contexts:
//
//   Published Journeys
//       GET /journeys/status/PUBLISHED
//
//   Searched Published Journeys
//       GET /journeys/search?from=&to=&date=
//
//   Open Journey Demands
//       GET /journey-demands/open
//
// The "All" view combines the already-resolved Journey and Journey Demand
// collections here, at the presentation composition boundary.
//
// Search is not performed locally. Search criteria are passed to the existing
// Journey hook, which delegates to the Journey API and ultimately to the
// Journey application's published-Journey search query.
//
// Responsibilities:
// - Own public Journey and Journey Demand loading through existing hooks.
// - Trigger initial public discovery requests.
// - Execute published Journey searches through useJourneys().search().
// - Combine the two public collections for the All tab.
// - Select the collection rendered by the active tab.
// - Transform feature read-models into presentation list items.
// - Connect the selected tab to TravellerDiscoverySection.
//
// This component does not:
// - call APIs directly;
// - use repositories;
// - perform matching;
// - perform client-side discovery filtering;
// - resolve traveller identity;
// - resolve trust information;
// - own authentication;
// - invent a separate traveller-discovery backend.
//
// Architectural boundary:
//
// Journey API
//      ↓
// useJourneys()
//      ↓
// Journey[]
//      │
//      ├─────────────────────┐
//      │                     │
//      │                     ↓
//      │              All / Journeys
//      │
// Journey Demand API         │
//      ↓                     │
// useJourneyDemands()        │
//      ↓                     │
// JourneyDemand[] ───────────┘
//              ↓
//      Presentation items
//              ↓
// TravellerDiscoverySection
//
// The landing page remains a Server Component.
//
// Search criteria arrive from the public landing-page URL:
//
// /?from=Nairobi&to=Kisumu&date=2026-09-15
//      ↓
// page.tsx
//      ↓
// LandingPage
//      ↓
// TravellerDiscoveryContent
//      ↓
// useJourneys.search()
//      ↓
// GET /journeys/search
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

// -----------------------------------------------------------------------------
// Journey Feature
// -----------------------------------------------------------------------------

import {
  useJourneys,
  type Journey,
  type UseJourneysSearchValues,
} from '@/features/journeys';

// -----------------------------------------------------------------------------
// Journey Demand Feature
// -----------------------------------------------------------------------------

import {
  useJourneyDemands,
  type JourneyDemand,
} from '@/features/journey-demands';

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

  /**
   * Published Journey search criteria supplied by the landing composition.
   *
   * When present, the existing published-Journey collection is replaced by
   * the results returned from the Journey search API.
   *
   * The values are transport-safe primitives. Search execution remains owned
   * by the Journey feature through useJourneys().
   */
  readonly searchValues?: UseJourneysSearchValues | null;
}

// -----------------------------------------------------------------------------
// Discovery Tab
// -----------------------------------------------------------------------------
//
// Keep this aligned with the existing TravellerDiscoverySection contract.
//
// The presentation layer defines the demand tab as DEMANDS.
// Do not introduce a second DEMAND spelling in this composition layer.
//
// -----------------------------------------------------------------------------

type DiscoveryTab =
  | 'ALL'
  | 'JOURNEYS'
  | 'DEMANDS';

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerDiscoveryContent({
  className,
  searchValues = null,
}: TravellerDiscoveryContentProps) {
  // ---------------------------------------------------------------------------
  // Journey Discovery
  // ---------------------------------------------------------------------------

  const {
    journeys,
    isLoading: isJourneysLoading,
    error: journeysError,
    load: loadJourneys,
    search: searchJourneys,
  } = useJourneys();

  // ---------------------------------------------------------------------------
  // Journey Demand Discovery
  // ---------------------------------------------------------------------------

  const {
    journeyDemands,
    isLoading: isJourneyDemandsLoading,
    error: journeyDemandsError,
    load: loadJourneyDemands,
  } = useJourneyDemands();

  // ---------------------------------------------------------------------------
  // Selected Tab
  // ---------------------------------------------------------------------------
  //
  // Tab state belongs to the composition layer because this component decides
  // which already-loaded public collection is presented.
  //
  // It is not API query state.
  //

  const [tab, setTab] =
    useState<DiscoveryTab>('ALL');

  // ---------------------------------------------------------------------------
  // Search Criteria
  // ---------------------------------------------------------------------------
  //
  // Extract primitive values so React effects depend on the actual criteria,
  // rather than on the object reference supplied by the Server Component.
  //
  // This prevents an equivalent search object from causing an unnecessary
  // repeated Journey search.
  //

  const searchFrom = searchValues?.from ?? '';
  const searchTo = searchValues?.to ?? '';
  const searchDate = searchValues?.date ?? '';

  const hasSearchValues =
    searchFrom.length > 0 &&
    searchTo.length > 0 &&
    searchDate.length > 0;

  // ---------------------------------------------------------------------------
  // Initial Public Journey Discovery
  // ---------------------------------------------------------------------------
  //
  // The Journey hook deliberately does not fetch automatically.
  //
  // When no search criteria are present, load the complete published Journey
  // collection.
  //
  // When search criteria are present, the search effect below owns the Journey
  // request instead.
  //

  useEffect(() => {
    if (hasSearchValues) {
      return;
    }

    void loadJourneys();
  }, [
    hasSearchValues,
    loadJourneys,
  ]);

  // ---------------------------------------------------------------------------
  // Public Journey Demand Discovery
  // ---------------------------------------------------------------------------
  //
  // Journey Demand remains an independent public collection.
  //
  // A Journey search does not affect the Demand collection.
  //

  useEffect(() => {
    void loadJourneyDemands();
  }, [
    loadJourneyDemands,
  ]);

  // ---------------------------------------------------------------------------
  // Published Journey Search
  // ---------------------------------------------------------------------------
  //
  // Search criteria originate from the landing-page URL.
  //
  // No filtering occurs here. The values are delegated to the existing
  // Journey application/API path through useJourneys().
  //
  // The Journey backend therefore remains authoritative for which published
  // Journeys match the requested route and date.
  //

  useEffect(() => {
    if (!hasSearchValues) {
      return;
    }

    const values: UseJourneysSearchValues = {
      from: searchFrom,
      to: searchTo,
      date: searchDate,
    };

    void searchJourneys(values);
  }, [
    hasSearchValues,
    searchFrom,
    searchTo,
    searchDate,
    searchJourneys,
  ]);

  // ---------------------------------------------------------------------------
  // Tab Change
  // ---------------------------------------------------------------------------

  const handleTabChange = useCallback(
    (nextTab: string): void => {
      if (
        nextTab === 'ALL' ||
        nextTab === 'JOURNEYS' ||
        nextTab === 'DEMANDS'
      ) {
        setTab(nextTab);
      }
    },
    [],
  );

  // ---------------------------------------------------------------------------
  // Presentation Items
  // ---------------------------------------------------------------------------
  //
  // No discovery filtering occurs here.
  //
  // The Journey collection has already been resolved either through the public
  // published-Journey endpoint or through the backend published-Journey search.
  //
  // "All" simply combines the two authoritative public collections.
  //

  const items = useMemo(() => {
    const journeyItems =
      tab === 'DEMANDS'
        ? []
        : journeys.map(
            (journey: Journey) => ({
              publicId: journey.publicId,
              content: (
                <TravellerJourney
                  journey={journey}
                />
              ),
            }),
          );

    const demandItems =
      tab === 'JOURNEYS'
        ? []
        : journeyDemands.map(
            (demand: JourneyDemand) => ({
              publicId: demand.publicId,
              content: (
                <TravellerDemand
                  demand={demand}
                />
              ),
            }),
          );

    return [
      ...journeyItems,
      ...demandItems,
    ];
  }, [
    tab,
    journeys,
    journeyDemands,
  ]);

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------
  //
  // All requires both public collections because both contribute to the
  // composed discovery result.
  //
  // Individual tabs depend only on their own collection.
  //
  // When a Journey search is active, isJourneysLoading represents the search
  // request because useJourneys() owns both collection loading and searching.
  //

  const isLoading =
    tab === 'JOURNEYS'
      ? isJourneysLoading
      : tab === 'DEMANDS'
        ? isJourneyDemandsLoading
        : isJourneysLoading ||
          isJourneyDemandsLoading;

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------
  //
  // For All, either collection failing makes the composed discovery result
  // unsuccessful.
  //
  // Individual tabs expose only the error belonging to that collection.
  //

  const error =
    tab === 'JOURNEYS'
      ? journeysError
      : tab === 'DEMANDS'
        ? journeyDemandsError
        : journeysError ??
          journeyDemandsError;

  // ---------------------------------------------------------------------------
  // Successful Load
  // ---------------------------------------------------------------------------
  //
  // An empty array is a valid successful response.
  //
  // Therefore success is determined from loading/error state rather than from
  // collection length.
  //

  const hasLoadedData =
    tab === 'JOURNEYS'
      ? !isJourneysLoading &&
        journeysError === null
      : tab === 'DEMANDS'
        ? !isJourneyDemandsLoading &&
          journeyDemandsError === null
        : !isJourneysLoading &&
          !isJourneyDemandsLoading &&
          journeysError === null &&
          journeyDemandsError === null;

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  const status =
    isLoading
      ? 'loading'
      : error
        ? 'error'
        : hasLoadedData
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
      tab={tab}
      onTabChange={handleTabChange}
      showTabs
      showEmptyState
    />
  );
}
