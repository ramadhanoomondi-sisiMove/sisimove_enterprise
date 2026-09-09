// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Corridor
// -----------------------------------------------------------------------------
//
// Presentation component for a traveller's public primary corridor.
//
// Responsibilities:
// - Present the traveller's primary origin.
// - Present the traveller's primary destination.
// - Present public corridor waypoints.
//
// Non-responsibilities:
// - No API calls.
// - No authentication logic.
// - No authorization logic.
// - No journey scheduling.
// - No pricing.
// - No pickup or drop-off locations.
// - No live location.
// - No booking logic.
// - No Trust logic.
//
// A Traveller Corridor is a high-level public route identity.
// It is NOT a Journey.
//
// -----------------------------------------------------------------------------

import type {
  TravellerCorridor,
} from '@/features/traveller-profile';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface TravellerProfileCorridorProps {
  corridor: TravellerCorridor | null;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerProfileCorridor({
  corridor,
}: TravellerProfileCorridorProps) {
  if (!corridor) {
    return null;
  }

  return (
    <section
      aria-labelledby="traveller-primary-corridor-title"
      className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Heading                                                             */}
      {/* ------------------------------------------------------------------- */}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
          Travel route
        </p>

        <h2
          id="traveller-primary-corridor-title"
          className="mt-1 text-lg font-semibold text-neutral-950"
        >
          Primary corridor
        </h2>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Route                                                                */}
      {/* ------------------------------------------------------------------- */}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            From
          </p>

          <p className="mt-1 truncate text-base font-medium text-neutral-950">
            {corridor.origin}
          </p>
        </div>

        <div
          aria-hidden="true"
          className="hidden shrink-0 text-neutral-400 sm:block"
        >
          →
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            To
          </p>

          <p className="mt-1 truncate text-base font-medium text-neutral-950">
            {corridor.destination}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Waypoints                                                            */}
      {/* ------------------------------------------------------------------- */}

      {corridor.waypoints.length > 0 ? (
        <div className="mt-6 border-t border-neutral-100 pt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Along the way
          </p>

          <ol
            aria-label="Primary corridor waypoints"
            className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2"
          >
            {corridor.waypoints
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((waypoint, index) => (
                <li
                  key={waypoint.publicId}
                  className="flex items-center gap-2"
                >
                  {index > 0 ? (
                    <span
                      aria-hidden="true"
                      className="text-neutral-300"
                    >
                      ·
                    </span>
                  ) : null}

                  <span className="rounded-full bg-neutral-50 px-3 py-1.5 text-sm text-neutral-700 ring-1 ring-neutral-200">
                    {waypoint.name}
                  </span>
                </li>
              ))}
          </ol>
        </div>
      ) : null}
    </section>
  );
}