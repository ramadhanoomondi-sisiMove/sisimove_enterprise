// -----------------------------------------------------------------------------
// sisiMove — Traveller Discovery Content
// -----------------------------------------------------------------------------
//
// Client-side composition boundary for public Journey discovery.
//
// Public discovery has two legitimate public collections:
//
//   1. Published Journeys
//      GET /journeys/status/PUBLISHED
//
//   2. Open Journey Demands
//      GET /journey-demands/open
//
// Search adds a second responsibility to the Journey collection:
//
//   Search criteria
//        ↓
//   published Journey search
//        ↓
//   matching Journeys
//
// When a valid Journey search completes successfully but returns no published
// Journeys, the empty result becomes a conversion opportunity:
//
//   Search
//      ↓
//   no published Journey
//      ↓
//   preserve the exact search context
//      ↓
//   Journey Demand opportunity
//
// This remains one public discovery composition unit. A Journey search does
// not replace the broader public Journey/Demand marketplace.
//
// Responsibilities:
// - Own public Journey and Journey Demand loading through existing hooks.
// - Trigger initial public discovery requests.
// - Execute published Journey searches through useJourneys().search().
// - Determine when a Journey search has completed with no published Journeys.
// - Preserve the active search criteria for the empty-search conversion flow.
// - Report the empty-search context to the outer client composition boundary.
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
// - create Journey Demands;
// - decide whether a driver should publish a Journey;
// - resolve traveller identity;
// - resolve trust information;
// - own authentication;
// - perform booking;
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
//      ↓                     ↓
// Journeys              Empty search
//                              ↓
//                       Search context
//                              ↓
//                    outer composition
//                              ↓
//                     Demand conversion
//
// Journey Demand API
//      ↓
// useJourneyDemands()
//      ↓
// JourneyDemand[]
//      │
//      └─────────────────────┐
//                            ↓
//                     All / Demands
//                            ↓
//                   Presentation items
//                            ↓
//                 TravellerDiscoverySection
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
// client composition
//      ↓
// TravellerDiscoveryContent
//      ↓
// useJourneys.search()
//      ↓
// GET /journeys/search
//
// If that search returns no published Journey:
//
//      searchValues
//          ↓
//      isEmptySearch
//          ↓
//      emptySearchContext
//          ↓
//      outer client composition
//          ↓
//      JourneyDemandSection
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// This component deliberately does NOT filter journeyDemands locally by the
// Journey search criteria. The public Journey Demand collection remains owned
// by the Journey Demand feature.
//
// The empty-search state only preserves the traveller's original search
// context so the outer composition layer can present a demand opportunity.
// Authoritative demand matching remains an API/application concern.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT CLIENT BOUNDARY
//
// This component is a Client Component.
//
// The empty-search callback belongs to the client-side composition boundary.
// It must not be supplied directly by the Server Component LandingPage.
//
// TravellerDiscoveryContent detects the state.
//
// TravellerDiscoveryDemandContent owns the relationship between:
//
//   TravellerDiscoveryContent
//          ↓
//   emptySearchContext
//          ↓
//   JourneyDemandSection
//
// No demand is created automatically by this component.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT SEARCH SEMANTICS
//
// A valid search is considered empty only after the Journey search has:
//
//   1. received complete search criteria;
//   2. finished loading;
//   3. completed without an error;
//   4. returned zero published Journeys.
//
// An empty Journey result therefore represents:
//
//   "No published Journey currently matches this search."
//
// It does NOT mean:
//
//   "There are no Journey Demands."
//
// Journey Demands remain independently discoverable through the DEMANDS tab.
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
  type ReactNode,
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
   * When present, the Journey collection is resolved through the existing
   * published-Journey search API.
   *
   * These values are also retained when the search produces no Journey so the
   * empty-search state can be converted into a Journey Demand opportunity.
   *
   * The values remain transport-safe primitives. Search execution remains
   * owned by the Journey feature through useJourneys().
   */
  readonly searchValues?: UseJourneysSearchValues | null;

  /**
   * Reports the exact search context when a valid published-Journey search
   * completes successfully with no matching Journeys.
   *
   * This callback:
   * - does not create a Journey Demand;
   * - does not navigate;
   * - does not authenticate the traveller;
   * - does not perform matching.
   *
   * It only exposes the derived empty-search state to the outer client-side
   * composition boundary.
   *
   * This must be supplied by another Client Component, not directly by the
   * Server Component LandingPage.
   */
  readonly onEmptySearchContextChange?: (
    context: UseJourneysSearchValues | null,
  ) => void;
}

// -----------------------------------------------------------------------------
// Discovery Tab
// -----------------------------------------------------------------------------
//
// Keep this aligned with TravellerDiscoverySection.
//
// The presentation layer uses DEMANDS for the Journey Demand collection.
//

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
  onEmptySearchContextChange,
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
  // Tab state belongs to this composition layer because the component decides
  // which already-loaded public collection is presented.
  //
  // It is presentation state, not API query state.
  //

  const [tab, setTab] =
    useState<DiscoveryTab>('ALL');

  // ---------------------------------------------------------------------------
  // Search Criteria
  // ---------------------------------------------------------------------------
  //
  // Extract primitive values so effects depend on the actual search criteria
  // rather than the object reference supplied by the Server Component.
  //

  const searchFrom =
    searchValues?.from ?? '';

  const searchTo =
    searchValues?.to ?? '';

  const searchDate =
    searchValues?.date ?? '';

  const hasSearchValues =
    searchFrom.length > 0 &&
    searchTo.length > 0 &&
    searchDate.length > 0;

  // ---------------------------------------------------------------------------
  // Initial Public Journey Discovery
  // ---------------------------------------------------------------------------
  //
  // Without search criteria, load the complete published Journey collection.
  //
  // When search criteria exist, the search effect below owns the Journey
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
  // A Journey search never replaces or suppresses this collection.
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
  // Search criteria originate from the public landing-page URL.
  //
  // No filtering occurs here. The values are delegated to the existing
  // Journey feature, which calls the authoritative Journey search path.
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
  // Empty Search Detection
  // ---------------------------------------------------------------------------
  //
  // An empty search is NOT determined by journeys.length alone.
  //
  // It exists only when:
  //
  //   1. complete search criteria exist;
  //   2. the Journey search has finished;
  //   3. the Journey search succeeded;
  //   4. no published Journeys were returned.
  //
  // This prevents loading and error states from being presented as "no
  // journey".
  //

  const isEmptySearch =
    hasSearchValues &&
    !isJourneysLoading &&
    journeysError === null &&
    journeys.length === 0;

  // ---------------------------------------------------------------------------
  // Empty Search Context
  // ---------------------------------------------------------------------------
  //
  // Preserve the exact search context that produced the empty result.
  //
  // The downstream demand presentation therefore receives structured search
  // context instead of reconstructing it from displayed text.
  //

  const emptySearchContext =
    useMemo<UseJourneysSearchValues | null>(() => {
      if (!isEmptySearch) {
        return null;
      }

      return {
        from: searchFrom,
        to: searchTo,
        date: searchDate,
      };
    }, [
      isEmptySearch,
      searchFrom,
      searchTo,
      searchDate,
    ]);

  // ---------------------------------------------------------------------------
  // Report Empty Search Context
  // ---------------------------------------------------------------------------
  //
  // The discovery component detects the state.
  //
  // The outer Client Component decides what to render from that state.
  //
  // Null is reported whenever the search is:
  //
  // - absent;
  // - loading;
  // - unsuccessful;
  // - or has returned at least one Journey.
  //
  // This prevents stale empty-search conversion state.
  //

  useEffect(() => {
    onEmptySearchContextChange?.(
      emptySearchContext,
    );
  }, [
    emptySearchContext,
    onEmptySearchContextChange,
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
  // The collections have already been resolved by their owning features.
  //
  // This layer performs no discovery filtering or matching.
  //
  // ALL simply combines the two authoritative public collections.
  //

  const items = useMemo(() => {
    const journeyItems =
      tab === 'DEMANDS'
        ? []
        : journeys.map((journey: Journey) => ({
            publicId: journey.publicId,
            content: (
              <TravellerJourney
                journey={journey}
              />
            ),
          }));

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
  // ALL depends on both public collections.
  //
  // Each individual tab depends only on its own collection.
  //
  // When a Journey search is active, isJourneysLoading represents the current
  // Journey search request because useJourneys() owns both collection loading
  // and searching.
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
  // For ALL, either collection failing makes the composed discovery result
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
  // Success is therefore determined from loading/error state rather than
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
  //
  // TravellerDiscoverySection owns the public discovery presentation.
  //
  // Empty-search conversion is intentionally not rendered here. The separate
  // Journey Demand section receives the empty-search context through the outer
  // client composition boundary.
  //

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

