'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Participants List
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Fetch participants for a Journey Boarding.
// - Render each participant using JourneyParticipantCard.
// - Handle loading, empty, and error states.
// - Optionally identify and exclude the current passenger.
// - Keep HTTP requests and mapping logic in existing layers.
//
// Security:
// - Participant ownership must be established using trusted identity data.
// - Backend authorization remains authoritative.
// -----------------------------------------------------------------------------

import {
  Card,
  EmptyState,
  ErrorState,
  Skeleton,
} from '@/components/ui';

import type {
  JourneyBoardingParticipant,
} from '@/features/journey-boarding/models';

import {
  useJourneyBoardingParticipants,
} from '@/features/journey-boarding/hooks';

import {
  JourneyParticipantCard,
} from './journey-participant-card';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyParticipantsListProps {
  /**
   * Public identifier of the Journey Boarding.
   */
  journeyBoardingPublicId: string;

  /**
   * Public identifier of the authenticated passenger's own participant.
   * Supply only after ownership has been established using trusted identity.
   */
  currentPassengerParticipantPublicId?: string;

  /**
   * Optional heading for the participant list.
   */
  title?: string;
}

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

function ParticipantsLoadingState() {
  return (
    <div
      className="grid gap-3"
      role="status"
      aria-label="Loading journey participants"
      aria-busy="true"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <Card
          key={`participant-skeleton-${index}`}
          padding="md"
          aria-hidden="true"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48 max-w-full" />
            </div>

            <Skeleton
              radius="full"
              className="h-5 w-20"
            />
          </div>

          <div className="mt-4 grid gap-2">
            <Skeleton className="h-3 w-40 max-w-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Empty State
// -----------------------------------------------------------------------------

function ParticipantsEmptyState() {
  return (
    <EmptyState
      title="No other participants"
      description="There are no other journey participants to display at the moment."
    />
  );
}

// -----------------------------------------------------------------------------
// Error State
// -----------------------------------------------------------------------------

function ParticipantsErrorState({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <ErrorState
      title="Unable to load participants"
      description="We couldn't retrieve the participants for this journey. Please try again."
      retryAction={{
        label: 'Try again',
        onClick: onRetry,
      }}
    />
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyParticipantsList({
  journeyBoardingPublicId,
  currentPassengerParticipantPublicId,
  title = 'Other journey participants',
}: JourneyParticipantsListProps) {
  const hasBoardingPublicId =
    journeyBoardingPublicId.trim().length > 0;

  const {
    data: participants,
    isPending,
    isError,
    refetch,
    isFetching,
  } = useJourneyBoardingParticipants({
    publicId: journeyBoardingPublicId,
    enabled: hasBoardingPublicId,
  });

  if (!hasBoardingPublicId) {
    return (
      <ErrorState
        title="Journey boarding unavailable"
        description="A valid Journey Boarding identifier is required to load participants."
      />
    );
  }

  if (isPending) {
    return <ParticipantsLoadingState />;
  }

  if (isError) {
    return (
      <ParticipantsErrorState
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  const allParticipants: JourneyBoardingParticipant[] =
    participants ?? [];

  const visibleParticipants = currentPassengerParticipantPublicId
    ? allParticipants.filter(
        (participant) =>
          participant.publicId !==
          currentPassengerParticipantPublicId,
      )
    : allParticipants;

  if (visibleParticipants.length === 0) {
    return <ParticipantsEmptyState />;
  }

  return (
    <section
      className="grid gap-4"
      aria-labelledby="journey-participants-heading"
      aria-busy={isFetching}
    >
      <div className="min-w-0">
        <h2
          id="journey-participants-heading"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          {title}
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          {visibleParticipants.length}{' '}
          {visibleParticipants.length === 1
            ? 'participant'
            : 'participants'}
        </p>
      </div>

      <div className="grid gap-3">
          {visibleParticipants.map((participant, index) => (
          <JourneyParticipantCard
            key={`${participant.publicId || 'participant'}-${index}`}
            journeyBoardingPublicId={journeyBoardingPublicId}
            participant={participant}
          />
        ))}
      </div>
    </section>
  );
}
