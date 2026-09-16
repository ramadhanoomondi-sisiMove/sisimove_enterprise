// -----------------------------------------------------------------------------
// sisiMove — Marketplace Section
// -----------------------------------------------------------------------------
//
// Top-level presentation section for the public Journey Marketplace.
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
  readonly items: readonly PublicMarketplaceItem[];

  /**
   * Current marketplace query state.
   *
   * Query state remains controlled by the parent/application layer.
   */
  readonly query: PublicMarketplaceQuery;

  /**
   * Indicates that the marketplace sources are currently loading.
   *
   * Existing items remain visible while loading.
   */
  readonly isLoading?: boolean;

  /**
   * Indicates that the marketplace request failed.
   *
   * The error state is rendered only when there are no items to preserve.
   */
  readonly isError?: boolean;

  /**
   * Called when the visitor requests a retry after an error.
   */
  readonly onRetry?: () => void;

  /**
   * Called when the marketplace stream changes.
   */
  readonly onTypeChange: (type: PublicMarketplaceType) => void;

  /**
   * Called when the origin filter changes.
   *
   * null means that the origin filter has been cleared.
   */
  readonly onFromChange: (value: string | null) => void;

  /**
   * Called when the destination filter changes.
   *
   * null means that the destination filter has been cleared.
   */
  readonly onToChange: (value: string | null) => void;

  /**
   * Called when the travel-date filter changes.
   *
   * null means that the date filter has been cleared.
   */
  readonly onDateChange: (value: string | null) => void;

  /**
   * Called when secondary marketplace filters change.
   *
   * null means that no secondary marketplace filter is applied.
   */
  readonly onFilterChange: (
    filter: PublicMarketplaceFilter | null,
  ) => void;

  /**
   * Resolves the public Journey detail URL.
   *
   * URL construction remains outside this presentation component.
   */
  readonly getJourneyViewHref: (publicId: string) => string;

  /**
   * Optionally resolves the Journey booking URL.
   *
   * Returning undefined means that no booking action is rendered.
   */
  readonly getJourneyBookHref?: (
    publicId: string,
  ) => string | undefined;

  /**
   * Resolves the public Journey Demand detail URL.
   */
  readonly getDemandViewHref: (publicId: string) => string;

  /**
   * Optionally resolves the Journey Demand participation URL.
   *
   * Returning undefined means that no Join action is rendered.
   */
  readonly getDemandJoinHref?: (
    publicId: string,
  ) => string | undefined;

  /**
   * Whether Journey provider profiles should be linked.
   */
  readonly linkJourneyProviderToProfile?: boolean;

  /**
   * Whether Journey provider trust information/badges should be displayed.
   */
  readonly showJourneyProviderTrustBadges?: boolean;

  /**
   * Whether Journey Demand requester profiles should be linked.
   */
  readonly linkDemandRequesterToProfile?: boolean;

  /**
   * Whether Journey Demand requester trust information/badges should be
   * displayed.
   */
  readonly showDemandRequesterTrustBadges?: boolean;

  /**
   * Optional additional CSS classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Styling
// -----------------------------------------------------------------------------

const SECTION_CLASS_NAME = [
  'w-full',
  'min-w-0',
  'border-t border-[var(--border)]',
].join(' ');

const CONTAINER_CLASS_NAME = [
  'mx-auto',
  'flex',
  'w-full',
  'max-w-7xl',
  'min-w-0',
  'flex-col',
  'px-1',
  'py-5',
  'sm:px-1.5',
  'sm:py-6',
  'md:px-2',
  'md:py-7',
  'lg:px-3',
  'lg:py-8',
].join(' ');

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
  // Presentation state
  // ---------------------------------------------------------------------------
  //
  // Existing inventory always takes precedence over transitional loading and
  // error states. This preserves the browse-first marketplace experience when
  // the parent changes filters or refreshes one of the marketplace sources.
  // ---------------------------------------------------------------------------

  /**
   * Show the loading state only when there is no inventory to preserve.
   */
  const showInitialLoading =
    isLoading && items.length === 0;

  /**
   * Show the error state only when there is no inventory to preserve and the
   * marketplace is not currently displaying its initial loading state.
   */
  const showInitialError =
    isError &&
    items.length === 0 &&
    !showInitialLoading;

  /**
   * Show the empty state only after loading and error states have completed.
   */
  const showEmptyState =
    !isLoading &&
    !isError &&
    items.length === 0;

  /**
   * Existing inventory remains visible during loading and error transitions.
   */
  const showResults = items.length > 0;

  return (
    <section
      id="marketplace"
      aria-labelledby="marketplace-heading"
      className={[
        SECTION_CLASS_NAME,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={CONTAINER_CLASS_NAME}>
        {/* ----------------------------------------------------------------- */}
        {/* Marketplace header                                                */}
        {/* ----------------------------------------------------------------- */}
        <MarketplaceHeader type={query.type} />

        {/* ----------------------------------------------------------------- */}
        {/* Marketplace refinement controls                                   */}
        {/* ----------------------------------------------------------------- */}
        <div className="mt-4 min-w-0 sm:mt-5">
          <MarketplaceFilters
            query={query}
            onFromChange={onFromChange}
            onToChange={onToChange}
            onDateChange={onDateChange}
            onFilterChange={onFilterChange}
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Marketplace stream navigation                                     */}
        {/* ----------------------------------------------------------------- */}
        <div className="mt-3 flex min-w-0 items-center sm:mt-4">
          <MarketplaceTabs
            value={query.type}
            onChange={onTypeChange}
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Marketplace inventory                                             */}
        {/* ----------------------------------------------------------------- */}
        <div className="mt-4 flex min-w-0 flex-col sm:mt-5">
          {/* --------------------------------------------------------------- */}
          {/* Result context                                                   */}
          {/* --------------------------------------------------------------- */}
          {!showInitialLoading && !showInitialError && (
            <p className="mb-2 text-xs leading-5 text-[var(--foreground-muted)] sm:mb-3 sm:text-sm sm:leading-6">
              {items.length > 0
                ? 'Showing what’s available'
                : 'No marketplace inventory available yet'}
            </p>
          )}

          {/* --------------------------------------------------------------- */}
          {/* Initial loading                                                  */}
          {/* --------------------------------------------------------------- */}
          {showInitialLoading && <MarketplaceLoadingState />}

          {/* --------------------------------------------------------------- */}
          {/* Initial error                                                    */}
          {/* --------------------------------------------------------------- */}
          {showInitialError && (
            <MarketplaceErrorState onRetry={onRetry} />
          )}

          {/* --------------------------------------------------------------- */}
          {/* Empty marketplace                                                */}
          {/* --------------------------------------------------------------- */}
          {showEmptyState && <MarketplaceEmptyState />}

          {/* --------------------------------------------------------------- */}
          {/* Marketplace results                                              */}
          {/* --------------------------------------------------------------- */}
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
          {/* Pagination                                                       */}
          {/* --------------------------------------------------------------- */}
          {/*
           * Intentionally no pagination UI.
           *
           * The current public marketplace composition does not expose a
           * canonical unified pagination contract.
           *
           * Do not fabricate:
           *
           * - hasMore;
           * - nextCursor;
           * - page;
           * - limit;
           * - pagination loading;
           * - unified refetch behavior.
           *
           * If the public marketplace read boundary later introduces
           * pagination, this presentation contract can be extended explicitly.
           */}
        </div>
      </div>
    </section>
  );
}