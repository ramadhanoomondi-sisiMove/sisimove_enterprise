// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Filter Bar
// -----------------------------------------------------------------------------
//
// Composition component for the public marketplace controls.
//
// The filter bar brings together:
//
//     MarketplaceFilters
//         ├── origin
//         ├── destination
//         ├── date
//         └── secondary filters
//
//     MarketplaceTabs
//         └── marketplace scope
//
// The marketplace remains browse-first.
//
// Visitors see the published marketplace first. These controls only refine
// the currently visible marketplace and select which marketplace stream is
// being viewed.
//
// This component is intentionally presentation-only.
//
// It does NOT:
//
// - fetch marketplace data;
// - own marketplace query state;
// - update URL state directly;
// - perform filtering;
// - perform sorting;
// - determine booking eligibility;
// - contain Journey business rules;
// - contain Journey Demand business rules.
//
// The parent owns the query state and supplies the callbacks required to
// update that state.
//
// -----------------------------------------------------------------------------
//
// Visual structure
//
// The filter bar follows the public marketplace design:
//
//     [ From ] [ To ] [ Date ] [ Filters ]
//
//     [ All ] [ Journeys ] [ Demand ]
//
// Search/refinement controls are intentionally presented before marketplace
// stream navigation. The visitor can therefore refine the visible market
// without the interface feeling like a search-first experience.
//
// -----------------------------------------------------------------------------


import type { PublicMarketplaceFilter } from '@/features/public-marketplace/models/public-marketplace-filter';
import type {
  PublicMarketplaceQuery,
  PublicMarketplaceType,
} from '@/features/public-marketplace/models/public-marketplace-query';

import { MarketplaceFilters } from './marketplace-filters';
import { MarketplaceTabs } from './marketplace-tabs';


// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------


export interface MarketplaceFilterBarProps {
  /**
   * Current marketplace query state.
   *
   * The filter bar reads this state but does not own or mutate it.
   */
  query: PublicMarketplaceQuery;

  /**
   * Reports a changed marketplace scope.
   */
  onTypeChange: (value: PublicMarketplaceType) => void;

  /**
   * Reports a changed origin value.
   *
   * null means that the origin filter has been cleared.
   */
  onFromChange: (value: string | null) => void;

  /**
   * Reports a changed destination value.
   *
   * null means that the destination filter has been cleared.
   */
  onToChange: (value: string | null) => void;

  /**
   * Reports a changed travel date.
   *
   * null means that the date filter has been cleared.
   */
  onDateChange: (value: string | null) => void;

  /**
   * Reports changed secondary marketplace filters.
   *
   * null means that no secondary filter is active.
   */
  onFilterChange: (filter: PublicMarketplaceFilter | null) => void;

  /**
   * Optional additional classes applied to the filter bar.
   */
  className?: string;
}


// -----------------------------------------------------------------------------
// Marketplace Filter Bar
// -----------------------------------------------------------------------------


export function MarketplaceFilterBar({
  query,
  onTypeChange,
  onFromChange,
  onToChange,
  onDateChange,
  onFilterChange,
  className,
}: MarketplaceFilterBarProps) {
  return (
    <section
      aria-label="Marketplace controls"
      className={[
        'flex min-w-0 flex-col gap-5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Search and refinement controls                                      */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * These controls refine the marketplace currently visible to the
       * visitor. They do not initiate marketplace creation or own query
       * state.
       */}

      <MarketplaceFilters
        query={query}
        onFromChange={onFromChange}
        onToChange={onToChange}
        onDateChange={onDateChange}
        onFilterChange={onFilterChange}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Marketplace stream navigation                                       */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * Stream selection is deliberately kept below the refinement controls
       * to match the physical-market presentation:
       *
       *     refinement
       *          ↓
       *     market stream
       *
       * MarketplaceTabs remains controlled by the parent through query.type.
       */}

      <div className="flex min-w-0 items-center">
        <MarketplaceTabs
          value={query.type}
          onChange={onTypeChange}
        />
      </div>
    </section>
  );
}
