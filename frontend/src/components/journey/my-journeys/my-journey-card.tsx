
"use client";

// -----------------------------------------------------------------------------
// sisiMove — My Journey Card
// -----------------------------------------------------------------------------
//
// Authenticated presentation of one owner's Journey.
//
// Design contract:
// - Consumes only the MyJourney read model.
// - Mobile-first, compact presentation.
// - Two-column layout on mobile; four-column layout on larger screens.
// - Journey route and status remain visible.
// - Vehicle image uses only the supplied vehicle asset.
// - Price and capacity remain visible.
// - Journeys with bookings receive a subtle success treatment.
// - Booking and Boarding summaries navigate to journey-specific routes.
// - Footer unread message badge links to the authenticated messaging inbox.
// - Footer Get support action opens support for the selected Journey.
// - Cancelled Journeys remain visible as historical records.
// - Cancelled Journeys expose no navigation actions.
// - No Journey fetching, mutations, or lifecycle inference.
// - No Asset URL construction.
//
// -----------------------------------------------------------------------------

// Imports
// -----------------------------------------------------------------------------

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock3, UsersRound } from "lucide-react";

import { Card } from "@/components/ui";
import { formatTime } from "@/foundation/formatters";
import { AUTHENTICATED_ROUTES } from "@/foundation/routing";
import { cn } from "@/foundation/utils/cn";

import type { MyJourney } from "@/features/journey/models/my-journey";

import {
  JourneyBoardingSummary,
  JourneyBookingsSummary,
  JourneyCapacitySummary,
  JourneyDate,
  JourneyGetSupportAction,
  JourneyPrice,
  JourneyRoute,
  JourneyStatusBadge,
  JourneyVehicleSummary,
  JourneyUnreadMessagesBadge,
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
  const router = useRouter();
  const isCompact = emphasis === "compact";

  const route = journey.route;
  const schedule = journey.schedule;
  const vehicle = journey.vehicle;
  const capacity = journey.capacity;
  const pricing = journey.pricing;

  // ---------------------------------------------------------------------------
  // Presentation state
  // ---------------------------------------------------------------------------

  const isCancelled = journey.status === "CANCELLED";
  const hasBookings = journey.bookings.length > 0;

  // ---------------------------------------------------------------------------
  // Vehicle asset
  // ---------------------------------------------------------------------------

  const vehicleImageUrl = vehicle?.asset?.url?.trim() || null;

  const vehicleLabel = vehicle
    ? [vehicle.make, vehicle.model]
        .map((value) => value.trim())
        .filter((value) => value.length > 0)
        .join(" ") || "Journey vehicle"
    : "Journey vehicle";

  // ---------------------------------------------------------------------------
  // Schedule
  // ---------------------------------------------------------------------------

  const departureAt = schedule?.departureAt ?? null;
  const arrivalAt = schedule?.arrivalAt ?? null;

  const departureTime =
    departureAt !== null ? formatTime(departureAt) : null;

  const arrivalTime =
    arrivalAt !== null ? formatTime(arrivalAt) : null;

  // ---------------------------------------------------------------------------
  // Route
  // ---------------------------------------------------------------------------

  const routeOrigin = route?.origin.name ?? "Origin not set";
  const routeDestination = route?.destination.name ?? "Destination not set";
  const waypointCount = route?.waypoints.length ?? 0;

  // ---------------------------------------------------------------------------
  // Responsive sizing
  // ---------------------------------------------------------------------------

  const sectionPadding = isCompact
    ? "p-2 sm:px-[clamp(0.45rem,1vw,0.85rem)] sm:py-[clamp(0.4rem,0.8vw,0.7rem)]"
    : "p-2.5 sm:px-[clamp(0.55rem,1.1vw,1rem)] sm:py-[clamp(0.5rem,1vw,0.9rem)]";

  const sectionLabel = cn(
    "mb-1",
    "text-[0.625rem] sm:text-[clamp(0.48rem,0.62vw,0.62rem)]",
    "font-semibold",
    "uppercase",
    "tracking-[0.06em]",
    "leading-tight",
    "text-[var(--foreground-muted)]",
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Card
      padding="none"
      className={cn(
        "w-full",
        "min-w-0",
        "overflow-hidden",
        "rounded-xl",
        "border",
        "transition-all",
        "duration-200",
        hasBookings && !isCancelled
          ? "border-green-200 bg-green-50/20 shadow-[var(--shadow-lg)]"
          : "border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]",
        "hover:shadow-[var(--shadow-lg)]",
        hasBookings && !isCancelled
          ? "hover:border-green-300"
          : "hover:border-[var(--border-strong)]",
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
        {/* -----------------------------------------------------------------
            Main journey details

            Mobile:  Schedule | Route
                     Vehicle  | Price / Capacity

            Larger screens:
            Schedule | Route / Status | Vehicle | Price / Capacity
        ----------------------------------------------------------------- */}

        <div
          className={cn(
            "grid",
            "w-full",
            "min-w-0",
            "grid-cols-2",
            "sm:grid-cols-[16%_29%_35%_20%]",
          )}
        >
          {/* Schedule */}

          <section
            aria-label="Journey departure"
            className={cn(
              "flex",
              "min-w-0",
              "items-center",
              "border-r",
              "border-b",
              "border-[var(--border-subtle)]",
              "sm:border-b-0",
              sectionPadding,
            )}
          >
            <div className="w-full min-w-0">
              <div
                className={cn(
                  "flex",
                  "min-w-0",
                  "items-center",
                  "gap-1",
                  "sm:justify-center",
                  sectionLabel,
                )}
              >
                <Clock3
                  aria-hidden="true"
                  className="size-3 shrink-0 text-[var(--brand)] sm:size-[clamp(0.55rem,0.7vw,0.7rem)]"
                />

                <span className="truncate">Departure</span>
              </div>

              {schedule ? (
                <div className="min-w-0 sm:text-center">
                  <JourneyDate
                    schedule={schedule}
                    className="w-full sm:mx-auto"
                  />

                  {departureAt !== null ? (
                    <div
                      className={cn(
                        "mt-1.5",
                        "flex",
                        "min-w-0",
                        "items-center",
                        "gap-1",
                        "sm:justify-center",
                      )}
                    >
                      <time
                        dateTime={departureAt}
                        className={cn(
                          "min-w-0",
                          "truncate",
                          "text-xs sm:text-[clamp(0.62rem,0.88vw,0.82rem)]",
                          "font-extrabold",
                          "leading-tight",
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
                            className="shrink-0 text-xs text-[var(--foreground-subtle)]"
                          >
                            →
                          </span>

                          <time
                            dateTime={arrivalAt}
                            className={cn(
                              "min-w-0",
                              "truncate",
                              "text-[0.625rem] sm:text-[clamp(0.52rem,0.72vw,0.68rem)]",
                              "font-semibold",
                              "leading-tight",
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
                      "mt-1",
                      "block",
                      "truncate",
                      "text-[0.5625rem] sm:text-[clamp(0.42rem,0.48vw,0.5rem)]",
                      "font-semibold",
                      "uppercase",
                      "tracking-wide",
                      "text-[var(--foreground-muted)]",
                    )}
                  >
                    {schedule.timezone}
                  </span>
                </div>
              ) : (
                <p className="text-xs leading-tight text-[var(--foreground-muted)]">
                  Departure not set
                </p>
              )}
            </div>
          </section>

          {/* Route and status */}

          <section
            aria-label="Journey route and status"
            className={cn(
              "flex",
              "min-w-0",
              "items-center",
              "border-b",
              "border-[var(--border-subtle)]",
              "sm:border-b-0",
              sectionPadding,
            )}
          >
            <div className="w-full min-w-0">
              <div className={sectionLabel}>Route</div>

              {route ? (
                <div className="mx-auto w-full min-w-0 sm:max-w-[clamp(9rem,21vw,18rem)]">
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
                    "p-2",
                    "text-xs",
                    "leading-tight",
                    "text-[var(--foreground-muted)]",
                  )}
                >
                  Route not completed
                </div>
              )}

              {/* Journey status only. Unread messages are displayed below. */}

              <div className="mt-2 flex min-w-0 flex-wrap items-center justify-start gap-2 sm:justify-center">
                <JourneyStatusBadge status={journey.status} />
              </div>

              {waypointCount > 0 ? (
                <p className="mt-1 truncate text-[0.625rem] text-[var(--foreground-muted)] sm:text-center">
                  {waypointCount}{" "}
                  {waypointCount === 1 ? "waypoint" : "waypoints"}
                </p>
              ) : null}
            </div>
          </section>

          {/* Vehicle */}

          <section
            aria-label="Journey vehicle"
            className={cn(
              "min-w-0",
              "border-r",
              "border-[var(--border-subtle)]",
              "sm:border-r-0",
              "sm:border-l",
              "sm:border-[var(--border-subtle)]",
              sectionPadding,
            )}
          >
            <div className="flex min-w-0 flex-col">
              <div className={sectionLabel}>Vehicle</div>

              {vehicle ? (
                <>
                  <div
                    className={cn(
                      "relative",
                      "aspect-[16/8]",
                      "sm:aspect-[16/9]",
                      "w-full",
                      "min-w-0",
                      "overflow-hidden",
                      "rounded-lg",
                      "border",
                      "border-[var(--border)]",
                      "bg-[var(--background-subtle)]",
                    )}
                  >
                    {vehicleImageUrl ? (
                      <Image
                        src={vehicleImageUrl}
                        alt={vehicleLabel}
                        fill
                        sizes="(max-width: 639px) 45vw, (max-width: 1024px) 30vw, 420px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex size-full flex-col items-center justify-center gap-1 bg-[var(--brand-soft)]">
                        <span
                          aria-hidden="true"
                          className="text-2xl sm:text-3xl"
                        >
                          🚙
                        </span>

                        <span className="text-[0.5625rem] font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                          No photo
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-1.5 min-w-0 border-t border-[var(--border-subtle)] pt-1.5">
                    <JourneyVehicleSummary vehicle={vehicle} />
                  </div>
                </>
              ) : (
                <div
                  className={cn(
                    "flex",
                    "min-h-16",
                    "items-center",
                    "justify-center",
                    "rounded-lg",
                    "border",
                    "border-[var(--border-subtle)]",
                    "bg-[var(--background-subtle)]",
                    "p-2",
                    "text-center",
                    "text-xs",
                    "text-[var(--foreground-muted)]",
                  )}
                >
                  Vehicle not set
                </div>
              )}
            </div>
          </section>

          {/* Price and capacity */}

          <section
            aria-label="Journey price and availability"
            className={cn(
              "flex",
              "min-w-0",
              "items-center",
              "sm:border-l",
              "sm:border-[var(--border-subtle)]",
              sectionPadding,
            )}
          >
            <div className="w-full min-w-0">
              <div className={sectionLabel}>Price</div>

              {pricing ? (
                <div className="min-w-0 overflow-hidden">
                  <JourneyPrice
                    pricing={pricing}
                    className="min-w-0 max-w-full gap-1"
                  />
                </div>
              ) : (
                <span className="block truncate text-xs text-[var(--foreground-muted)]">
                  Price not set
                </span>
              )}

              {capacity ? (
                <div className="mt-2 border-t border-[var(--border-subtle)] pt-2">
                  <div className="flex min-w-0 items-center gap-1">
                    <UsersRound
                      aria-hidden="true"
                      className="size-3 shrink-0 text-[var(--brand)]"
                    />

                    <span className="min-w-0 text-xs font-semibold leading-tight text-[var(--foreground)]">
                      {capacity.availableSeats}{" "}
                      {capacity.availableSeats === 1 ? "seat" : "seats"}{" "}
                      available
                    </span>
                  </div>

                  <JourneyCapacitySummary
                    capacity={capacity}
                    className="mt-1 gap-x-1"
                  />
                </div>
              ) : (
                <div className="mt-2 border-t border-[var(--border-subtle)] pt-2 text-xs text-[var(--foreground-muted)]">
                  Seats not set
                </div>
              )}
            </div>
          </section>
        </div>

        {/* -----------------------------------------------------------------
            Booking and boarding summaries
        ----------------------------------------------------------------- */}

        <div
          className={cn(
            "grid",
            "grid-cols-2",
            "gap-2",
            "border-t",
            "border-[var(--border)]",
            hasBookings && !isCancelled
              ? "bg-green-50/50"
              : "bg-[var(--surface)]",
            "p-2 sm:gap-3 sm:px-3 sm:py-2.5",
          )}
        >
          {!isCancelled ? (
            <Link
              href={AUTHENTICATED_ROUTES.JOURNEY_BOOKINGS(
                journey.publicId,
              )}
              aria-label={`View bookings for journey from ${routeOrigin} to ${routeDestination}`}
              className={cn(
                "block",
                "min-w-0",
                "rounded-lg",
                "transition-colors",
                "hover:bg-[var(--background-subtle)]",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-[var(--brand)]",
              )}
            >
              <JourneyBookingsSummary bookings={journey.bookings} />
            </Link>
          ) : (
            <JourneyBookingsSummary bookings={journey.bookings} />
          )}

          {!isCancelled ? (
            <Link
              href={AUTHENTICATED_ROUTES.JOURNEY_BOARDING(
                journey.publicId,
              )}
              aria-label={`Open boarding for journey from ${routeOrigin} to ${routeDestination}`}
              className={cn(
                "block",
                "min-w-0",
                "rounded-lg",
                "transition-colors",
                "hover:bg-[var(--background-subtle)]",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-[var(--brand)]",
              )}
            >
              <JourneyBoardingSummary boarding={journey.boarding} />
            </Link>
          ) : (
            <JourneyBoardingSummary boarding={journey.boarding} />
          )}
        </div>

        {/* -----------------------------------------------------------------
            Footer

            Cancelled Journeys intentionally have no navigation actions.
        ----------------------------------------------------------------- */}

        <footer
          className={cn(
            "flex",
            "min-w-0",
            "items-center",
            "justify-between",
            "gap-2",
            "border-t",
            "border-[var(--border)]",
            "bg-[var(--background-brand)]",
            "px-2.5",
            "py-2",
            "sm:px-3",
          )}
        >
          {/* Route context */}

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-1 overflow-hidden">
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5",
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
                  "text-[0.625rem] sm:text-xs",
                  "font-semibold",
                  route
                    ? "text-[var(--success)]"
                    : "text-[var(--foreground-muted)]",
                )}
              >
                {routeOrigin}
              </span>

              <span
                aria-hidden="true"
                className="shrink-0 text-xs text-[var(--foreground-subtle)]"
              >
                →
              </span>

              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5",
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
                  "text-[0.625rem] sm:text-xs",
                  "font-semibold",
                  route
                    ? "text-[var(--danger)]"
                    : "text-[var(--foreground-muted)]",
                )}
              >
                {routeDestination}
              </span>
            </div>
          </div>

          {/* Footer actions: support, messages and management */}

          {!isCancelled ? (
            <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-2">
              <JourneyGetSupportAction
                journeyPublicId={journey.publicId}
                onGetSupport={(journeyPublicId) => {
                  router.push(
                    AUTHENTICATED_ROUTES.JOURNEY_SUPPORT_NEW(
                      journeyPublicId,
                    ),
                  );
                }}
                className="min-h-8 px-2 py-1 text-[0.6875rem] sm:px-3"
              />

              <JourneyUnreadMessagesBadge
                count={journey.unreadMessagesCount}
                href={AUTHENTICATED_ROUTES.MESSAGES}
              />

              <Link
                href={AUTHENTICATED_ROUTES.MY_JOURNEY(
                  journey.publicId,
                )}
                aria-label="Manage Journey"
                className={cn(
                  "inline-flex",
                  "min-h-8",
                  "shrink-0",
                  "items-center",
                  "justify-center",
                  "rounded-lg",
                  "border",
                  "border-[var(--border)]",
                  "bg-[var(--surface)]",
                  "px-3",
                  "py-1.5",
                  "text-xs",
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
