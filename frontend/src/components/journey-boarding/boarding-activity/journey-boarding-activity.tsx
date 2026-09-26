// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Activity
// -----------------------------------------------------------------------------
//
// Presents the secondary event history for a Journey Boarding.
//
// Responsibilities:
// - Render the boarding event history.
// - Order events for presentation.
// - Delegate individual event rendering to JourneyBoardingEventItem.
// - Present an appropriate empty state when no events exist.
//
// Non-responsibilities:
// - Does not fetch boarding activity.
// - Does not perform mutations.
// - Does not interpret event metadata as domain state.
// - Does not determine lifecycle validity.
// - Does not modify the JourneyBoarding projection.
// - Does not reproduce JourneyBoardingAggregate rules.
//
// Architectural rules:
// - The Journey Boarding projection is supplied by the parent feature layer.
// - Event history is secondary operational context, not the primary action
//   surface.
// - The backend remains authoritative for lifecycle and participant state.
// - Event metadata remains opaque to this component.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import {
  Card,
  EmptyState,
} from '@/components/ui';

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

import type {
  JourneyBoarding,
  JourneyBoardingEvent,
} from '@/features/journey-boarding/models';

// -----------------------------------------------------------------------------
// Components
// -----------------------------------------------------------------------------

import { JourneyBoardingEventItem } from './journey-boarding-event-item';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyBoardingActivityProps {
  /**
   * Current Journey Boarding projection.
   *
   * The projection is consumed read-only. This component never mutates the
   * supplied boarding or its event collection.
   */
  boarding: JourneyBoarding;

  /**
   * Optional content rendered alongside the activity heading.
   *
   * This allows the parent composition to provide contextual controls without
   * making the activity component responsible for those controls.
   */
  headerAction?: ReactNode;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Returns the chronological timestamp used for presentation ordering.
 *
 * `occurredAt` represents when the domain event happened and is therefore the
 * primary ordering field. `createdAt` is used only as a deterministic fallback
 * when the occurrence timestamp cannot be parsed.
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
 * Creates a presentation-only event ordering.
 *
 * The original `boarding.events` array is never mutated.
 *
 * Events are displayed newest first because the activity section is intended
 * to answer the operational question: "What happened most recently?"
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

  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------

  if (events.length === 0) {
    return (
      <Card
        variant="default"
        padding="md"
        header={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Activity
              </h2>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                Recent events for this boarding.
              </p>
            </div>

            {headerAction}
          </div>
        }
      >
        <EmptyState
          title="No activity yet"
          description="Boarding events will appear here as the boarding process progresses."
        />
      </Card>
    );
  }

  // ---------------------------------------------------------------------------
  // Activity
  // ---------------------------------------------------------------------------

  return (
    <Card
      variant="default"
      padding="md"
      header={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Activity
            </h2>

            <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
              Recent events for this boarding.
            </p>
          </div>

          {headerAction}
        </div>
      }
    >
      <ol className="divide-y divide-[var(--border-subtle)]">
        {events.map((event) => (
          <li key={event.publicId}>
            <JourneyBoardingEventItem event={event} />
          </li>
        ))}
      </ol>
    </Card>
  );
}