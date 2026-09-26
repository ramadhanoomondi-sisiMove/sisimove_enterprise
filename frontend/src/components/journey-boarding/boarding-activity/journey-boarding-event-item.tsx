// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Event Item
// -----------------------------------------------------------------------------
//
// Presents a single Journey Boarding domain event.
//
// Responsibilities:
// - Translate known Journey Boarding event types into human-readable labels.
// - Present the event timestamp.
// - Present available participant/member context using opaque public IDs.
// - Provide a compact visual distinction between event categories.
//
// Non-responsibilities:
// - Does not fetch participant/member/profile information.
// - Does not interpret event metadata.
// - Does not determine whether an event is valid.
// - Does not mutate the boarding.
// - Does not perform API requests.
// - Does not reproduce aggregate lifecycle rules.
//
// Architectural rules:
// - Event type is interpreted only for presentation.
// - Public identifiers remain opaque strings.
// - Missing optional event references are not replaced with invented data.
// - The backend event is treated as the authoritative historical record.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Model
// -----------------------------------------------------------------------------

import {
  JourneyBoardingEventType,
  type JourneyBoardingEvent,
} from '@/features/journey-boarding/models';

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import { Badge } from '@/components/ui';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyBoardingEventItemProps {
  /**
   * Journey Boarding event to present.
   */
  event: JourneyBoardingEvent;
}

// -----------------------------------------------------------------------------
// Presentation helpers
// -----------------------------------------------------------------------------

interface EventPresentation {
  label: string;
  badgeVariant:
    | 'default'
    | 'brand'
    | 'success'
    | 'warning'
    | 'danger'
    | 'outline';
}

/**
 * Maps a domain event type to presentation text.
 *
 * This mapping deliberately does not alter the underlying domain event.
 */
function getEventPresentation(
  type: JourneyBoardingEventType,
): EventPresentation {
  switch (type) {
    case JourneyBoardingEventType.BOARDING_OPENED:
      return {
        label: 'Boarding opened',
        badgeVariant: 'brand',
      };

    case JourneyBoardingEventType.PROVIDER_BOARDED:
      return {
        label: 'Provider boarded',
        badgeVariant: 'success',
      };

    case JourneyBoardingEventType.PASSENGER_BOARDED:
      return {
        label: 'Passenger boarded',
        badgeVariant: 'success',
      };

    case JourneyBoardingEventType.PASSENGER_NO_SHOW:
      return {
        label: 'Passenger marked as no-show',
        badgeVariant: 'warning',
      };

    case JourneyBoardingEventType.BOARDING_WITHDRAWN:
      return {
        label: 'Participant withdrew',
        badgeVariant: 'warning',
      };

    case JourneyBoardingEventType.PARTICIPANT_REMOVED:
      return {
        label: 'Participant removed',
        badgeVariant: 'danger',
      };

    case JourneyBoardingEventType.JOURNEY_STARTED:
      return {
        label: 'Journey started',
        badgeVariant: 'success',
      };

    case JourneyBoardingEventType.BOARDING_CANCELLED:
      return {
        label: 'Boarding cancelled',
        badgeVariant: 'danger',
      };

    default:
      return {
        label: 'Boarding event',
        badgeVariant: 'default',
      };
  }
}

/**
 * Formats an ISO timestamp for the user's local environment.
 *
 * Invalid timestamps are intentionally handled without throwing. The event
 * itself remains renderable even if a malformed timestamp reaches the client.
 */
function formatEventDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Time unavailable';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBoardingEventItem({
  event,
}: JourneyBoardingEventItemProps) {
  const presentation = getEventPresentation(event.type);

  const hasMember = Boolean(event.memberPublicId);
  const hasBooking = Boolean(event.bookingPublicId);
  const hasActor = Boolean(event.actorPublicId);

  return (
    <div className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0">
      {/* ------------------------------------------------------------------- */}
      {/* Event heading                                                        */}
      {/* ------------------------------------------------------------------- */}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <Badge
            variant={presentation.badgeVariant}
            size="sm"
          >
            {presentation.label}
          </Badge>
        </div>

        <time
          dateTime={event.occurredAt}
          className="shrink-0 text-xs text-[var(--foreground-muted)]"
        >
          {formatEventDateTime(event.occurredAt)}
        </time>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Event references                                                      */}
      {/* ------------------------------------------------------------------- */}
      {(
        hasMember ||
        hasBooking ||
        hasActor
      ) && (
        <dl className="grid gap-2 text-xs sm:grid-cols-2">
          {hasMember && (
            <div className="min-w-0">
              <dt className="text-[var(--foreground-muted)]">
                Member
              </dt>

              <dd className="mt-0.5 truncate font-mono text-[var(--foreground-secondary)]">
                {event.memberPublicId}
              </dd>
            </div>
          )}

          {hasBooking && (
            <div className="min-w-0">
              <dt className="text-[var(--foreground-muted)]">
                Booking
              </dt>

              <dd className="mt-0.5 truncate font-mono text-[var(--foreground-secondary)]">
                {event.bookingPublicId}
              </dd>
            </div>
          )}

          {hasActor && (
            <div className="min-w-0">
              <dt className="text-[var(--foreground-muted)]">
                Actor
              </dt>

              <dd className="mt-0.5 truncate font-mono text-[var(--foreground-secondary)]">
                {event.actorPublicId}
              </dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
}