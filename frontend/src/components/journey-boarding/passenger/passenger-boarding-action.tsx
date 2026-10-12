
'use client';

import { useState } from 'react';

import { Button, Card } from '@/components/ui';
import {
  JourneyBoardingParticipantStatus,
  type JourneyBoardingParticipant,
} from '@/features/journey-boarding/models';
import { useBoardPassenger } from '@/features/journey-boarding/hooks';

interface PassengerBoardingActionProps {
  boardingPublicId: string;
  participant: JourneyBoardingParticipant;
  onBoardingSuccess?: () => void;
  className?: string;
}

export function PassengerBoardingAction({
  boardingPublicId,
  participant,
  onBoardingSuccess,
  className,
}: PassengerBoardingActionProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const boardPassengerMutation = useBoardPassenger();

  const isExpected =
    participant.status === JourneyBoardingParticipantStatus.EXPECTED;

  const canConfirmBoarding =
    Boolean(boardingPublicId.trim()) &&
    Boolean(participant.publicId.trim()) &&
    isExpected;

  async function handleConfirmBoarding() {
    if (!canConfirmBoarding || boardPassengerMutation.isPending) {
      return;
    }

    setFeedback(null);

    try {
      await boardPassengerMutation.mutateAsync({
        params: {
          journeyBoardingPublicId: boardingPublicId,
          participantPublicId: participant.publicId,
        },
      });

      setFeedback('Your boarding has been confirmed.');
      onBoardingSuccess?.();
    } catch {
      setFeedback(
        'We could not confirm your boarding. Please try again.',
      );
    }
  }

  if (!isExpected) {
    return null;
  }

  return (
    <Card padding="md" className={className}>
      <h2 className="text-base font-semibold text-[var(--foreground)]">
        Ready to board?
      </h2>

      <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
        Confirm your boarding when you are ready to board and the provider
        is ready.
      </p>

      <div className="mt-4">
        <Button
          className="w-full"
          onClick={handleConfirmBoarding}
          loading={boardPassengerMutation.isPending}
          disabled={!canConfirmBoarding}
        >
          Confirm boarding
        </Button>
      </div>

      {feedback && (
        <p
          role="status"
          aria-live="polite"
          className="mt-3 text-sm text-[var(--foreground-secondary)]"
        >
          {feedback}
        </p>
      )}
    </Card>
  );
}
