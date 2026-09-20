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
//
// Visual language:
// - Compact mobile-first list.
// - Consistent spacing with other profile sections.
// - Empty state uses a restrained dashed surface.
// - No ranking, sorting, or corridor interpretation is performed here.
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
      <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--background-subtle)] px-4 py-5 text-center sm:px-5">
        <p className="text-sm font-medium text-[var(--foreground-secondary)]">
          No travel corridors yet
        </p>

        <p className="mt-1 text-xs leading-5 text-[var(--foreground-muted)]">
          Add your frequently travelled routes to make your profile more
          informative to other travellers.
        </p>
      </div>
    );
  }

  return (
    <div
      className="space-y-2.5"
      aria-label="Travel corridors"
    >
      {corridors.map((corridor) => (
        <CorridorItem
          key={corridor.publicId}
          corridor={corridor}
        />
      ))}
    </div>
  );
}