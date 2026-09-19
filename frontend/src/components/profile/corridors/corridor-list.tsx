// -----------------------------------------------------------------------------
// sisiMove — Corridor List
// -----------------------------------------------------------------------------
//
// Presentation-only list of the traveller's frequent travel corridors.
//
// Responsibilities:
// - Render corridor items.
// - Preserve the order supplied by the parent.
//
// Non-responsibilities:
// - Fetching corridors.
// - Sorting or ranking corridors.
// - Creating, editing, or deleting corridors.
// - Translating corridor data into another presentation model.
//
// Architectural note:
// - TravellerProfileCorridor is the authoritative frontend representation of
//   a Traveller Profile corridor.
// - This component intentionally consumes that feature model directly rather
//   than introducing a duplicate local Corridor interface.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import type { TravellerProfileCorridor } from '@/features/traveller-profile/models';

import { CorridorItem } from './corridor-item';

export interface CorridorListProps {
  readonly corridors: readonly TravellerProfileCorridor[];
}

export function CorridorList({
  corridors,
}: CorridorListProps): ReactNode {
  if (corridors.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-background p-6 text-sm text-muted-foreground">
        No travel corridors have been added yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {corridors.map((corridor) => (
        <CorridorItem
          key={corridor.publicId}
          corridor={corridor}
        />
      ))}
    </div>
  );
}