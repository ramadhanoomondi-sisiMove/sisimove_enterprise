'use client';

// -----------------------------------------------------------------------------
// sisiMove — Travel Activity Section
// -----------------------------------------------------------------------------
//
// Authenticated profile section displaying the traveller's journey activity.
//
// Responsibilities:
// - Present travel activity statistics.
// - Group activity into clear traveller/provider categories.
// - Delegate individual statistic rendering to TravelActivityStat.
//
// Non-responsibilities:
// - Fetching journey history.
// - Calculating statistics.
// - Querying Journey or Booking domains.
// - Mutating journey activity.
//
// The parent profile/page owns data acquisition and supplies the already
// calculated values through props.
//
// Architectural note:
// - All values are authoritative presentation inputs supplied by the parent.
// - This component does not derive totals, completion counts, or role counts.
// - Grouping is purely visual and does not imply additional domain semantics.
//
// Visual language:
// - Compact mobile-first profile section.
// - sisiMove blue accent for section identity.
// - Related metrics are visually grouped for easier scanning.
// - Individual values remain delegated to TravelActivityStat.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { TravelActivityStat } from './travel-activity-stat';

export interface TravelActivitySectionProps {
  readonly totalJourneys: number;
  readonly completedJourneys: number;
  readonly providerJourneys: number;
  readonly passengerJourneys: number;
  readonly completedProviderJourneys: number;
  readonly completedPassengerJourneys: number;
}

export function TravelActivitySection({
  totalJourneys,
  completedJourneys,
  providerJourneys,
  passengerJourneys,
  completedProviderJourneys,
  completedPassengerJourneys,
}: TravelActivitySectionProps): ReactNode {
  return (
    <section className="space-y-5">
      {/* ---------------------------------------------------------------------
          Section header
          --------------------------------------------------------------------- */}
      <div>
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-2 w-2 shrink-0 rounded-full bg-[var(--brand)]"
          />

          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-secondary)]">
            Travel Activity
          </h2>
        </div>

        <p className="mt-1.5 max-w-2xl text-sm leading-5 text-[var(--foreground-muted)]">
          Your journey history across sisiMove.
        </p>
      </div>

      {/* ---------------------------------------------------------------------
          Overall activity
          --------------------------------------------------------------------- */}
      <div>
        <div className="mb-2.5 text-xs font-medium text-[var(--foreground-muted)]">
          Overview
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <TravelActivityStat
            label="Total journeys"
            value={totalJourneys}
            description="Journeys associated with your profile"
          />

          <TravelActivityStat
            label="Completed journeys"
            value={completedJourneys}
            description="Journeys completed on sisiMove"
          />
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          Traveller / provider activity
          --------------------------------------------------------------------- */}
      <div>
        <div className="mb-2.5 text-xs font-medium text-[var(--foreground-muted)]">
          Journey roles
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <TravelActivityStat
            label="Provider journeys"
            value={providerJourneys}
            description="Journeys where you provided the travel"
          />

          <TravelActivityStat
            label="Passenger journeys"
            value={passengerJourneys}
            description="Journeys where you travelled as a passenger"
          />
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          Completed role activity
          --------------------------------------------------------------------- */}
      <div>
        <div className="mb-2.5 text-xs font-medium text-[var(--foreground-muted)]">
          Completed by role
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <TravelActivityStat
            label="Completed provider journeys"
            value={completedProviderJourneys}
          />

          <TravelActivityStat
            label="Completed passenger journeys"
            value={completedPassengerJourneys}
          />
        </div>
      </div>
    </section>
  );
}