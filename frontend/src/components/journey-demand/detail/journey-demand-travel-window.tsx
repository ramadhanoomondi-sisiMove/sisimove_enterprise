// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Travel Window
// -----------------------------------------------------------------------------
//
// Detail presentation component for a Journey Demand's requested travel
// window.
//
// The Demand schedule describes when the traveller wants to travel. It is
// intentionally presented as a request window rather than a confirmed
// Journey schedule.
//
// Visual hierarchy:
//
//   TRAVEL WINDOW
//   Departure window
//   Target / acceptable arrival
//   Timezone context
//
// Responsibilities:
// - present the public Journey Demand schedule;
// - show the requested departure window;
// - show optional arrival constraints when supplied;
// - preserve the distinction between target and maximum arrival;
// - format API-provided ISO datetime values for presentation;
// - make schedule flexibility understandable at a glance.
//
// Non-responsibilities:
// - no data fetching;
// - no mutations;
// - no schedule validation;
// - no inference of missing arrival values;
// - no calculation of scheduling rules;
// - no lifecycle logic.
//
// The backend-provided PublicJourneyDemandSchedule remains authoritative.
// -----------------------------------------------------------------------------

import {
  CalendarDays,
  Clock3,
  Flag,
  Timer,
} from "lucide-react";

import type { PublicJourneyDemandSchedule } from "@/features/journey-demand/models";

import { cn } from "@/foundation";

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandTravelWindowProps {
  /**
   * Public Journey Demand schedule.
   */
  readonly schedule: PublicJourneyDemandSchedule;

  /**
   * Controls presentation density.
   */
  readonly emphasis?: "compact" | "default";

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// =============================================================================
// Helpers
// =============================================================================

function parseScheduleDate(value: string): Date {
  return new Date(value);
}

function formatDateTime(
  value: string,
  timezone: string,
): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone,
  }).format(parseScheduleDate(value));
}

function formatTime(
  value: string,
  timezone: string,
): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  }).format(parseScheduleDate(value));
}

// =============================================================================
// Component
// =============================================================================

export function JourneyDemandTravelWindow({
  schedule,
  emphasis = "default",
  className,
}: JourneyDemandTravelWindowProps) {
  const {
    earliestDeparture,
    latestDeparture,
    targetArrival,
    maximumArrival,
    timezone,
  } = schedule;

  const isCompact = emphasis === "compact";

  const earliestDate = parseScheduleDate(
    earliestDeparture,
  );

  const latestDate = parseScheduleDate(
    latestDeparture,
  );

  const isSameDepartureDate =
    earliestDate.toLocaleDateString(undefined, {
      timeZone: timezone,
    }) ===
    latestDate.toLocaleDateString(undefined, {
      timeZone: timezone,
    });

  const departureLabel = isSameDepartureDate
    ? `${formatDateTime(
        earliestDeparture,
        timezone,
      )} – ${formatTime(
        latestDeparture,
        timezone,
      )}`
    : `${formatDateTime(
        earliestDeparture,
        timezone,
      )} – ${formatDateTime(
        latestDeparture,
        timezone,
      )}`;

  const hasTargetArrival =
    targetArrival !== null;

  const hasMaximumArrival =
    maximumArrival !== null;

  return (
    <section
      aria-labelledby="journey-demand-travel-window-heading"
      className={cn(
        "min-w-0",
        "overflow-hidden",
        "rounded-[var(--radius-xl)]",
        "border",
        "border-[var(--border)]",
        "bg-[var(--surface)]",
        "shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "border-l-4",
          "border-[var(--brand)]",
          "bg-[var(--background-brand)]",
          isCompact
            ? "px-4 py-4"
            : "px-5 py-5 sm:px-6",
        )}
      >
        <div
          className={cn(
            "flex",
            "items-start",
            "gap-3",
          )}
        >
          <div
            aria-hidden="true"
            className={cn(
              "flex",
              "size-9",
              "shrink-0",
              "items-center",
              "justify-center",
              "rounded-[var(--radius-lg)]",
              "bg-[var(--brand-soft)]",
              "text-[var(--brand)]",
            )}
          >
            <Clock3 className="size-4" />
          </div>

          <div className="min-w-0">
            <p
              className={cn(
                "text-[0.65rem]",
                "font-bold",
                "uppercase",
                "tracking-[0.1em]",
                "text-[var(--brand)]",
              )}
            >
              Travel window
            </p>

            <h2
              id="journey-demand-travel-window-heading"
              className={cn(
                "mt-1",
                "font-bold",
                "tracking-tight",
                "text-[var(--foreground)]",
                isCompact ? "text-base" : "text-lg",
              )}
            >
              When the traveller wants to travel
            </h2>

            <p
              className={cn(
                "mt-1",
                "leading-5",
                "text-[var(--foreground-muted)]",
                isCompact ? "text-xs" : "text-sm",
              )}
            >
              The requested departure window and any arrival constraints.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Schedule facts                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          isCompact
            ? "p-4"
            : "p-5 sm:p-6",
        )}
      >
        <dl
          className={cn(
            "grid",
            "min-w-0",
            "grid-cols-1",
            "gap-3",
            "lg:grid-cols-2",
          )}
        >
          {/* ---------------------------------------------------------------- */}
          {/* Departure                                                        */}
          {/* ---------------------------------------------------------------- */}

          <div
            className={cn(
              "min-w-0",
              "rounded-[var(--radius-lg)]",
              "border",
              "border-[var(--border-subtle)]",
              "bg-[var(--background-subtle)]",
              isCompact ? "p-4" : "p-5",
            )}
          >
            <dt
              className={cn(
                "flex",
                "items-center",
                "gap-2",
                "text-xs",
                "font-semibold",
                "text-[var(--foreground-muted)]",
              )}
            >
              <CalendarDays
                aria-hidden="true"
                className="size-3.5"
              />

              Departure window
            </dt>

            <dd
              className={cn(
                "mt-3",
                "font-extrabold",
                "leading-tight",
                "tracking-tight",
                "text-[var(--foreground)]",
                isCompact ? "text-base" : "text-lg",
              )}
            >
              {departureLabel}
            </dd>

            <div
              className={cn(
                "mt-3",
                "flex",
                "items-start",
                "gap-2",
              )}
            >
              <Timer
                aria-hidden="true"
                className="mt-0.5 size-3.5 shrink-0 text-[var(--brand)]"
              />

              <p
                className={cn(
                  "text-xs",
                  "leading-5",
                  "text-[var(--foreground-muted)]",
                )}
              >
                {isSameDepartureDate
                  ? "The traveller has provided a departure window for this date."
                  : "The requested departure window spans more than one calendar date."}
              </p>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Arrival                                                          */}
          {/* ---------------------------------------------------------------- */}

          <div
            className={cn(
              "min-w-0",
              "rounded-[var(--radius-lg)]",
              "border",
              "border-[var(--border-subtle)]",
              "bg-[var(--background-subtle)]",
              isCompact ? "p-4" : "p-5",
            )}
          >
            <dt
              className={cn(
                "flex",
                "items-center",
                "gap-2",
                "text-xs",
                "font-semibold",
                "text-[var(--foreground-muted)]",
              )}
            >
              <Flag
                aria-hidden="true"
                className="size-3.5"
              />

              Arrival preference
            </dt>

            {hasTargetArrival && (
              <dd
                className={cn(
                  "mt-3",
                  "font-extrabold",
                  "leading-tight",
                  "tracking-tight",
                  "text-[var(--foreground)]",
                  isCompact ? "text-base" : "text-lg",
                )}
              >
                {formatDateTime(
                  targetArrival,
                  timezone,
                )}
              </dd>
            )}

            {hasTargetArrival && hasMaximumArrival && (
              <div
                className={cn(
                  "mt-3",
                  "rounded-[var(--radius-md)]",
                  "border",
                  "border-[var(--border-subtle)]",
                  "bg-[var(--surface)]",
                  "px-3",
                  "py-2.5",
                )}
              >
                <p
                  className={cn(
                    "text-xs",
                    "font-medium",
                    "text-[var(--foreground-muted)]",
                  )}
                >
                  Latest acceptable arrival
                </p>

                <p
                  className={cn(
                    "mt-0.5",
                    "text-sm",
                    "font-semibold",
                    "text-[var(--foreground)]",
                  )}
                >
                  {formatDateTime(
                    maximumArrival,
                    timezone,
                  )}
                </p>
              </div>
            )}

            {!hasTargetArrival && hasMaximumArrival && (
              <dd
                className={cn(
                  "mt-3",
                  "font-extrabold",
                  "leading-tight",
                  "tracking-tight",
                  "text-[var(--foreground)]",
                  isCompact ? "text-base" : "text-lg",
                )}
              >
                {formatDateTime(
                  maximumArrival,
                  timezone,
                )}
              </dd>
            )}

            {!hasTargetArrival && !hasMaximumArrival && (
              <dd
                className={cn(
                  "mt-3",
                  "text-sm",
                  "text-[var(--foreground-muted)]",
                )}
              >
                No arrival constraint specified
              </dd>
            )}

            {hasTargetArrival && (
              <p
                className={cn(
                  "mt-3",
                  "text-xs",
                  "leading-5",
                  "text-[var(--foreground-muted)]",
                )}
              >
                This is the traveller&apos;s target arrival time.
              </p>
            )}

            {!hasTargetArrival && hasMaximumArrival && (
              <p
                className={cn(
                  "mt-3",
                  "text-xs",
                  "leading-5",
                  "text-[var(--foreground-muted)]",
                )}
              >
                This is the latest arrival time specified by the traveller.
              </p>
            )}
          </div>
        </dl>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Timezone                                                            */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "border-t",
          "border-[var(--border-subtle)]",
          "bg-[var(--background-subtle)]",
          isCompact
            ? "px-4 py-3"
            : "px-5 py-4 sm:px-6",
        )}
      >
        <p
          className={cn(
            "text-xs",
            "leading-5",
            "text-[var(--foreground-muted)]",
          )}
        >
          Times are shown in the requested travel timezone:{" "}
          <span className="font-medium text-[var(--foreground-secondary)]">
            {timezone}
          </span>
          .
        </p>
      </div>
    </section>
  );
}