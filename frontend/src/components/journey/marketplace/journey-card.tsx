// -----------------------------------------------------------------------------
// sisiMove — Public Journey Card
// -----------------------------------------------------------------------------
//
// Presents one public Journey marketplace projection.
//
// Responsibilities:
// - present one PublicJourney projection;
// - compose shared Journey presentation components;
// - expose optional View Journey and Book Journey actions;
// - provide a compact, responsive marketplace card.
//
// Non-responsibilities:
// - no data fetching;
// - no mutation handling;
// - no authorization decisions;
// - no filtering;
// - no sorting;
// - no collection ownership;
// - no lifecycle reconstruction;
// - no route construction;
// - no import of JourneyList;
// - no import of JourneyMarketplace.
//
// Component hierarchy:
//
//   JourneyMarketplace
//          ↓
//   JourneyList
//          ↓
//   JourneyCard
//          ↓
//   JourneyActions
//
// This component is intentionally a leaf presentation component.
//
// Public model boundary:
//
//   PublicJourney
//     ├── provider
//     ├── route
//     ├── schedule
//     ├── vehicle
//     ├── capacity
//     ├── pricing
//     ├── preferences
//     └── assets
//
// All Journey facts come directly from the backend-provided public projection.
// The card does not reconstruct Journey domain state.
//
// -----------------------------------------------------------------------------

"use client";

import Image from "next/image";

import { Card } from "@/components/ui";

import type { PublicJourney } from "@/features/journey/models";

import { cn } from "@/foundation";

import {
  JourneyActions,
  JourneyCapacitySummary,
  JourneyDate,
  JourneyPrice,
  JourneyRoute,
  JourneyScheduleSummary,
  JourneyVehicleAsset,
  JourneyVehicleSummary,
} from "../shared";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCardProps {
  /**
   * Public Journey projection supplied by the marketplace query.
   */
  readonly journey: PublicJourney;

  /**
   * Controls information density.
   *
   * Compact is appropriate for dense marketplace results.
   * Default provides slightly stronger visual hierarchy.
   */
  readonly emphasis?: "compact" | "default";

  /**
   * Optional additional classes.
   */
  readonly className?: string;

  /**
   * Opens the public Journey detail surface.
   *
   * Navigation remains owned by the parent.
   */
  readonly onView?: () => void;

  /**
   * Books the Journey.
   *
   * The parent owns authorization, verification requirements, mutation
   * handling, and capability checks.
   */
  readonly onBook?: () => void;

  /**
   * Whether the Book Journey mutation is processing.
   */
  readonly isBooking?: boolean;

  /**
   * Allows the parent to disable the View action.
   */
  readonly viewDisabled?: boolean;

  /**
   * Allows the parent to disable the Book action.
   */
  readonly bookDisabled?: boolean;

  /**
   * Optional action labels.
   */
  readonly viewLabel?: string;
  readonly bookLabel?: string;
  readonly bookingLabel?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCard({
  journey,
  emphasis = "default",
  className,
  onView,
  onBook,
  isBooking = false,
  viewDisabled = false,
  bookDisabled = false,
  viewLabel = "View Journey",
  bookLabel = "Book Journey",
  bookingLabel = "Booking…",
}: JourneyCardProps) {
  const isCompact = emphasis === "compact";
  const waypointCount = journey.route.waypoints.length;

  /**
   * Journey assets contain opaque Asset references rather than renderable
   * URLs. The shared JourneyVehicleAsset component therefore presents its
   * attached-asset state unless a resolved PublicAsset is supplied by a
   * higher-level composition.
   */
  const vehicleAsset = journey.assets.find(
    (asset) => asset.type === "VEHICLE",
  );

  /**
   * PublicTraveller.avatar is a public avatar projection rather than a raw
   * URL string. The renderable URL belongs to that projection.
   *
   * The card does not construct, transform, or resolve the URL itself.
   */
  const travellerAvatar = journey.provider.traveller.avatar;

  return (
    <Card
      className={cn(
        "w-full",
        "overflow-hidden",
        "transition-shadow",
        "duration-200",
        "hover:shadow-[var(--shadow-md)]",
        className,
      )}
      padding={isCompact ? "sm" : "md"}
    >
      <article
        className={cn(
          "min-w-0",
          isCompact ? "space-y-3" : "space-y-4",
        )}
        aria-label={[
          "Journey",
          "from",
          journey.route.origin.name,
          "to",
          journey.route.destination.name,
        ].join(" ")}
      >
        {/* -------------------------------------------------------------------
            Header
            ------------------------------------------------------------------ */}

        <header
          className={cn(
            "flex",
            "min-w-0",
            "items-start",
            "justify-between",
            "gap-3",
          )}
        >
          <JourneyDate schedule={journey.schedule} />
        </header>

        {/* -------------------------------------------------------------------
            Provider
            -------------------------------------------------------------------

            Public identity and trust information are already composed into
            the Journey provider projection. The card deliberately does not
            reconstruct traveller identity or trust information.

            The avatar is rendered from the public traveller projection.
            No avatar URL is constructed by the Journey feature.
            ------------------------------------------------------------------ */}

        <div
          className={cn(
            "flex",
            "min-w-0",
            "items-center",
            "gap-3",
          )}
        >
          <div
            className={cn(
              "flex",
              "size-9",
              "shrink-0",
              "items-center",
              "justify-center",
              "overflow-hidden",
              "rounded-[var(--radius-full)]",
              "bg-[var(--brand-soft)]",
              "text-sm",
              "font-semibold",
              "text-[var(--brand)]",
            )}
          >
            {travellerAvatar ? (
              <Image
                src={travellerAvatar.url}
                alt=""
                width={36}
                height={36}
                className="size-full object-cover"
              />
            ) : (
              journey.provider.traveller.handle
                .slice(0, 1)
                .toUpperCase()
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[var(--foreground)]">
              @{journey.provider.traveller.handle}
            </p>

            <p className="text-xs text-[var(--foreground-muted)]">
              Journey provider
            </p>
          </div>
        </div>

        {/* -------------------------------------------------------------------
            Route
            ------------------------------------------------------------------ */}

        <div className="min-w-0">
          <JourneyRoute
            route={journey.route}
            showWaypoints={!isCompact}
          />

          {waypointCount > 0 && (
            <p
              className={cn(
                "mt-1.5",
                "text-[var(--foreground-muted)]",
                isCompact ? "text-xs" : "text-sm",
              )}
            >
              + {waypointCount}{" "}
              {waypointCount === 1 ? "waypoint" : "waypoints"}
            </p>
          )}
        </div>

        {/* -------------------------------------------------------------------
            Vehicle
            ------------------------------------------------------------------ */}

        <div
          className={cn(
            "flex",
            "min-w-0",
            "flex-col",
            "gap-3",
            "sm:flex-row",
            "sm:items-center",
            "sm:justify-between",
          )}
        >
          <JourneyVehicleSummary vehicle={journey.vehicle} />

          {vehicleAsset && (
            <JourneyVehicleAsset
              asset={vehicleAsset}
              className="sm:shrink-0"
            />
          )}
        </div>

        {/* -------------------------------------------------------------------
            Capacity
            -------------------------------------------------------------------

            Capacity values are displayed exactly as supplied by the public
            Journey projection. The card does not calculate availability.
            ------------------------------------------------------------------ */}

        <div className="min-w-0">
          <JourneyCapacitySummary
            capacity={journey.capacity}
            className={isCompact ? "text-sm" : undefined}
          />
        </div>

        {/* -------------------------------------------------------------------
            Schedule + pricing
            -------------------------------------------------------------------

            This row presents the primary marketplace decision information:
            when the Journey departs and what the supplied Journey price is.
            ------------------------------------------------------------------ */}

        <div
          className={cn(
            "flex",
            "min-w-0",
            "flex-col",
            "gap-3",
            "border-t",
            "border-[var(--border-subtle)]",
            "pt-3",
            "sm:flex-row",
            "sm:items-end",
            "sm:justify-between",
            "sm:gap-4",
          )}
        >
          <div className="min-w-0">
            <JourneyScheduleSummary schedule={journey.schedule} />
          </div>

          <div
            className={cn(
              "min-w-0",
              "sm:text-right",
            )}
          >
            <JourneyPrice pricing={journey.pricing} />
          </div>
        </div>

        {/* -------------------------------------------------------------------
            Actions
            -------------------------------------------------------------------

            JourneyActions is the shared Journey action presentation boundary.
            The card supplies callbacks and state; it does not implement
            navigation, authorization, verification, or booking behavior.
            ------------------------------------------------------------------ */}

        <JourneyActions
          onView={onView}
          onBook={onBook}
          isBooking={isBooking}
          viewDisabled={viewDisabled}
          bookDisabled={bookDisabled}
          emphasis={emphasis}
          viewLabel={viewLabel}
          bookLabel={bookLabel}
          bookingLabel={bookingLabel}
        />
      </article>
    </Card>
  );
}