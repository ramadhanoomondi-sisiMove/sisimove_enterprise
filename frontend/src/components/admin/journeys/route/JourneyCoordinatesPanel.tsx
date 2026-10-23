
'use client';

/**
 * sisiMove — Journey Coordinates Panel
 *
 * Displays the geographic coordinates of a journey's origin and destination.
 *
 * Responsibilities:
 * - Present latitude and longitude clearly.
 * - Label origin and destination independently.
 * - Provide accessible coordinate information.
 *
 * This component does not geocode coordinates or render an interactive map.
 */

import { useMemo } from 'react';
import { Copy, MapPin } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import type { JourneyCoordinates } from '@/features/admin/journeys/models/journey.model';

export interface JourneyCoordinatesPanelProps {
  origin: JourneyCoordinates;
  destination: JourneyCoordinates;
  originLabel?: string;
  destinationLabel?: string;
  className?: string;
}

interface CoordinateEntryProps {
  label: string;
  coordinates: JourneyCoordinates;
  variant: 'origin' | 'destination';
}

function isValidCoordinate(
  coordinates: JourneyCoordinates,
): boolean {
  return (
    Number.isFinite(coordinates.latitude) &&
    coordinates.latitude >= -90 &&
    coordinates.latitude <= 90 &&
    Number.isFinite(coordinates.longitude) &&
    coordinates.longitude >= -180 &&
    coordinates.longitude <= 180
  );
}

function formatCoordinate(value: number): string {
  return value.toFixed(6);
}

function CoordinateEntry({
  label,
  coordinates,
  variant,
}: CoordinateEntryProps) {
  const valid = isValidCoordinate(coordinates);

  const coordinateText = valid
    ? `${formatCoordinate(coordinates.latitude)}, ${formatCoordinate(coordinates.longitude)}`
    : null;

  const handleCopy = () => {
    if (!coordinateText || typeof navigator === 'undefined') {
      return;
    }

    void navigator.clipboard?.writeText(coordinateText);
  };

  return (
    <div className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-xl',
            variant === 'origin'
              ? 'bg-[var(--success-soft)] text-[var(--success)]'
              : 'bg-[var(--brand-soft)] text-[var(--brand)]',
          )}
        >
          <MapPin aria-hidden="true" className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            {variant === 'origin' ? 'Origin' : 'Destination'}
          </p>

          <h4 className="mt-1 break-words text-sm font-semibold text-[var(--foreground)]">
            {label}
          </h4>

          {valid && coordinateText ? (
            <div className="mt-3 space-y-1">
              <p className="text-xs text-[var(--foreground-muted)]">
                Latitude
              </p>

              <p className="font-mono text-sm tabular-nums text-[var(--foreground)]">
                {formatCoordinate(coordinates.latitude)}
              </p>

              <p className="pt-1 text-xs text-[var(--foreground-muted)]">
                Longitude
              </p>

              <p className="font-mono text-sm tabular-nums text-[var(--foreground)]">
                {formatCoordinate(coordinates.longitude)}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-[var(--danger)]">
              Coordinates are invalid or unavailable.
            </p>
          )}
        </div>

        {valid && (
          <button
            type="button"
            onClick={handleCopy}
            aria-label={`Copy coordinates for ${label}`}
            title="Copy coordinates"
            className={cn(
              'inline-flex size-9 shrink-0 items-center justify-center rounded-lg',
              'border border-[var(--border)] text-[var(--foreground-secondary)]',
              'transition hover:bg-[var(--background-subtle)]',
              'focus-visible:outline-2 focus-visible:outline-offset-2',
            )}
          >
            <Copy aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function JourneyCoordinatesPanel({
  origin,
  destination,
  originLabel = 'Journey origin',
  destinationLabel = 'Journey destination',
  className,
}: JourneyCoordinatesPanelProps) {
  const coordinatesAreIdentical = useMemo(
    () =>
      isValidCoordinate(origin) &&
      isValidCoordinate(destination) &&
      origin.latitude === destination.latitude &&
      origin.longitude === destination.longitude,
    [origin, destination],
  );

  return (
    <section
      aria-labelledby="journey-coordinates-heading"
      className={cn('space-y-4', className)}
    >
      <div>
        <h3
          id="journey-coordinates-heading"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Geographic coordinates
        </h3>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Recorded latitude and longitude for both journey endpoints.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <CoordinateEntry
          label={originLabel}
          coordinates={origin}
          variant="origin"
        />

        <CoordinateEntry
          label={destinationLabel}
          coordinates={destination}
          variant="destination"
        />
      </div>

      {coordinatesAreIdentical && (
        <p
          role="status"
          className="rounded-lg border border-[var(--warning)]/30 bg-[var(--warning-soft)] px-3 py-2 text-sm text-[var(--foreground-secondary)]"
        >
          The origin and destination coordinates are identical.
        </p>
      )}
    </section>
  );
}
