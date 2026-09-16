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
//     Primary discovery
//         ├── From
//         ├── To
//         └── Date
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
// The component deals only with values already represented by the marketplace
// read model.
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
// Small presentation icons
// -----------------------------------------------------------------------------
//
// These icons are intentionally local to this presentation component.
//
// They do not represent domain concepts, business rules, or feature logic.
// -----------------------------------------------------------------------------

function RoutePointIcon({
  type,
}: {
  type: 'from' | 'to';
}) {
  if (type === 'from') {
    return (
      <span
        aria-hidden="true"
        className="
          flex h-8 w-8 shrink-0 items-center justify-center
          rounded-lg
          bg-[var(--brand-soft)]
          text-[var(--brand)]
        "
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className="h-4 w-4"
        >
          <circle
            cx="10"
            cy="10"
            r="3"
            stroke="currentColor"
            strokeWidth="1.5"
          />

          <path
            d="M10 3v3M10 14v3M3 10h3M14 10h3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="
        flex h-8 w-8 shrink-0 items-center justify-center
        rounded-lg
        bg-[var(--background-muted)]
        text-[var(--foreground-secondary)]
      "
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className="h-4 w-4"
      >
        <path
          d="M10 3.5v10.5m0 0 3.5-3.5M10 14l-3.5-3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}


function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4.5"
        width="14"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M6.5 3v3M13.5 3v3M3 8h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}


function SlidersIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M4 5h12M6.5 10h7M8.5 15h3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <circle
        cx="7"
        cy="5"
        r="1.5"
        fill="var(--surface)"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <circle
        cx="13"
        cy="10"
        r="1.5"
        fill="var(--surface)"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <circle
        cx="10"
        cy="15"
        r="1.5"
        fill="var(--surface)"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
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

  /**
   * Number of active secondary refinements.
   *
   * This is presentation-only state derived from the controlled query.
   */
  const activeFilterCount = [
    filter.minimumSeats !== null,
    filter.maximumPricePerSeat !== null,
    filter.hasVehicle === true,
    filter.verifiedTravellerOnly === true,
  ].filter(Boolean).length;

  return (
    <section
      aria-label="Marketplace discovery filters"
      className={[
        'w-full min-w-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className="
          w-full min-w-0
          overflow-hidden
          rounded-xl sm:rounded-2xl
          border border-[var(--border)]
          bg-[var(--surface)]
          shadow-[var(--shadow-sm)]
        "
      >
        {/* -----------------------------------------------------------------
            Primary discovery controls

            These are deliberately compact.

            The marketplace is browse-first, so these controls should refine
            the visible market without pushing the actual marketplace far
            below the fold.
        ----------------------------------------------------------------- */}

        <div
          className="
            grid min-w-0
            grid-cols-[minmax(0,1fr)_minmax(0,1fr)]
            md:grid-cols-[minmax(0,1.15fr)_minmax(0,1.15fr)_minmax(0,0.9fr)]
            lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto]
          "
        >
          {/* From ---------------------------------------------------------- */}

          <div
            className="
              min-w-0
              border-b border-[var(--border)]
              md:border-b-0 md:border-r
            "
          >
            <label
              htmlFor="marketplace-from"
              className="
                flex min-h-[60px] cursor-text
                min-w-0 items-center
                gap-2 sm:gap-2.5
                px-2.5 sm:px-3 md:px-3.5 lg:px-4
                transition-colors
                hover:bg-[var(--background-subtle)]
              "
            >
              <RoutePointIcon type="from" />

              <span className="min-w-0 flex-1">
                <span
                  className="
                    block truncate
                    text-[9px] sm:text-[10px]
                    font-semibold uppercase
                    tracking-[0.1em]
                    text-[var(--foreground-subtle)]
                  "
                >
                  From
                </span>

                <input
                  id="marketplace-from"
                  type="text"
                  value={valueOrEmpty(query.from)}
                  onChange={(event) =>
                    onFromChange(event.target.value || null)
                  }
                  placeholder="Departure"
                  autoComplete="off"
                  className="
                    mt-0.5 block w-full min-w-0
                    border-0 bg-transparent p-0
                    text-xs sm:text-sm
                    font-medium
                    text-[var(--foreground)]
                    outline-none
                    placeholder:text-[var(--foreground-subtle)]
                  "
                />
              </span>
            </label>
          </div>

          {/* To ------------------------------------------------------------ */}

          <div
            className="
              min-w-0
              border-b border-[var(--border)]
              md:border-b-0 md:border-r
            "
          >
            <label
              htmlFor="marketplace-to"
              className="
                flex min-h-[60px] cursor-text
                min-w-0 items-center
                gap-2 sm:gap-2.5
                px-2.5 sm:px-3 md:px-3.5 lg:px-4
                transition-colors
                hover:bg-[var(--background-subtle)]
              "
            >
              <RoutePointIcon type="to" />

              <span className="min-w-0 flex-1">
                <span
                  className="
                    block truncate
                    text-[9px] sm:text-[10px]
                    font-semibold uppercase
                    tracking-[0.1em]
                    text-[var(--foreground-subtle)]
                  "
                >
                  To
                </span>

                <input
                  id="marketplace-to"
                  type="text"
                  value={valueOrEmpty(query.to)}
                  onChange={(event) =>
                    onToChange(event.target.value || null)
                  }
                  placeholder="Destination"
                  autoComplete="off"
                  className="
                    mt-0.5 block w-full min-w-0
                    border-0 bg-transparent p-0
                    text-xs sm:text-sm
                    font-medium
                    text-[var(--foreground)]
                    outline-none
                    placeholder:text-[var(--foreground-subtle)]
                  "
                />
              </span>
            </label>
          </div>

          {/* Date ---------------------------------------------------------- */}

          <div
            className="
              min-w-0
              border-b border-[var(--border)]
              md:col-span-1
              md:border-b-0 md:border-r
              max-[767px]:col-span-2
            "
          >
            <label
              htmlFor="marketplace-date"
              className="
                flex min-h-[60px] cursor-pointer
                min-w-0 items-center
                gap-2 sm:gap-2.5
                px-2.5 sm:px-3 md:px-3.5 lg:px-4
                transition-colors
                hover:bg-[var(--background-subtle)]
              "
            >
              <span
                aria-hidden="true"
                className="
                  flex h-8 w-8 shrink-0 items-center justify-center
                  rounded-lg
                  bg-[var(--background-muted)]
                  text-[var(--foreground-secondary)]
                "
              >
                <CalendarIcon />
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className="
                    block truncate
                    text-[9px] sm:text-[10px]
                    font-semibold uppercase
                    tracking-[0.1em]
                    text-[var(--foreground-subtle)]
                  "
                >
                  Date
                </span>

                <input
                  id="marketplace-date"
                  type="date"
                  value={valueOrEmpty(query.date)}
                  onChange={(event) =>
                    onDateChange(event.target.value || null)
                  }
                  className="
                    mt-0.5 block w-full min-w-0
                    border-0 bg-transparent p-0
                    text-xs sm:text-sm
                    font-medium
                    text-[var(--foreground)]
                    outline-none
                  "
                />
              </span>
            </label>
          </div>

          {/* Filter summary ------------------------------------------------ */}

          <div
            className="
              flex min-h-[60px]
              min-w-0
              items-center
              px-2.5 sm:px-3 md:px-3.5 lg:px-4
              max-[767px]:col-span-2
            "
          >
            <div
              className="
                flex w-full min-w-0
                items-center
                gap-2.5
              "
            >
              <span
                aria-hidden="true"
                className="
                  flex h-8 w-8 shrink-0
                  items-center justify-center
                  rounded-lg
                  bg-[var(--brand-soft)]
                  text-[var(--brand)]
                "
              >
                <SlidersIcon />
              </span>

              <div className="min-w-0">
                <span
                  className="
                    block truncate
                    text-[9px] sm:text-[10px]
                    font-semibold uppercase
                    tracking-[0.1em]
                    text-[var(--foreground-subtle)]
                  "
                >
                  Refine
                </span>

                <span
                  className="
                    block truncate
                    text-xs sm:text-sm
                    font-medium
                    text-[var(--foreground)]
                  "
                >
                  {activeFilterCount > 0
                    ? `${activeFilterCount} active`
                    : 'All options'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------------
            Secondary refinement

            These controls are intentionally allowed to wrap.

            Unlike the primary controls, they are optional refinements and
            therefore should never force the marketplace into horizontal
            scrolling.
        ----------------------------------------------------------------- */}

        <div
          className="
            border-t border-[var(--border)]
            bg-[var(--background-subtle)]
            px-2.5 py-2.5
            sm:px-3 sm:py-3
            md:px-4
          "
        >
          <div
            className="
              flex min-w-0
              flex-wrap
              items-center
              gap-2
            "
          >
            <span
              className="
                mr-1 shrink-0
                text-[9px] sm:text-[10px]
                font-semibold uppercase
                tracking-[0.1em]
                text-[var(--foreground-subtle)]
              "
            >
              Refine results
            </span>

            {/* Minimum seats ----------------------------------------------- */}

            <label
              className="
                flex min-w-0 min-h-9
                items-center gap-1.5
                rounded-lg
                border border-[var(--border)]
                bg-[var(--surface)]
                px-2.5
                transition-colors
                focus-within:border-[var(--brand)]
                focus-within:ring-2
                focus-within:ring-[var(--brand)]/10
              "
            >
              <span
                className="
                  shrink-0
                  text-[11px] sm:text-xs
                  text-[var(--foreground-muted)]
                "
              >
                Seats
              </span>

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
                className="
                  min-w-0
                  border-0 bg-transparent
                  py-1 pr-0
                  text-xs sm:text-sm
                  font-medium
                  text-[var(--foreground)]
                  outline-none
                "
              >
                <option value="">Any</option>
                <option value="1">1+ seat</option>
                <option value="2">2+ seats</option>
                <option value="3">3+ seats</option>
                <option value="4">4+ seats</option>
              </select>
            </label>

            {/* Maximum price ------------------------------------------------ */}

            <label
              className="
                flex min-w-0 min-h-9
                items-center gap-1.5
                rounded-lg
                border border-[var(--border)]
                bg-[var(--surface)]
                px-2.5
                transition-colors
                focus-within:border-[var(--brand)]
                focus-within:ring-2
                focus-within:ring-[var(--brand)]/10
              "
            >
              <span
                className="
                  shrink-0
                  text-[11px] sm:text-xs
                  text-[var(--foreground-muted)]
                "
              >
                Price
              </span>

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
                className="
                  min-w-0
                  border-0 bg-transparent
                  py-1 pr-0
                  text-xs sm:text-sm
                  font-medium
                  text-[var(--foreground)]
                  outline-none
                "
              >
                <option value="">Any</option>
                <option value="500">KES 500</option>
                <option value="1000">KES 1,000</option>
                <option value="2000">KES 2,000</option>
                <option value="5000">KES 5,000</option>
              </select>
            </label>

            {/* Verified traveller ------------------------------------------ */}

            <label
              className="
                inline-flex min-h-9
                min-w-0
                cursor-pointer
                items-center gap-1.5
                rounded-lg
                border border-transparent
                px-2
                text-xs sm:text-sm
                text-[var(--foreground-secondary)]
                transition-colors
                hover:bg-[var(--surface)]
              "
            >
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
                className="
                  size-4 shrink-0
                  rounded
                  border-[var(--border-strong)]
                  accent-[var(--brand)]
                "
              />

              <span className="truncate">
                Verified travellers
              </span>
            </label>

            {/* Vehicle availability ---------------------------------------- */}

            <label
              className="
                inline-flex min-h-9
                min-w-0
                cursor-pointer
                items-center gap-1.5
                rounded-lg
                border border-transparent
                px-2
                text-xs sm:text-sm
                text-[var(--foreground-secondary)]
                transition-colors
                hover:bg-[var(--surface)]
              "
            >
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
                className="
                  size-4 shrink-0
                  rounded
                  border-[var(--border-strong)]
                  accent-[var(--brand)]
                "
              />

              <span className="truncate">
                Vehicle available
              </span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}