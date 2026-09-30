// -----------------------------------------------------------------------------
// Path: src/features/journey/components/journey-card.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Public Journey Marketplace Card
//
// PublicJourney-aligned marketplace presentation.
//
// Composition:
//
//   ┌──────────────┬─────────────────────────┬────────────────┬──────────────┐
//   │   SCHEDULE   │       ROUTE / @USER     │    VEHICLE     │ PRICE / SEATS │
//   ├──────────────┴─────────────────────────┴────────────────┴──────────────┤
//   │ Route context                                                   Actions │
//   └─────────────────────────────────────────────────────────────────────────┘
//
// Design contract:
// - Consumes only the PublicJourney read model.
// - Uses only fields actually exposed by PublicTraveller.
// - One horizontal composition at every viewport size.
// - Compact proportional marketplace surface.
// - Shared Journey presentation components remain the visual source of truth.
// - Route is the primary visual anchor.
// - Provider handle is prominent and uses @handle.
// - No provider avatar.
// - Vehicle image is resolved only from supplied PublicAsset references.
// - Price is the commercial anchor.
// - Capacity is an immediate availability signal.
// - Footer remains compact and horizontal.
// - No mobile-only stacking.
// - No Asset URL construction.
// - No routing/authentication/booking orchestration.
//
// -----------------------------------------------------------------------------

"use client";

import Image from "next/image";
import { Clock3, UsersRound } from "lucide-react";

import { Card } from "@/components/ui";

import type { PublicAsset } from "@/features/assets/models";
import type { PublicJourney } from "@/features/journey/models";

import { formatTime } from "@/foundation/formatters";
import { cn } from "@/foundation/utils/cn";

import {
  JourneyActions,
  JourneyCapacitySummary,
  JourneyDate,
  JourneyPrice,
  JourneyRoute,
  JourneyVehicleSummary,
} from "../shared";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCardProps {
  readonly journey: PublicJourney;

  /**
   * Public Asset references already resolved through the public Asset
   * delivery boundary.
   *
   * JourneyCard never constructs or infers Asset URLs.
   */
  readonly publicAssets?: readonly PublicAsset[];

  readonly emphasis?: "compact" | "default";
  readonly className?: string;

  /**
   * Presentation callbacks.
   *
   * The parent owns routing, authentication and booking orchestration.
   */
  readonly onView?: () => void;
  readonly onShare?: () => void;
  readonly onBook?: () => void;

  readonly isBooking?: boolean;

  readonly viewDisabled?: boolean;
  readonly shareDisabled?: boolean;
  readonly bookDisabled?: boolean;

  readonly viewLabel?: string;
  readonly shareLabel?: string;
  readonly bookLabel?: string;
  readonly bookingLabel?: string;
}

// -----------------------------------------------------------------------------
// Asset helpers
// -----------------------------------------------------------------------------

function getVehicleAssetUrl(
  journey: PublicJourney,
  publicAssets: readonly PublicAsset[],
): string | null {
  const vehicleAsset = journey.assets.find(
    (asset) => asset.type === "VEHICLE",
  );

  if (!vehicleAsset) {
    return null;
  }

  const publicAsset = publicAssets.find(
    (asset) => asset.publicId === vehicleAsset.assetPublicId,
  );

  const url = publicAsset?.url?.trim();

  return url || null;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCard({
  journey,
  publicAssets = [],
  emphasis = "compact",
  className,
  onView,
  onShare,
  onBook,
  isBooking = false,
  viewDisabled = false,
  shareDisabled = false,
  bookDisabled = false,
  viewLabel = "View",
  shareLabel = "Share",
  bookLabel = "Book Journey",
  bookingLabel = "Booking…",
}: JourneyCardProps) {
  const isCompact = emphasis === "compact";

  const vehicleImageUrl = getVehicleAssetUrl(
    journey,
    publicAssets,
  );

  // ---------------------------------------------------------------------------
  // Public Traveller fields
  //
  // PublicTraveller exposes:
  // - publicId
  // - handle
  // - bio
  // - avatar
  // - countryCode
  //
  // The marketplace card uses handle and countryCode.
  // Avatar is intentionally not rendered by the card.
  // ---------------------------------------------------------------------------

  const providerHandle =
    journey.provider.traveller.handle.startsWith("@")
      ? journey.provider.traveller.handle
      : `@${journey.provider.traveller.handle}`;

  const providerCountry =
    journey.provider.traveller.countryCode.trim();

  const waypointCount = journey.route.waypoints.length;

  // ---------------------------------------------------------------------------
  // Schedule
  //
  // Keep nullable arrivalAt separate from the formatted display value.
  // This is important with exactOptionalPropertyTypes because React's
  // <time dateTime> prop accepts string | undefined, not string | null.
  // ---------------------------------------------------------------------------

  const departureAt = journey.schedule.departureAt;
  const arrivalAt = journey.schedule.arrivalAt;

  const departureTime = formatTime(departureAt);

  const arrivalTime =
    arrivalAt !== null
      ? formatTime(arrivalAt)
      : null;

  // ---------------------------------------------------------------------------
  // Responsive sizing
  // ---------------------------------------------------------------------------

  const horizontalPadding = isCompact
    ? "px-[clamp(0.6rem,1.15vw,0.95rem)]"
    : "px-[clamp(0.7rem,1.35vw,1.1rem)]";

  const verticalPadding = isCompact
    ? "py-[clamp(0.55rem,1vw,0.8rem)]"
    : "py-[clamp(0.7rem,1.3vw,1rem)]";

  const sectionGap =
    "gap-[clamp(0.4rem,0.8vw,0.7rem)]";

  const sectionLabel = cn(
    "mb-[clamp(0.25rem,0.5vw,0.4rem)]",
    "text-[clamp(0.38rem,0.55vw,0.5rem)]",
    "font-semibold",
    "uppercase",
    "tracking-[0.08em]",
    "leading-none",
    "text-[var(--foreground-muted)]",
  );

  return (
    <Card
      padding="none"
      className={cn(
        "w-full",
        "min-w-0",
        "overflow-hidden",
        "rounded-[clamp(0.65rem,1vw,0.9rem)]",
        "border",
        "border-[var(--border)]",
        "bg-[var(--surface)]",
        "shadow-[var(--shadow-md)]",
        "transition-all",
        "duration-200",
        "hover:-translate-y-px",
        "hover:border-[var(--border-strong)]",
        "hover:shadow-[var(--shadow-lg)]",
        className,
      )}
    >
      <article
        className="min-w-0"
        aria-label={[
          "Journey",
          "from",
          journey.route.origin.name,
          "to",
          journey.route.destination.name,
        ].join(" ")}
      >
        {/* -------------------------------------------------------------------
            Marketplace body

            Schedule | Route / Provider | Vehicle | Price / Capacity
            ------------------------------------------------------------------- */}

        <div
          className={cn(
            "grid",
            "w-full",
            "min-w-0",
            "grid-cols-[18%_34%_24%_24%]",
          )}
        >
          {/* -----------------------------------------------------------------
              Schedule
              ----------------------------------------------------------------- */}

          <section
            aria-label="Journey departure"
            className={cn(
              "flex",
              "min-w-0",
              "items-center",
              "border-r",
              "border-[var(--border-subtle)]",
              horizontalPadding,
              verticalPadding,
            )}
          >
            <div className="w-full min-w-0">
              <div
                className={cn(
                  "flex",
                  "items-center",
                  "justify-center",
                  "gap-[clamp(0.18rem,0.35vw,0.28rem)]",
                  sectionLabel,
                )}
              >
                <Clock3
                  aria-hidden="true"
                  className="size-[clamp(0.5rem,0.75vw,0.65rem)] shrink-0 text-[var(--brand)]"
                />

                <span>Departure</span>
              </div>

              <div className="min-w-0 text-center">
                <JourneyDate
                  schedule={journey.schedule}
                  className="mx-auto w-full"
                />

                <div
                  className={cn(
                    "mt-[clamp(0.35rem,0.7vw,0.55rem)]",
                    "flex",
                    "min-w-0",
                    "items-center",
                    "justify-center",
                    "gap-[clamp(0.2rem,0.4vw,0.35rem)]",
                  )}
                >
                  <time
                    dateTime={departureAt}
                    className={cn(
                      "truncate",
                      "text-[clamp(0.62rem,0.95vw,0.82rem)]",
                      "font-extrabold",
                      "leading-none",
                      "tracking-tight",
                      "text-[var(--foreground)]",
                    )}
                  >
                    {departureTime}
                  </time>

                  {arrivalAt !== null ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-[clamp(0.45rem,0.65vw,0.58rem)] text-[var(--foreground-subtle)]"
                      >
                        →
                      </span>

                      <time
                        dateTime={arrivalAt}
                        className={cn(
                          "truncate",
                          "text-[clamp(0.52rem,0.78vw,0.68rem)]",
                          "font-semibold",
                          "leading-none",
                          "text-[var(--foreground-secondary)]",
                        )}
                      >
                        {arrivalTime}
                      </time>
                    </>
                  ) : null}
                </div>

                <span
                  className={cn(
                    "mt-[clamp(0.2rem,0.4vw,0.3rem)]",
                    "block",
                    "max-w-full",
                    "truncate",
                    "text-[clamp(0.34rem,0.52vw,0.48rem)]",
                    "font-semibold",
                    "uppercase",
                    "tracking-[0.07em]",
                    "leading-none",
                    "text-[var(--foreground-muted)]",
                  )}
                >
                  {journey.schedule.timezone}
                </span>
              </div>
            </div>
          </section>

          {/* -----------------------------------------------------------------
              Route + Provider
              ----------------------------------------------------------------- */}

          <section
            aria-label="Journey route and provider"
            className={cn(
              "flex",
              "min-w-0",
              "items-center",
              "justify-center",
              horizontalPadding,
              verticalPadding,
            )}
          >
            <div className="w-full min-w-0">
              <div className={sectionLabel}>
                Route
              </div>

              <div
                className={cn(
                  "mx-auto",
                  "w-full",
                  "max-w-[clamp(11rem,22vw,18rem)]",
                )}
              >
                <JourneyRoute
                  route={journey.route}
                  showWaypoints={false}
                />
              </div>

              {/* -------------------------------------------------------------
                  Provider
                  ------------------------------------------------------------- */}

              <div
                className={cn(
                  "mt-[clamp(0.45rem,0.8vw,0.65rem)]",
                  "border-t",
                  "border-[var(--border-subtle)]",
                  "pt-[clamp(0.35rem,0.6vw,0.5rem)]",
                )}
              >
                <div
                  className={cn(
                    "flex",
                    "min-w-0",
                    "items-center",
                    "justify-center",
                    "gap-[clamp(0.2rem,0.4vw,0.35rem)]",
                  )}
                >
                  <span
                    className={cn(
                      "min-w-0",
                      "truncate",
                      "text-[clamp(0.58rem,0.85vw,0.76rem)]",
                      "font-bold",
                      "leading-none",
                      "text-[var(--brand)]",
                    )}
                  >
                    {providerHandle}
                  </span>

                  {providerCountry ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-[clamp(0.38rem,0.55vw,0.5rem)] text-[var(--foreground-subtle)]"
                      >
                        ·
                      </span>

                      <span
                        className={cn(
                          "shrink-0",
                          "text-[clamp(0.38rem,0.55vw,0.5rem)]",
                          "font-semibold",
                          "uppercase",
                          "leading-none",
                          "tracking-[0.06em]",
                          "text-[var(--foreground-muted)]",
                        )}
                      >
                        {providerCountry}
                      </span>
                    </>
                  ) : null}
                </div>

                {waypointCount > 0 ? (
                  <div
                    className={cn(
                      "mt-[clamp(0.2rem,0.35vw,0.3rem)]",
                      "flex",
                      "min-w-0",
                      "items-center",
                      "justify-center",
                    )}
                  >
                    <span
                      className={cn(
                        "min-w-0",
                        "truncate",
                        "text-[clamp(0.34rem,0.5vw,0.46rem)]",
                        "leading-none",
                        "text-[var(--foreground-muted)]",
                      )}
                    >
                      {waypointCount}{" "}
                      {waypointCount === 1
                        ? "waypoint"
                        : "waypoints"}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          {/* -----------------------------------------------------------------
              Vehicle
              ----------------------------------------------------------------- */}

          <section
            aria-label="Journey vehicle"
            className={cn(
              "flex",
              "min-w-0",
              "items-center",
              "border-l",
              "border-[var(--border-subtle)]",
              horizontalPadding,
              verticalPadding,
            )}
          >
            <div className="w-full min-w-0">
              <div className={sectionLabel}>
                Vehicle
              </div>

              <div
                className={cn(
                  "flex",
                  "min-w-0",
                  "items-center",
                  sectionGap,
                )}
              >
                <div
                  className={cn(
                    "relative",
                    "size-[clamp(2.4rem,4.6vw,3.6rem)]",
                    "shrink-0",
                    "overflow-hidden",
                    "rounded-[clamp(0.4rem,0.75vw,0.6rem)]",
                    "border",
                    "border-[var(--border)]",
                    "bg-[var(--background-subtle)]",
                  )}
                >
                  {vehicleImageUrl ? (
                    <Image
                      src={vehicleImageUrl}
                      alt="Journey vehicle"
                      fill
                      sizes="(max-width: 640px) 40px, (max-width: 1024px) 54px, 60px"
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
                        "bg-[var(--brand-soft)]",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className="text-[clamp(0.82rem,1.65vw,1.18rem)]"
                      >
                        🚙
                      </span>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <JourneyVehicleSummary
                    vehicle={journey.vehicle}
                    className="gap-[clamp(0.35rem,0.65vw,0.55rem)]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* -----------------------------------------------------------------
              Price + Capacity
              ----------------------------------------------------------------- */}

          <section
            aria-label="Journey price and availability"
            className={cn(
              "flex",
              "min-w-0",
              "items-center",
              "border-l",
              "border-[var(--border-subtle)]",
              horizontalPadding,
              verticalPadding,
            )}
          >
            <div className="w-full min-w-0">
              <div className={sectionLabel}>
                Price
              </div>

              <JourneyPrice
                pricing={journey.pricing}
                className={cn(
                  "max-w-full",
                  "gap-[clamp(0.3rem,0.55vw,0.45rem)]",
                )}
              />

              <div
                className={cn(
                  "mt-[clamp(0.4rem,0.7vw,0.55rem)]",
                  "border-t",
                  "border-[var(--border-subtle)]",
                  "pt-[clamp(0.35rem,0.6vw,0.48rem)]",
                )}
              >
                <div
                  className={cn(
                    "flex",
                    "min-w-0",
                    "items-center",
                    "gap-[clamp(0.22rem,0.4vw,0.35rem)]",
                  )}
                >
                  <UsersRound
                    aria-hidden="true"
                    className="size-[clamp(0.58rem,0.85vw,0.72rem)] shrink-0 text-[var(--brand)]"
                  />

                  <span
                    className={cn(
                      "min-w-0",
                      "truncate",
                      "text-[clamp(0.45rem,0.65vw,0.58rem)]",
                      "font-semibold",
                      "leading-tight",
                      "text-[var(--foreground)]",
                    )}
                  >
                    {journey.capacity.availableSeats}{" "}
                    {journey.capacity.availableSeats === 1
                      ? "seat"
                      : "seats"}{" "}
                    available
                  </span>
                </div>

                <JourneyCapacitySummary
                  capacity={journey.capacity}
                  className={cn(
                    "mt-[clamp(0.15rem,0.3vw,0.25rem)]",
                    "gap-x-[clamp(0.22rem,0.4vw,0.35rem)]",
                  )}
                />
              </div>
            </div>
          </section>
        </div>

        {/* -------------------------------------------------------------------
            Footer
            ------------------------------------------------------------------- */}

        <footer
          className={cn(
            "flex",
            "min-w-0",
            "items-center",
            "justify-between",
            "gap-[clamp(0.45rem,0.9vw,0.75rem)]",
            "border-t",
            "border-[var(--border)]",
            "bg-[var(--background-brand)]",
            "px-[clamp(0.6rem,1.15vw,0.95rem)]",
            "py-[clamp(0.32rem,0.6vw,0.48rem)]",
          )}
        >
          {/* Route context */}

          <div className="min-w-0 flex-1">
            <div
              className={cn(
                "flex",
                "min-w-0",
                "items-center",
                "gap-[clamp(0.2rem,0.4vw,0.35rem)]",
                "overflow-hidden",
              )}
            >
              <span
                aria-hidden="true"
                className="size-[clamp(0.28rem,0.45vw,0.36rem)] shrink-0 rounded-full bg-[var(--success)]"
              />

              <span
                className={cn(
                  "min-w-0",
                  "truncate",
                  "text-[clamp(0.4rem,0.6vw,0.54rem)]",
                  "font-semibold",
                  "leading-none",
                  "text-[var(--success)]",
                )}
              >
                {journey.route.origin.name}
              </span>

              <span
                aria-hidden="true"
                className="shrink-0 text-[clamp(0.45rem,0.65vw,0.58rem)] text-[var(--foreground-subtle)]"
              >
                →
              </span>

              <span
                aria-hidden="true"
                className="size-[clamp(0.28rem,0.45vw,0.36rem)] shrink-0 rounded-full bg-[var(--danger)]"
              />

              <span
                className={cn(
                  "min-w-0",
                  "truncate",
                  "text-[clamp(0.4rem,0.6vw,0.54rem)]",
                  "font-semibold",
                  "leading-none",
                  "text-[var(--danger)]",
                )}
              >
                {journey.route.destination.name}
              </span>
            </div>
          </div>

          {/* Actions */}

          <div className="min-w-0 shrink-0">
            <JourneyActions
              onView={onView}
              onShare={onShare}
              onBook={onBook}
              isBooking={isBooking}
              viewDisabled={viewDisabled}
              shareDisabled={shareDisabled}
              bookDisabled={bookDisabled}
              emphasis="compact"
              viewLabel={viewLabel}
              shareLabel={shareLabel}
              bookLabel={bookLabel}
              bookingLabel={bookingLabel}
              className="pt-0"
            />
          </div>
        </footer>
      </article>
    </Card>
  );
}