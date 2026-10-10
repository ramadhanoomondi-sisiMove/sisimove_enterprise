
import type { JourneyBoarding } from "@/features/journey-boarding/models/journey-boarding";
import { cn } from "@/foundation/utils/cn";

export interface JourneyBoardingSummaryProps {
  readonly boarding: JourneyBoarding | null;
  readonly className?: string;
}

export function JourneyBoardingSummary({
  boarding,
  className,
}: JourneyBoardingSummaryProps) {
  const participantCount = boarding?.participants.length ?? 0;
  const eventCount = boarding?.events.length ?? 0;
  const hasBoarding = boarding !== null;

  const tooltip = hasBoarding
    ? `Boarding status: ${boarding.status}. ${participantCount} ${
        participantCount === 1 ? "participant" : "participants"
      } and ${eventCount} ${eventCount === 1 ? "event" : "events"}.`
    : "No boarding record is available yet.";

  return (
    <section
      aria-label="Journey boarding"
      title={tooltip}
      className={cn(
        "group relative w-full min-w-0 max-w-[12rem]",
        "rounded-lg border p-2",
        "border-[var(--border-subtle)]",
        "bg-[var(--background-subtle)]",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-0.5",
        "hover:border-[var(--brand)]",
        "hover:bg-[var(--background)]",
        "hover:shadow-md",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col items-start gap-1.5">
        <div
          aria-hidden="true"
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full",
            "bg-[var(--background-muted)]",
            "text-[var(--foreground-muted)]",
            "transition-all duration-200 ease-out",
            "group-hover:scale-105",
            "group-hover:bg-[var(--brand-soft)]",
            "group-hover:text-[var(--brand)]",
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4 transition-transform duration-200 group-hover:scale-110"
          >
            <path d="M8 5h8" />
            <path d="M7 3h10v4H7z" />
            <rect x="4" y="5" width="16" height="16" rx="2" />
            <path d="m8 13 2.5 2.5L16 10" />
          </svg>
        </div>

        <div className="w-full min-w-0">
          <div className="flex w-full min-w-0 items-center justify-between gap-1">
            <p className="text-xs font-semibold leading-tight text-[var(--foreground)]">
              Boarding
            </p>

            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "size-3.5 shrink-0",
                "text-[var(--foreground-muted)]",
                "transition-all duration-200 ease-out",
                "group-hover:translate-x-1",
                "group-hover:text-[var(--brand)]",
              )}
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>

          {hasBoarding ? (
            <>
              <p
                className="mt-1 truncate text-sm font-semibold leading-tight text-[var(--foreground)]"
                title={boarding.status}
              >
                {boarding.status}
              </p>

              <p className="mt-1 text-xs leading-tight text-[var(--foreground-muted)]">
                <span className="font-semibold tabular-nums">
                  {participantCount}
                </span>{" "}
                {participantCount === 1 ? "participant" : "participants"}
              </p>

              <p className="mt-0.5 text-xs leading-tight text-[var(--foreground-muted)]">
                <span className="font-semibold tabular-nums">
                  {eventCount}
                </span>{" "}
                {eventCount === 1 ? "event" : "events"}
              </p>
            </>
          ) : (
            <>
              <p className="mt-1 text-xs font-medium leading-tight text-[var(--foreground-muted)]">
                No boarding record
              </p>

              <p className="mt-1 text-[0.65rem] leading-tight text-[var(--foreground-muted)]">
                Awaiting boarding details
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
