// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Filter Bar
// -----------------------------------------------------------------------------
//
// Composition boundary for public marketplace discovery controls.
//
// The filter bar composes two presentation components:
//
//     MarketplaceFilters
//         ├── origin
//         ├── destination
//         ├── date
//         └── secondary filters
//
//     MarketplaceTabs
//         ├── All
//         ├── Journeys
//         └── Demand
//
// The marketplace is intentionally browse-first.
//
// Published marketplace content is visible without requiring a search.
// These controls refine the visible marketplace and select which marketplace
// stream is currently being viewed.
//
// -----------------------------------------------------------------------------
// Architectural boundary
// -----------------------------------------------------------------------------
//
// This component is presentation-only.
//
// It does NOT:
//
// - fetch marketplace data;
// - own marketplace query state;
// - update URL state;
// - perform filtering or sorting;
// - determine booking eligibility;
// - contain Journey business rules;
// - contain Journey Demand business rules.
//
// The parent marketplace boundary owns query state and supplies the callbacks
// used to update that state.
//
// -----------------------------------------------------------------------------
// Responsive presentation
// -----------------------------------------------------------------------------
//
// The marketplace filter surface is mobile-first and compact.
//
// The controls:
//
// - remain horizontally oriented;
// - contract with the available viewport;
// - keep stream tabs visually connected to the filters;
// - avoid unnecessary hero-like whitespace;
// - do not introduce horizontal page scrolling.
//
// The child presentation components remain responsible for the exact sizing
// and behavior of their individual controls.
//
// -----------------------------------------------------------------------------
// Visual structure
// -----------------------------------------------------------------------------
//
//     [ From ] [ To ] [ Date ] [ Refine ]
//
//     [ All ] [ Journeys ] [ Demand ]
//
// Refinement remains above stream navigation because the visitor is already
// inside the marketplace. The controls refine the market rather than acting
// as a gate before the market is shown.
//
// -----------------------------------------------------------------------------

import type { PublicMarketplaceFilter } from '@/features/public-marketplace/models/public-marketplace-filter';
import type {
  PublicMarketplaceQuery,
  PublicMarketplaceType,
} from '@/features/public-marketplace/models/public-marketplace-query';

import { cn } from '@/foundation';

import { MarketplaceFilters } from './marketplace-filters';
import { MarketplaceTabs } from './marketplace-tabs';

// =============================================================================
// Props
// =============================================================================

export interface MarketplaceFilterBarProps {
  /**
   * Current marketplace query state.
   *
   * The filter bar reads the state supplied by its parent but never owns it.
   */
  readonly query: PublicMarketplaceQuery;

  /**
   * Reports a changed marketplace stream.
   */
  readonly onTypeChange: (value: PublicMarketplaceType) => void;

  /**
   * Reports a changed origin filter.
   *
   * null clears the origin filter.
   */
  readonly onFromChange: (value: string | null) => void;

  /**
   * Reports a changed destination filter.
   *
   * null clears the destination filter.
   */
  readonly onToChange: (value: string | null) => void;

  /**
   * Reports a changed travel-date filter.
   *
   * null clears the date filter.
   */
  readonly onDateChange: (value: string | null) => void;

  /**
   * Reports changed secondary marketplace filters.
   *
   * null means that no secondary filter is active.
   */
  readonly onFilterChange: (
    filter: PublicMarketplaceFilter | null,
  ) => void;

  /**
   * Optional additional classes applied to the composition boundary.
   */
  readonly className?: string;
}

// =============================================================================
// Marketplace Filter Bar
// =============================================================================

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
      className={cn(
        'w-full min-w-0',
        className,
      )}
    >
      {/* =====================================================================
          Marketplace refinement

          The marketplace remains visible before these controls are used.
          These controls therefore refine the existing marketplace rather than
          acting as a search gate.
      ===================================================================== */}

      <div className="w-full min-w-0">
        <MarketplaceFilters
          query={query}
          onFromChange={onFromChange}
          onToChange={onToChange}
          onDateChange={onDateChange}
          onFilterChange={onFilterChange}
        />
      </div>

      {/* =====================================================================
          Marketplace stream navigation

          Keep tabs close to the filters. They belong to the same discovery
          surface and should not visually compete with the marketplace
          results below.
      ===================================================================== */}

      <div
        className={cn(
          'mt-2',
          'flex w-full min-w-0',
          'items-center',
          'sm:mt-2.5',
        )}
      >
        <MarketplaceTabs
          value={query.type}
          onChange={onTypeChange}
        />
      </div>
    </section>
  );
}