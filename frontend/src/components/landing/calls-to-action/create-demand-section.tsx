// -----------------------------------------------------------------------------
// sisiMove — Create Demand Section
// -----------------------------------------------------------------------------
//
// Landing-page call-to-action for travellers who cannot find a suitable
// published Journey.
//
// The marketplace model is:
//
//     Traveller need
//          │
//          ▼
//     Create Demand
//          │
//          ▼
//     Other travellers can join
//          │
//          ▼
//     Potential provider sees the opportunity
//
// This component is presentation-only.
//
// It does not:
// - create a Journey Demand;
// - call an API;
// - access authentication state;
// - own authentication logic;
// - resolve the destination route.
//
// Navigation is expressed through `href` so the surrounding application can
// decide how authenticated and unauthenticated visitors should be handled.
//
// IMPORTANT:
//
// The shared Button primitive is intentionally not used here because Button
// renders a native <button> element and does not currently support an
// `asChild`/polymorphic API.
//
// A navigation CTA must render as a Link rather than a button. This avoids
// invalid interactive-element nesting and keeps keyboard/navigation semantics
// correct.
//
// -----------------------------------------------------------------------------

import Link from "next/link";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface CreateDemandSectionProps {
  /**
   * Destination used by the CTA.
   *
   * Defaults to the public Demand creation route.
   */
  href?: string;

  /**
   * Optional additional class name.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CreateDemandSection({
  href = "/demands/create",
  className,
}: CreateDemandSectionProps) {
  return (
    <section
      className={[
        "border-y border-[var(--border)] bg-[var(--background-muted)] px-6 py-16",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby="create-demand-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        {/* -----------------------------------------------------------------
            Section context
        ----------------------------------------------------------------- */}
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--foreground-secondary)]">
          Can&apos;t find your journey?
        </p>

        {/* -----------------------------------------------------------------
            Primary message
        ----------------------------------------------------------------- */}
        <h2
          id="create-demand-heading"
          className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl"
        >
          Tell the market where you need to go.
        </h2>

        {/* -----------------------------------------------------------------
            Marketplace explanation
        ----------------------------------------------------------------- */}
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--foreground-secondary)]">
          Create a travel demand and let other travellers join you — or let a
          provider see the demand and make the journey.
        </p>

        {/* -----------------------------------------------------------------
            CTA

            This is a Link because its purpose is navigation.

            The classes mirror the existing Button primitive's primary/lg
            treatment without introducing a second interactive element.
        ----------------------------------------------------------------- */}
        <div className="mt-7">
          <Link
            href={href}
            className={[
              "inline-flex",
              "min-h-12",
              "items-center",
              "justify-center",
              "gap-2",
              "rounded-[var(--radius-lg)]",
              "border",
              "border-transparent",
              "bg-[var(--brand)]",
              "px-5",
              "text-base",
              "font-medium",
              "whitespace-nowrap",
              "select-none",
              "text-[var(--brand-foreground)]",
              "transition-colors",
              "duration-150",
              "ease-out",
              "hover:bg-[var(--brand-hover)]",
              "active:bg-[var(--brand-hover)]",
              "focus-visible:outline-2",
              "focus-visible:outline-[var(--brand)]",
              "focus-visible:outline-offset-2",
            ].join(" ")}
          >
            Create travel demand
          </Link>
        </div>
      </div>
    </section>
  );
}