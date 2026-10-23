
'use client';

import { ArrowRight, MapPin, Route } from 'lucide-react';

import { cn } from '@/foundation/utils/cn';
import type { JourneyCorridor } from '@/features/admin/journeys/models/journey.model';

export interface JourneyRouteSummaryProps {
  corridor: JourneyCorridor;
  className?: string;
  showWaypointCount?: boolean;
}

export function JourneyRouteSummary({
  corridor,
  className,
  showWaypointCount = true,
}: JourneyRouteSummaryProps) {
  const waypointCount = corridor.waypoints.length;

  return (
    <section
      aria-label="Journey route summary"
      className={cn(
        'rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5',
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
            <Route aria-hidden="true" className="size-4" />
          </span>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Route overview
            </h3>
            <p className="text-xs text-[var(--foreground-muted)]">
              Journey corridor
            </p>
          </div>
        </div>

        {showWaypointCount && (
          <span className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--background-subtle)] px-3 py-1 text-xs font-medium text-[var(--foreground-muted)]">
            {waypointCount} {waypointCount === 1 ? 'waypoint' : 'waypoints'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-[var(--success)]">
            <MapPin aria-hidden="true" className="size-4 shrink-0" />
            <span className="text-xs font-medium">Origin</span>
          </div>

          <p className="break-words text-sm font-semibold text-[var(--foreground)]">
            {corridor.originName || 'Origin not specified'}
          </p>

          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            {corridor.originLatitude}, {corridor.originLongitude}
          </p>
        </div>

        <div
          aria-hidden="true"
          className="flex items-center justify-center text-[var(--foreground-muted)]"
        >
          <ArrowRight className="size-5" />
        </div>

        <div className="min-w-0 text-right">
          <div className="mb-2 flex items-center justify-end gap-2 text-[var(--brand)]">
            <span className="text-xs font-medium">Destination</span>
            <MapPin aria-hidden="true" className="size-4 shrink-0" />
          </div>

          <p className="break-words text-sm font-semibold text-[var(--foreground)]">
            {corridor.destinationName || 'Destination not specified'}
          </p>

          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            {corridor.destinationLatitude},{' '}
            {corridor.destinationLongitude}
          </p>
        </div>
      </div>

      {corridor.corridorKey && (
        <div className="mt-4 border-t border-[var(--border)] pt-3">
          <p className="text-xs text-[var(--foreground-muted)]">
            Corridor key
          </p>
          <p className="mt-1 break-all font-mono text-xs text-[var(--foreground)]">
            {corridor.corridorKey}
          </p>
        </div>
      )}
    </section>
  );
}

export default JourneyRouteSummary;
