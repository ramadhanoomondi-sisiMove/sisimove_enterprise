// -----------------------------------------------------------------------------
// sisiMove — Landing Hero
// -----------------------------------------------------------------------------
//
// Compact opening section for the public sisiMove marketplace.
//
// This is intentionally not a traditional oversized marketing hero.
//
// sisiMove is a marketplace first:
//
// - visitors should immediately understand what the marketplace is;
// - the available journeys and demands should remain visually close to the
//   opening message;
// - search and filtering belong to the marketplace controls below;
// - primary marketplace content should not be pushed below a large decorative
//   hero.
//
// Responsibilities:
//
// - introduce the public Journey Market;
// - establish the supply-and-demand marketplace concept;
// - provide a clear visual transition into the marketplace.
//
// This component does not:
//
// - fetch marketplace data;
// - manage search or filter state;
// - render marketplace results;
// - construct routes;
// - contain Journey or Journey Demand business logic.
// -----------------------------------------------------------------------------

export interface LandingHeroProps {
  /**
   * Optional additional CSS classes.
   */
  className?: string;
}

export function LandingHero({
  className,
}: LandingHeroProps) {
  return (
    <section
      aria-labelledby="landing-hero-heading"
      className={[
        'w-full min-w-0 border-b border-[var(--border)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
            The journey market
          </p>

          <h1
            id="landing-hero-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl"
          >
            See where people are going — and where people are looking to go.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--foreground-muted)] sm:text-lg">
            Browse published journeys and travel demands in one place. Find an
            available seat, join a shared travel plan, or create a demand when
            the journey you need is not available.
          </p>
        </div>
      </div>
    </section>
  );
}

