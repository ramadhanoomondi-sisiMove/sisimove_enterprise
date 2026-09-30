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
//        ↓
//      4:30 PM
//
// Product role:
//
//     When does it leave?
//             │
//             ▼
//     When does it arrive?
//             │
//             ▼
//     What timezone applies?
//
// Responsibilities:
// - present departure date and time;
// - present arrival time when supplied by the backend;
// - preserve the Journey schedule timezone as supporting metadata;
// - reuse the shared JourneyDate component and foundation time formatter;
// - provide subtle Lucide icons for date and travel time.
//
// This component does NOT:
// - calculate journey duration;
// - infer an arrival time;
// - convert or mutate the backend schedule;
// - recreate JourneySchedule domain validation.
//
// The backend Journey schedule projection remains the source of truth.
//
// -----------------------------------------------------------------------------

import {
  ArrowRight,
  Clock3,
} from "lucide-react";

import type { JourneySchedule } from "@/features/journey/models";

import { formatTime } from "@/foundation/formatters";
import { cn } from "@/foundation/utils/cn";

import { JourneyDate } from "./journey-date";

// =============================================================================
// Props
// =============================================================================

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

// =============================================================================
// Component
// =============================================================================

export function JourneyScheduleSummary({
  schedule,
  className,
}: JourneyScheduleSummaryProps) {
  const departureTime = formatTime(schedule.departureAt);

  const arrivalAt = schedule.arrivalAt;

  const arrivalTime =
    arrivalAt !== null
      ? formatTime(arrivalAt)
      : null;

  const hasArrivalTime =
    arrivalAt !== null &&
    arrivalTime !== null;

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
      {/* ------------------------------------------------------------------- */}
      {/* Departure date                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "flex",
          "w-full",
          "items-center",
          "justify-center",
          "rounded-[var(--radius-lg)]",
          "border",
          "border-[var(--border)]",
          "bg-[var(--surface)]",
          "px-3",
          "py-3",
          "shadow-[var(--shadow-sm)]",
        )}
      >
        <JourneyDate
          schedule={schedule}
          className="w-full"
        />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Schedule divider                                                    */}
      {/* ------------------------------------------------------------------- */}

      <div
        aria-hidden="true"
        className={cn(
          "my-3",
          "h-px",
          "w-10",
          "bg-[var(--border-strong)]",
        )}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Travel time                                                         */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={cn(
          "w-full",
          "rounded-[var(--radius-lg)]",
          "border",
          "border-[var(--border)]",
          "bg-[var(--background-subtle)]",
          "px-3",
          "py-3",
        )}
      >
        <div
          className={cn(
            "flex",
            "items-center",
            "justify-center",
            "gap-2",
          )}
        >
          <div
            aria-hidden="true"
            className={cn(
              "flex",
              "size-7",
              "shrink-0",
              "items-center",
              "justify-center",
              "rounded-full",
              "bg-[var(--brand-soft)]",
              "text-[var(--brand)]",
            )}
          >
            <Clock3 className="size-3.5" />
          </div>

          <div
            className={cn(
              "flex",
              "min-w-0",
              "items-baseline",
              "justify-center",
              "gap-2",
            )}
          >
            <time
              dateTime={schedule.departureAt}
              className={cn(
                "truncate",
                "text-base",
                "font-extrabold",
                "leading-tight",
                "tracking-tight",
                "text-[var(--foreground)]",
              )}
            >
              {departureTime}
            </time>

            {hasArrivalTime ? (
              <>
                <ArrowRight
                  aria-hidden="true"
                  className={cn(
                    "size-3.5",
                    "shrink-0",
                    "text-[var(--foreground-subtle)]",
                  )}
                />

                <time
                  dateTime={arrivalAt}
                  className={cn(
                    "truncate",
                    "text-sm",
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
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Timezone                                                          */}
        {/* ----------------------------------------------------------------- */}

        <div
          className={cn(
            "mt-2",
            "flex",
            "items-center",
            "justify-center",
            "gap-1.5",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "size-1.5",
              "rounded-full",
              "bg-[var(--brand)]",
            )}
          />

          <span
            className={cn(
              "max-w-full",
              "truncate",
              "text-[0.65rem]",
              "font-semibold",
              "uppercase",
              "tracking-[0.1em]",
              "leading-tight",
              "text-[var(--foreground-muted)]",
            )}
          >
            {schedule.timezone}
          </span>
        </div>
      </div>
    </div>
  );
}

export default JourneyScheduleSummary;