// -----------------------------------------------------------------------------
// sisiMove — Journey Date
// -----------------------------------------------------------------------------
//
// Reusable Journey departure-date presentation.
//
// Example:
//   Monday, 16th November 2026
//
// Responsibilities:
// - Present the Journey departure date in a human-friendly format.
// - Include the weekday.
// - Include an ordinal day.
// - Include the full month and year.
// - Remain purely presentational.
//
// This component does NOT:
// - calculate Journey dates;
// - modify the shared global date formatter;
// - infer Journey lifecycle state;
// - recreate schedule/domain logic.
// -----------------------------------------------------------------------------

import type { JourneySchedule } from "@/features/journey/models";
import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDateProps {
  /**
   * Journey schedule projection.
   */
  readonly schedule: JourneySchedule;

  /**
   * Optional additional CSS classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return "th";
  }

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function formatJourneyDate(value: string): string {
  const date = new Date(value);

  const weekday = new Intl.DateTimeFormat("en-KE", {
    weekday: "long",
  }).format(date);

  const month = new Intl.DateTimeFormat("en-KE", {
    month: "long",
  }).format(date);

  const year = new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
  }).format(date);

  const day = date.getDate();

  return `${weekday}, ${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDate({
  schedule,
  className,
}: JourneyDateProps) {
  return (
    <time
      dateTime={schedule.departureAt}
      className={cn(
        "text-sm",
        "font-medium",
        "text-[var(--foreground-secondary)]",
        className,
      )}
    >
      {formatJourneyDate(schedule.departureAt)}
    </time>
  );
}