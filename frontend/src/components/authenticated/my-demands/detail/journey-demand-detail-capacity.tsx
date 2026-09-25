// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Detail Capacity
// -----------------------------------------------------------------------------
//
// Presents the number of seats requested for the Journey Demand.
//
// Responsibilities:
// - Display requested seats.
// - Display matched seats when available.
//
// This component is presentation-only. Capacity data is supplied by the
// parent detail container and is not fetched here.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type { JourneyDemandCapacity } from '@/features/journey-demand/models';

export interface JourneyDemandDetailCapacityProps {
  capacity: JourneyDemandCapacity | null;
}

export function JourneyDemandDetailCapacity({
  capacity,
}: JourneyDemandDetailCapacityProps) {
  if (!capacity) {
    return (
      <Card padding="lg">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-slate-900">
            Seats
          </h2>

          <p className="text-sm text-slate-500">
            Seat requirements have not been provided yet.
          </p>
        </div>
      </Card>
    );
  }

  const requestedSeats = capacity.requestedSeats;
  const matchedSeats = capacity.matchedSeats;

  return (
    <Card padding="lg">
      <div className="space-y-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Seats
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Passenger capacity requested for this journey.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <CapacityItem
            label="Seats requested"
            value={requestedSeats}
          />

          <CapacityItem
            label="Seats matched"
            value={matchedSeats}
          />
        </div>
      </div>
    </Card>
  );
}

interface CapacityItemProps {
  label: string;
  value: number;
}

function CapacityItem({
  label,
  value,
}: CapacityItemProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}