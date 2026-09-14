// -----------------------------------------------------------------------------
// sisiMove — Marketplace Section
// -----------------------------------------------------------------------------
//
// Top-level presentation section for the public Journey Market.
//
// The marketplace is a composition boundary over two independent feature
// domains:
//
// - Journey
// - Journey Demand
//
// MarketplaceSection owns only the visual composition of the marketplace.
//
// The marketplace data lifecycle remains owned by the parent/application
// layer.
//
// -----------------------------------------------------------------------------
//
// Responsibilities
// -----------------------------------------------------------------------------
//
// MarketplaceSection:
//
// - composes marketplace presentation components;
// - exposes controlled query/filter callbacks;
// - renders the supplied marketplace items;
// - renders loading, error, empty, and result states;
// - keeps the currently supplied items visible while the parent is loading.
//
// MarketplaceSection does NOT:
//
// - fetch marketplace data;
// - construct API requests;
// - manage URL state;
// - filter marketplace items;
// - sort marketplace items;
// - determine booking eligibility;
// - determine whether a demand can be joined;
// - construct Journey URLs;
// - construct Journey Demand URLs;
// - contain Journey business rules;
// - contain Journey Demand business rules;
// - fabricate pagination.
//
// Those responsibilities belong to the parent/application layer or to the
// respective feature domains.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT — CURRENT MARKETPLACE CONTRACT
// -----------------------------------------------------------------------------
//
// The current usePublicMarketplace() hook returns:
//
//     {
//       items,
//       isLoading,
//       error,
//     }
//
// It intentionally does not expose:
//
// - pagination;
// - hasMore;
// - nextCursor;
// - limit;
// - refetch;
// - unified marketplace pagination state.
//
// Journey and Journey Demand currently remain independent collection sources.
// Until a canonical unified marketplace pagination contract exists, the
// presentation layer must not invent one.
//
// -----------------------------------------------------------------------------
//
// Visual structure
// -----------------------------------------------------------------------------
//
// The public landing page follows the physical-market interaction model:
//
//     THE JOURNEY MARKET
//     See where people are going...
//
//     [ From ] [ To ] [ Date ] [ Filters ]
//
//     MARKET
//     [ All ] [ Journeys ] [ Demand ]
//     Showing what's available
//
//     ┌───────────────┐  ┌───────────────┐
//     │ JOURNEY       │  │ DEMAND        │
//     │ ...           │  │ ...           │
//     └───────────────┘  └───────────────┘
//
// The visitor therefore sees the market first and refines it second.
//
// Search and filters are discovery controls, not the entry requirement for
// seeing marketplace inventory.
//
// -----------------------------------------------------------------------------
//
// Composition boundary
// -----------------------------------------------------------------------------
//
// MarketplaceSection intentionally composes the marketplace controls directly:
//
//     MarketplaceFilters
//             ↓
//     MarketplaceHeader
//             ↓
//     MarketplaceTabs
//             ↓
//     MarketplaceResults
//
// This keeps the top-level visual order explicit.
//
// MarketplaceFilters owns only refinement controls.
//
// MarketplaceHeader identifies the marketplace result area.
//
// MarketplaceTabs switches between:
//
// - ALL
// - JOURNEY
// - DEMAND
//
// MarketplaceResults renders the supplied Journey and Demand read models.
//
// -----------------------------------------------------------------------------

import type {
  PublicMarketplaceFilter,
  PublicMarketplaceItem,
  PublicMarketplaceQuery,
  PublicMarketplaceType,
} from '@/features/public-marketplace/models';

import { MarketplaceEmptyState } from './marketplace-empty-state';
import { MarketplaceErrorState } from './marketplace-error-state';
import { MarketplaceFilters } from './marketplace-filters';
import { MarketplaceHeader } from './marketplace-header';
import { MarketplaceLoadingState } from './marketplace-loading-state';
import { MarketplaceResults } from './marketplace-results';
import { MarketplaceTabs } from './marketplace-tabs';


// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MarketplaceSectionProps {
  /**
   * Current marketplace items supplied by the parent/application layer.
   *
   * These items are already composed from the independent public Journey and
   * Journey Demand read models.
   */
  items: readonly PublicMarketplaceItem[];

  /**
   * Current marketplace query state.
   *
   * Query state remains controlled by the parent/application layer.
   */
  query: PublicMarketplaceQuery;

  /**
   * Indicates that the marketplace sources are currently loading.
   *
   * When items already exist, the section keeps those items visible instead
   * of replacing them with a loading skeleton.
   */
  isLoading?: boolean;

  /**
   * Indicates that the marketplace request failed.
   *
   * The section renders the error state only when there are no items to show.
   */
  isError?: boolean;

  /**
   * Called when the visitor requests a retry after an error.
   *
   * Retry behaviour remains owned by the parent/application layer.
   */
  onRetry?: () => void;

  /**
   * Called when the marketplace type changes.
   */
  onTypeChange: (type: PublicMarketplaceType) => void;

  /**
   * Called when the origin filter changes.
   *
   * null means that the origin filter has been cleared.
   */
  onFromChange: (value: string | null) => void;

  /**
   * Called when the destination filter changes.
   *
   * null means that the destination filter has been cleared.
   */
  onToChange: (value: string | null) => void;

  /**
   * Called when the travel-date filter changes.
   *
   * null means that the date filter has been cleared.
   */
  onDateChange: (value: string | null) => void;

  /**
   * Called when marketplace filters change.
   *
   * null means that no secondary marketplace filter is currently applied.
   */
  onFilterChange: (filter: PublicMarketplaceFilter | null) => void;

  /**
   * Resolves the public Journey detail URL.
   *
   * URL construction remains outside this presentation component.
   */
  getJourneyViewHref: (publicId: string) => string;

  /**
   * Optionally resolves the Journey booking URL.
   *
   * Returning undefined means that no booking action should be rendered.
   */
  getJourneyBookHref?: (publicId: string) => string | undefined;

  /**
   * Resolves the public Journey Demand detail URL.
   */
  getDemandViewHref: (publicId: string) => string;

  /**
   * Optionally resolves the Journey Demand participation URL.
   *
   * Returning undefined means that no join action should be rendered.
   */
  getDemandJoinHref?: (publicId: string) => string | undefined;

  /**
   * Optional Journey provider profile-link configuration.
   */
  linkJourneyProviderToProfile?: boolean;

  /**
   * Optional Journey provider trust-badge configuration.
   */
  showJourneyProviderTrustBadges?: boolean;

  /**
   * Optional Demand requester profile-link configuration.
   */
  linkDemandRequesterToProfile?: boolean;

  /**
   * Optional Demand requester trust-badge configuration.
   */
  showDemandRequesterTrustBadges?: boolean;

  /**
   * Optional additional CSS classes.
   */
  className?: string;
}


// -----------------------------------------------------------------------------
// Marketplace Section
// -----------------------------------------------------------------------------

export function MarketplaceSection({
  items,
  query,
  isLoading = false,
  isError = false,
  onRetry,
  onTypeChange,
  onFromChange,
  onToChange,
  onDateChange,
  onFilterChange,
  getJourneyViewHref,
  getJourneyBookHref,
  getDemandViewHref,
  getDemandJoinHref,
  linkJourneyProviderToProfile = true,
  showJourneyProviderTrustBadges = true,
  linkDemandRequesterToProfile = true,
  showDemandRequesterTrustBadges = true,
  className,
}: MarketplaceSectionProps) {
  // ---------------------------------------------------------------------------
  // Derived presentation state
  // ---------------------------------------------------------------------------
  //
  // The parent/application layer owns marketplace retrieval state.
  //
  // This component deliberately derives only presentation state from the
  // supplied values. It does not introduce another lifecycle or data model.
  // ---------------------------------------------------------------------------

  /**
   * Initial loading is represented by the loading skeleton only when there
   * are no marketplace items to keep visible.
   *
   * Once items exist, subsequent loading must not replace the visible market.
   */
  const showInitialLoading = isLoading && items.length === 0;

  /**
   * An error is presented as the primary marketplace state only when there
   * are no existing items to display.
   *
   * This prevents a temporary query failure from destroying already visible
   * marketplace inventory.
   */
  const showInitialError =
    isError &&
    items.length === 0 &&
    !showInitialLoading;

  /**
   * The empty state is meaningful only when the marketplace is not loading
   * and no error is currently preventing the result from being interpreted.
   *
   * An empty array with no loading/error therefore means that the current
   * marketplace query successfully produced no matching inventory.
   */
  const showEmptyState =
    !isLoading &&
    !isError &&
    items.length === 0;

  /**
   * Results remain mounted while the parent is loading.
   *
   * This is important for a browse-first marketplace because changing
   * discovery criteria should not make the visible market disappear while
   * the next independent Journey/Demand snapshots are being resolved.
   */
  const showResults = items.length > 0;


  return (
    <section
      id="marketplace"
      aria-labelledby="marketplace-heading"
      className={[
        'w-full min-w-0 border-t border-[var(--border)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col px-4 py-10 sm:px-6 sm:py-12 lg:px-8">

        {/* ----------------------------------------------------------------- */}
        {/* Marketplace refinement controls                                   */}
        {/* ----------------------------------------------------------------- */}
        {/*
         * Refinement controls appear before the inventory because the visitor
         * may optionally narrow the market after entering it.
         *
         * The controls do not initiate the marketplace experience. The
         * marketplace itself remains visible when the query is empty.
         *
         * Query state remains controlled by the parent.
         */}

        <MarketplaceFilters
          query={query}
          onFromChange={onFromChange}
          onToChange={onToChange}
          onDateChange={onDateChange}
          onFilterChange={onFilterChange}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Marketplace heading                                                */}
        {/* ----------------------------------------------------------------- */}
        {/*
         * The hero already introduces "The Journey Market".
         *
         * MarketplaceHeader therefore identifies the actual inventory area
         * without repeating the hero's descriptive copy.
         */}

        <MarketplaceHeader className="mt-10" />

        {/* ----------------------------------------------------------------- */}
        {/* Marketplace stream navigation                                      */}
        {/* ----------------------------------------------------------------- */}
        {/*
         * Tabs belong to the marketplace itself rather than to the generic
         * refinement controls.
         *
         * They therefore appear directly beneath the MARKET heading and
         * before the marketplace result content.
         */}

        <div className="mt-5 flex min-w-0 items-center">
          <MarketplaceTabs
            value={query.type}
            onChange={onTypeChange}
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Marketplace content                                                */}
        {/* ----------------------------------------------------------------- */}

        <div className="mt-5 flex min-w-0 flex-col gap-6">

          {/* --------------------------------------------------------------- */}
          {/* Result context                                                   */}
          {/* --------------------------------------------------------------- */}
          {/*
           * Keep the marketplace context compact.
           *
           * The wording deliberately does not become another hero. It simply
           * tells the visitor what the cards below represent.
           */}

          {!showInitialLoading && !showInitialError && (
            <p className="text-sm leading-6 text-[var(--foreground-muted)]">
              Showing what&apos;s available
            </p>
          )}

          {/* --------------------------------------------------------------- */}
          {/* Initial loading                                                  */}
          {/* --------------------------------------------------------------- */}

          {showInitialLoading && (
            <MarketplaceLoadingState />
          )}

          {/* --------------------------------------------------------------- */}
          {/* Initial error                                                     */}
          {/* --------------------------------------------------------------- */}

          {showInitialError && (
            <MarketplaceErrorState
              onRetry={onRetry}
            />
          )}

          {/* --------------------------------------------------------------- */}
          {/* Empty marketplace                                                */}
          {/* --------------------------------------------------------------- */}

          {showEmptyState && (
            <MarketplaceEmptyState />
          )}

          {/* --------------------------------------------------------------- */}
          {/* Marketplace results                                              */}
          {/* --------------------------------------------------------------- */}
          {/*
           * Results remain mounted while isLoading is true if existing items
           * were supplied by the parent.
           *
           * There is intentionally no separate refreshing skeleton. The
           * current marketplace remains visible until the parent supplies the
           * next snapshot.
           */}

          {showResults && (
            <MarketplaceResults
              items={items}
              getJourneyViewHref={getJourneyViewHref}
              getJourneyBookHref={getJourneyBookHref}
              getDemandViewHref={getDemandViewHref}
              getDemandJoinHref={getDemandJoinHref}
              linkJourneyProviderToProfile={
                linkJourneyProviderToProfile
              }
              showJourneyProviderTrustBadges={
                showJourneyProviderTrustBadges
              }
              linkDemandRequesterToProfile={
                linkDemandRequesterToProfile
              }
              showDemandRequesterTrustBadges={
                showDemandRequesterTrustBadges
              }
            />
          )}

          {/* --------------------------------------------------------------- */}
          {/* Refreshing                                                       */}
          {/* --------------------------------------------------------------- */}
          {/*
           * There is intentionally no pagination or "load more" control here.
           *
           * The current marketplace composition is built from two independent
           * collection hooks:
           *
           *     usePublicJourneys()
           *              +
           *     useJourneyDemands()
           *
           * Neither currently exposes a unified marketplace pagination
           * contract. Therefore this section must not invent:
           *
           * - hasMore;
           * - nextCursor;
           * - page numbers;
           * - pagination loading;
           * - unified marketplace refetch behaviour.
           *
           * A future canonical Public Marketplace read boundary may introduce
           * those concepts. When that happens, the presentation contract can
           * be extended deliberately rather than anticipating the API.
           */}

        </div>
      </div>
    </section>
  );
}

