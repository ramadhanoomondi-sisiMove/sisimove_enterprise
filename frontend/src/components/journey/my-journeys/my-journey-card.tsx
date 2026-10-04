// -----------------------------------------------------------------------------
// Path: src/features/journey/components/my-journey-card.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — My Journey Card
//
// Authenticated presentation of one owner's Journey.
//
// Design contract:
// - Consumes only the MyJourney read model.
// - Mirrors the public JourneyCard marketplace composition.
// - One horizontal composition at every viewport size.
// - Compact proportional authenticated Journey surface.
// - All major visual dimensions scale together through clamp().
// - Route remains the primary visual anchor.
// - Journey status is visible without dominating the card.
// - Vehicle image is a primary marketplace visual.
// - Vehicle image owns the available vehicle column space.
// - Vehicle summary remains as a compact one-line footer beneath the image.
// - Vehicle image is resolved only from the supplied MyJourney vehicle asset.
// - Price is the commercial anchor.
// - Price receives enough proportional width to remain visible as the card
//   becomes narrower.
// - Capacity is an immediate availability signal.
// - Footer remains compact and horizontal.
// - Active Journeys retain the authenticated Manage entry point.
// - CANCELLED Journeys remain visible in My Journeys.
// - CANCELLED Journeys are presented as terminal/read-only Journey records.
// - CANCELLED Journeys expose no View or Manage navigation action.
// - Progressively assembled Draft Journeys remain safe to render.
// - No Journey fetching.
// - No Journey mutations.
// - No lifecycle transition logic.
// - No capability inference.
// - No Journey editing.
// - No Asset URL construction.
//
// Shared Journey presentation components remain responsible for
// Journey-specific visual details.
//
// -----------------------------------------------------------------------------

"use client";

import Image from "next/image";
import { Clock3, UsersRound } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui";
import { formatTime } from "@/foundation/formatters";
import { AUTHENTICATED_ROUTES } from "@/foundation/routing";
import { cn } from "@/foundation/utils/cn";

import type { MyJourney } from "@/features/journey/models/my-journey";

import {
  JourneyCapacitySummary,
  JourneyDate,
  JourneyPrice,
  JourneyRoute,
  JourneyStatusBadge,
  JourneyVehicleSummary,
} from "@/components/journey/shared";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MyJourneyCardProps {
  /**
   * Authenticated Journey projection supplied by the My Journeys query.
   */
  readonly journey: MyJourney;

  /**
   * Optional additional CSS classes.
   */
  readonly className?: string;

  /**
   * Optional presentation emphasis.
   */
  readonly emphasis?: "compact" | "default";
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MyJourneyCard({
  journey,
  className,
  emphasis = "compact",
}: MyJourneyCardProps) {
  const isCompact = emphasis === "compact";

  const route = journey.route;
  const schedule = journey.schedule;
  const vehicle = journey.vehicle;
  const capacity = journey.capacity;
  const pricing = journey.pricing;

  // ---------------------------------------------------------------------------
  // Terminal presentation
  //
  // CANCELLED is a persisted terminal status supplied by the backend.
  //
  // The card does not decide what that status means operationally. It only
  // uses the status to provide appropriate presentation.
  //
  // CANCELLED Journeys remain visible as historical records but expose no
  // navigation action from this card.
  //
  // No mutation, transition, or capability decision is made here.
  // ---------------------------------------------------------------------------

  const isCancelled = journey.status === "CANCELLED";

  // ---------------------------------------------------------------------------
  // Vehicle asset
  //
  // The MyJourney projection already contains the resolved public asset
  // reference. The card never constructs an Asset URL.
  // ---------------------------------------------------------------------------

  const vehicleImageUrl =
    vehicle?.asset?.url?.trim() || null;

  const vehicleLabel = vehicle
    ? [vehicle.make, vehicle.model]
        .map((value) => value.trim())
        .filter((value) => value.length > 0)
        .join(" ") || "Journey vehicle"
    : "Journey vehicle";

  // ---------------------------------------------------------------------------
  // Schedule
  // ---------------------------------------------------------------------------

  const departureAt =
    schedule?.departureAt ?? null;

  const arrivalAt =
    schedule?.arrivalAt ?? null;

  const departureTime =
    departureAt !== null
      ? formatTime(departureAt)
      : null;

  const arrivalTime =
    arrivalAt !== null
      ? formatTime(arrivalAt)
      : null;

  // ---------------------------------------------------------------------------
  // Route
  // ---------------------------------------------------------------------------

  const routeOrigin =
    route?.origin.name ?? "Origin not set";

  const routeDestination =
    route?.destination.name ?? "Destination not set";

  const waypointCount =
    route?.waypoints.length ?? 0;

  // ---------------------------------------------------------------------------
  // Responsive sizing
  //
  // These values intentionally mirror JourneyCard.
  //
  // The card remains one horizontal composition. Rather than introducing a
  // mobile-only layout, typography, spacing, icons and visual containers
  // progressively scale together.
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
          isCancelled ? "Cancelled Journey" : "My Journey",
          "from",
          routeOrigin,
          "to",
          routeDestination,
        ].join(" ")}
      >
        {/* -------------------------------------------------------------------
            Marketplace-style body

            Schedule | Route / Status | Vehicle | Price / Capacity

            Proportions deliberately match JourneyCard:

                16% | 29% | 35% | 20%

            Price therefore gets a little more room while the vehicle remains
            the dominant visual column.
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

              {schedule ? (
                <div className="min-w-0 text-center">
                  <JourneyDate
                    schedule={schedule}
                    className="mx-auto w-full"
                  />

                  {departureAt !== null ? (
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
                  ) : null}

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
                    {schedule.timezone}
                  </span>
                </div>
              ) : (
                <p
                  className={cn(
                    "text-center",
                    "text-[clamp(0.42rem,0.65vw,0.62rem)]",
                    "leading-tight",
                    "text-[var(--foreground-subtle)]",
                  )}
                >
                  Departure not set
                </p>
              )}
            </div>
          </section>

          {/* -----------------------------------------------------------------
              Route + Status
              ----------------------------------------------------------------- */}

          <section
            aria-label="Journey route and status"
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

              {route ? (
                <div
                  className={cn(
                    "mx-auto",
                    "w-full",
                    "max-w-[clamp(9rem,21vw,18rem)]",
                    "min-w-0",
                  )}
                >
                  <JourneyRoute
                    route={route}
                    showWaypoints={false}
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    "rounded-[var(--radius-md)]",
                    "border",
                    "border-[var(--border-subtle)]",
                    "bg-[var(--background-subtle)]",
                    "px-[clamp(0.45rem,0.8vw,0.75rem)]",
                    "py-[clamp(0.4rem,0.7vw,0.6rem)]",
                    "text-center",
                    "text-[clamp(0.42rem,0.65vw,0.62rem)]",
                    "leading-tight",
                    "text-[var(--foreground-muted)]",
                  )}
                >
                  Journey route not yet completed
                </div>
              )}

              {/* Status */}

              <div
                className={cn(
                  "mt-[clamp(0.35rem,0.7vw,0.65rem)]",
                  "flex",
                  "min-w-0",
                  "items-center",
                  "justify-center",
                  "border-t",
                  "border-[var(--border-subtle)]",
                  "pt-[clamp(0.28rem,0.52vw,0.5rem)]",
                )}
              >
                <JourneyStatusBadge
                  status={journey.status}
                />
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
          </section>

          {/* -----------------------------------------------------------------
              Vehicle

              Image owns the available vehicle column width.
              Summary remains directly beneath it as a compact footer.
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
              <div className={sectionLabel}>
                Vehicle
              </div>

              {vehicle ? (
                <>
                  {/* -----------------------------------------------------------
                      Primary vehicle image
                      ----------------------------------------------------------- */}

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

                  {/* -----------------------------------------------------------
                      Vehicle summary footer
                      ----------------------------------------------------------- */}

                  <div
                    className={cn(
                      "min-w-0",
                      "border-t",
                      "border-[var(--border-subtle)]",
                      "pt-[clamp(0.3rem,0.58vw,0.55rem)]",
                    )}
                  >
                    <JourneyVehicleSummary
                      vehicle={vehicle}
                    />
                  </div>
                </>
              ) : (
                <div
                  className={cn(
                    "flex",
                    "min-h-[clamp(5rem,8vw,8rem)]",
                    "items-center",
                    "justify-center",
                    "rounded-[var(--radius-md)]",
                    "border",
                    "border-[var(--border-subtle)]",
                    "bg-[var(--background-subtle)]",
                    "px-[clamp(0.45rem,0.8vw,0.75rem)]",
                    "py-[clamp(0.4rem,0.7vw,0.6rem)]",
                    "text-center",
                    "text-[clamp(0.42rem,0.65vw,0.62rem)]",
                    "text-[var(--foreground-muted)]",
                  )}
                >
                  Vehicle not set
                </div>
              )}
            </div>
          </section>

          {/* -----------------------------------------------------------------
              Price + Capacity

              Price receives 20% of the body width.

              This keeps the commercial anchor visible as the complete card
              scales down.
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

              {pricing ? (
                <div className="min-w-0 overflow-hidden">
                  <JourneyPrice
                    pricing={pricing}
                    className={cn(
                      "min-w-0",
                      "max-w-full",
                      "gap-[clamp(0.22rem,0.5vw,0.45rem)]",
                    )}
                  />
                </div>
              ) : (
                <span
                  className={cn(
                    "block",
                    "min-w-0",
                    "truncate",
                    "text-[clamp(0.5rem,0.75vw,0.7rem)]",
                    "text-[var(--foreground-muted)]",
                  )}
                >
                  Price not set
                </span>
              )}

              {capacity ? (
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
                      {capacity.availableSeats}{" "}
                      {capacity.availableSeats === 1
                        ? "seat"
                        : "seats"}{" "}
                      available
                    </span>
                  </div>

                  <JourneyCapacitySummary
                    capacity={capacity}
                    className={cn(
                      "mt-[clamp(0.12rem,0.26vw,0.25rem)]",
                      "gap-x-[clamp(0.18rem,0.35vw,0.35rem)]",
                    )}
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    "mt-[clamp(0.3rem,0.62vw,0.55rem)]",
                    "border-t",
                    "border-[var(--border-subtle)]",
                    "pt-[clamp(0.28rem,0.52vw,0.48rem)]",
                    "text-[clamp(0.4rem,0.62vw,0.58rem)]",
                    "text-[var(--foreground-muted)]",
                  )}
                >
                  Seats not set
                </div>
              )}
            </div>
          </section>
        </div>

        {/* -------------------------------------------------------------------
            Footer

            CANCELLED Journeys intentionally have no navigation action.
            They remain visible as historical records only.
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
          {/* Route context */}

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
                className={cn(
                  "size-[clamp(0.24rem,0.4vw,0.36rem)]",
                  "shrink-0",
                  "rounded-full",
                  route
                    ? "bg-[var(--success)]"
                    : "bg-[var(--foreground-subtle)]",
                )}
              />

              <span
                className={cn(
                  "min-w-0",
                  "truncate",
                  "text-[clamp(0.36rem,0.56vw,0.54rem)]",
                  "font-semibold",
                  "leading-none",
                  route
                    ? "text-[var(--success)]"
                    : "text-[var(--foreground-muted)]",
                )}
              >
                {routeOrigin}
              </span>

              <span
                aria-hidden="true"
                className="shrink-0 text-[clamp(0.4rem,0.6vw,0.58rem)] text-[var(--foreground-subtle)]"
              >
                →
              </span>

              <span
                aria-hidden="true"
                className={cn(
                  "size-[clamp(0.24rem,0.4vw,0.36rem)]",
                  "shrink-0",
                  "rounded-full",
                  route
                    ? "bg-[var(--danger)]"
                    : "bg-[var(--foreground-subtle)]",
                )}
              />

              <span
                className={cn(
                  "min-w-0",
                  "truncate",
                  "text-[clamp(0.36rem,0.56vw,0.54rem)]",
                  "font-semibold",
                  "leading-none",
                  route
                    ? "text-[var(--danger)]"
                    : "text-[var(--foreground-muted)]",
                )}
              >
                {routeDestination}
              </span>
            </div>
          </div>

          {/* Management / navigation */}

          {!isCancelled ? (
            <div className="min-w-0 shrink-0">
              <Link
                href={AUTHENTICATED_ROUTES.MY_JOURNEY(
                  journey.publicId,
                )}
                aria-label="Manage Journey"
                className={cn(
                  "inline-flex",
                  "min-h-[clamp(1.8rem,2.7vw,2.25rem)]",
                  "shrink-0",
                  "items-center",
                  "justify-center",
                  "rounded-[var(--radius-md)]",
                  "border",
                  "border-[var(--border)]",
                  "bg-[var(--surface)]",
                  "px-[clamp(0.55rem,1vw,0.75rem)]",
                  "py-[clamp(0.3rem,0.5vw,0.4rem)]",
                  "text-[clamp(0.52rem,0.7vw,0.75rem)]",
                  "font-semibold",
                  "text-[var(--foreground)]",
                  "transition-colors",
                  "hover:border-[var(--brand)]",
                  "hover:bg-[var(--brand-soft)]",
                  "hover:text-[var(--brand)]",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-[var(--brand)]",
                )}
              >
                Manage
              </Link>
            </div>
          ) : null}
        </footer>
      </article>
    </Card>
  );
}