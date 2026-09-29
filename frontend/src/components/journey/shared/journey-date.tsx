// -----------------------------------------------------------------------------
// Path: src/features/journey/components/shared/JourneyDate.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Date
// -----------------------------------------------------------------------------
//
// Compact Journey departure-date presentation.
//
// Marketplace presentation:
//
//   📅
//   TUE
//   11
//   AUG 2026
//
// Responsibilities:
// - present the Journey departure date;
// - provide weekday, day, month, and year;
// - remain purely presentational;
// - provide a compact visual footprint for marketplace cards;
// - provide a subtle Lucide visual cue for the departure date.
//
// This component does NOT:
// - calculate Journey dates;
// - modify the shared global date formatter;
// - infer Journey lifecycle state;
// - recreate schedule/domain logic.
// -----------------------------------------------------------------------------

import { CalendarDays } from "lucide-react";

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

interface JourneyDateParts {
  readonly weekday: string;
  readonly day: string;
  readonly month: string;
  readonly year: string;
}

function formatJourneyDate(value: string): JourneyDateParts {
  const date = new Date(value);

  const parts = new Intl.DateTimeFormat("en-KE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).formatToParts(date);

  const getPart = (
    type: Intl.DateTimeFormatPartTypes,
  ): string =>
    parts.find(
      (part) => part.type === type,
    )?.value ?? "";

  return {
    weekday: getPart("weekday").toUpperCase(),
    day: getPart("day"),
    month: getPart("month").toUpperCase(),
    year: getPart("year"),
  };
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDate({
  schedule,
  className,
}: JourneyDateProps) {
  const date = formatJourneyDate(
    schedule.departureAt,
  );

  return (
    <time
      dateTime={schedule.departureAt}
      aria-label={`${date.weekday} ${date.day} ${date.month} ${date.year}`}
      className={cn(
        "flex",
        "w-[clamp(3rem,6vw,4.5rem)]",
        "shrink-0",
        "flex-col",
        "items-center",
        "justify-center",
        "text-center",
        "leading-none",
        className,
      )}
    >
      <CalendarDays
        className={cn(
          "size-[clamp(0.7rem,1.15vw,0.9rem)]",
          "text-[var(--brand)]",
        )}
        aria-hidden="true"
      />

      <span
        className={cn(
          "mt-[clamp(0.2rem,0.4vw,0.3rem)]",
          "text-[clamp(0.48rem,0.7vw,0.65rem)]",
          "font-bold",
          "tracking-[0.08em]",
          "leading-none",
          "text-[var(--foreground-secondary)]",
        )}
      >
        {date.weekday}
      </span>

      <span
        className={cn(
          "mt-[clamp(0.2rem,0.4vw,0.3rem)]",
          "text-[clamp(1.15rem,2.5vw,1.75rem)]",
          "font-bold",
          "tracking-tight",
          "leading-none",
          "text-[var(--foreground)]",
        )}
      >
        {date.day}
      </span>

      <span
        className={cn(
          "mt-[clamp(0.2rem,0.4vw,0.3rem)]",
          "text-[clamp(0.46rem,0.68vw,0.65rem)]",
          "font-semibold",
          "tracking-[0.04em]",
          "leading-none",
          "text-[var(--foreground-muted)]",
        )}
      >
        {date.month} {date.year}
      </span>
    </time>
  );
}