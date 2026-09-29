// -----------------------------------------------------------------------------
// Path: src/features/journey/components/shared/JourneyScheduleSummary.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Schedule Summary
// -----------------------------------------------------------------------------
//
// Compact presentation of a Journey's scheduled travel window.
//
// Marketplace presentation:
//
//        📅
//       TUE
//        11
//    AUG 2026
//    ─────────
//    🕐 8:30 AM
//
// Responsibilities:
// - Present departure date and time.
// - Present arrival time when supplied by the backend.
// - Preserve the Journey schedule timezone as supporting metadata.
// - Reuse the shared JourneyDate component and foundation time formatter.
// - Provide subtle Lucide icons for date and travel time.
//
// This component does NOT:
// - calculate journey duration;
// - infer an arrival time;
// - convert or mutate the backend schedule;
// - recreate JourneySchedule domain validation.
// -----------------------------------------------------------------------------

import { Clock3 } from "lucide-react";

import type { JourneySchedule } from "@/features/journey/models";

import { formatTime } from "@/foundation/formatters";
import { cn } from "@/foundation/utils/cn";

import { JourneyDate } from "./journey-date";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyScheduleSummaryProps {
  /**
   * Journey schedule projection supplied by the backend.
   */
  readonly schedule: JourneySchedule;

  /**
   * Optional additional CSS classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyScheduleSummary({
  schedule,
  className,
}: JourneyScheduleSummaryProps) {
  const departureTime = formatTime(
    schedule.departureAt,
  );

  const arrivalAt = schedule.arrivalAt;

  const arrivalTime =
    arrivalAt !== null
      ? formatTime(arrivalAt)
      : null;

  return (
    <div
      className={cn(
        "flex",
        "min-w-0",
        "flex-col",
        "items-center",
        "text-center",
        className,
      )}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Departure Date                                                     */}
      {/* ------------------------------------------------------------------ */}

      <JourneyDate
        schedule={schedule}
        className="w-full"
      />

      {/* ------------------------------------------------------------------ */}
      {/* Schedule Divider                                                   */}
      {/* ------------------------------------------------------------------ */}

      <div
        aria-hidden="true"
        className={cn(
          "my-[clamp(0.45rem,0.9vw,0.7rem)]",
          "h-px",
          "w-[clamp(2rem,4vw,3.25rem)]",
          "bg-[var(--border-subtle)]",
        )}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Travel Time                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div
        className={cn(
          "flex",
          "min-w-0",
          "max-w-full",
          "flex-col",
          "items-center",
          "gap-[clamp(0.2rem,0.4vw,0.3rem)]",
        )}
      >
        <div
          className={cn(
            "flex",
            "min-w-0",
            "max-w-full",
            "items-center",
            "justify-center",
            "gap-[clamp(0.25rem,0.5vw,0.4rem)]",
          )}
        >
          <Clock3
            className={cn(
              "size-[clamp(0.65rem,1.05vw,0.85rem)]",
              "shrink-0",
              "text-[var(--brand)]",
            )}
            aria-hidden="true"
          />

          <time
            dateTime={schedule.departureAt}
            className={cn(
              "truncate",
              "text-[clamp(0.62rem,1vw,0.82rem)]",
              "font-semibold",
              "leading-tight",
              "text-[var(--foreground)]",
            )}
          >
            {departureTime}
          </time>

          {arrivalAt !== null && arrivalTime !== null ? (
            <>
              <span
                aria-hidden="true"
                className={cn(
                  "shrink-0",
                  "text-[clamp(0.55rem,0.85vw,0.7rem)]",
                  "text-[var(--foreground-subtle)]",
                )}
              >
                —
              </span>

              <time
                dateTime={arrivalAt}
                className={cn(
                  "truncate",
                  "text-[clamp(0.55rem,0.85vw,0.72rem)]",
                  "leading-tight",
                  "text-[var(--foreground-secondary)]",
                )}
              >
                {arrivalTime}
              </time>
            </>
          ) : null}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Timezone                                                         */}
        {/* ---------------------------------------------------------------- */}

        <span
          className={cn(
            "max-w-full",
            "truncate",
            "text-[clamp(0.42rem,0.65vw,0.55rem)]",
            "font-medium",
            "uppercase",
            "tracking-wide",
            "leading-tight",
            "text-[var(--foreground-muted)]",
          )}
        >
          {schedule.timezone}
        </span>
      </div>
    </div>
  );
}