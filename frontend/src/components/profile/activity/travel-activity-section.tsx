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
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { TravelActivityStat } from './travel-activity-stat';

export interface TravelActivitySectionProps {
  totalJourneys: number;
  completedJourneys: number;
  providerJourneys: number;
  passengerJourneys: number;
  completedProviderJourneys: number;
  completedPassengerJourneys: number;
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
    <section className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide">
          Travel Activity
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Your journey history across sisiMove.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TravelActivityStat
          label="Total journeys"
          value={totalJourneys}
        />

        <TravelActivityStat
          label="Completed journeys"
          value={completedJourneys}
        />

        <TravelActivityStat
          label="Provider journeys"
          value={providerJourneys}
        />

        <TravelActivityStat
          label="Passenger journeys"
          value={passengerJourneys}
        />

        <TravelActivityStat
          label="Completed provider journeys"
          value={completedProviderJourneys}
        />

        <TravelActivityStat
          label="Completed passenger journeys"
          value={completedPassengerJourneys}
        />
      </div>
    </section>
  );
}