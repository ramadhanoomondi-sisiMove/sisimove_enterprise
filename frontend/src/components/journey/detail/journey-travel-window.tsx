// -----------------------------------------------------------------------------
// sisiMove — Journey Travel Window
// -----------------------------------------------------------------------------
//
// Presents the Journey's public travel schedule.
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

import { cn } from "@/foundation";

import type { JourneySchedule } from "@/features/journey/models";

import { JourneyScheduleSummary } from "../shared";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyTravelWindow({
  schedule,
  className,
}: JourneyTravelWindowProps) {
  return (
    <section
      className={cn(
        "w-full",
        "rounded-[var(--radius-lg)]",
        "border border-[var(--border)]",
        "bg-[var(--surface)]",
        "p-4",
        className,
      )}
      aria-labelledby="journey-travel-window-heading"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Heading                                                             */}
      {/* ------------------------------------------------------------------- */}

      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
          Travel
        </p>

        <h2
          id="journey-travel-window-heading"
          className="mt-1 text-lg font-semibold text-[var(--foreground)]"
        >
          Travel window
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Departure and arrival information for this Journey.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Schedule                                                             */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "rounded-[var(--radius-md)]",
          "bg-[var(--background-subtle)]",
          "p-4",
        )}
      >
        <JourneyScheduleSummary schedule={schedule} />
      </div>
    </section>
  );
}