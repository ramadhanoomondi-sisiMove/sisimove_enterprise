// -----------------------------------------------------------------------------
// sisiMove — Journey Schedule Summary
// -----------------------------------------------------------------------------
//
// Compact presentation of a Journey's scheduled travel window.
//
// Example:
//
//   Monday, 16th November 2026
//   8:30 AM — 1:45 PM
//
// Responsibilities:
// - Present departure date and time.
// - Present arrival time when supplied by the backend.
// - Preserve the Journey schedule timezone as supporting metadata.
// - Reuse the shared JourneyDate component and foundation time formatter.
//
// This component does NOT:
// - calculate journey duration;
// - infer an arrival time;
// - convert or mutate the backend schedule;
// - recreate JourneySchedule domain validation.
// -----------------------------------------------------------------------------

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
  const departureTime = formatTime(schedule.departureAt);

  const arrivalTime = schedule.arrivalAt
    ? formatTime(schedule.arrivalAt)
    : null;

  return (
    <div
      className={cn(
        "min-w-0",
        "space-y-1",
        className,
      )}
    >
      <JourneyDate schedule={schedule} />

      <div
        className={cn(
          "flex",
          "min-w-0",
          "flex-wrap",
          "items-center",
          "gap-x-2",
          "gap-y-1",
        )}
      >
        <time
          dateTime={schedule.departureAt}
          className="text-sm font-semibold text-[var(--foreground)]"
        >
          {departureTime}
        </time>

        {arrivalTime && (
          <>
            <span
              aria-hidden="true"
              className="text-[var(--foreground-subtle)]"
            >
              —
            </span>

            <time
              dateTime={schedule.arrivalAt ?? undefined}
              className="text-sm text-[var(--foreground-secondary)]"
            >
              {arrivalTime}
            </time>
          </>
        )}

        <span className="text-xs text-[var(--foreground-muted)]">
          {schedule.timezone}
        </span>
      </div>
    </div>
  );
}