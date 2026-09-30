// -----------------------------------------------------------------------------
// sisiMove — Journey Travel Window
// -----------------------------------------------------------------------------
//
// Presents the Journey's public travel schedule.
//
// Product role:
//
//     When does the Journey happen?
//              │
//              ▼
//     Clear departure timing
//              │
//              ▼
//     Confident booking decision
//
// Responsibilities:
// - present departure date and time;
// - present optional arrival time;
// - present the schedule timezone.
//
// Non-responsibilities:
// - no API calls;
// - no data fetching;
// - no navigation;
// - no booking logic;
// - no lifecycle logic;
// - no schedule mutation;
// - no duration calculation;
// - no timezone conversion;
// - no inference from missing arrival data.
//
// The backend schedule projection is authoritative. The component presents
// the supplied timestamps and timezone without changing their meaning.
//
// -----------------------------------------------------------------------------
//
// Public Journey detail:
//
//   JourneyDetail
//       │
//       ├── JourneyOverview
//       ├── JourneyTravelWindow
//       │     └── JourneySchedule
//       ├── JourneyCapacity
//       ├── JourneyPricing
//       ├── JourneyVehicle
//       ├── JourneyPreferences
//       ├── JourneyAssets
//       └── JourneyLifecycle
//
// -----------------------------------------------------------------------------

import { CalendarDays } from "lucide-react";

import { cn } from "@/foundation";

import type { JourneySchedule } from "@/features/journey/models";

import { JourneyScheduleSummary } from "../shared";

// =============================================================================
// Props
// =============================================================================

export interface JourneyTravelWindowProps {
  /**
   * Public Journey schedule projection.
   */
  readonly schedule: JourneySchedule;

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyTravelWindow({
  schedule,
  className,
}: JourneyTravelWindowProps) {
  return (
    <section
      className={cn(
        "w-full",
        "overflow-hidden",
        "rounded-[var(--radius-xl)]",
        "border",
        "border-[var(--border)]",
        "bg-[var(--surface)]",
        "shadow-[var(--shadow-sm)]",
        className,
      )}
      aria-labelledby="journey-travel-window-heading"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "border-b",
          "border-[var(--border-subtle)]",
          "bg-[var(--background-brand)]",
          "px-5",
          "py-5",
          "sm:px-6",
          "sm:py-6",
        )}
      >
        <div
          className={cn(
            "flex",
            "items-center",
            "gap-2",
            "text-xs",
            "font-bold",
            "uppercase",
            "tracking-[0.14em]",
            "text-[var(--brand)]",
          )}
        >
          <CalendarDays
            aria-hidden="true"
            className="size-3.5"
          />

          <span>Travel timing</span>
        </div>

        <h2
          id="journey-travel-window-heading"
          className={cn(
            "mt-1.5",
            "text-xl",
            "font-bold",
            "tracking-tight",
            "text-[var(--foreground)]",
            "sm:text-2xl",
          )}
        >
          Plan your Journey.
        </h2>

        <p
          className={cn(
            "mt-1",
            "max-w-2xl",
            "text-sm",
            "leading-5",
            "text-[var(--foreground-muted)]",
          )}
        >
          Check the departure date, travel times and timezone before booking.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Schedule presentation                                               */}
      {/* ------------------------------------------------------------------- */}

      <div className="p-4 sm:p-5">
        <div
          className={cn(
            "overflow-hidden",
            "rounded-[var(--radius-lg)]",
            "border",
            "border-[var(--border)]",
            "bg-[var(--background-subtle)]",
          )}
        >
          {/* ----------------------------------------------------------------- */}
          {/* Schedule intro                                                    */}
          {/* ----------------------------------------------------------------- */}

          <div
            className={cn(
              "flex",
              "items-start",
              "gap-3",
              "border-b",
              "border-[var(--border)]",
              "bg-[var(--surface)]",
              "px-4",
              "py-4",
              "sm:px-5",
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
                "rounded-[var(--radius-md)]",
                "bg-[var(--brand-soft)]",
                "text-[var(--brand)]",
              )}
            >
              <CalendarDays className="size-4" />
            </div>

            <div className="min-w-0">
              <p
                className={cn(
                  "text-sm",
                  "font-bold",
                  "text-[var(--foreground)]",
                )}
              >
                Scheduled travel
              </p>

              <p
                className={cn(
                  "mt-0.5",
                  "text-xs",
                  "leading-5",
                  "text-[var(--foreground-muted)]",
                )}
              >
                The published schedule for this Journey.
              </p>
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* Canonical schedule summary                                        */}
          {/* ----------------------------------------------------------------- */}

          <div
            className={cn(
              "px-4",
              "py-5",
              "sm:px-6",
              "sm:py-6",
            )}
          >
            <JourneyScheduleSummary schedule={schedule} />
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Supporting message                                                */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            "mt-3",
            "flex",
            "items-start",
            "gap-2.5",
            "px-1",
          )}
        >
          <CalendarDays
            aria-hidden="true"
            className={cn(
              "mt-0.5",
              "size-3.5",
              "shrink-0",
              "text-[var(--brand)]",
            )}
          />

          <p
            className={cn(
              "text-xs",
              "leading-5",
              "text-[var(--foreground-muted)]",
            )}
          >
            Please make sure the published departure time works for your
            Journey before booking.
          </p>
        </div>
      </div>
    </section>
  );
}

export default JourneyTravelWindow;