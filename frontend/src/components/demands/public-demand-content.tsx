// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Content
// -----------------------------------------------------------------------------
//
// Public detail presentation for one Journey Demand.
//
// Journey Demand represents TRAVEL NEED rather than travel supply.
//
// This page presents:
//
// - who is requesting travel;
// - the requester's public trust information;
// - where they want to travel;
// - when they are willing to travel;
// - how many seats are required;
// - their price expectation;
// - which travellers have joined the Demand.
//
// `PublicJourneyDemand` is already the composed public read model.
//
// This component therefore:
//
// - resolves one Demand through `useJourneyDemand()`;
// - presents the returned public read model;
// - uses shared Traveller / Trust presentation;
// - uses the shared PublicAssetImage boundary;
// - constructs only presentation/navigation URLs.
//
// It does not:
//
// - fetch Traveller independently;
// - fetch Trust independently;
// - fetch Assets independently;
// - access Prisma or persistence models;
// - construct storage URLs;
// - create or mutate a Demand;
// - convert a Demand into a Journey;
// - implement matching business logic;
// - implement authentication;
// - implement verification.
//
// IMPORTANT:
//
// A Journey Demand does not represent a Journey.
//
// It has:
//
// - no vehicle;
// - no fixed Journey price;
// - no provider;
// - no booking state.
//
// A provider may discover the Demand and independently decide whether to
// create and publish a Journey capable of satisfying it.
//
// -----------------------------------------------------------------------------
//
// PUBLIC ACTION MODEL
//
// Viewing the Demand:
//
//     /demands/[publicId]
//              ↓
//          public access
//
// Joining the Demand:
//
//     click "Join this demand"
//              ↓
//     LoginRequiredModal
//              ↓
//       ┌──────┴──────┐
//       ↓             ↓
//    Sign in       Join sisiMove
//
// Authentication and verification remain outside this presentation boundary.
//
// -----------------------------------------------------------------------------
//
// RESPONSIVE LAYOUT
//
// Mobile / tablet:
//
//     Main content
//     Requester
//     Join
//     Provider opportunity
//
// Desktop:
//
//     ┌──────────────────────────────┬──────────────────────┐
//     │ Main Demand content          │ Requester            │
//     │                              │ Join                 │
//     │                              │ Provider opportunity  │
//     └──────────────────────────────┴──────────────────────┘
//
// The desktop split begins at `xl` so tablet and smaller laptop widths retain
// enough room for route names, dates, and demand information.
// -----------------------------------------------------------------------------

'use client';

import { useState } from 'react';
import Link from 'next/link';

import { LoginRequiredModal } from '@/components/authentication/login-required-modal';
import { PublicAssetImage } from '@/components/landing/shared/assets';
import { TravellerSummary } from '@/components/landing/shared/traveller';
import { TrustSummary } from '@/components/landing/shared/trust';
import { useJourneyDemand } from '@/features/journey-demands';
import type {
  PublicJourneyDemand,
  PublicJourneyDemandParticipant,
} from '@/features/journey-demands';

// =============================================================================
// Types
// =============================================================================

export interface PublicDemandContentProps {
  /**
   * Stable public Journey Demand identifier supplied by the public route.
   */
  readonly publicId: string;
}

// =============================================================================
// Formatting
// =============================================================================

function formatDateTime(
  value: string,
  timezone: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone,
  }).format(date);
}

function formatDateRange(
  earliestDeparture: string,
  latestDeparture: string,
  timezone: string,
): string {
  const earliest = new Date(earliestDeparture);
  const latest = new Date(latestDeparture);

  if (
    Number.isNaN(earliest.getTime()) ||
    Number.isNaN(latest.getTime())
  ) {
    return `${earliestDeparture} – ${latestDeparture}`;
  }

  const dateFormatter = new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: timezone,
  });

  const sameDay =
    dateFormatter.format(earliest) ===
    dateFormatter.format(latest);

  if (sameDay) {
    const date = new Intl.DateTimeFormat('en-KE', {
      dateStyle: 'medium',
      timeZone: timezone,
    }).format(earliest);

    const timeFormatter = new Intl.DateTimeFormat('en-KE', {
      timeStyle: 'short',
      timeZone: timezone,
    });

    return `${date}, ${timeFormatter.format(
      earliest,
    )} – ${timeFormatter.format(latest)}`;
  }

  return `${formatDateTime(
    earliestDeparture,
    timezone,
  )} – ${formatDateTime(latestDeparture, timezone)}`;
}

function formatMoney(
  amount: number | null,
  currency: string,
): string | null {
  if (amount === null) {
    return null;
  }

  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

function formatDemandStatus(
  status: PublicJourneyDemand['status'],
): string {
  switch (status) {
    case 'OPEN':
      return 'Open';

    case 'MATCHED':
      return 'Matched';

    case 'CONVERTED':
      return 'Converted';

    case 'FULFILLED':
      return 'Fulfilled';

    default:
      return status;
  }
}

function formatWaypointType(
  type: string,
): string {
  return type
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function getActiveParticipants(
  participants: readonly PublicJourneyDemandParticipant[],
): readonly PublicJourneyDemandParticipant[] {
  return participants.filter(
    (participant) =>
      participant.status === 'ACTIVE',
  );
}

// =============================================================================
// Loading State
// =============================================================================

function LoadingState() {
  return (
    <section
      aria-label="Loading travel demand"
      className="section"
    >
      <div className="page-container">
        <div className="mx-auto max-w-5xl animate-pulse space-y-5 sm:space-y-6">
          <div className="h-5 w-32 rounded bg-[var(--background-muted)]" />

          <div className="surface space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="h-5 w-28 rounded bg-[var(--background-muted)]" />

            <div className="h-10 w-full max-w-3xl rounded bg-[var(--background-muted)]" />

            <div className="h-5 w-full max-w-xl rounded bg-[var(--background-muted)]" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-24 rounded bg-[var(--background-muted)]" />
              <div className="h-24 rounded bg-[var(--background-muted)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Error State
// =============================================================================

function ErrorState({
  message,
}: {
  readonly message: string;
}) {
  return (
    <section className="section">
      <div className="page-container">
        <div className="mx-auto max-w-3xl">
          <div
            role="alert"
            className="surface border border-[color:rgb(220_38_38_/_0.2)] p-4 sm:p-6 lg:p-8"
          >
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              Unable to load this travel demand
            </h1>

            <p className="mt-2 break-words text-sm leading-6 text-[var(--foreground-secondary)]">
              {message}
            </p>

            <Link
              href="/"
              className={[
                'mt-6 inline-flex items-center',
                'rounded-[var(--radius-md)]',
                'border border-[var(--border)]',
                'px-4 py-2',
                'text-sm font-medium',
                'text-[var(--foreground)]',
                'transition-colors',
                'hover:bg-[var(--background-subtle)]',
                'focus:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-[var(--brand)]',
                'focus-visible:ring-offset-2',
              ].join(' ')}
            >
              Back to marketplace
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Not Found State
// =============================================================================

function NotFoundState() {
  return (
    <section className="section">
      <div className="page-container">
        <div className="mx-auto max-w-3xl">
          <div className="surface p-4 sm:p-6 lg:p-8">
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              Travel demand not found
            </h1>

            <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
              This travel demand may no longer be publicly available.
            </p>

            <Link
              href="/"
              className={[
                'mt-6 inline-flex items-center',
                'rounded-[var(--radius-md)]',
                'border border-[var(--border)]',
                'px-4 py-2',
                'text-sm font-medium',
                'text-[var(--foreground)]',
                'transition-colors',
                'hover:bg-[var(--background-subtle)]',
                'focus:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-[var(--brand)]',
                'focus-visible:ring-offset-2',
              ].join(' ')}
            >
              Back to marketplace
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Requester
// =============================================================================

function RequesterSection({
  demand,
}: {
  readonly demand: PublicJourneyDemand;
}) {
  const { traveller, trust } = demand.requester;

  return (
    <section
      aria-labelledby="demand-requester-heading"
      className="surface p-4 sm:p-6"
    >
      <h2
        id="demand-requester-heading"
        className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]"
      >
        Requested by
      </h2>

      <div className="mt-4 min-w-0">
        <TravellerSummary
          traveller={traveller}
          linkToProfile
        />
      </div>

      {traveller.bio && (
        <p className="mt-4 break-words text-sm leading-6 text-[var(--foreground-secondary)]">
          {traveller.bio}
        </p>
      )}

      <div className="mt-5 border-t border-[var(--border-subtle)] pt-5">
        <TrustSummary
          trust={trust}
          showBadges
        />
      </div>
    </section>
  );
}

// =============================================================================
// Route
// =============================================================================

function RouteSection({
  route,
}: {
  readonly route: PublicJourneyDemand['route'];
}) {
  const waypoints = route.waypoints
    .slice()
    .sort(
      (left, right) =>
        left.sequence - right.sequence,
    );

  return (
    <section
      aria-labelledby="demand-route-heading"
      className="surface p-4 sm:p-6 lg:p-8"
    >
      <h2
        id="demand-route-heading"
        className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]"
      >
        Requested route
      </h2>

      <div className="mt-6">
        {/* ----------------------------------------------------------------- */}
        {/* Origin                                                             */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex min-w-0 gap-3 sm:gap-4">
          <div className="relative flex w-4 shrink-0 justify-center">
            <div
              aria-hidden="true"
              className="mt-1 h-3 w-3 rounded-full border-2 border-[var(--brand)] bg-[var(--background)]"
            />

            {waypoints.length > 0 && (
              <div
                aria-hidden="true"
                className="absolute top-4 bottom-0 w-px bg-[var(--border)]"
              />
            )}
          </div>

          <div className="min-w-0 flex-1 pb-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              From
            </p>

            <p className="mt-1 break-words text-lg font-semibold text-[var(--foreground)]">
              {route.origin.name}
            </p>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Requested waypoints                                                */}
        {/* ----------------------------------------------------------------- */}

        {waypoints.map((waypoint, index) => (
          <div
            key={waypoint.publicId}
            className="flex min-w-0 gap-3 sm:gap-4"
          >
            <div className="relative flex w-4 shrink-0 justify-center">
              <div
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full bg-[var(--foreground-subtle)]"
              />

              {index < waypoints.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute top-2.5 bottom-0 w-px bg-[var(--border)]"
                />
              )}
            </div>

            <div className="min-w-0 flex-1 pb-5">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                {formatWaypointType(waypoint.type)}
              </p>

              <p className="mt-1 break-words font-medium text-[var(--foreground)]">
                {waypoint.name}
              </p>

              {(waypoint.pickupRequired ||
                waypoint.dropoffRequired) && (
                <p className="mt-1 break-words text-xs text-[var(--foreground-muted)]">
                  {[
                    waypoint.pickupRequired
                      ? 'Pickup required'
                      : null,
                    waypoint.dropoffRequired
                      ? 'Drop-off required'
                      : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* ----------------------------------------------------------------- */}
        {/* Destination                                                        */}
        {/* ----------------------------------------------------------------- */}

        <div className="flex min-w-0 gap-3 sm:gap-4">
          <div className="flex w-4 shrink-0 justify-center">
            <div
              aria-hidden="true"
              className="mt-1 h-3 w-3 rounded-full border-2 border-[var(--brand)] bg-[var(--background)]"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              To
            </p>

            <p className="mt-1 break-words text-lg font-semibold text-[var(--foreground)]">
              {route.destination.name}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Schedule
// =============================================================================

function ScheduleSection({
  schedule,
}: {
  readonly schedule: PublicJourneyDemand['schedule'];
}) {
  return (
    <section
      aria-labelledby="demand-schedule-heading"
      className="surface p-4 sm:p-6 lg:p-8"
    >
      <h2
        id="demand-schedule-heading"
        className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]"
      >
        When they want to travel
      </h2>

      <p className="mt-3 break-words text-lg font-semibold text-[var(--foreground)]">
        {formatDateRange(
          schedule.earliestDeparture,
          schedule.latestDeparture,
          schedule.timezone,
        )}
      </p>

      <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
        Flexible departure window
      </p>

      <dl className="mt-6 grid gap-5 sm:grid-cols-2">
        {schedule.targetArrival && (
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Preferred arrival
            </dt>

            <dd className="mt-1 break-words text-sm font-medium text-[var(--foreground)]">
              {formatDateTime(
                schedule.targetArrival,
                schedule.timezone,
              )}
            </dd>
          </div>
        )}

        {schedule.maximumArrival && (
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Latest acceptable arrival
            </dt>

            <dd className="mt-1 break-words text-sm font-medium text-[var(--foreground)]">
              {formatDateTime(
                schedule.maximumArrival,
                schedule.timezone,
              )}
            </dd>
          </div>
        )}

        <div className="min-w-0">
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Timezone
          </dt>

          <dd className="mt-1 break-words text-sm font-medium text-[var(--foreground)]">
            {schedule.timezone}
          </dd>
        </div>
      </dl>
    </section>
  );
}

// =============================================================================
// Demand Summary
// =============================================================================

function SummarySection({
  demand,
}: {
  readonly demand: PublicJourneyDemand;
}) {
  const maximumPrice = formatMoney(
    demand.pricing.maximumPricePerSeat,
    demand.pricing.currency,
  );

  const preferredPrice = formatMoney(
    demand.pricing.preferredPricePerSeat,
    demand.pricing.currency,
  );

  return (
    <section
      aria-labelledby="demand-summary-heading"
      className="surface p-4 sm:p-6 lg:p-8"
    >
      <h2
        id="demand-summary-heading"
        className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]"
      >
        Travel need
      </h2>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <div className="min-w-0">
          <p className="text-2xl font-semibold text-[var(--foreground)]">
            {demand.capacity.remainingSeats}
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            {demand.capacity.remainingSeats === 1
              ? 'seat still needed'
              : 'seats still needed'}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-2xl font-semibold text-[var(--foreground)]">
            {demand.capacity.requestedSeats}
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            seats requested
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-2xl font-semibold text-[var(--foreground)]">
            {demand.capacity.matchedSeats}
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            seats matched
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-[var(--border-subtle)] pt-6">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          Price expectation
        </h3>

        <div className="mt-3 space-y-2 text-sm text-[var(--foreground-secondary)]">
          {preferredPrice && (
            <p>
              Preferred:{' '}
              <span className="font-medium text-[var(--foreground)]">
                {preferredPrice} per seat
              </span>
            </p>
          )}

          {maximumPrice && (
            <p>
              Maximum acceptable:{' '}
              <span className="font-medium text-[var(--foreground)]">
                {maximumPrice} per seat
              </span>
            </p>
          )}

          {!preferredPrice && !maximumPrice && (
            <p>
              No price preference has been specified.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Participants
// =============================================================================

function ParticipantCard({
  participant,
}: {
  readonly participant: PublicJourneyDemandParticipant;
}) {
  const { traveller, trust } = participant;

  return (
    <Link
      href={`/travellers/${encodeURIComponent(traveller.handle)}`}
      className={[
        'block min-w-0 rounded-[var(--radius-md)]',
        'border border-[var(--border)]',
        'p-4',
        'transition-colors',
        'hover:bg-[var(--background-subtle)]',
        'focus:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-[var(--brand)]',
        'focus-visible:ring-offset-2',
      ].join(' ')}
    >
      <div className="min-w-0">
        <TravellerSummary
          traveller={traveller}
          linkToProfile={false}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--foreground-muted)]">
        <span>
          {participant.seats}{' '}
          {participant.seats === 1
            ? 'seat'
            : 'seats'}
        </span>

        <span>
          {trust.completedJourneys}{' '}
          {trust.completedJourneys === 1
            ? 'completed journey'
            : 'completed journeys'}
        </span>

        {trust.ratingCount > 0 && (
          <span>
            {trust.ratingAverage.toFixed(1)} rating
          </span>
        )}
      </div>
    </Link>
  );
}

function ParticipantsSection({
  participants,
}: {
  readonly participants: readonly PublicJourneyDemandParticipant[];
}) {
  const activeParticipants =
    getActiveParticipants(participants);

  if (activeParticipants.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="demand-participants-heading"
      className="surface p-4 sm:p-6 lg:p-8"
    >
      <h2
        id="demand-participants-heading"
        className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]"
      >
        Travellers joining this Demand
      </h2>

      <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">
        {activeParticipants.length === 1
          ? '1 traveller'
          : `${activeParticipants.length} travellers`}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {activeParticipants.map((participant) => (
          <ParticipantCard
            key={participant.publicId}
            participant={participant}
          />
        ))}
      </div>
    </section>
  );
}

// =============================================================================
// Join Demand Action
// =============================================================================
//
// Joining a Demand is a protected marketplace action.
//
// On the public marketplace:
//
//     Join this demand
//            ↓
//     login-required modal
//
// This component intentionally does not know whether the current visitor is
// authenticated. The public presentation simply exposes the protected action
// and asks the visitor to sign in.
//
// Once authenticated, the authenticated marketplace/action boundary can apply
// the verification requirement before allowing the actual join operation.
// =============================================================================

function JoinDemandSection({
  isOpen,
}: {
  readonly isOpen: boolean;
}) {
  const [loginModalOpen, setLoginModalOpen] =
    useState(false);

  if (!isOpen) {
    return (
      <section className="surface p-4 sm:p-6">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          This Demand is no longer open
        </p>

        <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
          New travellers can no longer join this travel request.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="surface p-4 sm:p-6">
        <p className="text-sm font-semibold text-[var(--foreground)]">
          Looking for the same journey?
        </p>

        <p className="mt-2 text-sm leading-6 text-[var(--foreground-secondary)]">
          Join this Demand to show that you are looking for the
          same route and travel window.
        </p>

        <button
          type="button"
          onClick={() => setLoginModalOpen(true)}
          className={[
            'mt-5 flex w-full items-center justify-center',
            'rounded-[var(--radius-md)]',
            'bg-[var(--brand)]',
            'px-4 py-3',
            'text-sm font-semibold',
            'text-[var(--brand-foreground)]',
            'transition-colors',
            'hover:bg-[var(--brand-hover)]',
            'focus:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-[var(--brand)]',
            'focus-visible:ring-offset-2',
          ].join(' ')}
        >
          Join this demand
        </button>
      </section>

      <LoginRequiredModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
}

// =============================================================================
// Provider Opportunity
// =============================================================================

function ProviderOpportunitySection() {
  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--brand-soft)] p-4 sm:p-6">
      <p className="text-sm font-semibold text-[var(--foreground)]">
        Can you make this journey?
      </p>

      <p className="mt-2 break-words text-sm leading-6 text-[var(--foreground-secondary)]">
        This Demand represents a real travel need. A provider can
        use it as an opportunity to plan and publish a Journey that
        satisfies the requested route and timing.
      </p>
    </section>
  );
}

// =============================================================================
// Public Journey Demand Content
// =============================================================================

export function PublicDemandContent({
  publicId,
}: PublicDemandContentProps) {
  const {
    data: demand,
    isLoading,
    error,
  } = useJourneyDemand(publicId);

  if (isLoading && !demand) {
    return <LoadingState />;
  }

  if (error && !demand) {
    return (
      <ErrorState
        message={
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while loading this travel demand.'
        }
      />
    );
  }

  if (!demand) {
    return <NotFoundState />;
  }

  const isOpen = demand.status === 'OPEN';

  return (
    <section className="section">
      <div className="page-container min-w-0">
        <div className="mx-auto max-w-6xl min-w-0">
          {/* ---------------------------------------------------------------- */}
          {/* Navigation                                                        */}
          {/* ---------------------------------------------------------------- */}

          <Link
            href="/"
            className={[
              'inline-flex max-w-full items-center',
              'text-sm font-medium',
              'text-[var(--foreground-secondary)]',
              'transition-colors',
              'hover:text-[var(--foreground)]',
              'focus:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]',
              'focus-visible:ring-offset-2',
            ].join(' ')}
          >
            ← Back to marketplace
          </Link>

          {/* ---------------------------------------------------------------- */}
          {/* Demand Header                                                     */}
          {/* ---------------------------------------------------------------- */}

          <header className="mt-5 min-w-0 sm:mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-semibold text-[var(--brand)]">
                Travel demand
              </span>

              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--foreground-secondary)]">
                {formatDemandStatus(demand.status)}
              </span>
            </div>

            <h1 className="mt-4 max-w-full break-words text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl lg:text-4xl">
              {demand.route.origin.name} →{' '}
              {demand.route.destination.name}
            </h1>

            <p className="mt-3 max-w-2xl break-words text-sm leading-6 text-[var(--foreground-secondary)] sm:text-base sm:leading-7">
              A traveller is looking for a journey between these
              locations.
            </p>
          </header>

          {/* ---------------------------------------------------------------- */}
          {/* Main Content                                                      */}
          {/* ---------------------------------------------------------------- */}
          {/*
           * Keep the Demand page single-column until `xl`.
           *
           * This prevents the requester/action sidebar from squeezing the
           * route and schedule information on tablets and smaller laptops.
           */}

          <div className="mt-6 grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start xl:gap-6">
            {/* -------------------------------------------------------------- */}
            {/* Main Demand content                                             */}
            {/* -------------------------------------------------------------- */}

            <main className="min-w-0 space-y-5 sm:space-y-6">
              <RouteSection route={demand.route} />

              <ScheduleSection schedule={demand.schedule} />

              <SummarySection demand={demand} />

              <ParticipantsSection
                participants={demand.participants}
              />
            </main>

            {/* -------------------------------------------------------------- */}
            {/* Sidebar                                                         */}
            {/* -------------------------------------------------------------- */}

            <aside className="min-w-0 space-y-5 sm:space-y-6 xl:sticky xl:top-6 xl:self-start">
              <RequesterSection demand={demand} />

              <JoinDemandSection
                isOpen={isOpen}
              />

              <ProviderOpportunitySection />
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}