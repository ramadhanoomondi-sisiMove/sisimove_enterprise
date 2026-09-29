// -----------------------------------------------------------------------------
// Path: src/features/journey-demand/components/JourneyDemandCard.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Public Journey Demand Marketplace Card
//
// Visual direction:
// - Premium, bright, distinctive marketplace surface.
// - One horizontal composition at every viewport size.
// - Card behaves as one proportional visual object.
// - Route is the primary visual anchor and is centered within its zone.
// - Requester handle is prominent and presented as @handle.
// - From and To use distinct visual colors.
// - Requested seats remain an immediate demand signal.
// - Price preference is the commercial anchor.
// - Actions remain visible in a dedicated footer.
// - Footer repeats the route as action context.
// - Typography, icons, spacing and controls scale together.
// - No mobile-only stacking or structural reconstruction.
// - No vehicle presentation.
//
// Unlike JourneyCard:
// - no vehicle;
// - no vehicle asset;
// - no vehicle presentation;
// - no vehicle-related marketplace information.
//
// Responsibilities:
// - present one PublicJourneyDemand marketplace projection;
// - compose shared public Journey Demand presentation components;
// - expose View, Share, and Join actions;
// - preserve the backend PublicJourneyDemand as the source of truth.
//
// Non-responsibilities:
// - no data fetching;
// - no mutation handling;
// - no authorization decisions;
// - no filtering;
// - no sorting;
// - no collection ownership;
// - no lifecycle reconstruction;
// - no route construction.
//
// -----------------------------------------------------------------------------
//
// Component hierarchy:
//
//   JourneyDemandMarketplace
//            ↓
//   JourneyDemandList
//            ↓
//   JourneyDemandCard
//            ↓
//   Journey Demand shared presentation components
//            ↓
//   JourneyDemandActions
//
// -----------------------------------------------------------------------------

"use client";

import { Card } from "@/components/ui";

import type {
  PublicJourneyDemand,
} from "@/features/journey-demand/models";

import { cn } from "@/foundation";

import {
  JourneyDemandActions,
  JourneyDemandDate,
  JourneyDemandDemandSummary,
  JourneyDemandRequesterSummary,
  JourneyDemandRoute,
  JourneyDemandScheduleSummary,
  JourneyDemandStatusBadge,
} from "../shared";

import { JourneyDemandPricingSummary } from "../pricing";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandCardProps {
  /**
   * Public Journey Demand projection supplied by the marketplace query.
   */
  readonly demand: PublicJourneyDemand;

  /**
   * Controls information density.
   *
   * Compact is the dense public marketplace presentation.
   * Default provides the more spacious presentation.
   */
  readonly emphasis?: "compact" | "default";

  /**
   * Optional additional classes.
   */
  readonly className?: string;

  /**
   * Opens the public Journey Demand detail surface.
   */
  readonly onView: () => void;

  /**
   * Shares the Journey Demand.
   */
  readonly onShare: () => void;

  /**
   * Joins the Journey Demand.
   */
  readonly onJoin: () => void;

  /**
   * Whether the Join Demand mutation is processing.
   */
  readonly isJoining?: boolean;

  /**
   * Allows the parent to disable the View action.
   */
  readonly viewDisabled?: boolean;

  /**
   * Allows the parent to disable the Share action.
   */
  readonly shareDisabled?: boolean;

  /**
   * Allows the parent to disable the Join action.
   */
  readonly joinDisabled?: boolean;

  /**
   * Optional action labels.
   */
  readonly viewLabel?: string;
  readonly shareLabel?: string;
  readonly joinLabel?: string;
  readonly joiningLabel?: string;
}

// -----------------------------------------------------------------------------
// Small local icon
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
    | "seats"
    | "eye"
    | "share"
    | "join";
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

    case "eye":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className={common}
          strokeWidth="2"
        >
          <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );

    case "share":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className={common}
          strokeWidth="2"
        >
          <circle cx="18" cy="5" r="2.5" />
          <circle cx="6" cy="12" r="2.5" />
          <circle cx="18" cy="19" r="2.5" />
          <path d="m8.2 10.9 7.6-4.7M8.2 13.1l7.6 4.7" />
        </svg>
      );

    case "join":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className={common}
          strokeWidth="2"
        >
          <circle cx="9" cy="8" r="3" />
          <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
          <path d="M17 8v6M14 11h6" />
        </svg>
      );
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandCard({
  demand,
  emphasis = "compact",
  className,
  onView,
  onShare,
  onJoin,
  isJoining = false,
  viewDisabled = false,
  shareDisabled = false,
  joinDisabled = false,
  viewLabel = "View",
  shareLabel = "Share",
  joinLabel = "Join Demand",
  joiningLabel = "Joining…",
}: JourneyDemandCardProps) {
  const isCompact = emphasis === "compact";

  const waypointCount = demand.route.waypoints.length;

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
          "Journey demand",
          "from",
          demand.route.origin.name,
          "to",
          demand.route.destination.name,
        ].join(" ")}
      >
        {/* -----------------------------------------------------------------
            Main marketplace row

            Stable proportional zones:

              Date | Requester | Centered Route | Demand | Price
            ----------------------------------------------------------------- */}

        <div
          className={cn(
            "grid",
            "w-full",
            "min-w-0",
            "grid-cols-[108px_21%_minmax(220px,1.2fr)_18%_155px]",
            "divide-x",
            "divide-[var(--border-subtle)]",
          )}
        >
          {/* ---------------------------------------------------------------
              Date / requested departure
              --------------------------------------------------------------- */}

          <div
            className={cn(
              "flex",
              "min-w-0",
              "flex-col",
              "justify-center",
              "px-3",
              "py-3",
              "lg:px-4",
              isCompact ? "lg:py-3" : "lg:py-5",
            )}
          >
            <JourneyDemandDate
              schedule={demand.schedule}
              emphasis={emphasis}
            />

            <div
              className={cn(
                "mt-2",
                "flex",
                "min-w-0",
                "items-center",
                "gap-1",
                "overflow-hidden",
                "text-xs",
                "font-medium",
                "text-[var(--foreground-muted)]",
              )}
            >
              <MarketplaceIcon
                type="clock"
                className="size-3.5 text-[var(--brand)]"
              />

              <JourneyDemandScheduleSummary
                schedule={demand.schedule}
                emphasis="compact"
              />
            </div>
          </div>

          {/* ---------------------------------------------------------------
              Requester

              JourneyDemandRequesterSummary already renders the @handle.
              Keep the handle in exactly one place to avoid duplication.
              --------------------------------------------------------------- */}

          <div
            className={cn(
              "flex",
              "min-w-0",
              "items-center",
              "px-3",
              "py-3",
              "lg:px-4",
              isCompact ? "lg:py-3" : "lg:py-5",
            )}
          >
            <div className="w-full min-w-0">
              <JourneyDemandRequesterSummary
                requester={demand.requester}
                emphasis="compact"
              />

              <div className="mt-1.5">
                <JourneyDemandStatusBadge
                  status={demand.status}
                />
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              Centered route
              --------------------------------------------------------------- */}

          <div
            className={cn(
              "flex",
              "min-w-0",
              "items-center",
              "justify-center",
              "bg-[var(--background-brand)]",
              "px-3",
              "py-3",
              "text-center",
              "lg:px-4",
              isCompact ? "lg:py-3" : "lg:py-5",
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
                  "text-[var(--brand)]",
                )}
              >
                Requested route
              </div>

              <div className="flex min-w-0 justify-center">
                <div className="min-w-0 max-w-full">
                  <JourneyDemandRoute
                    route={demand.route}
                    emphasis={emphasis}
                  />
                </div>
              </div>

              {waypointCount > 0 && (
                <p
                  className={cn(
                    "mt-1.5",
                    "text-[0.65rem]",
                    "font-medium",
                    "text-[var(--foreground-muted)]",
                  )}
                >
                  + {waypointCount}{" "}
                  {waypointCount === 1
                    ? "waypoint"
                    : "waypoints"}
                </p>
              )}
            </div>
          </div>

          {/* ---------------------------------------------------------------
              Demand / requested seats
              --------------------------------------------------------------- */}

          <div
            className={cn(
              "flex",
              "min-w-0",
              "items-center",
              "px-3",
              "py-3",
              "lg:px-4",
              isCompact ? "lg:py-3" : "lg:py-5",
            )}
          >
            <div className="w-full min-w-0">
              <JourneyDemandDemandSummary
                capacity={demand.capacity}
                demand={demand.demand}
                emphasis="compact"
              />

              <div className="mt-2 flex min-w-0 items-center gap-1 text-xs font-semibold text-[var(--success)]">
                <MarketplaceIcon
                  type="seats"
                  className="size-3.5"
                />

                <span className="truncate">
                  Seats requested
                </span>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              Price preference
              --------------------------------------------------------------- */}

          <div
            className={cn(
              "flex",
              "min-w-0",
              "flex-col",
              "items-start",
              "justify-center",
              "px-3",
              "py-3",
              "lg:items-end",
              "lg:px-4",
              isCompact ? "lg:py-3" : "lg:py-5",
            )}
          >
            <div className="min-w-0 max-w-full text-right">
              <JourneyDemandPricingSummary
                pricing={demand.pricing}
                emphasis="compact"
              />
            </div>

            <div className="mt-1.5">
              <JourneyDemandStatusBadge
                status={demand.status}
              />
            </div>
          </div>
        </div>

        {/* -----------------------------------------------------------------
            Footer
            ----------------------------------------------------------------- */}

        <footer
          className={cn(
            "flex",
            "min-w-0",
            "items-center",
            "justify-between",
            "gap-[clamp(0.6rem,1.2vw,1rem)]",
            "border-t",
            "border-[var(--border)]",
            "bg-[var(--background-subtle)]",
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
                className="size-[clamp(0.45rem,0.7vw,0.62rem)] text-[var(--brand)]"
              />

              <span
                className="min-w-0 truncate text-[var(--brand)]"
                title={demand.route.origin.name}
              >
                {demand.route.origin.name}
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
                className="min-w-0 truncate text-[var(--danger)]"
                title={demand.route.destination.name}
              >
                {demand.route.destination.name}
              </span>
            </div>
          </div>

          <div className="min-w-0 shrink-0">
            <JourneyDemandActions
              onView={onView}
              onShare={onShare}
              onJoin={onJoin}
              isJoining={isJoining}
              viewDisabled={viewDisabled}
              shareDisabled={shareDisabled}
              joinDisabled={joinDisabled}
              viewLabel={viewLabel}
              shareLabel={shareLabel}
              joinLabel={joinLabel}
              joiningLabel={joiningLabel}
              emphasis="compact"
              viewLeadingContent={
                <MarketplaceIcon
                  type="eye"
                  className="size-4"
                />
              }
              shareLeadingContent={
                <MarketplaceIcon
                  type="share"
                  className="size-4"
                />
              }
              joinLeadingContent={
                <MarketplaceIcon
                  type="join"
                  className="size-4"
                />
              }
              className="w-full sm:w-auto"
            />
          </div>
        </footer>
      </article>
    </Card>
  );
}