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
//   ┌──────────────┬───────────────────────┬────────────────────────┬─────────────┐
//   │   SCHEDULE   │    ROUTE / @USER      │                        │    PRICE    │
//   │              │                       │     VEHICLE IMAGE      │   / SEATS   │
//   │              │                       │                        │             │
//   │              │                       │                        │             │
//   │              │                       │                        │             │
//   │              │                       │────────────────────────│             │
//   │              │                       │ Vehicle summary        │             │
//   ├──────────────┴───────────────────────┴────────────────────────┴─────────────┤
//   │ Route context                                                   Actions      │
//   └─────────────────────────────────────────────────────────────────────────────┘
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
// - Vehicle image is a primary marketplace visual.
// - The vehicle image owns the available vehicle column space.
// - Vehicle summary remains as a compact one-line footer beneath the image.
// - Vehicle Asset URL comes from the resolved PublicJourney vehicle projection.
// - Price is the commercial anchor.
// - Capacity is an immediate availability signal.
// - Footer remains compact and horizontal.
// - No mobile-only stacking.
// - No Asset URL construction.
// - No routing/authentication/booking orchestration.
// - All visual dimensions scale uniformly through clamp().
// - Price column receives enough proportional width to remain visible.
// - Content is allowed to shrink internally without forcing the card
//   into an additional layout mode.
//
// -----------------------------------------------------------------------------
//
// Asset boundary:
//
// PublicJourney.vehicle.asset is the resolved browser-facing Asset reference.
// The JourneyCard consumes that projection directly.
//
// The card does NOT:
// - resolve Asset public IDs;
// - receive a separate PublicAsset collection;
// - fetch Assets;
// - construct Asset URLs;
// - call the Asset API.
//
// The public Journey query boundary is responsible for supplying the resolved
// vehicle Asset reference.
//
// -----------------------------------------------------------------------------

"use client";

import Image from "next/image";
import { Clock3, UsersRound } from "lucide-react";

import { Card } from "@/components/ui";

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
  bookLabel = "Book Journey",
  bookingLabel = "Booking…",
}: JourneyCardProps) {
  const isCompact =
    emphasis === "compact";

  // ---------------------------------------------------------------------------
  // Vehicle Asset
  //
  // The public Journey projection already contains the resolved browser-facing
  // Asset reference.
  //
  // JourneyCard consumes the URL supplied by the backend projection and never
  // resolves the Asset itself.
  // ---------------------------------------------------------------------------

  const vehicleImageUrl =
    journey.vehicle.asset?.url?.trim() || null;

  // ---------------------------------------------------------------------------
  // Public Traveller
  // ---------------------------------------------------------------------------

  const rawProviderHandle =
    journey.provider.traveller.handle.trim();

  const providerHandle =
    rawProviderHandle.startsWith("@")
      ? rawProviderHandle
      : `@${rawProviderHandle}`;

  const providerCountry =
    journey.provider.traveller.countryCode.trim();

  const waypointCount =
    journey.route.waypoints.length;

  // ---------------------------------------------------------------------------
  // Vehicle
  // ---------------------------------------------------------------------------

  const vehicleLabel = [
    journey.vehicle.make,
    journey.vehicle.model,
  ]
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .join(" ") || "Journey vehicle";

  // ---------------------------------------------------------------------------
  // Schedule
  // ---------------------------------------------------------------------------

  const departureAt =
    journey.schedule.departureAt;

  const arrivalAt =
    journey.schedule.arrivalAt;

  const departureTime =
    formatTime(departureAt);

  const arrivalTime =
    arrivalAt !== null
      ? formatTime(arrivalAt)
      : null;

  // ---------------------------------------------------------------------------
  // Responsive sizing
  //
  // All major dimensions scale from the same viewport relationship.
  // The composition remains horizontal; content simply becomes more compact.
  // ---------------------------------------------------------------------------

  const horizontalPadding = isCompact
    ? "px-[clamp(0.48rem,1.05vw,0.95rem)]"
    : "px-[clamp(0.58rem,1.2vw,1.1rem)]";

  const verticalPadding = isCompact
    ? "py-[clamp(0.45rem,0.9vw,0.8rem)]"
    : "py-[clamp(0.58rem,1.1vw,1rem)]";

  const sectionLabel = cn(
    "mb-[clamp(0.2rem,0.45vw,0.4rem)]",
    "text-[clamp(0.34rem,0.52vw,0.5rem)]",
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
        "rounded-[clamp(0.58rem,0.95vw,0.9rem)]",
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

            Proportions intentionally favour the commercial column slightly
            more than before so price remains visible as the card contracts.
            ------------------------------------------------------------------- */}

        <div
          className={cn(
            "grid",
            "w-full",
            "min-w-0",
            "grid-cols-[16%_29%_35%_20%]",
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
                  "min-w-0",
                  "items-center",
                  "justify-center",
                  "gap-[clamp(0.14rem,0.3vw,0.28rem)]",
                  sectionLabel,
                )}
              >
                <Clock3
                  aria-hidden="true"
                  className="size-[clamp(0.44rem,0.7vw,0.65rem)] shrink-0 text-[var(--brand)]"
                />

                <span className="truncate">
                  Departure
                </span>
              </div>

              <div className="min-w-0 text-center">
                <JourneyDate
                  schedule={journey.schedule}
                  className="mx-auto w-full"
                />

                <div
                  className={cn(
                    "mt-[clamp(0.28rem,0.6vw,0.55rem)]",
                    "flex",
                    "min-w-0",
                    "items-center",
                    "justify-center",
                    "gap-[clamp(0.15rem,0.35vw,0.35rem)]",
                  )}
                >
                  <time
                    dateTime={departureAt}
                    className={cn(
                      "min-w-0",
                      "truncate",
                      "text-[clamp(0.56rem,0.88vw,0.82rem)]",
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
                        className="shrink-0 text-[clamp(0.4rem,0.6vw,0.58rem)] text-[var(--foreground-subtle)]"
                      >
                        →
                      </span>

                      <time
                        dateTime={arrivalAt}
                        className={cn(
                          "min-w-0",
                          "truncate",
                          "text-[clamp(0.46rem,0.72vw,0.68rem)]",
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
                    "mt-[clamp(0.16rem,0.35vw,0.3rem)]",
                    "block",
                    "max-w-full",
                    "truncate",
                    "text-[clamp(0.3rem,0.48vw,0.48rem)]",
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
                  "max-w-[clamp(9rem,21vw,18rem)]",
                  "min-w-0",
                )}
              >
                <JourneyRoute
                  route={journey.route}
                  showWaypoints={false}
                />
              </div>

              <div
                className={cn(
                  "mt-[clamp(0.35rem,0.7vw,0.65rem)]",
                  "border-t",
                  "border-[var(--border-subtle)]",
                  "pt-[clamp(0.28rem,0.52vw,0.5rem)]",
                )}
              >
                <div
                  className={cn(
                    "flex",
                    "min-w-0",
                    "items-center",
                    "justify-center",
                    "gap-[clamp(0.16rem,0.35vw,0.35rem)]",
                  )}
                >
                  <span
                    className={cn(
                      "min-w-0",
                      "truncate",
                      "text-[clamp(0.52rem,0.8vw,0.76rem)]",
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
                        className="shrink-0 text-[clamp(0.34rem,0.5vw,0.5rem)] text-[var(--foreground-subtle)]"
                      >
                        ·
                      </span>

                      <span
                        className={cn(
                          "shrink-0",
                          "text-[clamp(0.34rem,0.5vw,0.5rem)]",
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
                      "mt-[clamp(0.16rem,0.3vw,0.3rem)]",
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
                        "text-[clamp(0.3rem,0.46vw,0.46rem)]",
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
              "min-w-0",
              "border-l",
              "border-[var(--border-subtle)]",
              horizontalPadding,
              verticalPadding,
            )}
          >
            <div className="flex min-w-0 flex-col">
              <div
                className={cn(
                  "relative",
                  "aspect-[16/9]",
                  "w-full",
                  "min-w-0",
                  "overflow-hidden",
                  "rounded-[clamp(0.5rem,0.9vw,0.85rem)]",
                  "border",
                  "border-[var(--border)]",
                  "bg-[var(--background-subtle)]",
                  "shadow-[var(--shadow-sm)]",
                )}
              >
                {vehicleImageUrl ? (
                  <Image
                    src={vehicleImageUrl}
                    alt={vehicleLabel}
                    fill
                    sizes="(max-width: 640px) 220px, (max-width: 1024px) 320px, 420px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div
                    className={cn(
                      "flex",
                      "size-full",
                      "flex-col",
                      "items-center",
                      "justify-center",
                      "gap-[clamp(0.25rem,0.5vw,0.4rem)]",
                      "bg-[var(--brand-soft)]",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="text-[clamp(1.5rem,3.5vw,3rem)]"
                    >
                      🚙
                    </span>

                    <span
                      className={cn(
                        "text-[clamp(0.3rem,0.5vw,0.5rem)]",
                        "font-semibold",
                        "uppercase",
                        "tracking-[0.06em]",
                        "text-[var(--foreground-muted)]",
                      )}
                    >
                      No photo
                    </span>
                  </div>
                )}
              </div>

              <div
                className={cn(
                  "min-w-0",
                  "border-t",
                  "border-[var(--border-subtle)]",
                  "pt-[clamp(0.3rem,0.58vw,0.55rem)]",
                )}
              >
                <JourneyVehicleSummary
                  vehicle={journey.vehicle}
                />
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

              <div className="min-w-0 overflow-hidden">
                <JourneyPrice
                  pricing={journey.pricing}
                  className={cn(
                    "min-w-0",
                    "max-w-full",
                    "gap-[clamp(0.22rem,0.5vw,0.45rem)]",
                  )}
                />
              </div>

              <div
                className={cn(
                  "mt-[clamp(0.3rem,0.62vw,0.55rem)]",
                  "border-t",
                  "border-[var(--border-subtle)]",
                  "pt-[clamp(0.28rem,0.52vw,0.48rem)]",
                )}
              >
                <div
                  className={cn(
                    "flex",
                    "min-w-0",
                    "items-center",
                    "gap-[clamp(0.18rem,0.35vw,0.35rem)]",
                  )}
                >
                  <UsersRound
                    aria-hidden="true"
                    className="size-[clamp(0.5rem,0.78vw,0.72rem)] shrink-0 text-[var(--brand)]"
                  />

                  <span
                    className={cn(
                      "min-w-0",
                      "truncate",
                      "text-[clamp(0.4rem,0.62vw,0.58rem)]",
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
                    "mt-[clamp(0.12rem,0.26vw,0.25rem)]",
                    "gap-x-[clamp(0.18rem,0.35vw,0.35rem)]",
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
            "gap-[clamp(0.35rem,0.8vw,0.75rem)]",
            "border-t",
            "border-[var(--border)]",
            "bg-[var(--background-brand)]",
            "px-[clamp(0.48rem,1.05vw,0.95rem)]",
            "py-[clamp(0.28rem,0.55vw,0.48rem)]",
          )}
        >
          <div className="min-w-0 flex-1">
            <div
              className={cn(
                "flex",
                "min-w-0",
                "items-center",
                "gap-[clamp(0.16rem,0.35vw,0.35rem)]",
                "overflow-hidden",
              )}
            >
              <span
                aria-hidden="true"
                className="size-[clamp(0.24rem,0.4vw,0.36rem)] shrink-0 rounded-full bg-[var(--success)]"
              />

              <span
                className={cn(
                  "min-w-0",
                  "truncate",
                  "text-[clamp(0.36rem,0.56vw,0.54rem)]",
                  "font-semibold",
                  "leading-none",
                  "text-[var(--success)]",
                )}
              >
                {journey.route.origin.name}
              </span>

              <span
                aria-hidden="true"
                className="shrink-0 text-[clamp(0.4rem,0.6vw,0.58rem)] text-[var(--foreground-subtle)]"
              >
                →
              </span>

              <span
                aria-hidden="true"
                className="size-[clamp(0.24rem,0.4vw,0.36rem)] shrink-0 rounded-full bg-[var(--danger)]"
              />

              <span
                className={cn(
                  "min-w-0",
                  "truncate",
                  "text-[clamp(0.36rem,0.56vw,0.54rem)]",
                  "font-semibold",
                  "leading-none",
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
              className="pt-0"
            />
          </div>
        </footer>
      </article>
    </Card>
  );
}