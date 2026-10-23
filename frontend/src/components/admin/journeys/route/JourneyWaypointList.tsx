
'use client';

/**
 * sisiMove — Journey Waypoint List
 *
 * Displays the ordered waypoints along a journey corridor.
 *
 * Responsibilities:
 * - Sort waypoints by sequence.
 * - Identify pickup and drop-off locations.
 * - Display waypoint coordinates and location details.
 * - Provide a clear empty state when no intermediate waypoints exist.
 *
 * This component is presentation-only. It does not modify journey routes.
 */

import { useMemo } from 'react';
import {
  ArrowDown,
  ArrowUp,
  MapPin,
  Navigation,
  PackageCheck,
  Route,
} from 'lucide-react';

import { cn } from '@/foundation/utils/cn';

import type { JourneyWaypoint } from '@/features/admin/journeys/models/journey.model';

export interface JourneyWaypointListProps {
  waypoints: readonly JourneyWaypoint[];
  className?: string;
  showCoordinates?: boolean;
}

function formatCoordinate(value: number): string {
  return value.toFixed(6);
}

function isValidCoordinate(waypoint: JourneyWaypoint): boolean {
  return (
    Number.isFinite(waypoint.latitude) &&
    waypoint.latitude >= -90 &&
    waypoint.latitude <= 90 &&
    Number.isFinite(waypoint.longitude) &&
    waypoint.longitude >= -180 &&
    waypoint.longitude <= 180
  );
}

function getWaypointTypeLabel(type: string): string {
  const normalized = type.trim().replace(/[_-]+/g, ' ').toLowerCase();

  if (!normalized) {
    return 'Waypoint';
  }

  return normalized.replace(/\b\w/g, (character) =>
    character.toUpperCase(),
  );
}

function WaypointRole({
  isPickup,
  isDropoff,
}: {
  isPickup: boolean;
  isDropoff: boolean;
}) {
  if (isPickup && isDropoff) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--brand)]/20 bg-[var(--brand-soft)] px-2.5 py-1 text-xs font-medium text-[var(--brand)]">
        <PackageCheck aria-hidden="true" className="size-3.5" />
        Pickup & drop-off
      </span>
    );
  }

  if (isPickup) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--success)]/20 bg-[var(--success-soft)] px-2.5 py-1 text-xs font-medium text-[var(--success)]">
        <ArrowUp aria-hidden="true" className="size-3.5" />
        Pickup
      </span>
    );
  }

  if (isDropoff) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--brand)]/20 bg-[var(--brand-soft)] px-2.5 py-1 text-xs font-medium text-[var(--brand)]">
        <ArrowDown aria-hidden="true" className="size-3.5" />
        Drop-off
      </span>
    );
  }

  return null;
}

export default function JourneyWaypointList({
  waypoints,
  className,
  showCoordinates = true,
}: JourneyWaypointListProps) {
  const orderedWaypoints = useMemo(
    () =>
      [...waypoints].sort(
        (first, second) => first.sequence - second.sequence,
      ),
    [waypoints],
  );

  return (
    <section
      aria-labelledby="journey-waypoints-heading"
      className={cn('space-y-4', className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3
            id="journey-waypoints-heading"
            className="text-base font-semibold text-[var(--foreground)]"
          >
            Route waypoints
          </h3>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Ordered intermediate stops along the journey.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--background-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--foreground-secondary)]">
          <Route aria-hidden="true" className="size-3.5" />
          {orderedWaypoints.length}{' '}
          {orderedWaypoints.length === 1 ? 'waypoint' : 'waypoints'}
        </span>
      </div>

      {orderedWaypoints.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--background-subtle)] px-5 py-8 text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--foreground-muted)]">
            <MapPin aria-hidden="true" className="size-5" />
          </div>

          <p className="mt-3 text-sm font-medium text-[var(--foreground)]">
            No intermediate waypoints
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            This journey has no additional stops recorded between its endpoints.
          </p>
        </div>
      ) : (
        <ol className="space-y-0">
          {orderedWaypoints.map((waypoint, index) => {
            const validCoordinates = isValidCoordinate(waypoint);
            const waypointType = getWaypointTypeLabel(waypoint.type);

            return (
              <li
                key={waypoint.publicId || waypoint.id}
                className="relative flex gap-3 pb-5 last:pb-0"
              >
                {index < orderedWaypoints.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-[15px] top-8 w-px bg-[var(--border-strong)]"
                  />
                )}

                <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--foreground-secondary)]">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                        Stop {index + 1}
                        {Number.isFinite(waypoint.sequence)
                          ? ` · Sequence ${waypoint.sequence}`
                          : ''}
                      </p>

                      <h4 className="mt-1 break-words text-sm font-semibold text-[var(--foreground)]">
                        {waypoint.name || 'Unnamed waypoint'}
                      </h4>

                      <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                        {waypointType}
                      </p>
                    </div>

                    <WaypointRole
                      isPickup={waypoint.isPickup}
                      isDropoff={waypoint.isDropoff}
                    />
                  </div>

                  {showCoordinates && (
                    <div className="mt-4 flex items-start gap-2 border-t border-[var(--border-subtle)] pt-3">
                      <Navigation
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-[var(--foreground-muted)]"
                      />

                      {validCoordinates ? (
                        <p className="break-all font-mono text-xs tabular-nums text-[var(--foreground-secondary)]">
                          {formatCoordinate(waypoint.latitude)},{' '}
                          {formatCoordinate(waypoint.longitude)}
                        </p>
                      ) : (
                        <p className="text-xs text-[var(--danger)]">
                          Coordinates are invalid or unavailable.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
