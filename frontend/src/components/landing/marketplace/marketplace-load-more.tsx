// -----------------------------------------------------------------------------
// sisiMove — Public Marketplace Load More
// -----------------------------------------------------------------------------
//
// Pagination control for the public marketplace.
//
// The marketplace may contain many published Journeys and Journey Demands.
// Results are therefore loaded in manageable pages.
//
// This component represents the "load more" interaction:
//
//     Current results
//           ↓
//       Load more
//           ↓
//     Request next page
//           ↓
//     Append results
//
// This component is intentionally presentation-only.
//
// It does NOT:
// - fetch marketplace data;
// - construct pagination cursors;
// - interpret continuation tokens;
// - append marketplace items;
// - own marketplace state;
// - determine whether another page exists;
// - contain Journey business rules;
// - contain Journey Demand business rules.
//
// The marketplace feature/read boundary owns pagination behavior and supplies
// the current state through props.
//
// -----------------------------------------------------------------------------
//
// Pagination boundary
//
// PublicMarketplacePagination
//     │
//     ├── count
//     ├── limit
//     ├── nextCursor
//     └── hasMore
//             │
//             ↓
//     MarketplaceLoadMore
//
// The component only needs `hasMore` and `isLoading` to determine whether the
// control should be displayed and whether it should be temporarily disabled.
//
// The cursor remains completely outside the UI component.
//
// -----------------------------------------------------------------------------


export interface MarketplaceLoadMoreProps {
  /**
   * Indicates whether another marketplace page is available.
   *
   * When false, the control is not rendered.
   */
  hasMore: boolean;

  /**
   * Indicates whether the next marketplace page is currently being loaded.
   *
   * This prevents repeated requests while the parent is processing the
   * previous request.
   */
  isLoading?: boolean;

  /**
   * Called when the visitor requests the next marketplace page.
   *
   * The parent owns the actual pagination operation.
   */
  onLoadMore: () => void;

  /**
   * Optional additional classes applied to the control container.
   */
  className?: string;
}


// -----------------------------------------------------------------------------
// Marketplace Load More
// -----------------------------------------------------------------------------


export function MarketplaceLoadMore({
  hasMore,
  isLoading = false,
  onLoadMore,
  className,
}: MarketplaceLoadMoreProps) {
  if (!hasMore) {
    return null;
  }

  return (
    <div
      className={[
        "flex min-w-0 justify-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        onClick={onLoadMore}
        disabled={isLoading}
        aria-busy={isLoading}
        className={[
          "inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--border)] px-5 py-2 text-sm font-medium",
          "text-[var(--foreground)] transition-colors",
          "hover:bg-[var(--background-secondary)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-60",
        ].join(" ")}
      >
        {isLoading ? "Loading…" : "Load more"}
      </button>
    </div>
  );
}
