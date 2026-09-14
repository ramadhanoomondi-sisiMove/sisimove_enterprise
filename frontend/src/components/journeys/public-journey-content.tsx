// -----------------------------------------------------------------------------
// sisiMove — Public Journey Content
// -----------------------------------------------------------------------------
//
// Client-side presentation boundary for the public Journey detail page.
//
// PublicJourney is already the composed public read model. It contains the
// public Traveller, Trust, Route, Schedule, Vehicle, Capacity, Pricing,
// Preferences, and Asset information required by this page.
//
// This component therefore does not perform additional domain composition or
// fetch related public resources independently.
//
// Responsibilities:
//
// - resolve one public Journey through usePublicJourney();
// - handle loading, error, and not-found states;
// - present the public Journey information;
// - link the Journey provider to their public Traveller Profile;
// - provide the public booking entry point.
//
// It deliberately does not:
//
// - access Prisma or backend persistence models;
// - expose internal Journey or Identity identifiers;
// - fetch Traveller Profile or Trust independently;
// - fetch Asset records independently;
// - construct storage URLs;
// - perform Journey business logic.
//
// Public assets are already represented by safe renderable URLs in the
// PublicJourney read model and are rendered with next/image.
// -----------------------------------------------------------------------------

'use client';

import Image from 'next/image';
import Link from 'next/link';

import { usePublicJourney } from '@/features/journeys/hooks/public-use-journey';
import type {
  PublicJourney,
  PublicJourneyAsset,
  PublicJourneyPreferences,
} from '@/features/journeys/models';

// =============================================================================
// Types
// =============================================================================

export interface PublicJourneyContentProps {
  /**
   * Stable public Journey identifier supplied by the public route.
   */
  readonly publicId: string;
}

// =============================================================================
// Formatting
// =============================================================================

function formatJourneyDate(
  value: string,
  timezone: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone,
  }).format(date);
}

function formatPrice(
  amount: number,
  currency: string,
): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatVerificationLevel(
  level: PublicJourney['provider']['trust']['verificationLevel'],
): string {
  switch (level) {
    case 'HIGHLY_VERIFIED':
      return 'Highly verified';

    case 'VERIFIED':
      return 'Verified';

    case 'BASIC':
      return 'Basic verification';

    case 'NONE':
    default:
      return 'Not verified';
  }
}

// =============================================================================
// Loading State
// =============================================================================

function PublicJourneyLoadingState() {
  return (
    <section
      aria-label="Loading Journey"
      className="section"
    >
      <div className="page-container">
        <div className="surface animate-pulse space-y-6 p-6 sm:p-8">
          <div className="h-4 w-24 rounded bg-muted" />

          <div className="space-y-3">
            <div className="h-8 w-2/3 rounded bg-muted" />
            <div className="h-5 w-1/2 rounded bg-muted" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-24 rounded bg-muted"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Error State
// =============================================================================

interface PublicJourneyErrorStateProps {
  readonly error: Error;
}

function PublicJourneyErrorState({
  error,
}: PublicJourneyErrorStateProps) {
  return (
    <section className="section">
      <div className="page-container">
        <div
          role="alert"
          className="surface p-6 sm:p-8"
        >
          <p className="text-sm font-semibold text-destructive">
            We could not load this Journey.
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            {error.message}
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Explore journeys
          </Link>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Not Found State
// =============================================================================

function PublicJourneyNotFoundState() {
  return (
    <section className="section">
      <div className="page-container">
        <div className="surface p-6 sm:p-8">
          <h1 className="text-xl font-semibold">
            Journey not found
          </h1>

          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            This Journey may no longer be publicly available, or the link may
            no longer be valid.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Explore journeys
          </Link>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Provider
// =============================================================================

interface JourneyProviderProps {
  readonly journey: PublicJourney;
}

function JourneyProvider({
  journey,
}: JourneyProviderProps) {
  const { traveller, trust } = journey.provider;

  const profileHref = `/travellers/${encodeURIComponent(
    traveller.handle,
  )}`;

  return (
    <section
      aria-labelledby="journey-provider-heading"
      className="surface p-6"
    >
      <Link
        href={profileHref}
        aria-label={`View @${traveller.handle}'s profile`}
        className="group block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <div className="flex items-start gap-4">
          {traveller.avatar ? (
            <Image
              src={traveller.avatar.url}
              alt={traveller.avatar.alt ?? traveller.handle}
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-full object-cover transition group-hover:opacity-90"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted text-lg font-semibold transition group-hover:bg-muted/80"
            >
              {traveller.handle.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="journey-provider-heading"
                className="font-semibold group-hover:underline"
              >
                @{traveller.handle}
              </h2>

              {trust.verificationLevel !== 'NONE' && (
                <span className="rounded-full border px-2 py-0.5 text-xs font-medium">
                  {formatVerificationLevel(
                    trust.verificationLevel,
                  )}
                </span>
              )}
            </div>

            {traveller.bio && (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {traveller.bio}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span>
                ★ {trust.ratingAverage.toFixed(1)}
                {trust.ratingCount > 0 &&
                  ` (${trust.ratingCount})`}
              </span>

              <span>
                {trust.completedJourneys}{' '}
                {trust.completedJourneys === 1
                  ? 'completed journey'
                  : 'completed journeys'}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {trust.badges.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {trust.badges.map((badge) => (
            <div
              key={badge.publicId}
              title={badge.description ?? badge.name}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium"
            >
              {badge.asset && (
                <Image
                  src={badge.asset.url}
                  alt={badge.asset.alt ?? ''}
                  width={16}
                  height={16}
                  className="h-4 w-4 object-contain"
                />
              )}

              <span>{badge.name}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// =============================================================================
// Route
// =============================================================================

interface JourneyRouteProps {
  readonly journey: PublicJourney;
}

function JourneyRoute({
  journey,
}: JourneyRouteProps) {
  const {
    origin,
    destination,
    waypoints,
  } = journey.route;

  const intermediateWaypoints = waypoints
    .slice()
    .sort((left, right) => left.sequence - right.sequence)
    .filter(
      (waypoint) =>
        waypoint.type !== 'ORIGIN' &&
        waypoint.type !== 'DESTINATION',
    );

  return (
    <section
      aria-labelledby="journey-route-heading"
      className="surface p-6"
    >
      <h2
        id="journey-route-heading"
        className="text-lg font-semibold"
      >
        Journey route
      </h2>

      <div className="mt-6 space-y-5">
        <div className="flex gap-4">
          <div
            aria-hidden="true"
            className="mt-1 h-3 w-3 shrink-0 rounded-full border-2"
          />

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              From
            </p>

            <p className="mt-1 font-medium">
              {origin.name}
            </p>
          </div>
        </div>

        {intermediateWaypoints.map((waypoint) => (
          <div
            key={waypoint.publicId}
            className="flex gap-4"
          >
            <div
              aria-hidden="true"
              className="mt-1 h-3 w-3 shrink-0 rounded-full border"
            />

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {formatEnumLabel(waypoint.type)}
              </p>

              <p className="mt-1 font-medium">
                {waypoint.name}
              </p>
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <div
            aria-hidden="true"
            className="mt-1 h-3 w-3 shrink-0 rounded-full border-2"
          />

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              To
            </p>

            <p className="mt-1 font-medium">
              {destination.name}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Journey Summary
// =============================================================================

interface JourneySummaryProps {
  readonly journey: PublicJourney;
}

function JourneySummary({
  journey,
}: JourneySummaryProps) {
  const {
    schedule,
    capacity,
    pricing,
    vehicle,
  } = journey;

  return (
    <section
      aria-label="Journey summary"
      className="surface p-6"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Departure
          </p>

          <p className="mt-1 font-semibold">
            {formatJourneyDate(
              schedule.departureAt,
              schedule.timezone,
            )}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Price
          </p>

          <p className="mt-1 text-xl font-bold">
            {formatPrice(
              pricing.amount,
              pricing.currency,
            )}
          </p>

          <p className="text-xs text-muted-foreground">
            per seat
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Availability
          </p>

          <p className="mt-1 font-semibold">
            {capacity.availableSeats} available
          </p>

          <p className="text-xs text-muted-foreground">
            of {capacity.totalSeats} seats
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Vehicle
          </p>

          <p className="mt-1 font-semibold">
            {vehicle.make} {vehicle.model}
          </p>

          <p className="text-xs text-muted-foreground">
            {vehicle.year ?? 'Year unavailable'}
            {vehicle.color ? ` · ${vehicle.color}` : ''}
          </p>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Vehicle
// =============================================================================

interface JourneyVehicleProps {
  readonly journey: PublicJourney;
}

function JourneyVehicle({
  journey,
}: JourneyVehicleProps) {
  const { vehicle } = journey;

  return (
    <section
      aria-labelledby="journey-vehicle-heading"
      className="surface overflow-hidden"
    >
      {vehicle.asset && (
        <Image
          src={vehicle.asset.url}
          alt={
            vehicle.asset.alt ??
            `${vehicle.make} ${vehicle.model}`
          }
          width={1280}
          height={720}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="aspect-[16/9] w-full object-cover"
        />
      )}

      <div className="p-6">
        <h2
          id="journey-vehicle-heading"
          className="text-lg font-semibold"
        >
          Vehicle
        </h2>

        <p className="mt-2 font-medium">
          {vehicle.make} {vehicle.model}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {vehicle.year !== null && (
            <span>{vehicle.year}</span>
          )}

          {vehicle.color && (
            <span>{vehicle.color}</span>
          )}

          {vehicle.registration && (
            <span>{vehicle.registration}</span>
          )}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// Preferences
// =============================================================================

interface JourneyPreferencesProps {
  readonly preferences: PublicJourneyPreferences;
}

function JourneyPreferences({
  preferences,
}: JourneyPreferencesProps) {
  const entries = [
    ['Smoking', preferences.smoking],
    ['Pets', preferences.pets],
    ['Luggage', preferences.luggage],
    ['Conversation', preferences.conversation],
    ['Music', preferences.music],
  ] as const;

  return (
    <section
      aria-labelledby="journey-preferences-heading"
      className="surface p-6"
    >
      <h2
        id="journey-preferences-heading"
        className="text-lg font-semibold"
      >
        Journey preferences
      </h2>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {entries.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </dt>

            <dd className="mt-1 text-sm font-medium">
              {formatEnumLabel(value)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

// =============================================================================
// Journey Assets
// =============================================================================

interface JourneyAssetsProps {
  readonly assets: readonly PublicJourneyAsset[];
}

function JourneyAssets({
  assets,
}: JourneyAssetsProps) {
  if (assets.length === 0) {
    return null;
  }

  const sortedAssets = assets
    .slice()
    .sort(
      (left, right) =>
        left.sortOrder - right.sortOrder,
    );

  return (
    <section
      aria-labelledby="journey-assets-heading"
      className="surface p-6"
    >
      <h2
        id="journey-assets-heading"
        className="text-lg font-semibold"
      >
        Journey photos
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {sortedAssets.map(({ publicId, asset }) => (
          <Image
            key={publicId}
            src={asset.url}
            alt={asset.alt ?? 'Journey photo'}
            width={800}
            height={600}
            sizes="(min-width: 640px) 50vw, 100vw"
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
        ))}
      </div>
    </section>
  );
}

// =============================================================================
// Booking Action
// =============================================================================

interface JourneyBookingActionProps {
  readonly journey: PublicJourney;
}

function JourneyBookingAction({
  journey,
}: JourneyBookingActionProps) {
  const {
    capacity,
    pricing,
  } = journey;

  const isAvailable = capacity.availableSeats > 0;

  return (
    <section className="surface p-6">
      <p className="text-sm text-muted-foreground">
        Price per seat
      </p>

      <p className="mt-1 text-3xl font-bold">
        {formatPrice(
          pricing.amount,
          pricing.currency,
        )}
      </p>

      <p className="mt-2 text-sm text-muted-foreground">
        {isAvailable
          ? `${capacity.availableSeats} ${
              capacity.availableSeats === 1
                ? 'seat'
                : 'seats'
            } available`
          : 'No seats currently available'}
      </p>

      {isAvailable ? (
        <Link
          href={`/journeys/${encodeURIComponent(journey.publicId)}/book`}
          className="mt-6 flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Book this journey
        </Link>
      ) : (
        <div
          aria-disabled="true"
          className="mt-6 flex w-full items-center justify-center rounded-md border px-4 py-3 text-sm font-medium text-muted-foreground"
        >
          Fully booked
        </div>
      )}
    </section>
  );
}

// =============================================================================
// Main Presentation
// =============================================================================

interface PublicJourneyViewProps {
  readonly journey: PublicJourney;
}

function PublicJourneyView({
  journey,
}: PublicJourneyViewProps) {
  const {
    origin,
    destination,
  } = journey.route;

  return (
    <div className="section">
      <div className="page-container space-y-6">
        <div>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            ← Back to journeys
          </Link>

          <div className="mt-6">
            <p className="text-sm font-medium text-muted-foreground">
              Journey
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              {origin.name} → {destination.name}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              {formatJourneyDate(
                journey.schedule.departureAt,
                journey.schedule.timezone,
              )}
            </p>
          </div>
        </div>

        <JourneySummary journey={journey} />

        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
          <div className="min-w-0 space-y-6">
            <JourneyRoute journey={journey} />
            <JourneyAssets assets={journey.assets} />
            <JourneyVehicle journey={journey} />
            <JourneyPreferences
              preferences={journey.preferences}
            />
          </div>

          <aside className="min-w-0 space-y-6 lg:sticky lg:top-6 lg:self-start">
            <JourneyProvider journey={journey} />
            <JourneyBookingAction journey={journey} />
          </aside>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Public Journey Content
// =============================================================================

export function PublicJourneyContent({
  publicId,
}: PublicJourneyContentProps) {
  const {
    data: journey,
    isLoading,
    error,
  } = usePublicJourney(publicId);

  if (isLoading) {
    return <PublicJourneyLoadingState />;
  }

  if (error) {
    return <PublicJourneyErrorState error={error} />;
  }

  if (!journey) {
    return <PublicJourneyNotFoundState />;
  }

  return <PublicJourneyView journey={journey} />;
}

