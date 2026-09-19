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
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background px-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="truncate">
            {corridor.originName}
          </span>

          <span
            aria-hidden="true"
            className="text-muted-foreground"
          >
            →
          </span>

          <span className="truncate">
            {corridor.destinationName}
          </span>
        </div>

        {corridor.isPrimary ? (
          <div className="mt-1 text-xs text-muted-foreground">
            Primary corridor
          </div>
        ) : null}
      </div>
    </div>
  );
}