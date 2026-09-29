// -----------------------------------------------------------------------------
// sisiMove — Journey Editor Header
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - present the authenticated Journey editing header;
// - display Journey route identity when available;
// - display departure information when available;
// - display the current Journey lifecycle status;
// - provide an optional back/navigation callback supplied by the parent;
// - gracefully represent progressively assembled Draft Journeys.
//
// Non-responsibilities:
// - no data fetching;
// - no mutations;
// - no lifecycle transition decisions;
// - no authorization decisions;
// - no verification checks;
// - no route construction;
// - no Journey domain logic.
//
// Important:
//
// MyJourney intentionally exposes nullable route and schedule projections:
//
//   route: JourneyRoute | null
//   schedule: JourneySchedule | null
//
// A Journey may therefore reach this component while it is still being
// assembled. The header must not assert that these components exist.
//
// Missing components are represented as presentation fallbacks rather than
// being treated as errors.
//
// The component consumes the existing MyJourney projection. It does not
// reconstruct Journey state from individual child components.
//
// -----------------------------------------------------------------------------

"use client";

import { Badge, Button } from "@/components/ui";
import { cn } from "@/foundation/utils/cn";

import type { MyJourney } from "@/features/journey/models";

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 12H5"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11 18-6-6 6-6"
      />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyEditorHeaderProps {
  /**
   * Authenticated Journey projection being edited.
   */
  readonly journey: MyJourney;

  /**
   * Optional parent-owned back action.
   *
   * Navigation remains outside this component.
   */
  readonly onBack?: () => void;

  /**
   * Optional custom page title.
   */
  readonly title?: string;

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatDateTime(
  value: string,
): string {
  const timestamp = new Date(value);

  if (Number.isNaN(timestamp.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-KE",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(timestamp);
}

function formatStatus(
  status: MyJourney["status"],
): string {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyEditorHeader({
  journey,
  onBack,
  title = "Manage Journey",
  className,
}: JourneyEditorHeaderProps) {
  // ---------------------------------------------------------------------------
  // Route projection
  // ---------------------------------------------------------------------------
  //
  // A Draft Journey may not have a corridor attached yet. Do not dereference
  // journey.route unless it exists.
  //
  // The individual route names remain presentation data supplied by the
  // MyJourney projection; this component does not reconstruct them.
  // ---------------------------------------------------------------------------

  const origin =
    journey.route?.origin.name ??
    "Origin not set";

  const destination =
    journey.route?.destination.name ??
    "Destination not set";

  // ---------------------------------------------------------------------------
  // Schedule projection
  // ---------------------------------------------------------------------------
  //
  // A Draft Journey may not have a schedule attached yet.
  // ---------------------------------------------------------------------------

  const departureAt =
    journey.schedule?.departureAt ?? null;

  const departureLabel =
    departureAt === null
      ? "Departure not set"
      : `Departure ${formatDateTime(departureAt)}`;

  return (
    <header
      className={cn(
        "space-y-4",
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Parent-owned navigation                                             */}
      {/* ------------------------------------------------------------------- */}

      {onBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          leadingIcon={<ArrowLeftIcon />}
          onClick={onBack}
          className="-ml-2"
        >
          Back
        </Button>
      )}

      <div
        className={cn(
          "flex",
          "flex-col",
          "gap-3",
          "sm:flex-row",
          "sm:items-start",
          "sm:justify-between",
        )}
      >
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            {title}
          </p>

          {/* --------------------------------------------------------------- */}
          {/* Route identity                                                   */}
          {/* --------------------------------------------------------------- */}

          <h1
            className={cn(
              "text-xl",
              "font-semibold",
              "tracking-tight",
              "text-[var(--foreground)]",
              "sm:text-2xl",
            )}
          >
            <span>{origin}</span>

            <span
              aria-hidden="true"
              className="px-2 text-[var(--foreground-muted)]"
            >
              →
            </span>

            <span>{destination}</span>
          </h1>

          {/* --------------------------------------------------------------- */}
          {/* Departure                                                        */}
          {/* --------------------------------------------------------------- */}

          <p className="text-sm text-[var(--foreground-muted)]">
            {departureLabel}
          </p>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Lifecycle status                                                  */}
        {/* ----------------------------------------------------------------- */}

        <Badge>
          {formatStatus(journey.status)}
        </Badge>
      </div>
    </header>
  );
}

