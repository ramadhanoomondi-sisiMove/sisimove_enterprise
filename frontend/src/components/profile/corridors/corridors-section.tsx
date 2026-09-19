// -----------------------------------------------------------------------------
// sisiMove — Frequent Travel Corridors Section
// -----------------------------------------------------------------------------
//
// Authenticated profile section displaying the traveller's frequently used
// travel corridors.
//
// Responsibilities:
// - Present the traveller's corridor list.
// - Provide the presentation-level Manage action.
// - Delegate list rendering to CorridorList.
//
// Non-responsibilities:
// - Fetching corridor data.
// - Creating or editing corridors.
// - Persisting corridor changes.
// - Determining which corridors are frequent.
//
// Architectural note:
// - TravellerProfileCorridor is the authoritative frontend model for a
//   Traveller Profile corridor.
// - This section does not introduce or transform that model into a duplicate
//   presentation type.
// - Corridor management remains a separate workflow from profile display.
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import type { TravellerProfileCorridor } from '@/features/traveller-profile/models';

import { CorridorList } from './corridor-list';

export interface CorridorsSectionProps {
  readonly corridors: readonly TravellerProfileCorridor[];
  readonly onManage?: () => void;
}

export function CorridorsSection({
  corridors,
  onManage,
}: CorridorsSectionProps): ReactNode {
  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide">
            Frequent Travel Corridors
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Routes you travel regularly.
          </p>
        </div>

        {onManage !== undefined ? (
          <button
            type="button"
            onClick={onManage}
            className="shrink-0 text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            Manage
          </button>
        ) : null}
      </div>

      <CorridorList corridors={corridors} />
    </section>
  );
}