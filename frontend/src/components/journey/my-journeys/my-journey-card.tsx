// -----------------------------------------------------------------------------
// sisiMove — My Journey Card
// -----------------------------------------------------------------------------
//
// Authenticated presentation of one owner's Journey.
//
// Responsibilities:
// - present one authoritative MyJourney projection;
// - present the Journey lifecycle status;
// - present available Journey component summaries;
// - safely handle progressively assembled Draft Journeys;
// - provide navigation to authenticated Journey management.
//
// Non-responsibilities:
// - no Journey fetching;
// - no Journey mutations;
// - no lifecycle transition logic;
// - no Journey editing;
// - no capability inference;
// - no recreation of Journey domain behavior.
//
// Shared Journey components remain responsible for Journey-specific
// presentation. This component only composes those read-only projections into
// the authenticated My Journeys collection card.
//
// -----------------------------------------------------------------------------

import Link from "next/link";

import { Card } from "@/components/ui";
import { AUTHENTICATED_ROUTES } from "@/foundation/routing";

import {
  JourneyCapacitySummary,
  JourneyPreferencesSummary,
  JourneyPrice,
  JourneyRoute,
  JourneyScheduleSummary,
  JourneyStatusBadge,
  JourneyVehicleSummary,
} from "@/components/journey/shared";

import type { MyJourney } from "@/features/journey/models/my-journey";

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
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MyJourneyCard({
  journey,
  className,
}: MyJourneyCardProps) {
  return (
    <Card
      className={[
        "overflow-hidden",
        className ?? "",
      ].join(" ")}
    >
      <div className="space-y-5 p-5">
        {/* ----------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-[var(--foreground-muted)]">
              My Journey
            </p>

            <p className="mt-1 truncate text-sm text-[var(--foreground-secondary)]">
              {journey.route
                ? `${journey.route.origin.name} → ${journey.route.destination.name}`
                : "Journey details not yet completed"}
            </p>
          </div>

          <JourneyStatusBadge status={journey.status} />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Route                                                             */}
        {/* ----------------------------------------------------------------- */}

        {journey.route && (
          <JourneyRoute route={journey.route} />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Schedule                                                          */}
        {/* ----------------------------------------------------------------- */}

        {journey.schedule && (
          <JourneyScheduleSummary schedule={journey.schedule} />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Vehicle                                                           */}
        {/* ----------------------------------------------------------------- */}

        {journey.vehicle && (
          <JourneyVehicleSummary vehicle={journey.vehicle} />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Capacity                                                          */}
        {/* ----------------------------------------------------------------- */}

        {journey.capacity && (
          <JourneyCapacitySummary capacity={journey.capacity} />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Pricing                                                           */}
        {/* ----------------------------------------------------------------- */}

        {journey.pricing && (
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-[var(--foreground-muted)]">
              Travel contribution
            </span>

            <JourneyPrice pricing={journey.pricing} />
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Preferences                                                       */}
        {/* ----------------------------------------------------------------- */}

        {journey.preferences && (
          <div className="border-t border-[var(--border-subtle)] pt-4">
            <p className="mb-3 text-xs font-medium text-[var(--foreground-muted)]">
              Preferences
            </p>

            <JourneyPreferencesSummary
              preferences={journey.preferences}
            />
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Management                                                        */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
          <p className="min-w-0 text-xs text-[var(--foreground-muted)]">
            {journey.status === "DRAFT"
              ? "Complete your Journey details before publishing."
              : "Manage your Journey"}
          </p>

          <Link
            href={AUTHENTICATED_ROUTES.MY_JOURNEY(journey.publicId)}
            className={[
              "inline-flex",
              "shrink-0",
              "items-center",
              "justify-center",
              "rounded-[var(--radius-md)]",
              "border",
              "border-[var(--border)]",
              "bg-[var(--surface)]",
              "px-3",
              "py-2",
              "text-sm",
              "font-medium",
              "text-[var(--foreground)]",
              "transition-colors",
              "hover:border-[var(--brand)]",
              "hover:bg-[var(--surface-brand)]",
              "hover:text-[var(--brand)]",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-[var(--brand)]",
            ].join(" ")}
          >
            Manage
          </Link>
        </div>
      </div>
    </Card>
  );
}

