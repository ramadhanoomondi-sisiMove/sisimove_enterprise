
// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Event Item
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Translate known event types into human-readable labels.
// - Present the event timestamp.
// - Present available member, booking, and actor references.
// - Provide a compact visual distinction between event categories.
//
// Non-responsibilities:
// - Does not fetch participant/member/profile information.
// - Does not interpret event metadata.
// - Does not determine event validity.
// - Does not mutate the boarding or perform API requests.
//
// Architectural rules:
// - Event type is interpreted only for presentation.
// - Public identifiers remain opaque strings.
// - Missing optional references are not invented.
// - The backend event remains the authoritative historical record.
// -----------------------------------------------------------------------------

import {
  AlertCircle,
  CalendarClock,
  CircleMinus,
  Flag,
  History,
  PlayCircle,
  ShieldAlert,
  UserCheck,
  UserMinus,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import {
  JourneyBoardingEventType,
  type JourneyBoardingEvent,
} from "@/features/journey-boarding/models";

import { Badge } from "@/components/ui";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyBoardingEventItemProps {
  event: JourneyBoardingEvent;
}

// -----------------------------------------------------------------------------
// Presentation helpers
// -----------------------------------------------------------------------------

type EventBadgeVariant =
  | "default"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "outline";

interface EventPresentation {
  label: string;
  badgeVariant: EventBadgeVariant;
  icon: LucideIcon;
  iconClassName: string;
}

function getEventPresentation(
  type: JourneyBoardingEventType,
): EventPresentation {
  switch (type) {
    case JourneyBoardingEventType.BOARDING_OPENED:
      return {
        label: "Boarding opened",
        badgeVariant: "brand",
        icon: Flag,
        iconClassName:
          "bg-[var(--background-brand)] text-[var(--brand)]",
      };

    case JourneyBoardingEventType.PROVIDER_BOARDED:
      return {
        label: "Provider boarded",
        badgeVariant: "success",
        icon: ShieldAlert,
        iconClassName:
          "bg-[var(--success-soft)] text-[var(--success)]",
      };

    case JourneyBoardingEventType.PASSENGER_BOARDED:
      return {
        label: "Passenger boarded",
        badgeVariant: "success",
        icon: UserCheck,
        iconClassName:
          "bg-[var(--success-soft)] text-[var(--success)]",
      };

    case JourneyBoardingEventType.PASSENGER_NO_SHOW:
      return {
        label: "Passenger marked as no-show",
        badgeVariant: "warning",
        icon: AlertCircle,
        iconClassName:
          "bg-[var(--warning-soft)] text-[var(--warning)]",
      };

    case JourneyBoardingEventType.BOARDING_WITHDRAWN:
      return {
        label: "Participant withdrew",
        badgeVariant: "warning",
        icon: CircleMinus,
        iconClassName:
          "bg-[var(--warning-soft)] text-[var(--warning)]",
      };

    case JourneyBoardingEventType.PARTICIPANT_REMOVED:
      return {
        label: "Participant removed",
        badgeVariant: "danger",
        icon: UserMinus,
        iconClassName:
          "bg-[var(--danger-soft)] text-[var(--danger)]",
      };

    case JourneyBoardingEventType.JOURNEY_STARTED:
      return {
        label: "Journey started",
        badgeVariant: "success",
        icon: PlayCircle,
        iconClassName:
          "bg-[var(--success-soft)] text-[var(--success)]",
      };

    case JourneyBoardingEventType.BOARDING_CANCELLED:
      return {
        label: "Boarding cancelled",
        badgeVariant: "danger",
        icon: CircleMinus,
        iconClassName:
          "bg-[var(--danger-soft)] text-[var(--danger)]",
      };

    default:
      return {
        label: "Boarding event",
        badgeVariant: "default",
        icon: History,
        iconClassName:
          "bg-[var(--background-subtle)] text-[var(--foreground-secondary)]",
      };
  }
}

/**
 * Returns the valid timestamp used for display.
 * createdAt is a fallback only when occurredAt is invalid.
 */
function getEventDateValue(event: JourneyBoardingEvent): string | null {
  if (!Number.isNaN(Date.parse(event.occurredAt))) {
    return event.occurredAt;
  }

  if (!Number.isNaN(Date.parse(event.createdAt))) {
    return event.createdAt;
  }

  return null;
}

function formatEventDateTime(value: string | null): string {
  if (!value) {
    return "Time unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Time unavailable";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBoardingEventItem({
  event,
}: JourneyBoardingEventItemProps) {
  const presentation = getEventPresentation(event.type);
  const EventIcon = presentation.icon;

  const eventDateValue = getEventDateValue(event);
  const formattedDateTime = formatEventDateTime(eventDateValue);

  const references = [
    {
      label: "Member",
      value: event.memberPublicId,
    },
    {
      label: "Booking",
      value: event.bookingPublicId,
    },
    {
      label: "Actor",
      value: event.actorPublicId,
    },
  ].filter(
    (reference): reference is { label: string; value: string } =>
      typeof reference.value === "string" &&
      reference.value.length > 0,
  );

  return (
    <article className="flex min-w-0 gap-3">
      {/* Event icon */}

      <div
        className={[
          "flex size-10 shrink-0 items-center justify-center",
          "rounded-[var(--radius-lg)]",
          presentation.iconClassName,
        ].join(" ")}
      >
        <EventIcon size={19} aria-hidden="true" />
      </div>

      {/* Event content */}

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col items-start gap-2">
            <Badge
              variant={presentation.badgeVariant}
              size="sm"
            >
              {presentation.label}
            </Badge>

            <p className="text-xs text-[var(--foreground-secondary)]">
              {formattedDateTime}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
            <CalendarClock size={14} aria-hidden="true" />
            <span>Event time</span>
          </div>
        </div>

        {references.length > 0 && (
          <dl className="grid min-w-0 gap-2 sm:grid-cols-2">
            {references.map((reference) => (
              <div
                key={reference.label}
                className="min-w-0 rounded-[var(--radius-md)] bg-[var(--background-subtle)] px-3 py-2"
              >
                <dt className="text-xs text-[var(--foreground-muted)]">
                  {reference.label}
                </dt>

                <dd
                  className="mt-1 break-all font-mono text-xs leading-5 text-[var(--foreground-secondary)]"
                  title={reference.value}
                >
                  {reference.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  );
}
