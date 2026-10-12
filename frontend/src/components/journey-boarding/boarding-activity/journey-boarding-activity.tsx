
// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Activity
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Render the boarding event history.
// - Order events newest first for presentation.
// - Delegate individual event rendering to JourneyBoardingEventItem.
// - Present an appropriate empty state when no events exist.
//
// Non-responsibilities:
// - Does not fetch boarding activity.
// - Does not perform mutations.
// - Does not interpret event metadata as domain state.
// - Does not determine lifecycle validity.
// - Does not modify the JourneyBoarding projection.
//
// Architectural rules:
// - The parent supplies the Journey Boarding projection.
// - Event history remains secondary operational context.
// - The backend remains authoritative.
// - Event metadata remains opaque.
// -----------------------------------------------------------------------------

import type { ReactNode } from "react";

import {
  Activity,
  History,
} from "lucide-react";

import {
  Badge,
  Card,
  EmptyState,
} from "@/components/ui";

import type {
  JourneyBoarding,
  JourneyBoardingEvent,
} from "@/features/journey-boarding/models";

import { JourneyBoardingEventItem } from "./journey-boarding-event-item";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyBoardingActivityProps {
  boarding: JourneyBoarding;
  headerAction?: ReactNode;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Returns the valid timestamp used for event presentation.
 *
 * occurredAt is authoritative for event ordering. createdAt is used as a
 * presentation fallback when occurredAt is invalid.
 */
function getEventTimestamp(event: JourneyBoardingEvent): number {
  const occurredAt = Date.parse(event.occurredAt);

  if (!Number.isNaN(occurredAt)) {
    return occurredAt;
  }

  const createdAt = Date.parse(event.createdAt);

  if (!Number.isNaN(createdAt)) {
    return createdAt;
  }

  return 0;
}

/**
 * Returns a new array ordered newest first.
 * The source event collection is never mutated.
 */
function sortEventsForPresentation(
  events: readonly JourneyBoardingEvent[],
): JourneyBoardingEvent[] {
  return [...events].sort(
    (left, right) =>
      getEventTimestamp(right) - getEventTimestamp(left),
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBoardingActivity({
  boarding,
  headerAction,
}: JourneyBoardingActivityProps) {
  const events = sortEventsForPresentation(boarding.events);

  return (
    <Card
      variant="default"
      padding="md"
      header={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--background-subtle)] text-[var(--foreground-secondary)]">
              <History size={20} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-[var(--foreground)]">
                  Activity
                </h2>

                <Badge variant="outline" size="sm">
                  {events.length}{" "}
                  {events.length === 1 ? "event" : "events"}
                </Badge>
              </div>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                A chronological record of boarding activity, newest first.
              </p>
            </div>
          </div>

          {headerAction && (
            <div className="flex shrink-0 items-center">
              {headerAction}
            </div>
          )}
        </div>
      }
    >
      {events.length === 0 ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
            <Activity size={15} aria-hidden="true" />
            <span>Event history</span>
          </div>

          <EmptyState
            title="No activity yet"
            description="Boarding events will appear here as the boarding process progresses."
          />
        </div>
      ) : (
        <ol
          aria-label="Journey boarding event history"
          className="divide-y divide-[var(--border-subtle)]"
        >
          {events.map((event) => (
            <li key={event.publicId} className="py-4 first:pt-0 last:pb-0">
              <JourneyBoardingEventItem event={event} />
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
