// -----------------------------------------------------------------------------
// Path: src/components/journey-demand/my-demands/my-journey-demand-card.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — My Journey Demand Card
//
// Authenticated presentation of one owner's Journey Demand.
//
// Design direction:
// - Mirrors the public JourneyDemandCard visual grammar.
// - Remains explicitly authenticated.
// - Consumes only MyJourneyDemand.
// - One horizontal composition at every viewport size.
// - Route/corridor remains the primary visual anchor.
// - Requested seats remain the immediate demand signal.
// - Price preference remains the commercial anchor.
// - Lifecycle status remains visible without dominating the card.
// - Schedule remains visible without dominating the card.
// - Footer remains compact and horizontal.
// - Typography, spacing, icons, and controls scale proportionally.
//
// Important:
// - MyJourneyDemand exposes `corridor`, not `route`.
// - MyJourneyDemand exposes `capacity`, not public `demand`.
// - MyJourneyDemand does not expose a public requester projection.
// - No public Journey Demand read model is reconstructed here.
//
// Runtime safety:
// - HTTP date values are normalized defensively at the presentation boundary.
// - ISO date strings are supported even when the read model is Date-based.
// - Invalid dates are never passed to Intl.DateTimeFormat.
// - Invalid/missing schedule values fall back to presentation-safe labels.
// - The frontend does not attempt to repair backend date semantics.
//
// Owner navigation:
// - This is an authenticated owner's Journey Demand.
// - The primary card action is therefore `Manage Demand`, not `View Demand`.
// - The parent/container owns navigation through `onManage`.
// - The card does not construct or own the management route.
//
// -----------------------------------------------------------------------------

"use client";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Settings2,
  UsersRound,
} from "lucide-react";

import { Card } from "@/components/ui";
import { cn } from "@/foundation/utils/cn";

import type { MyJourneyDemand } from "@/features/journey-demand/models";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MyJourneyDemandCardProps {
  readonly demand: MyJourneyDemand;
  readonly onManage?: (demand: MyJourneyDemand) => void;
  readonly className?: string;
  readonly emphasis?: "compact" | "default";
}

// -----------------------------------------------------------------------------
// Runtime date normalization
// -----------------------------------------------------------------------------
//
// Although the frontend model declares backend timestamps as Date, JSON
// responses arrive over HTTP without a native Date type.
//
// This helper protects the presentation boundary from:
// - ISO strings;
// - numeric timestamps;
// - invalid Date instances;
// - invalid date strings.
//
// It deliberately does not "repair" invalid backend data.
// -----------------------------------------------------------------------------

type RuntimeDateValue =
  | Date
  | string
  | number
  | undefined;

function toValidDate(
  value: RuntimeDateValue,
): Date | undefined {
  if (value === undefined) {
    return undefined;
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  const timestamp = date.getTime();

  if (!Number.isFinite(timestamp)) {
    return undefined;
  }

  return date;
}

// -----------------------------------------------------------------------------
// Date formatting
// -----------------------------------------------------------------------------

function formatDate(
  value: RuntimeDateValue,
): string {
  const date = toValidDate(value);

  if (date === undefined) {
    return "Date not set";
  }

  try {
    return new Intl.DateTimeFormat("en-KE", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(date);
  } catch {
    return "Date not set";
  }
}

function formatTime(
  value: RuntimeDateValue,
  timezone: string,
): string {
  const date = toValidDate(value);

  if (date === undefined) {
    return "Time not set";
  }

  try {
    return new Intl.DateTimeFormat("en-KE", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone,
    }).format(date);
  } catch {
    try {
      return new Intl.DateTimeFormat("en-KE", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch {
      return "Time not set";
    }
  }
}

// -----------------------------------------------------------------------------
// Status helpers
// -----------------------------------------------------------------------------

function formatStatus(
  status: MyJourneyDemand["status"],
): string {
  switch (status) {
    case "DRAFT":
      return "Draft";

    case "OPEN":
      return "Open";

    case "MATCHED":
      return "Matched";

    case "CONVERTED":
      return "Converted";

    case "FULFILLED":
      return "Fulfilled";

    case "CANCELLED":
      return "Cancelled";

    case "EXPIRED":
      return "Expired";

    default:
      return status;
  }
}

// -----------------------------------------------------------------------------
// Pricing helpers
// -----------------------------------------------------------------------------

function formatPrice(
  pricing: MyJourneyDemand["pricing"],
): string {
  if (
    pricing === undefined ||
    pricing.isUnconstrained
  ) {
    return "Flexible";
  }

  if (
    pricing.preferredPricePerSeat !== undefined
  ) {
    return `${pricing.currency} ${pricing.preferredPricePerSeat.toLocaleString(
      "en-KE",
    )}`;
  }

  if (
    pricing.maximumPricePerSeat !== undefined
  ) {
    return `Up to ${pricing.currency} ${pricing.maximumPricePerSeat.toLocaleString(
      "en-KE",
    )}`;
  }

  return "Flexible";
}

// -----------------------------------------------------------------------------
// Visual primitives
// -----------------------------------------------------------------------------

function DemandIcon({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        "size-[clamp(1.35rem,2vw,1.75rem)]",
        "rounded-full",
        "bg-[var(--background-subtle)]",
        "text-[var(--foreground-secondary)]",
      )}
    >
      {children}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  readonly status: MyJourneyDemand["status"];
}) {
  const isPositive =
    status === "OPEN" ||
    status === "MATCHED" ||
    status === "FULFILLED";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1",
        "rounded-full",
        "border border-[var(--border-subtle)]",
        "px-[clamp(0.4rem,0.7vw,0.6rem)]",
        "py-[clamp(0.2rem,0.35vw,0.3rem)]",
        "text-[clamp(0.46rem,0.62vw,0.56rem)]",
        "font-semibold uppercase tracking-[0.07em]",
        isPositive
          ? "bg-[var(--success-soft)] text-[var(--success)]"
          : "bg-[var(--background-subtle)] text-[var(--foreground-secondary)]",
      )}
    >
      {isPositive ? (
        <CheckCircle2
          className="size-[clamp(0.55rem,0.75vw,0.7rem)]"
          aria-hidden="true"
        />
      ) : null}

      {formatStatus(status)}
    </span>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MyJourneyDemandCard({
  demand,
  onManage,
  className,
  emphasis = "compact",
}: MyJourneyDemandCardProps) {
  const isCompact = emphasis === "compact";

  const corridor = demand.corridor;
  const schedule = demand.schedule;
  const capacity = demand.capacity;
  const pricing = demand.pricing;

  // ---------------------------------------------------------------------------
  // Corridor
  // ---------------------------------------------------------------------------

  const originName =
    corridor?.originName ?? "Origin not set";

  const destinationName =
    corridor?.destinationName ??
    "Destination not set";

  const waypointCount =
    corridor?.waypoints.length ?? 0;

  // ---------------------------------------------------------------------------
  // Schedule
  // ---------------------------------------------------------------------------

  const earliestDeparture =
    schedule?.scheduleWindow.earliestDeparture;

  const latestDeparture =
    schedule?.scheduleWindow.latestDeparture;

  const validEarliestDeparture =
    toValidDate(earliestDeparture);

  const validLatestDeparture =
    toValidDate(latestDeparture);

  const hasExactDeparture =
    schedule?.isExactDepartureTime === true &&
    validEarliestDeparture !== undefined;

  const hasDepartureWindow =
    schedule?.hasDepartureWindow === true &&
    validEarliestDeparture !== undefined &&
    validLatestDeparture !== undefined;

  const timezone =
    schedule?.timezone || "Africa/Nairobi";

  const departureLabel =
    formatDate(validEarliestDeparture);

  const departureTimeLabel =
    hasExactDeparture
      ? formatTime(
          validEarliestDeparture,
          timezone,
        )
      : hasDepartureWindow
        ? `${formatTime(
            validEarliestDeparture,
            timezone,
          )} – ${formatTime(
            validLatestDeparture,
            timezone,
          )}`
        : "Departure not set";

  // ---------------------------------------------------------------------------
  // Capacity
  // ---------------------------------------------------------------------------

  const requestedSeats =
    capacity?.requestedSeats ?? 0;

  const matchedSeats =
    capacity?.matchedSeats ?? 0;

  const remainingSeats =
    capacity?.remainingSeats ?? requestedSeats;

  // ---------------------------------------------------------------------------
  // Pricing
  // ---------------------------------------------------------------------------

  const priceLabel = formatPrice(pricing);

  return (
    <Card
      className={cn(
        "overflow-hidden",
        "rounded-[clamp(0.75rem,1.2vw,1rem)]",
        "border border-[var(--border-subtle)]",
        "bg-[var(--background)]",
        "shadow-sm",
        "transition-all duration-200",
        "hover:-translate-y-px hover:shadow-md",
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Main card body                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "grid",
          "grid-cols-[108px_21%_minmax(220px,1.2fr)_18%_155px]",
          "divide-x divide-[var(--border-subtle)]",
          "px-3 lg:px-4",
          isCompact ? "py-3" : "py-5",
        )}
      >
        {/* --------------------------------------------------------------- */}
        {/* Schedule                                                        */}
        {/* --------------------------------------------------------------- */}

        <section
          className={cn(
            "flex min-w-0 flex-col justify-center",
            "pr-[clamp(0.65rem,1.2vw,1rem)]",
          )}
        >
          <div
            className={cn(
              "mb-[clamp(0.3rem,0.55vw,0.45rem)]",
              "flex items-center gap-1.5",
              "text-[clamp(0.48rem,0.68vw,0.58rem)]",
              "font-semibold uppercase tracking-[0.08em]",
              "text-[var(--foreground-muted)]",
            )}
          >
            <CalendarDays
              className="size-[clamp(0.65rem,0.85vw,0.8rem)]"
              aria-hidden="true"
            />

            <span>Departure</span>
          </div>

          <div
            className={cn(
              "truncate",
              "text-[clamp(0.72rem,1vw,0.9rem)]",
              "font-bold",
              "text-[var(--foreground)]",
            )}
          >
            {departureLabel}
          </div>

          <div
            className={cn(
              "mt-0.5 truncate",
              "text-[clamp(0.56rem,0.78vw,0.68rem)]",
              "font-medium",
              "text-[var(--foreground-secondary)]",
            )}
          >
            {departureTimeLabel}
          </div>

          {schedule?.hasArrivalConstraint ? (
            <div
              className={cn(
                "mt-1 truncate",
                "text-[clamp(0.45rem,0.62vw,0.55rem)]",
                "text-[var(--foreground-muted)]",
              )}
            >
              Arrival constraint
            </div>
          ) : null}
        </section>

        {/* --------------------------------------------------------------- */}
        {/* Authenticated demand status                                     */}
        {/* --------------------------------------------------------------- */}

        <section
          className={cn(
            "flex min-w-0 flex-col justify-center",
            "px-[clamp(0.7rem,1.25vw,1rem)]",
          )}
        >
          <div
            className={cn(
              "mb-[clamp(0.4rem,0.7vw,0.55rem)]",
              "flex items-center gap-1.5",
              "text-[clamp(0.46rem,0.62vw,0.55rem)]",
              "font-semibold uppercase tracking-[0.08em]",
              "text-[var(--foreground-muted)]",
            )}
          >
            <DemandIcon>
              <UsersRound
                className="size-[clamp(0.65rem,0.8vw,0.75rem)]"
                aria-hidden="true"
              />
            </DemandIcon>

            <span>Your demand</span>
          </div>

          <div className="min-w-0">
            <div
              className={cn(
                "truncate",
                "text-[clamp(0.72rem,1vw,0.9rem)]",
                "font-bold",
                "text-[var(--foreground)]",
              )}
            >
              {demand.isDraft
                ? "Unpublished"
                : "My Journey Demand"}
            </div>

            <div className="mt-1 flex min-w-0 items-center gap-1.5">
              <StatusBadge status={demand.status} />
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------------- */}
        {/* Corridor — primary visual anchor                                */}
        {/* --------------------------------------------------------------- */}

        <section
          className={cn(
            "flex min-w-0 flex-col justify-center",
            "bg-[var(--background-brand)]",
            "px-[clamp(0.8rem,1.6vw,1.35rem)]",
            "text-center",
          )}
        >
          <div
            className={cn(
              "mb-[clamp(0.35rem,0.6vw,0.5rem)]",
              "text-[clamp(0.42rem,0.62vw,0.55rem)]",
              "font-semibold uppercase tracking-[0.08em]",
              "text-[var(--brand)]",
            )}
          >
            Requested route
          </div>

          <div
            className={cn(
              "flex min-w-0 items-center justify-center",
              "gap-[clamp(0.35rem,0.7vw,0.65rem)]",
            )}
          >
            <MapPin
              className={cn(
                "size-[clamp(0.75rem,1vw,0.95rem)]",
                "shrink-0",
                "text-[var(--brand)]",
              )}
              aria-hidden="true"
            />

            <span
              className={cn(
                "min-w-0 truncate",
                "text-[clamp(0.72rem,1.1vw,1rem)]",
                "font-bold",
                "text-[var(--foreground)]",
              )}
              title={originName}
            >
              {originName}
            </span>

            <ArrowRight
              className={cn(
                "size-[clamp(0.7rem,0.95vw,0.9rem)]",
                "shrink-0",
                "text-[var(--brand)]",
              )}
              aria-hidden="true"
            />

            <MapPin
              className={cn(
                "size-[clamp(0.75rem,1vw,0.95rem)]",
                "shrink-0",
                "text-[var(--foreground-secondary)]",
              )}
              aria-hidden="true"
            />

            <span
              className={cn(
                "min-w-0 truncate",
                "text-[clamp(0.72rem,1.1vw,1rem)]",
                "font-bold",
                "text-[var(--foreground)]",
              )}
              title={destinationName}
            >
              {destinationName}
            </span>
          </div>

          <div
            className={cn(
              "mt-[clamp(0.35rem,0.6vw,0.5rem)]",
              "flex items-center justify-center gap-1",
              "text-[clamp(0.45rem,0.62vw,0.55rem)]",
              "text-[var(--foreground-muted)]",
            )}
          >
            <MapPin
              className="size-[clamp(0.55rem,0.7vw,0.65rem)]"
              aria-hidden="true"
            />

            <span>
              {waypointCount > 0
                ? `${waypointCount} waypoint${
                    waypointCount === 1 ? "" : "s"
                  }`
                : "Direct corridor"}
            </span>
          </div>
        </section>

        {/* --------------------------------------------------------------- */}
        {/* Capacity / demand signal                                        */}
        {/* --------------------------------------------------------------- */}

        <section
          className={cn(
            "flex min-w-0 flex-col justify-center",
            "px-[clamp(0.7rem,1.25vw,1rem)]",
          )}
        >
          <div
            className={cn(
              "mb-[clamp(0.35rem,0.6vw,0.5rem)]",
              "flex items-center gap-1.5",
              "text-[clamp(0.46rem,0.62vw,0.55rem)]",
              "font-semibold uppercase tracking-[0.08em]",
              "text-[var(--foreground-muted)]",
            )}
          >
            <UsersRound
              className="size-[clamp(0.65rem,0.85vw,0.8rem)]"
              aria-hidden="true"
            />

            <span>Seats requested</span>
          </div>

          <div
            className={cn(
              "flex items-baseline gap-1.5",
              "text-[clamp(0.95rem,1.45vw,1.25rem)]",
              "font-bold",
              "text-[var(--foreground)]",
            )}
          >
            <span>{requestedSeats}</span>

            <span
              className={cn(
                "text-[clamp(0.52rem,0.72vw,0.64rem)]",
                "font-medium",
                "text-[var(--foreground-muted)]",
              )}
            >
              {requestedSeats === 1
                ? "seat"
                : "seats"}
            </span>
          </div>

          <div
            className={cn(
              "mt-1",
              "text-[clamp(0.46rem,0.65vw,0.56rem)]",
              "text-[var(--foreground-secondary)]",
            )}
          >
            {matchedSeats > 0
              ? `${matchedSeats} matched · ${remainingSeats} remaining`
              : "No seats matched yet"}
          </div>
        </section>

        {/* --------------------------------------------------------------- */}
        {/* Pricing                                                         */}
        {/* --------------------------------------------------------------- */}

        <section
          className={cn(
            "flex min-w-0 flex-col justify-center",
            "pl-[clamp(0.7rem,1.25vw,1rem)]",
          )}
        >
          <div
            className={cn(
              "mb-[clamp(0.35rem,0.6vw,0.5rem)]",
              "text-[clamp(0.46rem,0.62vw,0.55rem)]",
              "font-semibold uppercase tracking-[0.08em]",
              "text-[var(--foreground-muted)]",
            )}
          >
            Price preference
          </div>

          <div
            className={cn(
              "truncate",
              "text-[clamp(0.8rem,1.15vw,1rem)]",
              "font-bold",
              "text-[var(--foreground)]",
            )}
            title={priceLabel}
          >
            {priceLabel}
          </div>

          <div
            className={cn(
              "mt-1 truncate",
              "text-[clamp(0.46rem,0.65vw,0.56rem)]",
              "text-[var(--foreground-secondary)]",
            )}
          >
            per seat
          </div>
        </section>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Footer                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "flex min-w-0 items-center justify-between",
          "gap-[clamp(0.6rem,1.2vw,1rem)]",
          "border-t border-[var(--border-subtle)]",
          "bg-[var(--background-subtle)]",
          "px-[clamp(0.7rem,1.45vw,1.2rem)]",
          "py-[clamp(0.45rem,0.9vw,0.7rem)]",
        )}
      >
        {/* Route context -------------------------------------------------- */}

        <div
          className={cn(
            "flex min-w-0 items-center",
            "gap-[clamp(0.45rem,0.9vw,0.75rem)]",
            "text-[clamp(0.52rem,0.72vw,0.64rem)]",
            "font-medium",
            "text-[var(--foreground-secondary)]",
          )}
        >
          <MapPin
            className="size-[clamp(0.65rem,0.85vw,0.8rem)] shrink-0 text-[var(--brand)]"
            aria-hidden="true"
          />

          <span
            className="min-w-0 truncate"
            title={originName}
          >
            {originName}
          </span>

          <ArrowRight
            className="size-[clamp(0.65rem,0.85vw,0.8rem)] shrink-0 text-[var(--foreground-muted)]"
            aria-hidden="true"
          />

          <MapPin
            className="size-[clamp(0.65rem,0.85vw,0.8rem)] shrink-0 text-[var(--foreground-secondary)]"
            aria-hidden="true"
          />

          <span
            className="min-w-0 truncate"
            title={destinationName}
          >
            {destinationName}
          </span>
        </div>

        {/* Authenticated management action ------------------------------- */}

        <button
          type="button"
          onClick={() => onManage?.(demand)}
          disabled={onManage === undefined}
          aria-label={`Manage Journey Demand from ${originName} to ${destinationName}`}
          className={cn(
            "inline-flex shrink-0 items-center justify-center gap-1.5",
            "rounded-[clamp(0.45rem,0.7vw,0.6rem)]",
            "border border-[var(--border-subtle)]",
            "bg-[var(--background)]",
            "px-[clamp(0.6rem,1vw,0.85rem)]",
            "py-[clamp(0.35rem,0.6vw,0.5rem)]",
            "text-[clamp(0.5rem,0.68vw,0.6rem)]",
            "font-semibold",
            "text-[var(--foreground)]",
            "transition-colors",
            "hover:bg-[var(--background-brand)]",
            "focus-visible:outline-2",
            "focus-visible:outline-[var(--brand)]",
            "focus-visible:outline-offset-2",
            "disabled:cursor-default disabled:opacity-50",
          )}
        >
          <Settings2
            className="size-[clamp(0.65rem,0.85vw,0.8rem)]"
            aria-hidden="true"
          />

          <span>Manage Demand</span>
        </button>
      </div>
    </Card>
  );
}
