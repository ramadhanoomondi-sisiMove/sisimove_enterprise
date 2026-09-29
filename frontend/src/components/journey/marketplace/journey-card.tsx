// -----------------------------------------------------------------------------
// Path: src/features/journey/components/journey-card.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Public Journey Marketplace Card
//
// Visual direction:
// - Premium, bright, distinctive marketplace surface.
// - One horizontal composition at every viewport size.
// - Card behaves as one proportional visual object.
// - Route is the primary visual anchor and is centered within its zone.
// - Provider handle is prominent and always presented as @handle.
// - Provider identity is trust metadata, never a real-name presentation.
// - From and To use distinct visual colors.
// - Vehicle imagery is a primary marketplace visual.
// - Vehicle identity remains prominent beside the vehicle image.
// - Price is the commercial anchor.
// - Capacity is an immediate availability signal.
// - Actions remain visible in a dedicated footer.
// - Footer repeats the route as action context.
// - Typography, icons, imagery, spacing and controls scale together.
// - No mobile-only stacking or structural reconstruction.
// - No provider avatar/profile image.
// - No global CSS changes.
// -----------------------------------------------------------------------------
//
// Frozen visual tokens used:
// - --background
// - --surface
// - --background-subtle
// - --background-brand
// - --brand
// - --foreground
// - --foreground-secondary
// - --foreground-muted
// - --foreground-subtle
// - --border
// - --border-subtle
// - --border-strong
// - --success
// - --warning
// - --shadow-md
// - --shadow-lg
// -----------------------------------------------------------------------------

"use client";

import Image from "next/image";

import { Card } from "@/components/ui";

import type { PublicJourney } from "@/features/journey/models";

import { cn } from "@/foundation";

import {
  JourneyActions,
  JourneyCapacitySummary,
  JourneyPrice,
  JourneyRoute,
  JourneyScheduleSummary,
  JourneyVehicleSummary,
} from "../shared";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCardProps {
  readonly journey: PublicJourney;
  readonly emphasis?: "compact" | "default";
  readonly className?: string;
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
// Local icon
// -----------------------------------------------------------------------------

function MarketplaceIcon({
  type,
  className,
}: {
  readonly type:
    | "clock"
    | "origin"
    | "destination"
    | "arrow"
    | "verified"
    | "phone"
    | "seats";
  readonly className?: string;
}) {
  const common = cn(
    "inline-block",
    "shrink-0",
    "stroke-current",
    className,
  );

  switch (type) {
    case "clock":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className={common}
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "origin":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={common}
        >
          <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Zm0-9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
        </svg>
      );

    case "destination":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={common}
        >
          <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Zm0-9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
        </svg>
      );

    case "arrow":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className={common}
          strokeWidth="2"
        >
          <path d="M4 12h15" />
          <path d="m14 7 5 5-5 5" />
        </svg>
      );

    case "verified":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={common}
        >
          <path d="M12 2.5 14.2 4l2.7-.2 1.1 2.5 2.3 1.4-.6 2.7.6 2.7-2.3 1.4-1.1 2.5-2.7-.2-2.2 1.5-2.2-1.5-2.7.2-1.1-2.5-2.3-1.4.6-2.7-.6-2.7 2.3-1.4L7.1 3.8l2.7.2L12 2.5Zm-1.1 13.2 5.4-5.4-1.4-1.4-4 4-1.8-1.8-1.4 1.4 3.2 3.2Z" />
        </svg>
      );

    case "phone":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className={common}
          strokeWidth="2"
        >
          <path d="M6.7 3.5 9.2 3l1.7 4-2 1.5a14.6 14.6 0 0 0 6.6 6.6l1.5-2 4 1.7-.5 2.5c-.3 1.4-1.6 2.3-3 2.1A16.9 16.9 0 0 1 4.6 6.5c-.2-1.4.7-2.7 2.1-3Z" />
        </svg>
      );

    case "seats":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className={common}
          strokeWidth="2"
        >
          <path d="M7 5v8a3 3 0 0 0 3 3h7" />
          <path d="M8 16v3" />
          <path d="M17 16v3" />
          <path d="M10 5h4a2 2 0 0 1 2 2v6H10a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
          <path d="M5 19h14" />
        </svg>
      );
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCard({
  journey,
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
  bookLabel = "Book Mine",
  bookingLabel = "Booking…",
}: JourneyCardProps) {
  const isCompact = emphasis === "compact";

  const waypointCount = journey.route.waypoints.length;

  const vehicleAsset = journey.assets.find(
    (asset) => asset.type === "VEHICLE",
  );

  const traveller =
    journey.provider.traveller as typeof journey.provider.traveller &
      Record<string, unknown>;

  const rating =
    typeof traveller.rating === "number"
      ? traveller.rating
      : typeof traveller.averageRating === "number"
        ? traveller.averageRating
        : null;

  const tripCount =
    typeof traveller.tripCount === "number"
      ? traveller.tripCount
      : typeof traveller.completedTrips === "number"
        ? traveller.completedTrips
        : null;

  const idVerified =
    traveller.idVerified === true ||
    traveller.isIdVerified === true ||
    traveller.identityVerified === true;

  const phoneVerified =
    traveller.phoneVerified === true ||
    traveller.isPhoneVerified === true;

  const vehicleAssetRecord = vehicleAsset as
    | (typeof vehicleAsset & Record<string, unknown>)
    | undefined;

  const vehicleImageUrl =
    typeof vehicleAssetRecord?.url === "string"
      ? vehicleAssetRecord.url.trim() || null
      : typeof vehicleAssetRecord?.publicUrl === "string"
        ? vehicleAssetRecord.publicUrl.trim() || null
        : typeof vehicleAssetRecord?.src === "string"
          ? vehicleAssetRecord.src.trim() || null
          : null;

  const providerHandle =
    journey.provider.traveller.handle.startsWith("@")
      ? journey.provider.traveller.handle
      : `@${journey.provider.traveller.handle}`;

  const verticalPadding = isCompact
    ? "py-[clamp(0.8rem,1.55vw,1.15rem)]"
    : "py-[clamp(0.95rem,1.9vw,1.4rem)]";

  const horizontalPadding =
    "px-[clamp(0.75rem,1.45vw,1.2rem)]";

  return (
    <Card
      className={cn(
        "w-full",
        "min-w-0",
        "overflow-hidden",
        "rounded-[clamp(0.75rem,1.2vw,1rem)]",
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
      padding="none"
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

            Stable proportional zones:

              Schedule | Centered Route + Provider | Vehicle | Price + Capacity
            ------------------------------------------------------------------- */}

        <div
          className={cn(
            "grid",
            "w-full",
            "min-w-0",
            "grid-cols-[17%_35%_24%_24%]",
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
                  "mb-[clamp(0.35rem,0.7vw,0.55rem)]",
                  "flex",
                  "items-center",
                  "gap-[clamp(0.25rem,0.5vw,0.4rem)]",
                  "text-[clamp(0.42rem,0.62vw,0.55rem)]",
                  "font-semibold",
                  "uppercase",
                  "tracking-[0.08em]",
                  "text-[var(--foreground-muted)]",
                )}
              >
                <MarketplaceIcon
                  type="clock"
                  className="size-[clamp(0.5rem,0.8vw,0.65rem)] text-[var(--brand)]"
                />

                <span>Departure</span>
              </div>

              <JourneyScheduleSummary
                schedule={journey.schedule}
                className="items-start text-left"
              />
            </div>
          </section>

          {/* -----------------------------------------------------------------
              Centered route + provider
              ----------------------------------------------------------------- */}

          <section
            aria-label="Journey route and provider"
            className={cn(
              "flex",
              "min-w-0",
              "items-center",
              "justify-center",
              "text-center",
              horizontalPadding,
              verticalPadding,
            )}
          >
            <div className="w-full min-w-0">
              <div
                className={cn(
                  "mb-[clamp(0.35rem,0.7vw,0.55rem)]",
                  "text-[clamp(0.42rem,0.62vw,0.55rem)]",
                  "font-semibold",
                  "uppercase",
                  "tracking-[0.08em]",
                  "text-[var(--foreground-muted)]",
                )}
              >
                Route
              </div>

              <div className="flex min-w-0 justify-center">
                <div className="min-w-0 max-w-full">
                  <JourneyRoute
                    route={journey.route}
                    showWaypoints={false}
                  />
                </div>
              </div>

              <div
                className={cn(
                  "mx-auto",
                  "mt-[clamp(0.6rem,1.1vw,0.85rem)]",
                  "max-w-full",
                  "border-t",
                  "border-[var(--border-subtle)]",
                  "pt-[clamp(0.45rem,0.8vw,0.65rem)]",
                )}
              >
                <div
                  className={cn(
                    "flex",
                    "min-w-0",
                    "items-center",
                    "justify-center",
                    "gap-[clamp(0.3rem,0.6vw,0.5rem)]",
                  )}
                >
                  <span
                    className={cn(
                      "min-w-0",
                      "truncate",
                      "text-[clamp(0.62rem,0.9vw,0.78rem)]",
                      "font-bold",
                      "leading-tight",
                      "text-[var(--brand)]",
                    )}
                  >
                    {providerHandle}
                  </span>

                  {rating !== null ? (
                    <span
                      className={cn(
                        "shrink-0",
                        "text-[clamp(0.46rem,0.65vw,0.58rem)]",
                        "font-semibold",
                        "text-[var(--foreground-secondary)]",
                      )}
                    >
                      <span className="mr-[0.15em] text-[var(--warning)]">
                        ★
                      </span>
                      {rating.toFixed(1)}
                    </span>
                  ) : null}

                  {tripCount !== null ? (
                    <span
                      className={cn(
                        "min-w-0",
                        "truncate",
                        "text-[clamp(0.4rem,0.6vw,0.52rem)]",
                        "text-[var(--foreground-muted)]",
                      )}
                    >
                      · {tripCount} trips
                    </span>
                  ) : null}
                </div>

                {(idVerified ||
                  phoneVerified ||
                  waypointCount > 0) ? (
                  <div
                    className={cn(
                      "mt-[clamp(0.2rem,0.4vw,0.3rem)]",
                      "flex",
                      "min-w-0",
                      "items-center",
                      "justify-center",
                      "gap-[clamp(0.35rem,0.7vw,0.55rem)]",
                      "overflow-hidden",
                    )}
                  >
                    {idVerified ? (
                      <span
                        className={cn(
                          "inline-flex",
                          "min-w-0",
                          "items-center",
                          "gap-0.5",
                          "truncate",
                          "text-[clamp(0.38rem,0.58vw,0.5rem)]",
                          "font-medium",
                          "text-[var(--success)]",
                        )}
                      >
                        <MarketplaceIcon
                          type="verified"
                          className="size-[clamp(0.4rem,0.65vw,0.55rem)]"
                        />

                        <span className="truncate">
                          ID verified
                        </span>
                      </span>
                    ) : null}

                    {phoneVerified ? (
                      <span
                        className={cn(
                          "inline-flex",
                          "min-w-0",
                          "items-center",
                          "gap-0.5",
                          "truncate",
                          "text-[clamp(0.38rem,0.58vw,0.5rem)]",
                          "font-medium",
                          "text-[var(--success)]",
                        )}
                      >
                        <MarketplaceIcon
                          type="phone"
                          className="size-[clamp(0.4rem,0.65vw,0.55rem)]"
                        />

                        <span className="truncate">
                          Phone verified
                        </span>
                      </span>
                    ) : null}

                    {waypointCount > 0 ? (
                      <span
                        className={cn(
                          "min-w-0",
                          "truncate",
                          "text-[clamp(0.38rem,0.58vw,0.5rem)]",
                          "text-[var(--foreground-muted)]",
                        )}
                      >
                        · {waypointCount}{" "}
                        {waypointCount === 1
                          ? "waypoint"
                          : "waypoints"}
                      </span>
                    ) : null}
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
              <div
                className={cn(
                  "mb-[clamp(0.35rem,0.7vw,0.55rem)]",
                  "text-[clamp(0.42rem,0.62vw,0.55rem)]",
                  "font-semibold",
                  "uppercase",
                  "tracking-[0.08em]",
                  "text-[var(--foreground-muted)]",
                )}
              >
                Vehicle
              </div>

              <div className="flex min-w-0 items-center gap-[clamp(0.45rem,0.9vw,0.75rem)]">
                <div
                  className={cn(
                    "relative",
                    "size-[clamp(3rem,6vw,4.5rem)]",
                    "shrink-0",
                    "overflow-hidden",
                    "rounded-[clamp(0.5rem,0.9vw,0.75rem)]",
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
                      sizes="(max-width: 640px) 48px, (max-width: 1024px) 64px, 72px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <span
                        aria-hidden="true"
                        className="text-[clamp(0.75rem,1.5vw,1.15rem)] font-bold text-[var(--brand)]"
                      >
                        🚙
                      </span>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <JourneyVehicleSummary
                    vehicle={journey.vehicle}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* -----------------------------------------------------------------
              Commercial anchor
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
              <div
                className={cn(
                  "mb-[clamp(0.35rem,0.7vw,0.55rem)]",
                  "text-[clamp(0.42rem,0.62vw,0.55rem)]",
                  "font-semibold",
                  "uppercase",
                  "tracking-[0.08em]",
                  "text-[var(--foreground-muted)]",
                )}
              >
                From
              </div>

              <div className="min-w-0 overflow-hidden">
                <JourneyPrice
                  pricing={journey.pricing}
                  className="max-w-full"
                />
              </div>

              <div
                className={cn(
                  "mt-[clamp(0.5rem,0.9vw,0.7rem)]",
                  "border-t",
                  "border-[var(--border-subtle)]",
                  "pt-[clamp(0.45rem,0.8vw,0.65rem)]",
                )}
              >
                <div
                  className={cn(
                    "flex",
                    "min-w-0",
                    "items-center",
                    "gap-[clamp(0.3rem,0.6vw,0.45rem)]",
                  )}
                >
                  <MarketplaceIcon
                    type="seats"
                    className="size-[clamp(0.58rem,0.9vw,0.72rem)] text-[var(--brand)]"
                  />

                  <span
                    className={cn(
                      "min-w-0",
                      "truncate",
                      "text-[clamp(0.5rem,0.75vw,0.64rem)]",
                      "font-semibold",
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
                  className="mt-[clamp(0.2rem,0.4vw,0.3rem)]"
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
            "gap-[clamp(0.6rem,1.2vw,1rem)]",
            "border-t",
            "border-[var(--border)]",
            "bg-[var(--background-brand)]",
            "px-[clamp(0.7rem,1.45vw,1.2rem)]",
            "py-[clamp(0.45rem,0.9vw,0.7rem)]",
          )}
        >
          <div className="min-w-0 flex-1">
            <div
              className={cn(
                "flex",
                "min-w-0",
                "items-center",
                "gap-[clamp(0.3rem,0.55vw,0.5rem)]",
                "overflow-hidden",
                "text-[clamp(0.46rem,0.7vw,0.62rem)]",
                "font-semibold",
              )}
            >
              <MarketplaceIcon
                type="origin"
                className="size-[clamp(0.45rem,0.7vw,0.62rem)] text-[var(--success)]"
              />

              <span
                className={cn(
                  "min-w-0",
                  "truncate",
                  "text-[var(--success)]",
                )}
              >
                {journey.route.origin.name}
              </span>

              <MarketplaceIcon
                type="arrow"
                className="size-[clamp(0.5rem,0.78vw,0.68rem)] text-[var(--foreground-subtle)]"
              />

              <MarketplaceIcon
                type="destination"
                className="size-[clamp(0.45rem,0.7vw,0.62rem)] text-[var(--danger)]"
              />

              <span
                className={cn(
                  "min-w-0",
                  "truncate",
                  "text-[var(--danger)]",
                )}
              >
                {journey.route.destination.name}
              </span>
            </div>
          </div>

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
              className="border-t-0 pt-0"
            />
          </div>
        </footer>
      </article>
    </Card>
  );
}