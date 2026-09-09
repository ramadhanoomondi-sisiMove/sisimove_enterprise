'use client';

// -----------------------------------------------------------------------------
// SisiMove — Journey Detail Page
// -----------------------------------------------------------------------------
//
// Public presentation of a Journey.
//
// This component is intentionally limited to public Journey information.
//
// It does not:
// - fetch data directly
// - mutate Journey state
// - perform booking
// - access Commercial
// - access Financial
// - expose private traveller information
// - expose phone numbers or private contact information
// - expose precise private meeting points
// - expose payment or wallet information
//
// Data retrieval belongs to the Journey API/hooks layer.
//
// Public information presented here may include:
// - route
// - public waypoints
// - schedule
// - public vehicle information
// - public seat availability
// - public seat price
// - public Journey preferences
// - public Journey assets
//
// Booking and other authenticated actions belong to their respective domains
// and should be introduced separately without coupling this presentation layer
// to Commercial or Financial.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useEffect,
} from 'react';

// -----------------------------------------------------------------------------
// Next.js
// -----------------------------------------------------------------------------

import Image from 'next/image';

// -----------------------------------------------------------------------------
// Foundation — Formatters
// -----------------------------------------------------------------------------

import {
  formatDate,
  formatTime,
} from '@/foundation/formatters';

// -----------------------------------------------------------------------------
// Journey
// -----------------------------------------------------------------------------

import {
  JourneySummary,
} from './journey-summary';

import {
  useJourney,
} from '../hooks';

import type {
  Journey,
} from '../models';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDetailPageProps {
  publicId: string;
}

// -----------------------------------------------------------------------------
// Preference Labels
// -----------------------------------------------------------------------------

function formatPreferenceLabel(
  value: string,
): string {
  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(
      /^\w/,
      (character) => character.toUpperCase(),
    );
}

// -----------------------------------------------------------------------------
// Vehicle Label
// -----------------------------------------------------------------------------

function formatVehicleLabel(
  make: string,
  model: string,
  year: number | null,
  color: string | null,
): string {
  return [
    year !== null ? String(year) : null,
    color,
    make,
    model,
  ]
    .filter(
      (
        value,
      ): value is string =>
        Boolean(value),
    )
    .join(' ');
}

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

function JourneyDetailLoadingState() {
  return (
    <section
      aria-labelledby="journey-detail-loading-title"
      aria-busy="true"
    >
      <div className="page-container py-10 sm:py-12 lg:py-16">
        <h1
          id="journey-detail-loading-title"
          className="sr-only"
        >
          Loading journey
        </h1>

        {/* ----------------------------------------------------------------- */}
        {/* Loading Header                                                     */}
        {/* ----------------------------------------------------------------- */}

        <header className="mb-8">
          <div
            aria-hidden="true"
            className="mb-3 h-4 w-40 animate-pulse rounded bg-[var(--muted)]"
          />

          <div
            aria-hidden="true"
            className="h-10 w-full max-w-xl animate-pulse rounded bg-[var(--muted)]"
          />

          <div
            aria-hidden="true"
            className="mt-4 h-5 w-72 animate-pulse rounded bg-[var(--muted)]"
          />
        </header>

        {/* ----------------------------------------------------------------- */}
        {/* Loading Content                                                    */}
        {/* ----------------------------------------------------------------- */}

        <div
          aria-hidden="true"
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]"
        >
          <div className="min-w-0 space-y-6">
            <div className="surface h-64 animate-pulse rounded-[var(--radius-lg)]" />

            <div className="surface h-48 animate-pulse rounded-[var(--radius-lg)]" />

            <div className="surface h-64 animate-pulse rounded-[var(--radius-lg)]" />

            <div className="surface h-56 animate-pulse rounded-[var(--radius-lg)]" />
          </div>

          <div className="surface h-80 animate-pulse rounded-[var(--radius-lg)]" />
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Error State
// -----------------------------------------------------------------------------

interface JourneyDetailErrorStateProps {
  error: Error;
  onRetry: () => void;
}

function JourneyDetailErrorState({
  error,
  onRetry,
}: JourneyDetailErrorStateProps) {
  const message =
    error.message.trim() ||
    'Something went wrong while loading this journey.';

  return (
    <section
      aria-labelledby="journey-detail-error-title"
    >
      <div className="page-container py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--brand)]">
            Journey
          </p>

          <h1
            id="journey-detail-error-title"
            className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl"
          >
            We could not load this journey
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-[var(--muted-foreground)]">
            {message}
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="mt-8 rounded-[var(--radius-md)] bg-[var(--brand)] px-5 py-3 font-medium text-white transition hover:bg-[var(--brand-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2"
          >
            Try again
          </button>
        </div>
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Journey Route
// -----------------------------------------------------------------------------

interface JourneyRouteSectionProps {
  journey: Journey;
}

function JourneyRouteSection({
  journey,
}: JourneyRouteSectionProps) {
  const {
    route,
  } = journey;

  const waypoints = route.waypoints
    .slice()
    .sort(
      (a, b) =>
        a.sequence - b.sequence,
    );

  return (
    <section
      aria-labelledby="journey-route-heading"
      className="surface rounded-[var(--radius-lg)] p-6"
    >
      <h2
        id="journey-route-heading"
        className="text-xl font-semibold text-[var(--foreground)]"
      >
        Route
      </h2>

      <ol className="mt-6">
        {/* ----------------------------------------------------------------- */}
        {/* Origin                                                             */}
        {/* ----------------------------------------------------------------- */}

        <li className="relative pb-6 pl-8">
          <span
            aria-hidden="true"
            className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-[var(--brand)] bg-[var(--background)]"
          />

          {waypoints.length > 0 && (
            <span
              aria-hidden="true"
              className="absolute left-[5px] top-4 h-full w-px bg-[var(--border)]"
            />
          )}

          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            From
          </p>

          <p className="mt-1 font-medium text-[var(--foreground)]">
            {route.originName}
          </p>
        </li>

        {/* ----------------------------------------------------------------- */}
        {/* Public Waypoints                                                   */}
        {/* ----------------------------------------------------------------- */}

        {waypoints.map(
          (waypoint, index) => (
            <li
              key={waypoint.publicId}
              className="relative pb-6 pl-8"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-1.5 h-3 w-3 rounded-full border border-[var(--border)] bg-[var(--background)]"
              />

              <span
                aria-hidden="true"
                className="absolute left-[5px] top-4 h-full w-px bg-[var(--border)]"
              />

              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                Stop {index + 1}
              </p>

              <p className="mt-1 text-[var(--foreground)]">
                {waypoint.name}
              </p>
            </li>
          ),
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Destination                                                        */}
        {/* ----------------------------------------------------------------- */}

        <li className="relative pl-8">
          <span
            aria-hidden="true"
            className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-[var(--brand)]"
          />

          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
            To
          </p>

          <p className="mt-1 font-medium text-[var(--foreground)]">
            {route.destinationName}
          </p>
        </li>
      </ol>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Journey Schedule
// -----------------------------------------------------------------------------

interface JourneyScheduleSectionProps {
  journey: Journey;
}

function JourneyScheduleSection({
  journey,
}: JourneyScheduleSectionProps) {
  const {
    schedule,
  } = journey;

  const departureDate = formatDate(
    schedule.departureAt,
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: schedule.timezone,
    },
  );

  const departureTime = formatTime(
    schedule.departureAt,
    {
      timeZone: schedule.timezone,
    },
  );

  const arrivalDate = schedule.arrivalAt
    ? formatDate(
        schedule.arrivalAt,
        {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          timeZone: schedule.timezone,
        },
      )
    : null;

  const arrivalTime = schedule.arrivalAt
    ? formatTime(
        schedule.arrivalAt,
        {
          timeZone: schedule.timezone,
        },
      )
    : null;

  return (
    <section
      aria-labelledby="journey-schedule-heading"
      className="surface rounded-[var(--radius-lg)] p-6"
    >
      <h2
        id="journey-schedule-heading"
        className="text-xl font-semibold text-[var(--foreground)]"
      >
        Schedule
      </h2>

      <dl className="mt-6 grid gap-6 sm:grid-cols-2">
        {/* ----------------------------------------------------------------- */}
        {/* Departure                                                          */}
        {/* ----------------------------------------------------------------- */}

        <div>
          <dt className="text-sm text-[var(--muted-foreground)]">
            Departure
          </dt>

          <dd className="mt-1 font-medium text-[var(--foreground)]">
            <time dateTime={schedule.departureAt}>
              <span className="block">
                {departureDate}
              </span>

              <span className="mt-1 block">
                {departureTime}
              </span>
            </time>
          </dd>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Arrival                                                            */}
        {/* ----------------------------------------------------------------- */}

        <div>
          <dt className="text-sm text-[var(--muted-foreground)]">
            Arrival
          </dt>

          <dd className="mt-1 font-medium text-[var(--foreground)]">
            {schedule.arrivalAt &&
            arrivalDate &&
            arrivalTime ? (
              <time dateTime={schedule.arrivalAt}>
                <span className="block">
                  {arrivalDate}
                </span>

                <span className="mt-1 block">
                  {arrivalTime}
                </span>
              </time>
            ) : (
              'Not specified'
            )}
          </dd>
        </div>
      </dl>

      <p className="mt-6 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted-foreground)]">
        Times shown in {schedule.timezone}.
      </p>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Journey Vehicle
// -----------------------------------------------------------------------------

interface JourneyVehicleSectionProps {
  journey: Journey;
}

function JourneyVehicleSection({
  journey,
}: JourneyVehicleSectionProps) {
  const {
    vehicle,
    assets,
  } = journey;

  if (!vehicle) {
    return null;
  }

  const vehicleAsset = assets
    .filter(
      (asset) =>
        asset.type === 'VEHICLE' &&
        Boolean(asset.url),
    )
    .slice()
    .sort(
      (a, b) =>
        a.sortOrder - b.sortOrder,
    )[0];

  const vehicleImage =
    vehicle.imageUrl ??
    vehicleAsset?.url ??
    null;

  const vehicleName = formatVehicleLabel(
    vehicle.make,
    vehicle.model,
    vehicle.year,
    vehicle.color,
  );

  return (
    <section
      aria-labelledby="journey-vehicle-heading"
      className="surface overflow-hidden rounded-[var(--radius-lg)]"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Vehicle Image                                                       */}
      {/* ------------------------------------------------------------------- */}

      {vehicleImage && (
        <div className="relative aspect-[16/9] w-full bg-[var(--muted)]">
          <Image
            src={vehicleImage}
            alt={vehicleName || 'Journey vehicle'}
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Vehicle Information                                                 */}
      {/* ------------------------------------------------------------------- */}

      <div className="p-6">
        <h2
          id="journey-vehicle-heading"
          className="text-xl font-semibold text-[var(--foreground)]"
        >
          Vehicle
        </h2>

        <p className="mt-3 font-medium text-[var(--foreground)]">
          {vehicle.make} {vehicle.model}
        </p>

        {(vehicle.year !== null ||
          vehicle.color !== null) && (
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {[
              vehicle.year !== null
                ? String(vehicle.year)
                : null,
              vehicle.color,
            ]
              .filter(
                (
                  value,
                ): value is string =>
                  Boolean(value),
              )
              .join(' · ')}
          </p>
        )}
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Journey Preferences
// -----------------------------------------------------------------------------

interface JourneyPreferencesSectionProps {
  journey: Journey;
}

function JourneyPreferencesSection({
  journey,
}: JourneyPreferencesSectionProps) {
  const {
    preferences,
  } = journey;

  if (!preferences) {
    return null;
  }

  return (
    <section
      aria-labelledby="journey-preferences-heading"
      className="surface rounded-[var(--radius-lg)] p-6"
    >
      <h2
        id="journey-preferences-heading"
        className="text-xl font-semibold text-[var(--foreground)]"
      >
        Journey preferences
      </h2>

      <dl className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
        {/* ----------------------------------------------------------------- */}
        {/* Smoking                                                            */}
        {/* ----------------------------------------------------------------- */}

        <div>
          <dt className="text-sm text-[var(--muted-foreground)]">
            Smoking
          </dt>

          <dd className="mt-1 text-[var(--foreground)]">
            {preferences.smoking === 'ALLOWED'
              ? 'Allowed'
              : 'Not allowed'}
          </dd>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Pets                                                               */}
        {/* ----------------------------------------------------------------- */}

        <div>
          <dt className="text-sm text-[var(--muted-foreground)]">
            Pets
          </dt>

          <dd className="mt-1 text-[var(--foreground)]">
            {formatPreferenceLabel(
              preferences.pets,
            )}
          </dd>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Luggage                                                            */}
        {/* ----------------------------------------------------------------- */}

        <div>
          <dt className="text-sm text-[var(--muted-foreground)]">
            Luggage
          </dt>

          <dd className="mt-1 text-[var(--foreground)]">
            {formatPreferenceLabel(
              preferences.luggage,
            )}
          </dd>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Conversation                                                       */}
        {/* ----------------------------------------------------------------- */}

        <div>
          <dt className="text-sm text-[var(--muted-foreground)]">
            Conversation
          </dt>

          <dd className="mt-1 text-[var(--foreground)]">
            {formatPreferenceLabel(
              preferences.conversation,
            )}
          </dd>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Music                                                              */}
        {/* ----------------------------------------------------------------- */}

        <div>
          <dt className="text-sm text-[var(--muted-foreground)]">
            Music
          </dt>

          <dd className="mt-1 text-[var(--foreground)]">
            {formatPreferenceLabel(
              preferences.music,
            )}
          </dd>
        </div>
      </dl>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Journey Detail Content
// -----------------------------------------------------------------------------

interface JourneyDetailContentProps {
  journey: Journey;
}

function JourneyDetailContent({
  journey,
}: JourneyDetailContentProps) {
  const {
    route,
    schedule,
  } = journey;

  const departureDate = formatDate(
    schedule.departureAt,
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: schedule.timezone,
    },
  );

  const departureTime = formatTime(
    schedule.departureAt,
    {
      timeZone: schedule.timezone,
    },
  );

  const arrivalTime = schedule.arrivalAt
    ? formatTime(
        schedule.arrivalAt,
        {
          timeZone: schedule.timezone,
        },
      )
    : null;

  return (
    <article
      aria-labelledby="journey-detail-title"
    >
      <div className="page-container py-10 sm:py-12 lg:py-16">
        {/* ----------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ----------------------------------------------------------------- */}

        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--brand)]">
            {journey.isBookable
              ? 'Journey available'
              : 'Journey unavailable'}
          </p>

          <h1
            id="journey-detail-title"
            className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl"
          >
            {route.originName} to{' '}
            {route.destinationName}
          </h1>

          <p className="mt-3 text-base text-[var(--muted-foreground)]">
            <time dateTime={schedule.departureAt}>
              {departureDate}
            </time>

            {' · '}

            <time dateTime={schedule.departureAt}>
              {departureTime}
            </time>

            {arrivalTime && (
              <>
                {' – '}

                <time
                  dateTime={
                    schedule.arrivalAt ?? undefined
                  }
                >
                  {arrivalTime}
                </time>
              </>
            )}
          </p>
        </header>

        {/* ----------------------------------------------------------------- */}
        {/* Main Content                                                      */}
        {/* ----------------------------------------------------------------- */}

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {/* ---------------------------------------------------------------- */}
          {/* Primary Journey Information                                      */}
          {/* ---------------------------------------------------------------- */}

          <div className="min-w-0 space-y-6">
            <JourneyRouteSection
              journey={journey}
            />

            <JourneyScheduleSection
              journey={journey}
            />

            <JourneyVehicleSection
              journey={journey}
            />

            <JourneyPreferencesSection
              journey={journey}
            />
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Public Journey Summary                                           */}
          {/* ---------------------------------------------------------------- */}

          <aside
            aria-label="Journey summary"
            className="lg:sticky lg:top-6"
          >
            <JourneySummary
              journey={journey}
            />
          </aside>
        </div>
      </div>
    </article>
  );
}

// -----------------------------------------------------------------------------
// Journey Detail Page
// -----------------------------------------------------------------------------

export function JourneyDetailPage({
  publicId,
}: JourneyDetailPageProps) {
  const {
    journey,
    isLoading,
    error,
    load,
    reset,
  } = useJourney();

  useEffect(() => {
    void load(publicId);

    return () => {
      reset();
    };
  }, [
    load,
    publicId,
    reset,
  ]);

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading && !journey) {
    return (
      <JourneyDetailLoadingState />
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (error && !journey) {
    return (
      <JourneyDetailErrorState
        error={error}
        onRetry={() => {
          void load(publicId);
        }}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Missing Journey
  // ---------------------------------------------------------------------------

  if (!journey) {
    return (
      <JourneyDetailErrorState
        error={
          new Error(
            'This journey could not be found.',
          )
        }
        onRetry={() => {
          void load(publicId);
        }}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Success
  // ---------------------------------------------------------------------------

  return (
    <JourneyDetailContent
      journey={journey}
    />
  );
}