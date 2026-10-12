
'use client';

import { PassengerBoardingStatusCard } from './passenger-boarding-status-card';
import { JourneyParticipantsList } from './journey-participants-list';
import { PassengerBoardingAction } from './passenger-boarding-action';
import { PassengerJourneySummary } from './passenger-journey-summary';

import type { JourneyBoardingParticipant } from '@/features/journey-boarding/models';

export interface PassengerParticipantsPageProps {
  boardingPublicId: string;
  currentParticipant: JourneyBoardingParticipant;
  origin: string;
  destination: string;
  departureAt?: string | Date | null;
  journeyStatus?: string | null;
  providerName?: string | null;
  onBoardingSuccess?: () => void;
  className?: string;
}

export function PassengerParticipantsPage({
  boardingPublicId,
  currentParticipant,
  origin,
  destination,
  departureAt,
  journeyStatus,
  providerName,
  onBoardingSuccess,
  className,
}: PassengerParticipantsPageProps) {
  return (
    <main className="page-shell">
      <div className="page-container py-5 sm:py-8">
        <div className={`mx-auto w-full max-w-5xl space-y-5 ${className ?? ''}`}>
          <header>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-muted)]">
              Your travel
            </p>

            <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
              Journey participants
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)] sm:text-base">
              Review your journey details, boarding status, and the other
              participants.
            </p>
          </header>

          <PassengerJourneySummary
            origin={origin}
            destination={destination}
            departureAt={departureAt}
            journeyStatus={journeyStatus}
            providerName={providerName}
          />

          <PassengerBoardingStatusCard
            participant={currentParticipant}
          />

          <PassengerBoardingAction
            boardingPublicId={boardingPublicId}
            participant={currentParticipant}
            onBoardingSuccess={onBoardingSuccess}
          />

          <section
            aria-labelledby="journey-participants-heading"
            className="space-y-3"
          >
            <div>
              <h2
                id="journey-participants-heading"
                className="text-lg font-semibold text-[var(--foreground)]"
              >
                Other journey participants
              </h2>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                See the participants associated with this journey.
              </p>
            </div>

            <JourneyParticipantsList
              journeyBoardingPublicId={boardingPublicId}
              currentPassengerParticipantPublicId={
                currentParticipant.publicId
              }
            />
          </section>
        </div>
      </div>
    </main>
  );
}
