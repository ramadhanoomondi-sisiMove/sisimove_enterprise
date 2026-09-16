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
// This component renders lightweight visual placeholders that intentionally
// mirror the horizontal geometry of the real marketplace cards.
//
// It is intentionally presentation-only.
//
// It does NOT:
//
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
//
// Both marketplace item types use the same high-level horizontal loading
// geometry:
//
//     Date | Person | Route | Details | Price/Summary | Actions
//
// The exact content differs between Journey and Demand, but the marketplace
// presentation boundary benefits from a stable shared loading shape.
// -----------------------------------------------------------------------------


export interface MarketplaceLoadingStateProps {
  /**
   * Number of placeholder marketplace rows to render.
   *
   * The default provides enough content to establish the marketplace stream
   * without making the loading state unnecessarily tall.
   */
  count?: number;

  /**
   * Optional additional classes applied to the loading-state container.
   */
  className?: string;
}


// -----------------------------------------------------------------------------
// Skeleton primitives
// -----------------------------------------------------------------------------
//
// These primitives are local presentation helpers.
//
// They intentionally do not depend on Journey or Journey Demand models.
// A loading state should never require fabricated domain objects.
// -----------------------------------------------------------------------------

function SkeletonBlock({
  className,
}: {
  className: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={[
        'animate-pulse',
        'rounded-md',
        'bg-[var(--background-muted)]',
        className,
      ].join(' ')}
    />
  );
}


function SkeletonCircle({
  className,
}: {
  className: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={[
        'animate-pulse',
        'shrink-0',
        'rounded-full',
        'bg-[var(--background-muted)]',
        className,
      ].join(' ')}
    />
  );
}


// -----------------------------------------------------------------------------
// Marketplace Skeleton Card
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// This skeleton deliberately follows the same horizontal composition model
// as the real marketplace cards.
//
// It does NOT reproduce Journey/Demand business content. It only preserves:
//
// - column geometry;
// - approximate density;
// - separators;
// - responsive shrinking;
// - action placement.
//
// This minimizes layout shift when real marketplace data arrives.
// -----------------------------------------------------------------------------

function MarketplaceSkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="
        flex
        w-full
        min-w-0
        items-stretch
        overflow-hidden
        rounded-xl
        border border-[var(--border)]
        bg-[var(--surface)]
        shadow-[var(--shadow-sm)]
      "
    >
      {/* -----------------------------------------------------------------
          Date
      ----------------------------------------------------------------- */}

      <div
        className="
          min-w-0
          flex-[0.8]
          px-1.5 py-2
          sm:px-2 sm:py-2.5
          md:px-2.5 md:py-3
          lg:px-4 lg:py-4
        "
      >
        <div className="flex min-w-0 flex-col gap-1.5">
          <SkeletonBlock className="h-2.5 w-10" />
          <SkeletonBlock className="h-5 w-8" />
          <SkeletonBlock className="h-2.5 w-10" />
          <SkeletonBlock className="mt-1 h-3 w-12" />
        </div>
      </div>

      {/* -----------------------------------------------------------------
          Traveller / provider
      ----------------------------------------------------------------- */}

      <div
        className="
          min-w-0
          flex-[1.4]
          border-l border-[var(--border-subtle)]
          px-1.5 py-2
          sm:px-2 sm:py-2.5
          md:px-2.5 md:py-3
          lg:px-4 lg:py-4
        "
      >
        <div className="flex min-w-0 items-center gap-2">
          <SkeletonCircle className="size-8 sm:size-9" />

          <div className="min-w-0 flex-1 space-y-1.5">
            <SkeletonBlock className="h-3 w-3/4 max-w-24" />
            <SkeletonBlock className="h-2.5 w-1/2 max-w-16" />
            <SkeletonBlock className="h-2.5 w-2/3 max-w-20" />
          </div>
        </div>
      </div>

      {/* -----------------------------------------------------------------
          Route
      ----------------------------------------------------------------- */}

      <div
        className="
          min-w-0
          flex-[1.6]
          border-l border-[var(--border-subtle)]
          px-1.5 py-2
          sm:px-2 sm:py-2.5
          md:px-2.5 md:py-3
          lg:px-4 lg:py-4
        "
      >
        <div className="flex min-w-0 flex-col justify-center gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <SkeletonBlock className="h-3 w-2.5" />
            <SkeletonBlock className="h-3 w-3/5 max-w-24" />
          </div>

          <div className="flex min-w-0 items-center gap-1.5">
            <SkeletonBlock className="h-3 w-2.5" />
            <SkeletonBlock className="h-3 w-3/4 max-w-28" />
          </div>

          <SkeletonBlock className="h-2.5 w-1/2 max-w-20" />
        </div>
      </div>

      {/* -----------------------------------------------------------------
          Vehicle / demand summary
      ----------------------------------------------------------------- */}

      <div
        className="
          min-w-0
          flex-[1.4]
          border-l border-[var(--border-subtle)]
          px-1.5 py-2
          sm:px-2 sm:py-2.5
          md:px-2.5 md:py-3
          lg:px-4 lg:py-4
        "
      >
        <div className="flex min-w-0 items-center gap-2">
          <SkeletonBlock className="h-10 w-12 shrink-0 rounded-md sm:h-11 sm:w-14" />

          <div className="min-w-0 flex-1 space-y-1.5">
            <SkeletonBlock className="h-3 w-4/5 max-w-24" />
            <SkeletonBlock className="h-2.5 w-3/5 max-w-20" />
            <SkeletonBlock className="h-2.5 w-2/3 max-w-16" />
          </div>
        </div>
      </div>

      {/* -----------------------------------------------------------------
          Price / summary
      ----------------------------------------------------------------- */}

      <div
        className="
          min-w-0
          flex-[0.9]
          border-l border-[var(--border-subtle)]
          px-1.5 py-2
          sm:px-2 sm:py-2.5
          md:px-2.5 md:py-3
          lg:px-3 lg:py-4
        "
      >
        <div className="flex min-w-0 flex-col gap-2">
          <SkeletonBlock className="h-4 w-3/4 max-w-20" />
          <SkeletonBlock className="h-2.5 w-1/2 max-w-14" />
          <SkeletonBlock className="h-2.5 w-4/5 max-w-20" />
        </div>
      </div>

      {/* -----------------------------------------------------------------
          Actions
      ----------------------------------------------------------------- */}

      <div
        className="
          flex
          min-w-0
          flex-[1.1]
          items-center
          border-l border-[var(--border-subtle)]
          px-1.5 py-2
          sm:px-2 sm:py-2.5
          md:px-2.5 md:py-3
          lg:px-3 lg:py-4
        "
      >
        <div className="flex min-w-0 flex-wrap gap-1.5">
          <SkeletonBlock className="h-9 w-16 rounded-lg sm:w-20" />
          <SkeletonBlock className="h-9 w-14 rounded-lg sm:w-16" />
        </div>
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
  /**
   * Protect the presentation layer from invalid counts while preserving the
   * caller's intended pagination/loading configuration.
   *
   * This does not represent marketplace business logic.
   */
  const safeCount = Math.max(1, Math.floor(count));

  return (
    <section
      aria-label="Loading marketplace"
      aria-busy="true"
      className={[
        'flex min-w-0 flex-col gap-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {Array.from({ length: safeCount }, (_, index) => (
        <MarketplaceSkeletonCard key={index} />
      ))}
    </section>
  );
}