
import Link from "next/link";

import {
  JourneyBoardingParticipantRole,
  JourneyBoardingParticipantStatus,
  JourneyBoardingStatus,
  type JourneyBoarding,
} from "@/features/journey-boarding/models";

import { Badge, Card } from "@/components/ui";

import { JourneyBoardingProgress } from "../boarding-progress/journey-boarding-progress";

import {
  MarkPassengerNoShowAction,
  RemoveParticipantAction,
  StartJourneyAction,
  CancelJourneyBoardingAction,
} from "../boarding-actions";

export interface JourneyBoardingCardProps {
  boarding: JourneyBoarding;
  isProvider?: boolean;
  href?: string;
  title?: string;
}

type BadgeVariant =
  | "default"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "outline";

function getStatusPresentation(
  status: JourneyBoardingStatus,
): {
  label: string;
  variant: BadgeVariant;
} {
  switch (status) {
    case JourneyBoardingStatus.NOT_STARTED:
      return {
        label: "Not started",
        variant: "default",
      };

    case JourneyBoardingStatus.BOARDING:
      return {
        label: "Boarding",
        variant: "brand",
      };

    case JourneyBoardingStatus.STARTED:
      return {
        label: "Started",
        variant: "success",
      };

    case JourneyBoardingStatus.CANCELLED:
      return {
        label: "Cancelled",
        variant: "danger",
      };

    default:
      return {
        label: "Unknown",
        variant: "outline",
      };
  }
}

function getParticipantStatusPresentation(
  status: JourneyBoardingParticipantStatus,
): {
  label: string;
  variant: BadgeVariant;
} {
  switch (status) {
    case JourneyBoardingParticipantStatus.EXPECTED:
      return {
        label: "Expected",
        variant: "warning",
      };

    case JourneyBoardingParticipantStatus.BOARDED:
      return {
        label: "Boarded",
        variant: "success",
      };

    default:
      return {
        label: String(status),
        variant: "outline",
      };
  }
}

export function JourneyBoardingCard({
  boarding,
  isProvider = false,
  href,
  title = "Journey boarding",
}: JourneyBoardingCardProps) {
  const status = getStatusPresentation(boarding.status);

  const passengerParticipants = boarding.participants.filter(
    (participant) =>
      participant.role === JourneyBoardingParticipantRole.PASSENGER,
  );

  const passengerCount = passengerParticipants.length;

  const boardedPassengerCount = passengerParticipants.filter(
    (participant) =>
      participant.status === JourneyBoardingParticipantStatus.BOARDED,
  ).length;

  return (
    <Card
      variant="default"
      padding="md"
      interactive={Boolean(href)}
      header={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-[var(--foreground)]">
              {title}
            </h2>

            <p className="mt-1 truncate font-mono text-xs text-[var(--foreground-muted)]">
              {boarding.publicId}
            </p>
          </div>

          <Badge variant={status.variant} size="sm">
            {status.label}
          </Badge>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Boarding progress */}

        <JourneyBoardingProgress boarding={boarding} />

        {/* Passenger counts */}

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[var(--radius-md)] bg-[var(--background-subtle)] px-3 py-2">
            <p className="text-xs text-[var(--foreground-muted)]">
              Passengers
            </p>

            <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {passengerCount}
            </p>
          </div>

          <div className="rounded-[var(--radius-md)] bg-[var(--background-subtle)] px-3 py-2">
            <p className="text-xs text-[var(--foreground-muted)]">
              Boarded
            </p>

            <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
              {boardedPassengerCount}
            </p>
          </div>
        </div>

        {/* Passengers and their inline provider actions */}

        <section
          aria-labelledby={`boarding-passengers-${boarding.publicId}`}
          className="border-t border-[var(--border-subtle)] pt-3"
        >
          <h3
            id={`boarding-passengers-${boarding.publicId}`}
            className="text-sm font-semibold text-[var(--foreground)]"
          >
            Passengers
          </h3>

          {passengerParticipants.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--foreground-muted)]">
              No passengers have been registered for this journey yet.
            </p>
          ) : (
            <div className="mt-3 flex flex-col divide-y divide-[var(--border-subtle)]">
              {passengerParticipants.map((participant) => {
                const participantStatus =
                  getParticipantStatusPresentation(participant.status);

                return (
                  <div
                    key={participant.publicId}
                    className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs text-[var(--foreground-secondary)]">
                        {participant.memberPublicId}
                      </p>

                      <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                        Participant ID: {participant.publicId}
                      </p>

                      <div className="mt-2">
                        <Badge
                          variant={participantStatus.variant}
                          size="sm"
                        >
                          {participantStatus.label}
                        </Badge>
                      </div>
                    </div>

                    {isProvider && (
                      <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                        <MarkPassengerNoShowAction
                          boarding={boarding}
                          participant={participant}
                        />

                        <RemoveParticipantAction
                          boarding={boarding}
                          participant={participant}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Provider journey-level actions */}

        {isProvider && (
          <div className="flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-3">
            <StartJourneyAction boarding={boarding} />

            <CancelJourneyBoardingAction boarding={boarding} />
          </div>
        )}

        {/* Boarding identifiers */}

        <div className="border-t border-[var(--border-subtle)] pt-3">
          <dl className="grid gap-2 sm:grid-cols-2">
            <div className="min-w-0">
              <dt className="text-xs text-[var(--foreground-muted)]">
                Journey
              </dt>

              <dd className="mt-0.5 truncate font-mono text-xs text-[var(--foreground-secondary)]">
                {boarding.journeyId}
              </dd>
            </div>

            <div className="min-w-0">
              <dt className="text-xs text-[var(--foreground-muted)]">
                Boarding
              </dt>

              <dd className="mt-0.5 truncate font-mono text-xs text-[var(--foreground-secondary)]">
                {boarding.publicId}
              </dd>
            </div>
          </dl>
        </div>

        {/* Optional navigation */}

        {href && (
          <div className="border-t border-[var(--border-subtle)] pt-3">
            <Link
              href={href}
              className={[
                "inline-flex min-h-9 w-full items-center justify-center",
                "rounded-[var(--radius-md)]",
                "border border-[var(--border-strong)]",
                "bg-transparent px-3 text-sm font-medium",
                "whitespace-nowrap text-[var(--foreground)]",
                "transition-colors duration-150 ease-out",
                "hover:border-[var(--foreground-subtle)]",
                "hover:bg-[var(--background-subtle)]",
                "active:bg-[var(--background-muted)]",
                "focus-visible:outline-2",
                "focus-visible:outline-[var(--brand)]",
                "focus-visible:outline-offset-2",
                "sm:w-auto",
              ].join(" ")}
            >
              View boarding
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
