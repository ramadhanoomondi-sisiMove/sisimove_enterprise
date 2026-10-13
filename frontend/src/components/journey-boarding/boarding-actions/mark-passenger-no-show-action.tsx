"use client";

// -----------------------------------------------------------------------------
// sisiMove — Mark Passenger No-Show Action
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Present the operation for an EXPECTED passenger.
// - Prevent no-show marking before scheduled departure.
// - Update eligibility automatically when departure time arrives.
// - Require explicit confirmation before the consequential transition.
// - Build the variables expected by useMarkPassengerNoShow.
// - Present mutation progress and failure feedback.
//
// The backend JourneyBoardingAggregate remains authoritative for the
// participant transition and scheduled departure rules.
// -----------------------------------------------------------------------------

import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
} from "@/components/ui";

import {
  JourneyBoardingParticipantStatus,
  type JourneyBoarding,
  type JourneyBoardingParticipant,
} from "@/features/journey-boarding/models";

import { useMarkPassengerNoShow } from "@/features/journey-boarding/hooks";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface MarkPassengerNoShowActionProps {
  /**
   * Current Journey Boarding projection.
   */
  boarding: JourneyBoarding;

  /**
   * Passenger participant that may be marked as a no-show.
   */
  participant: JourneyBoardingParticipant;

  /**
   * Scheduled departure timestamp in ISO 8601 format.
   */
  departureAt?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MarkPassengerNoShowAction({
  boarding,
  participant,
  departureAt,
}: MarkPassengerNoShowActionProps) {
  const [isConfirmationOpen, setIsConfirmationOpen] =
    useState(false);

  const [currentTime, setCurrentTime] = useState(
    () => Date.now(),
  );

  const markPassengerNoShow = useMarkPassengerNoShow();

  const departureTimestamp =
    typeof departureAt === "string"
      ? Date.parse(departureAt)
      : Number.NaN;

  const isValidDepartureTime =
    typeof departureAt === "string" &&
    departureAt.trim().length > 0 &&
    !Number.isNaN(departureTimestamp);

  const hasDepartureArrived =
    isValidDepartureTime &&
    currentTime >= departureTimestamp;

  useEffect(() => {
    if (!isValidDepartureTime || hasDepartureArrived) {
      return;
    }

    const remainingTime = departureTimestamp - Date.now();

    const timeoutId = window.setTimeout(() => {
      setCurrentTime(Date.now());
    }, Math.max(remainingTime, 0));

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    departureTimestamp,
    hasDepartureArrived,
    isValidDepartureTime,
  ]);

  // ---------------------------------------------------------------------------
  // Client-visible applicability
  // ---------------------------------------------------------------------------

  if (
    participant.status !==
    JourneyBoardingParticipantStatus.EXPECTED
  ) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleConfirm = () => {
    const now = Date.now();

    if (
      markPassengerNoShow.isPending ||
      !isValidDepartureTime ||
      now < departureTimestamp
    ) {
      setCurrentTime(now);
      return;
    }

    markPassengerNoShow.mutate(
      {
        params: {
          journeyBoardingPublicId: boarding.publicId,
          participantPublicId: participant.publicId,
        },
        request: {
          noShowAt: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          setIsConfirmationOpen(false);
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (markPassengerNoShow.isPending) {
      return;
    }

    if (open) {
      const now = Date.now();

      setCurrentTime(now);

      if (
        !isValidDepartureTime ||
        now < departureTimestamp
      ) {
        return;
      }
    }

    setIsConfirmationOpen(open);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => handleOpenChange(true)}
          disabled={
            markPassengerNoShow.isPending ||
            !isValidDepartureTime ||
            !hasDepartureArrived
          }
        >
          Mark no-show
        </Button>

        {!isValidDepartureTime && (
          <p
            role="alert"
            className="text-sm text-[var(--danger)]"
          >
            The scheduled departure time is unavailable. No-show
            marking is disabled until the schedule is available.
          </p>
        )}

        {isValidDepartureTime && !hasDepartureArrived && (
          <p
            role="status"
            className="text-sm text-[var(--foreground-secondary)]"
          >
            No-show marking is available after the scheduled
            departure time:{" "}
            {new Date(departureTimestamp).toLocaleString()}.
          </p>
        )}

        {isValidDepartureTime && hasDepartureArrived && (
          <p
            role="status"
            className="text-sm text-[var(--foreground-secondary)]"
          >
            The scheduled departure time has arrived. Confirm the
            passenger did not board before marking a no-show.
          </p>
        )}
      </div>

      <Dialog
        open={isConfirmationOpen}
        onOpenChange={handleOpenChange}
        title="Mark passenger as no-show?"
        description="This will record that the passenger did not board the journey."
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => handleOpenChange(false)}
              disabled={markPassengerNoShow.isPending}
            >
              Keep passenger
            </Button>

            <Button
              type="button"
              variant="danger"
              size="md"
              loading={markPassengerNoShow.isPending}
              disabled={
                markPassengerNoShow.isPending ||
                !isValidDepartureTime ||
                !hasDepartureArrived
              }
              onClick={handleConfirm}
            >
              {markPassengerNoShow.isPending
                ? "Marking no-show…"
                : "Confirm no-show"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            This action changes the passenger&apos;s boarding
            status. Confirm only if the passenger has not boarded.
          </p>

          {markPassengerNoShow.isError && (
            <p
              role="alert"
              className="text-sm text-[var(--danger)]"
            >
              {markPassengerNoShow.error instanceof Error
                ? markPassengerNoShow.error.message
                : "Unable to mark the passenger as a no-show. Please try again."}
            </p>
          )}
        </div>
      </Dialog>
    </>
  );
}
