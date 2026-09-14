// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Loading State
// -----------------------------------------------------------------------------
//
// Loading-state presentation for the public marketplace.
//
// The marketplace may load:
//
// - the initial public marketplace;
// - a refined marketplace query;
// - another pagination page;
// - refreshed Journey and Journey Demand results.
//
// During these operations, the interface should preserve the marketplace
// structure instead of displaying a large blank area or abruptly changing
// layout.
//
// This component renders a lightweight visual placeholder for marketplace
// results.
//
// It is intentionally presentation-only.
//
// It does NOT:
// - fetch marketplace data;
// - own loading state;
// - determine which items are being loaded;
// - render actual Journey data;
// - render actual Journey Demand data;
// - perform filtering or sorting;
// - contain marketplace business rules.
//
// The parent decides when this component should be displayed.
//
// -----------------------------------------------------------------------------
//
// Loading boundary
//
// Marketplace read boundary
//          │
//          ├── isLoading
//          └── isRefreshing
//                  │
//                  ↓
//       MarketplaceLoadingState
//
// The component does not distinguish between Journey and Demand skeletons.
// The shared structure keeps the loading state stable while the actual
// discriminated marketplace items are being retrieved.
// -----------------------------------------------------------------------------


export interface MarketplaceLoadingStateProps {
  /**
   * Number of placeholder cards to render.
   *
   * The default provides enough content to establish the marketplace layout
   * without making the loading state unnecessarily large.
   */
  count?: number;

  /**
   * Optional additional classes applied to the loading-state container.
   */
  className?: string;
}


// -----------------------------------------------------------------------------
// Skeleton Card
// -----------------------------------------------------------------------------
//
// This local skeleton is deliberately independent of the final Journey and
// Demand card components.
//
// A loading placeholder should not require incomplete or fabricated domain
// objects merely to render.
//
// -----------------------------------------------------------------------------


function MarketplaceSkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="flex min-w-0 flex-col gap-5 rounded-lg border border-[var(--border)] p-5"
    >
      {/* Traveller/provider placeholder */}
      <div className="flex items-center gap-3">
        <div className="size-11 shrink-0 animate-pulse rounded-full bg-[var(--background-secondary)]" />

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="h-4 w-32 animate-pulse rounded bg-[var(--background-secondary)]" />
          <div className="h-3 w-24 animate-pulse rounded bg-[var(--background-secondary)]" />
        </div>
      </div>

      {/* Route placeholder */}
      <div className="flex flex-col gap-3">
        <div className="h-4 w-4/5 animate-pulse rounded bg-[var(--background-secondary)]" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-[var(--background-secondary)]" />
      </div>

      {/* Details placeholder */}
      <div className="grid grid-cols-2 gap-3">
        <div className="h-12 animate-pulse rounded-md bg-[var(--background-secondary)]" />
        <div className="h-12 animate-pulse rounded-md bg-[var(--background-secondary)]" />
        <div className="h-12 animate-pulse rounded-md bg-[var(--background-secondary)]" />
        <div className="h-12 animate-pulse rounded-md bg-[var(--background-secondary)]" />
      </div>

      {/* Actions placeholder */}
      <div className="flex gap-3 pt-1">
        <div className="h-10 w-28 animate-pulse rounded-md bg-[var(--background-secondary)]" />
        <div className="h-10 w-20 animate-pulse rounded-md bg-[var(--background-secondary)]" />
      </div>
    </div>
  );
}


// -----------------------------------------------------------------------------
// Marketplace Loading State
// -----------------------------------------------------------------------------


export function MarketplaceLoadingState({
  count = 6,
  className,
}: MarketplaceLoadingStateProps) {
  const safeCount = Math.max(1, Math.floor(count));

  return (
    <section
      aria-label="Loading marketplace"
      aria-busy="true"
      className={[
        "grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {Array.from({ length: safeCount }, (_, index) => (
        <MarketplaceSkeletonCard key={index} />
      ))}
    </section>
  );
}

