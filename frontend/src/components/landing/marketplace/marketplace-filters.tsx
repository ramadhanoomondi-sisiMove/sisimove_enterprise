// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Filters
// -----------------------------------------------------------------------------
//
// Primary and secondary discovery controls for the public marketplace.
//
// The marketplace is browse-first:
//
//     Published marketplace
//             ↓
//     Visitor optionally refines
//             ↓
//     Matching marketplace items
//
// This component renders the visitor-facing controls used to refine the
// currently visible marketplace.
//
// It does NOT:
//
// - fetch marketplace data;
// - perform filtering itself;
// - perform sorting;
// - update URL state directly;
// - contain Journey business rules;
// - contain Journey Demand business rules;
// - determine booking eligibility;
// - determine whether a Journey or Demand is valid.
//
// The parent marketplace/query boundary owns the actual query state and
// decides what to do when a value changes.
//
// -----------------------------------------------------------------------------
//
// Query mapping
//
// UI controls
//
//     Primary discovery
//         ├── From
//         ├── To
//         ├── Date
//         └── Filters
//
//     Secondary refinement
//         ├── Minimum seats
//         ├── Maximum price
//         ├── Verified traveller
//         └── Vehicle available
//
//                         ↓
//
//                 PublicMarketplaceQuery
//
// The component therefore deals only with values already represented by the
// marketplace read model.
//
// -----------------------------------------------------------------------------


import type { PublicMarketplaceFilter } from '@/features/public-marketplace/models/public-marketplace-filter';
import type { PublicMarketplaceQuery } from '@/features/public-marketplace/models/public-marketplace-query';


// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------


export interface MarketplaceFiltersProps {
  /**
   * Current marketplace query values.
   *
   * The parent owns this state.
   */
  query: PublicMarketplaceQuery;

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
   * null means that no secondary marketplace filter is active.
   */
  onFilterChange: (filter: PublicMarketplaceFilter | null) => void;

  /**
   * Optional additional classes applied to the filter layout.
   */
  className?: string;
}


// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
//
// These helpers keep the JSX focused on presentation.
//
// Empty input values are represented as null in the marketplace query model.
//
// -----------------------------------------------------------------------------


function valueOrEmpty(value: string | null): string {
  return value ?? '';
}


function filterValue(
  filter: PublicMarketplaceFilter | null,
): PublicMarketplaceFilter {
  return (
    filter ?? {
      minimumSeats: null,
      maximumPricePerSeat: null,
      hasVehicle: null,
      verifiedTravellerOnly: null,
    }
  );
}


// -----------------------------------------------------------------------------
// Marketplace Filters
// -----------------------------------------------------------------------------


export function MarketplaceFilters({
  query,
  onFromChange,
  onToChange,
  onDateChange,
  onFilterChange,
  className,
}: MarketplaceFiltersProps) {
  const filter = filterValue(query.filter);

  /**
   * Applies one or more changes to the current secondary filter state.
   *
   * The presentation component keeps the filter representation coherent but
   * does not decide what those filters mean or how they are applied to the
   * marketplace.
   */
  const updateFilter = (
    changes: Partial<PublicMarketplaceFilter>,
  ) => {
    const nextFilter: PublicMarketplaceFilter = {
      ...filter,
      ...changes,
    };

    const hasActiveFilter =
      nextFilter.minimumSeats !== null ||
      nextFilter.maximumPricePerSeat !== null ||
      nextFilter.hasVehicle !== null ||
      nextFilter.verifiedTravellerOnly !== null;

    onFilterChange(hasActiveFilter ? nextFilter : null);
  };

  return (
    <div
      className={[
        'flex min-w-0 flex-col gap-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Primary marketplace controls                                       */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * These are the primary discovery controls and intentionally occupy
       * the first row of the marketplace interface.
       *
       * On large screens this produces the intended:
       *
       *     From | To | Date | Filters
       *
       * arrangement.
       */}

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* ----------------------------------------------------------------- */}
        {/* From                                                               */}
        {/* ----------------------------------------------------------------- */}

        <div className="min-w-0">
          <label
            htmlFor="marketplace-from"
            className="mb-1.5 block text-xs font-medium text-[var(--foreground-secondary)]"
          >
            From
          </label>

          <input
            id="marketplace-from"
            type="text"
            value={valueOrEmpty(query.from)}
            onChange={(event) =>
              onFromChange(event.target.value || null)
            }
            placeholder="Departure"
            autoComplete="off"
            className="min-h-10 w-full min-w-0 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--foreground-muted)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20"
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* To                                                                 */}
        {/* ----------------------------------------------------------------- */}

        <div className="min-w-0">
          <label
            htmlFor="marketplace-to"
            className="mb-1.5 block text-xs font-medium text-[var(--foreground-secondary)]"
          >
            To
          </label>

          <input
            id="marketplace-to"
            type="text"
            value={valueOrEmpty(query.to)}
            onChange={(event) =>
              onToChange(event.target.value || null)
            }
            placeholder="Destination"
            autoComplete="off"
            className="min-h-10 w-full min-w-0 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--foreground-muted)] focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20"
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Date                                                               */}
        {/* ----------------------------------------------------------------- */}

        <div className="min-w-0">
          <label
            htmlFor="marketplace-date"
            className="mb-1.5 block text-xs font-medium text-[var(--foreground-secondary)]"
          >
            Date
          </label>

          <input
            id="marketplace-date"
            type="date"
            value={valueOrEmpty(query.date)}
            onChange={(event) =>
              onDateChange(event.target.value || null)
            }
            className="min-h-10 w-full min-w-0 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20"
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Secondary filter trigger area                                     */}
        {/* ----------------------------------------------------------------- */}

        <div className="min-w-0">
          <span className="mb-1.5 block text-xs font-medium text-[var(--foreground-secondary)]">
            Filters
          </span>

          <div className="flex min-h-10 min-w-0 gap-2">
            <select
              aria-label="Minimum seats"
              value={filter.minimumSeats ?? ''}
              onChange={(event) =>
                updateFilter({
                  minimumSeats: event.target.value
                    ? Number(event.target.value)
                    : null,
                })
              }
              className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20"
            >
              <option value="">Seats</option>
              <option value="1">1+ seat</option>
              <option value="2">2+ seats</option>
              <option value="3">3+ seats</option>
              <option value="4">4+ seats</option>
            </select>

            <select
              aria-label="Maximum price per seat"
              value={filter.maximumPricePerSeat ?? ''}
              onChange={(event) =>
                updateFilter({
                  maximumPricePerSeat: event.target.value
                    ? Number(event.target.value)
                    : null,
                })
              }
              className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)]/20"
            >
              <option value="">Price</option>
              <option value="500">KES 500</option>
              <option value="1000">KES 1,000</option>
              <option value="2000">KES 2,000</option>
              <option value="5000">KES 5,000</option>
            </select>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Secondary trust and vehicle refinement                              */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * These filters are less central than From, To, Date, and the primary
       * filter selectors, so they sit on a compact secondary row rather than
       * becoming accidental fifth and sixth columns in the main grid.
       */}

      <div className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-3 border-t border-[var(--border)] pt-3">
        {/* ----------------------------------------------------------------- */}
        {/* Verified traveller                                                */}
        {/* ----------------------------------------------------------------- */}

        <label className="inline-flex min-h-10 items-center gap-2 text-sm text-[var(--foreground-secondary)]">
          <input
            type="checkbox"
            checked={filter.verifiedTravellerOnly === true}
            onChange={(event) =>
              updateFilter({
                verifiedTravellerOnly: event.target.checked
                  ? true
                  : null,
              })
            }
            className="size-4 rounded border-[var(--border)] accent-[var(--primary)]"
          />

          <span>Verified travellers</span>
        </label>

        {/* ----------------------------------------------------------------- */}
        {/* Vehicle availability                                               */}
        {/* ----------------------------------------------------------------- */}

        <label className="inline-flex min-h-10 items-center gap-2 text-sm text-[var(--foreground-secondary)]">
          <input
            type="checkbox"
            checked={filter.hasVehicle === true}
            onChange={(event) =>
              updateFilter({
                hasVehicle: event.target.checked
                  ? true
                  : null,
              })
            }
            className="size-4 rounded border-[var(--border)] accent-[var(--primary)]"
          />

          <span>Vehicle available</span>
        </label>
      </div>
    </div>
  );
}