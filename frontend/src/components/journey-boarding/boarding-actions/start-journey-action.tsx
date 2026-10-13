"use client";

// -----------------------------------------------------------------------------
// sisiMove — Start Journey Action
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Present the start operation while boarding is active.
// - Explain when the scheduled departure time has not arrived.
// - Handle missing or invalid departure timestamps safely.
// - Update departure-time eligibility automatically.
// - Require explicit confirmation before starting the Journey.
// - Build the variables expected by useStartJourney.
// - Present mutation progress and failure feedback.
//
// The backend remains authoritative for Journey lifecycle and departure rules.
// -----------------------------------------------------------------------------

import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
} from "@/components/ui";

import {
  JourneyBoardingStatus,
  type JourneyBoarding,
} from "@/features/journey-boarding/models";

import { useStartJourney } from "@/features/journey-boarding/hooks";

export interface StartJourneyActionProps {
  boarding: JourneyBoarding;
  departureAt?: string;
}

export function StartJourneyAction({
  boarding,
  departureAt,
}: StartJourneyActionProps) {
  const [isConfirmationOpen, setIsConfirmationOpen] =
    useState(false);

  const [currentTime, setCurrentTime] = useState(
    () => Date.now(),
  );

  const startJourney = useStartJourney();

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

  if (boarding.status !== JourneyBoardingStatus.BOARDING) {
    return null;
  }

  const handleConfirm = () => {
    const now = Date.now();

    if (
      startJourney.isPending ||
      !isValidDepartureTime ||
      now < departureTimestamp
    ) {
      setCurrentTime(now);
      return;
    }

    startJourney.mutate(
      {
        params: {
          journeyBoardingPublicId: boarding.publicId,
        },
        request: {
          journeyStartedAt: new Date().toISOString(),
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
    if (startJourney.isPending) {
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

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={() => handleOpenChange(true)}
          disabled={
            startJourney.isPending ||
            !isValidDepartureTime ||
            !hasDepartureArrived
          }
        >
          {startJourney.isPending
            ? "Starting journey…"
            : "Start journey"}
        </Button>

        {!isValidDepartureTime && (
          <p
            role="alert"
            className="text-sm text-[var(--danger)]"
          >
            The scheduled departure time is unavailable. Please
            refresh the journey details or contact support.
          </p>
        )}

        {isValidDepartureTime && !hasDepartureArrived && (
          <p
            role="status"
            className="text-sm text-[var(--foreground-secondary)]"
          >
            This journey cannot start yet. Scheduled departure is{" "}
            {new Date(departureTimestamp).toLocaleString()}.
          </p>
        )}

        {isValidDepartureTime && hasDepartureArrived && (
          <p
            role="status"
            className="text-sm text-[var(--foreground-secondary)]"
          >
            The scheduled departure time has arrived. You can start
            the journey when you are ready.
          </p>
        )}
      </div>

      <Dialog
        open={isConfirmationOpen}
        onOpenChange={handleOpenChange}
        title="Start journey?"
        description="Confirm that you are ready to start this journey."
        footer={
          <>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => handleOpenChange(false)}
              disabled={startJourney.isPending}
            >
              Not yet
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              loading={startJourney.isPending}
              disabled={
                startJourney.isPending ||
                !isValidDepartureTime ||
                !hasDepartureArrived
              }
              onClick={handleConfirm}
            >
              {startJourney.isPending
                ? "Starting journey…"
                : "Confirm start"}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[var(--foreground-secondary)]">
            Starting the journey will move it into progress and
            record the journey start time.
          </p>

          {startJourney.isError && (
            <p
              role="alert"
              className="text-sm text-[var(--danger)]"
            >
              {startJourney.error instanceof Error
                ? startJourney.error.message
                : "Unable to start the journey. Please try again."}
            </p>
          )}
        </div>
      </Dialog>
    </>
  );
}