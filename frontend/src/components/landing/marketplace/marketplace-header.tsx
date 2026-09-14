// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Header
// -----------------------------------------------------------------------------
//
// Presentation component for the public marketplace section.
//
// The landing hero introduces the overall journey market. This component
// intentionally does not repeat that introduction.
//
// Its responsibility is narrower:
//
//     MARKET
//     Showing what is currently available.
//
// The marketplace header sits immediately above the marketplace controls and
// results. It provides a clear visual boundary between the landing introduction
// and the actual marketplace.
//
// This component is intentionally presentation-only.
//
// It does NOT:
// - fetch marketplace data;
// - own marketplace query state;
// - perform filtering;
// - perform sorting;
// - determine whether items exist;
// - contain Journey business logic;
// - contain Journey Demand business logic;
// - render marketplace results.
//
// Those responsibilities belong to the marketplace feature/read boundary and
// the components composed around this header.
//
// -----------------------------------------------------------------------------
//
// Visual responsibility
//
// The public landing page now follows this hierarchy:
//
//     LandingHero
//         THE JOURNEY MARKET
//         See where people are going...
//
//     MarketplaceHeader
//         MARKET
//         Showing what's available
//
//     MarketplaceFilterBar
//         All / Journeys / Demand
//         From / To / Date / Filters
//
//     MarketplaceResults
//         Journey and Demand cards
//
// Keeping the header intentionally compact prevents the marketplace section
// from repeating the hero content and keeps the actual discovery surface
// visually prominent.
// -----------------------------------------------------------------------------


export interface MarketplaceHeaderProps {
  /**
   * Optional additional classes applied to the header container.
   *
   * The component does not interpret this value. It exists so the parent
   * marketplace section can control layout without introducing another
   * wrapper component.
   */
  className?: string;
}


// -----------------------------------------------------------------------------
// Marketplace Header
// -----------------------------------------------------------------------------


export function MarketplaceHeader({
  className,
}: MarketplaceHeaderProps) {
  return (
    <header
      aria-labelledby="marketplace-heading"
      className={[
        "flex min-w-0 flex-col gap-1",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h2
        id="marketplace-heading"
        className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--foreground)]"
      >
        Market
      </h2>

      <p className="text-sm leading-6 text-[var(--foreground-muted)]">
        Showing what&apos;s available
      </p>
    </header>
  );
}

