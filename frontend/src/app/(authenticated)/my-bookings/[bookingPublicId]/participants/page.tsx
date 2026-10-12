
'use client';

import { useParams } from 'next/navigation';

import { ErrorState, Skeleton } from '@/components/ui';

import { useCurrentIdentity } from '@/features/identity';

import { useJourneyBookingDetail } from '@/features/journey-booking/hooks/queries';

import { useJourneyBoardingByJourney } from '@/features/journey-boarding/hooks';

import { JourneyBoardingParticipantRole } from '@/features/journey-boarding/models';

import { PassengerParticipantsPage } from '@/components/journey-boarding/passenger';

function ParticipantsPageLoading() {
  return (
    <main className="page-shell">
      <div className="page-container py-6">
        <div className="mx-auto max-w-5xl space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-44 w-full" radius="lg" />
          <Skeleton className="h-32 w-full" radius="lg" />
          <Skeleton className="h-48 w-full" radius="lg" />
        </div>
      </div>
    </main>
  );
}

export default function BookingParticipantsRoutePage() {
  const params = useParams<{ bookingPublicId: string }>();

  const bookingPublicId = params.bookingPublicId?.trim() ?? '';

  const bookingQuery = useJourneyBookingDetail(bookingPublicId);

  const identityQuery = useCurrentIdentity();

  const booking = bookingQuery.data?.booking;

  const journeyPublicId = booking?.journeyPublicId ?? '';

  const boardingQuery = useJourneyBoardingByJourney({
    journeyPublicId,
    enabled:
      Boolean(journeyPublicId) &&
      !bookingQuery.isPending &&
      !bookingQuery.isError,
  });

  if (!bookingPublicId) {
    return (
      <ErrorState
        title="Booking not identified"
        description="We could not identify the booking for this page."
      />
    );
  }

  if (bookingQuery.isPending || identityQuery.isPending) {
    return <ParticipantsPageLoading />;
  }

  if (bookingQuery.isError || !booking) {
    return (
      <main className="page-shell">
        <div className="page-container py-6">
          <ErrorState
            title="Unable to load your booking"
            description="We couldn't retrieve this booking. Please try again."
            retryAction={{
              label: 'Try again',
              onClick: () => void bookingQuery.refetch(),
            }}
          />
        </div>
      </main>
    );
  }

  if (identityQuery.isError) {
    return (
      <main className="page-shell">
        <div className="page-container py-6">
          <ErrorState
            title="Unable to identify passenger"
            description={
              identityQuery.error instanceof Error
                ? identityQuery.error.message
                : 'We could not resolve your authenticated identity.'
            }
            retryAction={{
              label: 'Try again',
              onClick: () => void identityQuery.refetch(),
            }}
          />
        </div>
      </main>
    );
  }

  const identity = identityQuery.data;

  if (!identity) {
    return (
      <main className="page-shell">
        <div className="page-container py-6">
          <ErrorState
            title="Identity unavailable"
            description="Your authenticated identity could not be resolved. Please sign in again."
          />
        </div>
      </main>
    );
  }

  if (boardingQuery.isPending) {
    return <ParticipantsPageLoading />;
  }

  if (boardingQuery.isError || !boardingQuery.data) {
    return (
      <main className="page-shell">
        <div className="page-container py-6">
          <ErrorState
            title="Boarding information unavailable"
            description="Your booking was found, but we couldn't retrieve its journey boarding information."
            retryAction={{
              label: 'Try again',
              onClick: () => void boardingQuery.refetch(),
            }}
          />
        </div>
      </main>
    );
  }

  const boarding = boardingQuery.data;

  // Ensure the boarding record belongs to this booking's journey.
  if (boarding.journeyId !== journeyPublicId) {
    return (
      <main className="page-shell">
        <div className="page-container py-6">
          <ErrorState
            title="Journey boarding mismatch"
            description="The boarding record does not match the journey associated with this booking."
          />
        </div>
      </main>
    );
  }

  // Find the authenticated member's passenger participant by identity ID.
  // participant.publicId identifies the boarding participant record;
  // participant.memberPublicId identifies the member.
  const currentParticipant = boarding.participants.find(
    (participant) =>
      participant.role === JourneyBoardingParticipantRole.PASSENGER &&
      participant.memberPublicId === identity.publicId,
  );

  if (!currentParticipant) {
    return (
      <main className="page-shell">
        <div className="page-container py-6">
          <ErrorState
            title="Passenger boarding record not found"
            description="We couldn't find your passenger participant in this journey's boarding record. Your booking may not yet have been registered for boarding."
            retryAction={{
              label: 'Refresh boarding',
              onClick: () => void boardingQuery.refetch(),
            }}
          />
        </div>
      </main>
    );
  }

  const snapshot = booking.snapshot;

  return (
    <PassengerParticipantsPage
      boardingPublicId={boarding.publicId}
      currentParticipant={currentParticipant}
      origin={snapshot?.originName ?? 'Origin unavailable'}
      destination={snapshot?.destinationName ?? 'Destination unavailable'}
      departureAt={snapshot?.departureAt ?? null}
      journeyStatus={booking.journey?.status ?? null}
      providerName={booking.journey?.provider?.traveller?.handle ?? null}
      providerPublicId={boarding.providerPublicId}
    />
  );
}
