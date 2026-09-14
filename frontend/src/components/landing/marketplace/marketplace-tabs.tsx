// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Tabs
// -----------------------------------------------------------------------------
//
// Navigation control for the public marketplace.
//
// The marketplace contains two independent discovery streams:
//
//     JOURNEY
//         Published travel supply.
//
//     DEMAND
//         Published travel demand.
//
// The ALL tab combines both streams.
//
// This component only presents and selects the marketplace scope. It does not:
//
// - fetch marketplace data;
// - perform filtering;
// - perform sorting;
// - manipulate URL state;
// - determine which items exist;
// - contain Journey business rules;
// - contain Journey Demand business rules.
//
// The parent/application boundary owns the actual marketplace query state.
//
// -----------------------------------------------------------------------------
//
// Interaction
//
//     MarketplaceTabs
//          │
//          │ onChange("JOURNEY")
//          ↓
//     MarketplaceSection / marketplace state owner
//          │
//          ↓
//     PublicMarketplaceQuery.type
//
// Keeping the component controlled makes it reusable for:
//
// - URL-backed marketplace state;
// - server-provided initial state;
// - client-side marketplace state;
// - future navigation implementations.
//
// -----------------------------------------------------------------------------


import type { PublicMarketplaceType } from "@/features/public-marketplace/models/public-marketplace-query";


// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------


export interface MarketplaceTabsProps {
  /**
   * Currently selected marketplace scope.
   *
   * The parent owns this state.
   */
  value: PublicMarketplaceType;

  /**
   * Called when the visitor selects another marketplace scope.
   *
   * The component reports the requested scope but does not update application
   * state itself.
   */
  onChange: (value: PublicMarketplaceType) => void;

  /**
   * Optional additional classes applied to the tab navigation container.
   */
  className?: string;
}


// -----------------------------------------------------------------------------
// Tab definition
// -----------------------------------------------------------------------------
//
// Keeping the labels in one local definition prevents the JSX from becoming
// repetitive while keeping the actual marketplace vocabulary explicit.
//
// These labels describe marketplace streams, not domain lifecycle states.
//
// -----------------------------------------------------------------------------


const MARKETPLACE_TABS: ReadonlyArray<{
  value: PublicMarketplaceType;
  label: string;
}> = [
  {
    value: "ALL",
    label: "All",
  },
  {
    value: "JOURNEY",
    label: "Journeys",
  },
  {
    value: "DEMAND",
    label: "Demand",
  },
];


// -----------------------------------------------------------------------------
// Marketplace Tabs
// -----------------------------------------------------------------------------


export function MarketplaceTabs({
  value,
  onChange,
  className,
}: MarketplaceTabsProps) {
  return (
    <nav
      aria-label="Marketplace"
      className={[
        "flex min-w-0 flex-wrap items-center gap-1",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {MARKETPLACE_TABS.map((tab) => {
        const isActive = value === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => onChange(tab.value)}
            className={[
              "inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2",
              isActive
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--foreground)]",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}

