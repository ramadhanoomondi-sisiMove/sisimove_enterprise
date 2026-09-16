// -----------------------------------------------------------------------------
// sisiMove — Public Journey Content
// -----------------------------------------------------------------------------
//
// Client-side presentation boundary for the public Journey detail page.
//
// `PublicJourney` is already the composed public read model. It contains the
// public Traveller, Trust, Route, Schedule, Vehicle, Capacity, Pricing,
// Preferences, and Asset information required by this page.
//
// This component therefore does not perform additional domain composition or
// independently fetch related public resources.
//
// Responsibilities:
//
// - resolve one public Journey through `usePublicJourney()`;
// - handle loading, error, and not-found states;
// - present the public Journey information;
// - present the Journey provider using shared Traveller / Trust presentation;
// - render public assets through the shared `PublicAssetImage` boundary;
// - provide the public booking entry point.
//
// It deliberately does not:
//
// - access Prisma or backend persistence models;
// - expose internal Journey or Identity identifiers;
// - fetch Traveller Profile or Trust independently;
// - fetch Asset records independently;
// - construct storage URLs;
// - validate storage/provider-specific asset URLs;
// - perform Journey business logic.
//
// Asset rendering is intentionally delegated to `PublicAssetImage`.
//
// The Journey page should know that an asset exists, but it should not know
// how that asset is stored, transformed, or made renderable by Next Image.
//
// -----------------------------------------------------------------------------
//
// Architectural boundary:
//
// PublicJourney
//      │
//      ├── provider.traveller ──> TravellerSummary
//      ├── provider.trust ──────> TrustSummary
//      ├── vehicle.asset ───────> PublicAssetImage
//      ├── journey.assets[] ────> PublicAssetImage
//      └── badge.asset ─────────> PublicAssetImage
//
// This keeps the public Journey page a presentation consumer of the public
// read model rather than another public-data composition layer.
// -----------------------------------------------------------------------------

'use client';

import Link from 'next/link';

import { PublicAssetImage } from '@/components/landing/shared/assets';
import {TravellerSummary } from '@/components/landing/shared/traveller';
import { TrustSummary,} from '@/components/landing/shared/trust';
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

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone,
  }).format(date);
}

function formatPrice(
  amount: number,
  currency: string,
): string {
  return new Intl.NumberFormat('en-KE', {
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
          <div className="h-4 w-24 rounded bg-[var(--background-muted)]" />

          <div className="space-y-3">
            <div className="h-8 w-2/3 rounded bg-[var(--background-muted)]" />
            <div className="h-5 w-1/2 rounded bg-[var(--background-muted)]" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-24 rounded bg-[var(--background-muted)]"
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
  const message =
    error.message?.trim() ||
    'An unexpected error occurred while loading this Journey.';

  return (
    <section className="section">
      <div className="page-container">
        <div
          role="alert"
          className="surface p-6 sm:p-8"
        >
          <p className="text-sm font-semibold text-[var(--danger)]">
            We could not load this Journey.
          </p>

          <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
            {message}
          </p>

          <Link
            href="/"
            className={[
              'mt-6 inline-flex items-center rounded-[var(--radius-md)]',
              'border border-[var(--border)]',
              'px-4 py-2 text-sm font-medium',
              'text-[var(--foreground)]',
              'transition-colors',
              'hover:bg-[var(--background-subtle)]',
              'focus:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]',
              'focus-visible:ring-offset-2',
            ].join(' ')}
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
          <h1 className="text-xl font-semibold text-[var(--foreground)]">
            Journey not found
          </h1>

          <p className="mt-2 max-w-xl text-sm text-[var(--foreground-secondary)]">
            This Journey may no longer be publicly available, or the link may
            no longer be valid.
          </p>

          <Link
            href="/"
            className={[
              'mt-6 inline-flex items-center rounded-[var(--radius-md)]',
              'border border-[var(--border)]',
              'px-4 py-2 text-sm font-medium',
              'text-[var(--foreground)]',
              'transition-colors',
              'hover:bg-[var(--background-subtle)]',
              'focus:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]',
              'focus-visible:ring-offset-2',
            ].join(' ')}
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

  return (
    <section
      aria-labelledby="journey-provider-heading"
      className="surface p-6"
    >
      <div className="flex min-w-0 items-start gap-4">
        <div className="min-w-0 flex-1">
          <h2
            id="journey-provider-heading"
            className="sr-only"
          >
            Journey provider
          </h2>

          <TravellerSummary
            traveller={traveller}
            linkToProfile
          />

          {traveller.bio && (
            <p className="mt-4 text-sm leading-6 text-[var(--foreground-secondary)]">
              {traveller.bio}
            </p>
          )}
        </div>
      </div>

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
    .sort(
      (left, right) =>
        left.sequence - right.sequence,
    )
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
        className="text-lg font-semibold text-[var(--foreground)]"
      >
        Journey route
      </h2>

      <div className="mt-6 space-y-5">
        <div className="flex gap-4">
          <div
            aria-hidden="true"
            className="mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-[var(--brand)]"
          />

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              From
            </p>

            <p className="mt-1 font-medium text-[var(--foreground)]">
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
              className="mt-1 h-3 w-3 shrink-0 rounded-full border border-[var(--border-strong)]"
            />

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                {formatEnumLabel(waypoint.type)}
              </p>

              <p className="mt-1 font-medium text-[var(--foreground)]">
                {waypoint.name}
              </p>
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <div
            aria-hidden="true"
            className="mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-[var(--brand)]"
          />

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              To
            </p>

            <p className="mt-1 font-medium text-[var(--foreground)]">
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
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Departure
          </p>

          <p className="mt-1 font-semibold text-[var(--foreground)]">
            {formatJourneyDate(
              schedule.departureAt,
              schedule.timezone,
            )}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Price
          </p>

          <p className="mt-1 text-xl font-bold text-[var(--foreground)]">
            {formatPrice(
              pricing.amount,
              pricing.currency,
            )}
          </p>

          <p className="text-xs text-[var(--foreground-muted)]">
            per seat
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Availability
          </p>

          <p className="mt-1 font-semibold text-[var(--foreground)]">
            {capacity.availableSeats} available
          </p>

          <p className="text-xs text-[var(--foreground-muted)]">
            of {capacity.totalSeats} seats
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Vehicle
          </p>

          <p className="mt-1 font-semibold text-[var(--foreground)]">
            {vehicle.make} {vehicle.model}
          </p>

          <p className="text-xs text-[var(--foreground-muted)]">
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
        <PublicAssetImage
          asset={vehicle.asset}
          alt={
            vehicle.asset.alt ??
            `${vehicle.make} ${vehicle.model}`
          }
          fallbackAlt={`${vehicle.make} ${vehicle.model}`}
          width={1280}
          height={720}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="aspect-[16/9] w-full object-cover"
        />
      )}

      <div className="p-6">
        <h2
          id="journey-vehicle-heading"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          Vehicle
        </h2>

        <p className="mt-2 font-medium text-[var(--foreground)]">
          {vehicle.make} {vehicle.model}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[var(--foreground-secondary)]">
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
        className="text-lg font-semibold text-[var(--foreground)]"
      >
        Journey preferences
      </h2>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {entries.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              {label}
            </dt>

            <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
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
        className="text-lg font-semibold text-[var(--foreground)]"
      >
        Journey photos
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {sortedAssets.map(({ publicId, asset }) => (
          <PublicAssetImage
            key={publicId}
            asset={asset}
            alt={asset.alt ?? 'Journey photo'}
            fallbackAlt="Journey photo"
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
      <p className="text-sm text-[var(--foreground-secondary)]">
        Price per seat
      </p>

      <p className="mt-1 text-3xl font-bold text-[var(--foreground)]">
        {formatPrice(
          pricing.amount,
          pricing.currency,
        )}
      </p>

      <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
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
          className={[
            'mt-6 flex w-full items-center justify-center',
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
          Book this journey
        </Link>
      ) : (
        <div
          aria-disabled="true"
          className={[
            'mt-6 flex w-full items-center justify-center',
            'rounded-[var(--radius-md)]',
            'border border-[var(--border)]',
            'px-4 py-3',
            'text-sm font-medium',
            'text-[var(--foreground-muted)]',
          ].join(' ')}
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
            className={[
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
            ← Back to journeys
          </Link>

          <div className="mt-6">
            <p className="text-sm font-medium text-[var(--foreground-muted)]">
              Journey
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              {origin.name} → {destination.name}
            </h1>

            <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
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
    return (
      <PublicJourneyErrorState
        error={
          error instanceof Error
            ? error
            : new Error('An unexpected error occurred.')
        }
      />
    );
  }

  if (!journey) {
    return <PublicJourneyNotFoundState />;
  }

  return <PublicJourneyView journey={journey} />;
}