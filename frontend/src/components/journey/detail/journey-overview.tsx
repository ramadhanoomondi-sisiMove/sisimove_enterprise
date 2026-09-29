// -----------------------------------------------------------------------------
// sisiMove — Journey Overview
// -----------------------------------------------------------------------------
//
// Public overview of a Journey.
//
// Responsibilities:
// - present the public Journey provider;
// - present the provider's public Traveller information;
// - present the provider's public Trust information;
// - present the Journey route.
//
// Non-responsibilities:
// - no API calls;
// - no data fetching;
// - no navigation;
// - no booking logic;
// - no lifecycle logic;
// - no schedule-detail rendering;
// - no vehicle rendering;
// - no capacity rendering;
// - no pricing rendering;
// - no domain reconstruction.
//
// Public Journey detail:
//
//   JourneyDetail
//       │
//       ├── JourneyOverview
//       │     ├── Traveller
//       │     ├── Trust
//       │     └── Route
//       │
//       ├── JourneyTravelWindow
//       ├── JourneyCapacity
//       ├── JourneyPricing
//       ├── JourneyVehicle
//       ├── JourneyPreferences
//       ├── JourneyAssets
//       └── JourneyLifecycle
//
// The component consumes the canonical PublicJourney projection.
//
// -----------------------------------------------------------------------------

import Image from "next/image";

import { cn } from "@/foundation";

import type { PublicJourney } from "@/features/journey/models";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyOverviewProps {
  /**
   * Public Journey projection.
   */
  readonly journey: PublicJourney;

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatVerificationLevel(
  level: PublicJourney["provider"]["trust"]["verificationLevel"],
): string {
  switch (level) {
    case "HIGHLY_VERIFIED":
      return "Highly verified";

    case "VERIFIED":
      return "Verified";

    case "BASIC":
      return "Basic verification";

    case "NONE":
    default:
      return "Not verified";
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyOverview({
  journey,
  className,
}: JourneyOverviewProps) {
  const { traveller, trust } = journey.provider;

  return (
    <section
      className={cn("w-full space-y-4", className)}
      aria-labelledby="journey-overview-heading"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Heading                                                             */}
      {/* ------------------------------------------------------------------- */}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
          Journey
        </p>

        <h2
          id="journey-overview-heading"
          className="mt-1 text-xl font-semibold text-[var(--foreground)]"
        >
          Journey overview
        </h2>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Provider                                                            */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "rounded-[var(--radius-lg)]",
          "border border-[var(--border)]",
          "bg-[var(--surface)]",
          "p-4",
        )}
      >
        <div className="flex items-start gap-3">
          {/* ----------------------------------------------------------------- */}
          {/* Traveller avatar                                                  */}
          {/* ----------------------------------------------------------------- */}

          <div
            className={cn(
              "relative size-12 shrink-0 overflow-hidden rounded-full",
              "bg-[var(--brand-soft)]",
            )}
          >
            {traveller.avatar ? (
              <Image
                src={traveller.avatar.url}
                alt={
                  traveller.avatar.alt ??
                  `${traveller.handle} avatar`
                }
                fill
                sizes="48px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div
                className={cn(
                  "flex size-full items-center justify-center",
                  "text-sm font-semibold text-[var(--brand)]",
                )}
                aria-hidden="true"
              >
                {traveller.handle.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* Traveller identity                                                */}
          {/* ----------------------------------------------------------------- */}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--foreground)]">
              @{traveller.handle}
            </p>

            <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
              Journey provider
              {traveller.countryCode
                ? ` · ${traveller.countryCode}`
                : ""}
            </p>

            {traveller.bio && (
              <p className="mt-2 text-sm leading-5 text-[var(--foreground-muted)]">
                {traveller.bio}
              </p>
            )}
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Trust summary                                                      */}
        {/* ----------------------------------------------------------------- */}

        {trust && (
          <div
            className={cn(
              "mt-4",
              "border-t border-[var(--border)]",
              "pt-4",
            )}
          >
            <div className="flex flex-wrap gap-x-5 gap-y-3">
              {/* ------------------------------------------------------------- */}
              {/* Verification                                                  */}
              {/* ------------------------------------------------------------- */}

              <div>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Verification
                </p>

                <p className="mt-0.5 text-sm font-medium text-[var(--foreground)]">
                  {formatVerificationLevel(
                    trust.verificationLevel,
                  )}
                </p>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* Rating                                                        */}
              {/* ------------------------------------------------------------- */}

              <div>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Rating
                </p>

                <p className="mt-0.5 text-sm font-medium text-[var(--foreground)]">
                  {trust.ratingCount > 0
                    ? `${trust.ratingAverage.toFixed(1)} (${trust.ratingCount})`
                    : "No ratings yet"}
                </p>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* Completed journeys                                            */}
              {/* ------------------------------------------------------------- */}

              <div>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Completed journeys
                </p>

                <p className="mt-0.5 text-sm font-medium text-[var(--foreground)]">
                  {trust.completedJourneys}
                </p>
              </div>
            </div>

            {/* --------------------------------------------------------------- */}
            {/* Trust badges                                                    */}
            {/* --------------------------------------------------------------- */}

            {trust.badges.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs text-[var(--foreground-muted)]">
                  Trust badges
                </p>

                <div className="flex flex-wrap gap-2">
                  {trust.badges.map((badge) => (
                    <div
                      key={badge.publicId}
                      className={cn(
                        "inline-flex items-center gap-1.5",
                        "rounded-full",
                        "border border-[var(--border)]",
                        "bg-[var(--background)]",
                        "px-2.5 py-1",
                      )}
                      title={
                        badge.description ??
                        badge.name
                      }
                    >
                      {badge.asset && (
                        <div className="relative size-4 shrink-0">
                          <Image
                            src={badge.asset.url}
                            alt={badge.asset.alt ?? ""}
                            fill
                            sizes="16px"
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      )}

                      <span className="text-xs font-medium text-[var(--foreground)]">
                        {badge.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Route                                                               */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "rounded-[var(--radius-lg)]",
          "border border-[var(--border)]",
          "bg-[var(--surface)]",
          "p-4",
        )}
      >
        <div className="mb-3">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Route
          </p>

          <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
            Where this Journey is going
          </p>
        </div>

        <div className="space-y-2">
          {/* ----------------------------------------------------------------- */}
          {/* Origin                                                            */}
          {/* ----------------------------------------------------------------- */}

          <div>
            <p className="text-xs text-[var(--foreground-muted)]">
              From
            </p>

            <p className="mt-0.5 text-sm font-medium text-[var(--foreground)]">
              {journey.route.origin.name}
            </p>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* Route connector                                                   */}
          {/* ----------------------------------------------------------------- */}

          <div
            className="ml-1 h-4 border-l border-[var(--border)]"
            aria-hidden="true"
          />

          {/* ----------------------------------------------------------------- */}
          {/* Destination                                                       */}
          {/* ----------------------------------------------------------------- */}

          <div>
            <p className="text-xs text-[var(--foreground-muted)]">
              To
            </p>

            <p className="mt-0.5 text-sm font-medium text-[var(--foreground)]">
              {journey.route.destination.name}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

