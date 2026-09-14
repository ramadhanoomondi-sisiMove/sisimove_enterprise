// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Content
// -----------------------------------------------------------------------------
//
// Public detail presentation for one Journey Demand.
//
// Journey Demand represents TRAVEL NEED rather than travel supply.
//
// The page explains:
//
// - who is looking to travel;
// - why the requester can be trusted;
// - where they want to travel;
// - when they are willing to travel;
// - how many seats are required;
// - what price they are looking for;
// - which other travellers have joined the Demand.
//
// This component consumes the public Journey Demand read model through the
// public detail hook. It does not fetch Traveller, Trust, Asset, or any other
// domain resource independently.
//
// The backend public read boundary is responsible for resolving and redacting
// all information before it reaches this component.
//
// IMPORTANT:
//
// A Journey Demand does not represent a Journey.
//
// It has no vehicle, fixed Journey price, booking state, or concrete provider.
// A provider may discover the Demand and independently decide whether to
// create and publish a Journey that can satisfy it.
//
// -----------------------------------------------------------------------------
//
// Presentation boundary:
//
// Route
//   ↓
// PublicDemandContent
//   ↓
// useJourneyDemand()
//   ↓
// PublicJourneyDemand
//   ↓
// requester / trust / route / schedule / capacity / pricing / participants
//
// -----------------------------------------------------------------------------

'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useJourneyDemand } from '@/features/journey-demands';
import type {
  PublicJourneyDemand,
  PublicJourneyDemandParticipant,
} from '@/features/journey-demands';

// -----------------------------------------------------------------------------
// Formatting helpers
// -----------------------------------------------------------------------------

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
    dateFormatter.format(earliest) === dateFormatter.format(latest);

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

function formatVerificationLevel(
  level: string,
): string {
  switch (level) {
    case 'NONE':
      return 'Not verified';

    case 'BASIC':
      return 'Basic verification';

    case 'VERIFIED':
      return 'Verified';

    case 'HIGHLY_VERIFIED':
      return 'Highly verified';

    default:
      return level;
  }
}

function getActiveParticipants(
  participants: readonly PublicJourneyDemandParticipant[],
): readonly PublicJourneyDemandParticipant[] {
  return participants.filter(
    (participant) => participant.status === 'ACTIVE',
  );
}

// -----------------------------------------------------------------------------
// Loading state
// -----------------------------------------------------------------------------

function LoadingState() {
  return (
    <main className="page-container py-10 sm:py-14">
      <div className="mx-auto max-w-5xl animate-pulse space-y-6">
        <div className="h-5 w-32 rounded bg-muted" />

        <div className="surface space-y-6 p-6 sm:p-8">
          <div className="h-5 w-28 rounded bg-muted" />

          <div className="h-10 w-3/4 rounded bg-muted" />

          <div className="h-5 w-1/2 rounded bg-muted" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-24 rounded bg-muted" />
            <div className="h-24 rounded bg-muted" />
          </div>
        </div>
      </div>
    </main>
  );
}

// -----------------------------------------------------------------------------
// Error state
// -----------------------------------------------------------------------------

function ErrorState({
  message,
}: {
  readonly message: string;
}) {
  return (
    <main className="page-container py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="surface border border-destructive/20 p-6 sm:p-8">
          <h1 className="text-lg font-semibold">
            Unable to load this travel demand
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {message}
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Back to marketplace
          </Link>
        </div>
      </div>
    </main>
  );
}

// -----------------------------------------------------------------------------
// Not found state
// -----------------------------------------------------------------------------

function NotFoundState() {
  return (
    <main className="page-container py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="surface p-6 sm:p-8">
          <h1 className="text-lg font-semibold">
            Travel demand not found
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            This travel demand may no longer be publicly available.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Back to marketplace
          </Link>
        </div>
      </div>
    </main>
  );
}

// -----------------------------------------------------------------------------
// Requester
// -----------------------------------------------------------------------------

function RequesterSection({
  demand,
}: {
  readonly demand: PublicJourneyDemand;
}) {
  const { traveller, trust } = demand.requester;

  return (
    <section className="surface p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Requested by
      </p>

      <div className="mt-4 flex items-start gap-4">
        <Link
          href={`/travellers/${encodeURIComponent(traveller.handle)}`}
          className="shrink-0"
          aria-label={`View ${traveller.handle}'s profile`}
        >
          {traveller.avatar ? (
            <Image
              src={traveller.avatar.url}
              alt={traveller.avatar.alt ?? traveller.handle}
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-lg font-semibold"
            >
              {traveller.handle.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            href={`/travellers/${encodeURIComponent(traveller.handle)}`}
            className="font-semibold hover:underline"
          >
            {traveller.handle}
          </Link>

          {traveller.bio ? (
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              {traveller.bio}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5">
        <div>
          <p className="text-xs text-muted-foreground">
            Rating
          </p>

          <p className="mt-1 text-sm font-semibold">
            {trust.ratingCount > 0
              ? `${trust.ratingAverage.toFixed(1)} / 5`
              : 'No ratings yet'}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            Completed
          </p>

          <p className="mt-1 text-sm font-semibold">
            {trust.completedJourneys}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-muted-foreground">
          Verification
        </p>

        <p className="mt-1 text-sm font-medium">
          {formatVerificationLevel(trust.verificationLevel)}
        </p>
      </div>

      {trust.badges.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {trust.badges.map((badge) => (
            <span
              key={badge.publicId}
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium"
              title={badge.description ?? undefined}
            >
              {badge.asset ? (
                <Image
                  src={badge.asset.url}
                  alt={badge.asset.alt ?? badge.name}
                  width={16}
                  height={16}
                  className="h-4 w-4 object-contain"
                />
              ) : null}

              {badge.name}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}

// -----------------------------------------------------------------------------
// Route
// -----------------------------------------------------------------------------

function RouteSection({
  route,
}: {
  readonly route: PublicJourneyDemand['route'];
}) {
  const waypoints = route.waypoints
    .slice()
    .sort((a, b) => a.sequence - b.sequence);

  return (
    <section className="surface p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Requested route
      </p>

      <div className="mt-6">
        <div className="flex gap-4">
          <div className="relative flex w-4 shrink-0 justify-center">
            <div className="mt-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />

            {waypoints.length > 0 ? (
              <div className="absolute top-4 bottom-0 w-px bg-border" />
            ) : null}
          </div>

          <div className="min-w-0 pb-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              From
            </p>

            <p className="mt-1 text-lg font-semibold">
              {route.origin.name}
            </p>
          </div>
        </div>

        {waypoints.map((waypoint, index) => (
          <div
            key={waypoint.publicId}
            className="flex gap-4"
          >
            <div className="relative flex w-4 shrink-0 justify-center">
              <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/50" />

              {index < waypoints.length - 1 ? (
                <div className="absolute top-2.5 bottom-0 w-px bg-border" />
              ) : null}
            </div>

            <div className="min-w-0 pb-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {waypoint.type.replaceAll('_', ' ')}
              </p>

              <p className="mt-1 font-medium">
                {waypoint.name}
              </p>

              {waypoint.pickupRequired ||
              waypoint.dropoffRequired ? (
                <p className="mt-1 text-xs text-muted-foreground">
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
              ) : null}
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <div className="flex w-4 shrink-0 justify-center">
            <div className="mt-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              To
            </p>

            <p className="mt-1 text-lg font-semibold">
              {route.destination.name}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Schedule
// -----------------------------------------------------------------------------

function ScheduleSection({
  schedule,
}: {
  readonly schedule: PublicJourneyDemand['schedule'];
}) {
  return (
    <section className="surface p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        When they want to travel
      </p>

      <p className="mt-3 text-lg font-semibold">
        {formatDateRange(
          schedule.earliestDeparture,
          schedule.latestDeparture,
          schedule.timezone,
        )}
      </p>

      <p className="mt-2 text-sm text-muted-foreground">
        Flexible departure window
      </p>

      <dl className="mt-6 grid gap-5 sm:grid-cols-2">
        {schedule.targetArrival ? (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Preferred arrival
            </dt>

            <dd className="mt-1 text-sm font-medium">
              {formatDateTime(
                schedule.targetArrival,
                schedule.timezone,
              )}
            </dd>
          </div>
        ) : null}

        {schedule.maximumArrival ? (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Latest acceptable arrival
            </dt>

            <dd className="mt-1 text-sm font-medium">
              {formatDateTime(
                schedule.maximumArrival,
                schedule.timezone,
              )}
            </dd>
          </div>
        ) : null}

        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Timezone
          </dt>

          <dd className="mt-1 text-sm font-medium">
            {schedule.timezone}
          </dd>
        </div>
      </dl>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Demand summary
// -----------------------------------------------------------------------------

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

  const matchedSeats = demand.capacity.matchedSeats;
  const remainingSeats = demand.capacity.remainingSeats;

  return (
    <section className="surface p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Travel need
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <div>
          <p className="text-2xl font-semibold">
            {remainingSeats}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {remainingSeats === 1
              ? 'seat still needed'
              : 'seats still needed'}
          </p>
        </div>

        <div>
          <p className="text-2xl font-semibold">
            {demand.capacity.requestedSeats}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            seats requested
          </p>
        </div>

        <div>
          <p className="text-2xl font-semibold">
            {matchedSeats}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            seats matched
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <p className="text-sm font-semibold">
          Price expectation
        </p>

        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          {maximumPrice ? (
            <p>
              Maximum acceptable:{' '}
              <span className="font-medium text-foreground">
                {maximumPrice} per seat
              </span>
            </p>
          ) : null}

          {preferredPrice ? (
            <p>
              Preferred:{' '}
              <span className="font-medium text-foreground">
                {preferredPrice} per seat
              </span>
            </p>
          ) : null}

          {!maximumPrice && !preferredPrice ? (
            <p>
              No price preference has been specified.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Participants
// -----------------------------------------------------------------------------

function ParticipantCard({
  participant,
}: {
  readonly participant: PublicJourneyDemandParticipant;
}) {
  const { traveller, trust } = participant;

  return (
    <Link
      href={`/travellers/${encodeURIComponent(traveller.handle)}`}
      className="block rounded-lg border border-border p-4 transition hover:bg-muted/50"
    >
      <div className="flex items-center gap-3">
        {traveller.avatar ? (
          <Image
            src={traveller.avatar.url}
            alt={traveller.avatar.alt ?? traveller.handle}
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold"
          >
            {traveller.handle.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {traveller.handle}
          </p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {participant.seats}{' '}
            {participant.seats === 1 ? 'seat' : 'seats'}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span>
          {trust.completedJourneys} completed journeys
        </span>

        {trust.ratingCount > 0 ? (
          <span>
            {trust.ratingAverage.toFixed(1)} rating
          </span>
        ) : null}
      </div>
    </Link>
  );
}

function ParticipantsSection({
  participants,
}: {
  readonly participants: readonly PublicJourneyDemandParticipant[];
}) {
  const activeParticipants = getActiveParticipants(participants);

  if (activeParticipants.length === 0) {
    return null;
  }

  return (
    <section className="surface p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Travellers joining this demand
      </p>

      <h2 className="mt-1 text-lg font-semibold">
        {activeParticipants.length === 1
          ? '1 traveller'
          : `${activeParticipants.length} travellers`}
      </h2>

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

// -----------------------------------------------------------------------------
// Join Demand placeholder
// -----------------------------------------------------------------------------

function JoinDemandSection({
  isOpen,
}: {
  readonly isOpen: boolean;
}) {
  return (
    <section className="surface p-6">
      <p className="text-sm font-semibold">
        Looking for the same journey?
      </p>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Join this Demand to show that you are looking for the
        same route and travel window.
      </p>

      {/* ------------------------------------------------------------------- */}
      {/* PLACEHOLDER                                                          */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * The authenticated Join Demand flow is intentionally not wired yet.
       *
       * Do not invent the final route, authentication redirect, or command
       * contract here. This placeholder establishes the intended marketplace
       * action and can later be replaced by the real interaction.
       */}

      <Link
        href="#"
        aria-disabled={!isOpen}
        onClick={(event) => event.preventDefault()}
        className={[
          'mt-5 flex w-full items-center justify-center rounded-md px-4 py-3 text-sm font-semibold transition',
          isOpen
            ? 'cursor-not-allowed border border-primary text-primary opacity-70'
            : 'cursor-not-allowed border border-border text-muted-foreground opacity-60',
        ].join(' ')}
      >
        {isOpen ? 'Join this demand' : 'Demand is no longer open'}
      </Link>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Provider opportunity
// -----------------------------------------------------------------------------

function ProviderOpportunitySection() {
  return (
    <section className="surface-muted p-6">
      <p className="text-sm font-semibold">
        Can you make this journey?
      </p>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        This Demand represents a real travel need. A provider can
        use it as an opportunity to plan and publish a Journey that
        satisfies the requested route and timing.
      </p>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Public Journey Demand Content
// -----------------------------------------------------------------------------

export interface PublicDemandContentProps {
  readonly publicId: string;
}

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
    return <ErrorState message={error.message} />;
  }

  if (!demand) {
    return <NotFoundState />;
  }

  const isOpen = demand.status === 'OPEN';
  const requesterName = demand.requester.traveller.handle;

  return (
    <main className="page-container py-8 sm:py-10">
      <div className="mx-auto max-w-5xl">
        {/* ----------------------------------------------------------------- */}
        {/* Navigation                                                         */}
        {/* ----------------------------------------------------------------- */}

        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          ← Back to marketplace
        </Link>

        {/* ----------------------------------------------------------------- */}
        {/* Demand header                                                      */}
        {/* ----------------------------------------------------------------- */}

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Travel demand
            </span>

            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">
              {formatDemandStatus(demand.status)}
            </span>
          </div>

          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            {demand.route.origin.name} →{' '}
            {demand.route.destination.name}
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            {requesterName} is looking for a journey between these
            locations.
          </p>
        </header>

        {/* ----------------------------------------------------------------- */}
        {/* Main content                                                       */}
        {/* ----------------------------------------------------------------- */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-6">
            <RouteSection route={demand.route} />

            <ScheduleSection schedule={demand.schedule} />

            <SummarySection demand={demand} />

            <ParticipantsSection
              participants={demand.participants}
            />
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Sidebar                                                          */}
          {/* --------------------------------------------------------------- */}

          <aside className="min-w-0 space-y-6">
            <RequesterSection demand={demand} />

            <JoinDemandSection isOpen={isOpen} />

            <ProviderOpportunitySection />
          </aside>
        </div>
      </div>
    </main>
  );
}

