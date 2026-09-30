// -----------------------------------------------------------------------------
// sisiMove — Journey Overview
// -----------------------------------------------------------------------------
//
// Public overview of a Journey.
//
// Product role:
//
//     WHO
//       Provider + Traveller + Trust
//             │
//             ▼
//     WHERE
//       Origin → Destination
//             │
//             ▼
//     Traveller confidence
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
// The component consumes the canonical PublicJourney projection.
//
// -----------------------------------------------------------------------------
//
// Asset safety:
// - Public asset references may exist without a usable URL.
// - Empty or whitespace-only URLs must never be passed to next/image.
// - Avatar rendering therefore checks the resolved URL itself.
// - Trust badge assets follow the same rule.
// - No Asset URL is constructed from an opaque public ID.
//
// -----------------------------------------------------------------------------

import Image from "next/image";

import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  MapPin,
  Route,
  ShieldCheck,
  Star,
} from "lucide-react";

import { cn } from "@/foundation";

import type { PublicJourney } from "@/features/journey/models";

// =============================================================================
// Props
// =============================================================================

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

// =============================================================================
// Helpers
// =============================================================================

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

/**
 * Returns a renderable public Asset URL or null.
 *
 * An Asset projection may exist while its delivery URL is unavailable.
 * Never pass an empty string to next/image.
 */
function getRenderableAssetUrl(
  url: string | null | undefined,
): string | null {
  const normalizedUrl = url?.trim();

  return normalizedUrl ? normalizedUrl : null;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyOverview({
  journey,
  className,
}: JourneyOverviewProps) {
  const { traveller, trust } = journey.provider;

  const verificationLabel = trust
    ? formatVerificationLevel(trust.verificationLevel)
    : "Not verified";

  const hasRating =
    trust !== null &&
    trust.ratingCount > 0;

  const avatarUrl = getRenderableAssetUrl(
    traveller.avatar?.url,
  );

  return (
    <section
      className={cn(
        "w-full",
        "overflow-hidden",
        "rounded-[var(--radius-xl)]",
        "border",
        "border-[var(--border)]",
        "bg-[var(--surface)]",
        "shadow-[var(--shadow-sm)]",
        className,
      )}
      aria-labelledby="journey-overview-heading"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Journey identity header                                             */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "border-b",
          "border-[var(--border-subtle)]",
          "bg-[var(--background-brand)]",
          "px-5",
          "py-5",
          "sm:px-6",
          "sm:py-6",
        )}
      >
        <div
          className={cn(
            "flex",
            "items-center",
            "gap-2",
            "text-xs",
            "font-bold",
            "uppercase",
            "tracking-[0.14em]",
            "text-[var(--brand)]",
          )}
        >
          <Route
            aria-hidden="true"
            className="size-3.5"
          />

          <span>Journey</span>
        </div>

        <h2
          id="journey-overview-heading"
          className={cn(
            "mt-2",
            "text-2xl",
            "font-extrabold",
            "tracking-tight",
            "text-[var(--foreground)]",
            "sm:text-3xl",
          )}
        >
          {journey.route.origin.name}

          <span
            className="mx-2 text-[var(--foreground-subtle)]"
            aria-hidden="true"
          >
            →
          </span>

          {journey.route.destination.name}
        </h2>

        <p
          className={cn(
            "mt-2",
            "text-sm",
            "leading-5",
            "text-[var(--foreground-secondary)]",
          )}
        >
          A planned Journey with available seats.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Main overview                                                       */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "grid",
          "grid-cols-1",
          "lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]",
        )}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Route                                                              */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            "relative",
            "px-5",
            "py-6",
            "sm:px-6",
            "sm:py-7",
          )}
        >
          <div className="mb-5">
            <div
              className={cn(
                "inline-flex",
                "items-center",
                "gap-2",
                "text-xs",
                "font-bold",
                "uppercase",
                "tracking-[0.12em]",
                "text-[var(--foreground-muted)]",
              )}
            >
              <MapPin
                aria-hidden="true"
                className="size-3.5 text-[var(--brand)]"
              />

              <span>Travel route</span>
            </div>

            <p
              className={cn(
                "mt-1",
                "text-sm",
                "text-[var(--foreground-muted)]",
              )}
            >
              Follow the Journey from departure to destination.
            </p>
          </div>

          <div
            className={cn(
              "relative",
              "rounded-[var(--radius-lg)]",
              "border",
              "border-[var(--border)]",
              "bg-[var(--background-subtle)]",
              "p-5",
              "sm:p-6",
            )}
          >
            {/* ------------------------------------------------------------- */}
            {/* Route connector                                                */}
            {/* ------------------------------------------------------------- */}

            <div
              aria-hidden="true"
              className={cn(
                "absolute",
                "left-[27px]",
                "top-[53px]",
                "bottom-[53px]",
                "border-l-2",
                "border-dashed",
                "border-[var(--border-strong)]",
                "sm:left-[31px]",
              )}
            />

            <div className="relative space-y-7">
              {/* ----------------------------------------------------------- */}
              {/* Origin                                                       */}
              {/* ----------------------------------------------------------- */}

              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "relative",
                    "z-10",
                    "flex",
                    "size-6",
                    "shrink-0",
                    "items-center",
                    "justify-center",
                    "rounded-full",
                    "border-4",
                    "border-[var(--background-subtle)]",
                    "bg-[var(--brand)]",
                    "shadow-[var(--shadow-sm)]",
                  )}
                >
                  <span
                    className="size-1.5 rounded-full bg-[var(--brand-foreground)]"
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-[11px]",
                      "font-bold",
                      "uppercase",
                      "tracking-[0.12em]",
                      "text-[var(--foreground-muted)]",
                    )}
                  >
                    From
                  </p>

                  <p
                    className={cn(
                      "mt-1",
                      "text-lg",
                      "font-bold",
                      "leading-6",
                      "text-[var(--foreground)]",
                      "sm:text-xl",
                    )}
                  >
                    {journey.route.origin.name}
                  </p>
                </div>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* Destination                                                  */}
              {/* ----------------------------------------------------------- */}

              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "relative",
                    "z-10",
                    "flex",
                    "size-6",
                    "shrink-0",
                    "items-center",
                    "justify-center",
                    "rounded-full",
                    "border-4",
                    "border-[var(--background-subtle)]",
                    "bg-[var(--foreground)]",
                    "shadow-[var(--shadow-sm)]",
                  )}
                >
                  <span
                    className="size-1.5 rounded-full bg-[var(--brand-foreground)]"
                    aria-hidden="true"
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-[11px]",
                      "font-bold",
                      "uppercase",
                      "tracking-[0.12em]",
                      "text-[var(--foreground-muted)]",
                    )}
                  >
                    To
                  </p>

                  <p
                    className={cn(
                      "mt-1",
                      "text-lg",
                      "font-bold",
                      "leading-6",
                      "text-[var(--foreground)]",
                      "sm:text-xl",
                    )}
                  >
                    {journey.route.destination.name}
                  </p>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Route statement                                                */}
            {/* ------------------------------------------------------------- */}

            <div
              className={cn(
                "mt-6",
                "flex",
                "items-center",
                "gap-2",
                "border-t",
                "border-[var(--border)]",
                "pt-4",
                "text-xs",
                "font-medium",
                "text-[var(--foreground-muted)]",
              )}
            >
              <span>
                {journey.route.origin.name}
              </span>

              <ArrowRight
                aria-hidden="true"
                className="size-3.5 text-[var(--brand)]"
              />

              <span>
                {journey.route.destination.name}
              </span>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Provider                                                          */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            "border-t",
            "border-[var(--border-subtle)]",
            "px-5",
            "py-6",
            "sm:px-6",
            "sm:py-7",
            "lg:border-l",
            "lg:border-t-0",
          )}
        >
          <div
            className={cn(
              "inline-flex",
              "items-center",
              "gap-2",
              "text-xs",
              "font-bold",
              "uppercase",
              "tracking-[0.12em]",
              "text-[var(--foreground-muted)]",
            )}
          >
            <CarFront
              aria-hidden="true"
              className="size-3.5 text-[var(--brand)]"
            />

            <span>Your Journey provider</span>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Traveller                                                        */}
          {/* --------------------------------------------------------------- */}

          <div
            className={cn(
              "mt-4",
              "flex",
              "items-center",
              "gap-3",
            )}
          >
            <div
              className={cn(
                "relative",
                "size-14",
                "shrink-0",
                "overflow-hidden",
                "rounded-full",
                "border-2",
                "border-[var(--surface)]",
                "bg-[var(--brand-soft)]",
                "shadow-[var(--shadow-md)]",
                "ring-1",
                "ring-[var(--border)]",
              )}
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={
                    traveller.avatar?.alt ??
                    `${traveller.handle} avatar`
                  }
                  fill
                  sizes="56px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div
                  className={cn(
                    "flex",
                    "size-full",
                    "items-center",
                    "justify-center",
                    "text-lg",
                    "font-bold",
                    "text-[var(--brand)]",
                  )}
                  aria-hidden="true"
                >
                  {traveller.handle
                    .slice(0, 1)
                    .toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p
                className={cn(
                  "truncate",
                  "text-base",
                  "font-bold",
                  "text-[var(--foreground)]",
                )}
              >
                @{traveller.handle}
              </p>

              <p
                className={cn(
                  "mt-0.5",
                  "text-xs",
                  "text-[var(--foreground-muted)]",
                )}
              >
                Journey provider
                {traveller.countryCode
                  ? ` · ${traveller.countryCode}`
                  : ""}
              </p>
            </div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Bio                                                             */}
          {/* --------------------------------------------------------------- */}

          {traveller.bio ? (
            <p
              className={cn(
                "mt-4",
                "text-sm",
                "leading-5",
                "text-[var(--foreground-secondary)]",
              )}
            >
              {traveller.bio}
            </p>
          ) : null}

          {/* --------------------------------------------------------------- */}
          {/* Trust                                                           */}
          {/* --------------------------------------------------------------- */}

          {trust ? (
            <div
              className={cn(
                "mt-5",
                "rounded-[var(--radius-lg)]",
                "border",
                "border-[var(--border)]",
                "bg-[var(--background-subtle)]",
                "p-4",
              )}
            >
              <div
                className={cn(
                  "flex",
                  "items-center",
                  "gap-2",
                  "text-sm",
                  "font-bold",
                  "text-[var(--foreground)]",
                )}
              >
                <ShieldCheck
                  aria-hidden="true"
                  className="size-4 text-[var(--success)]"
                />

                <span>Trust & verification</span>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* Trust metrics                                                */}
              {/* ----------------------------------------------------------- */}

              <div
                className={cn(
                  "mt-4",
                  "grid",
                  "grid-cols-2",
                  "gap-3",
                )}
              >
                <div
                  className={cn(
                    "rounded-[var(--radius-md)]",
                    "bg-[var(--surface)]",
                    "p-3",
                  )}
                >
                  <div
                    className={cn(
                      "flex",
                      "items-center",
                      "gap-1.5",
                      "text-xs",
                      "font-medium",
                      "text-[var(--foreground-muted)]",
                    )}
                  >
                    <BadgeCheck
                      aria-hidden="true"
                      className="size-3.5 text-[var(--success)]"
                    />

                    <span>Verification</span>
                  </div>

                  <p
                    className={cn(
                      "mt-1",
                      "text-sm",
                      "font-bold",
                      "text-[var(--foreground)]",
                    )}
                  >
                    {verificationLabel}
                  </p>
                </div>

                <div
                  className={cn(
                    "rounded-[var(--radius-md)]",
                    "bg-[var(--surface)]",
                    "p-3",
                  )}
                >
                  <div
                    className={cn(
                      "flex",
                      "items-center",
                      "gap-1.5",
                      "text-xs",
                      "font-medium",
                      "text-[var(--foreground-muted)]",
                    )}
                  >
                    <Star
                      aria-hidden="true"
                      className="size-3.5 text-[var(--warning)]"
                    />

                    <span>Rating</span>
                  </div>

                  <p
                    className={cn(
                      "mt-1",
                      "text-sm",
                      "font-bold",
                      "text-[var(--foreground)]",
                    )}
                  >
                    {hasRating
                      ? `${trust.ratingAverage.toFixed(1)} / 5`
                      : "No ratings yet"}
                  </p>
                </div>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* Journey history                                               */}
              {/* ----------------------------------------------------------- */}

              <div
                className={cn(
                  "mt-3",
                  "rounded-[var(--radius-md)]",
                  "bg-[var(--surface)]",
                  "p-3",
                )}
              >
                <p
                  className={cn(
                    "text-xs",
                    "text-[var(--foreground-muted)]",
                  )}
                >
                  Completed Journeys
                </p>

                <p
                  className={cn(
                    "mt-0.5",
                    "text-sm",
                    "font-bold",
                    "text-[var(--foreground)]",
                  )}
                >
                  {trust.completedJourneys}
                </p>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* Trust badges                                                  */}
              {/* ----------------------------------------------------------- */}

              {trust.badges.length > 0 ? (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {trust.badges.map((badge) => {
                      const badgeAssetUrl =
                        getRenderableAssetUrl(
                          badge.asset?.url,
                        );

                      return (
                        <div
                          key={badge.publicId}
                          className={cn(
                            "inline-flex",
                            "items-center",
                            "gap-1.5",
                            "rounded-full",
                            "border",
                            "border-[var(--border)]",
                            "bg-[var(--surface)]",
                            "px-2.5",
                            "py-1.5",
                          )}
                          title={
                            badge.description ??
                            badge.name
                          }
                        >
                          {badgeAssetUrl ? (
                            <div className="relative size-4 shrink-0">
                              <Image
                                src={badgeAssetUrl}
                                alt={
                                  badge.asset?.alt ??
                                  ""
                                }
                                fill
                                sizes="16px"
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                          ) : null}

                          <span
                            className={cn(
                              "text-xs",
                              "font-semibold",
                              "text-[var(--foreground)]",
                            )}
                          >
                            {badge.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div
              className={cn(
                "mt-5",
                "rounded-[var(--radius-lg)]",
                "border",
                "border-[var(--border)]",
                "bg-[var(--background-subtle)]",
                "p-4",
              )}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck
                  aria-hidden="true"
                  className="size-4 text-[var(--foreground-muted)]"
                />

                <p
                  className={cn(
                    "text-sm",
                    "font-semibold",
                    "text-[var(--foreground-secondary)]",
                  )}
                >
                  Trust information not yet available
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default JourneyOverview;