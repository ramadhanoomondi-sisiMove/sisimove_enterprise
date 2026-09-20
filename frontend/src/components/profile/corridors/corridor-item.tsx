// -----------------------------------------------------------------------------
// sisiMove — Corridor Item
// -----------------------------------------------------------------------------
//
// Presentation-only representation of one frequently travelled corridor.
//
// A corridor is a reusable Traveller Profile preference/reference such as:
//
//     Nairobi → Mombasa
//     Nairobi → Kisumu
//
// Responsibilities:
// - Display one Traveller Profile corridor.
// - Display its human-readable origin and destination names.
// - Clearly identify whether the corridor is primary.
//
// Non-responsibilities:
// - Fetching corridor data.
// - Creating or editing corridors.
// - Determining corridor frequency.
// - Resolving Journey relationships.
// - Interpreting corridorKey.
// - Using geographic coordinates for presentation.
//
// Architectural note:
// - TravellerProfileCorridor is accepted directly as the component contract.
// - originName, destinationName, and isPrimary are already the appropriate
//   presentation values supplied by the Traveller Profile feature.
// - Coordinates and corridorKey remain part of the model for discovery,
//   matching, and management workflows but are intentionally unused here.
//
// Visual language:
// - Compact mobile-first route presentation.
// - Subtle inner surface rather than a heavy card treatment.
// - Clear origin → destination hierarchy.
// - sisiMove blue accent identifies the primary corridor.
// - No geographic interpretation or route-specific business logic.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import type { TravellerProfileCorridor } from '@/features/traveller-profile/models';

export interface CorridorItemProps {
  readonly corridor: TravellerProfileCorridor;
}

export function CorridorItem({
  corridor,
}: CorridorItemProps): ReactNode {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] px-4 py-3.5">
      <div className="flex min-w-0 items-start gap-3">
        {/* -----------------------------------------------------------------
            Route indicator
            -----------------------------------------------------------------
            This is purely visual. It does not encode route type, distance,
            frequency, or any other domain meaning.
        ----------------------------------------------------------------- */}
        <span
          aria-hidden="true"
          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--brand)]"
        />

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-[var(--foreground)]">
            <span className="min-w-0 truncate">
              {corridor.originName}
            </span>

            <span
              aria-hidden="true"
              className="shrink-0 text-[var(--foreground-subtle)]"
            >
              →
            </span>

            <span className="min-w-0 truncate">
              {corridor.destinationName}
            </span>
          </div>

          {corridor.isPrimary ? (
            <div className="mt-1.5">
              <span className="inline-flex items-center rounded-full border border-[var(--brand)] bg-[var(--brand-soft)] px-2 py-0.5 text-[11px] font-medium leading-4 text-[var(--brand)]">
                Primary corridor
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}