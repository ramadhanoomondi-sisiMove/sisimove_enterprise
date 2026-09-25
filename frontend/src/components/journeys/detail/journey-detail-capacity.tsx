// -----------------------------------------------------------------------------
// sisiMove — Journey Detail Capacity
// -----------------------------------------------------------------------------
//
// Presentation component for Journey seat capacity.
//
// Architectural boundary:
// - Does NOT fetch capacity.
// - Does NOT calculate booking state.
// - Does NOT create/update/delete capacity.
// - Does NOT perform booking mutations.
//
// `availableSeats` is already derived by the Journey frontend model/mapper.
// The component therefore consumes it as read-only presentation data.
// -----------------------------------------------------------------------------

import type { Journey } from '@/features/journey/models/journey';

import { Badge, Card } from '@/components/ui';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDetailCapacityProps {
  journey: Journey;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDetailCapacity({
  journey,
  className,
}: JourneyDetailCapacityProps) {
  const capacity =
    journey.capacity;

  if (!capacity) {
    return (
      <Card
        variant="outlined"
        padding="md"
        className={className}
      >
        <div className="space-y-2">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Seats
          </h2>

          <p className="text-sm leading-6 text-[var(--foreground-muted)]">
            Seat capacity has not been configured for this Journey yet.
          </p>
        </div>
      </Card>
    );
  }

  const {
    totalSeats,
    bookedSeats,
    availableSeats,
  } = capacity;

  const hasAvailableSeats =
    availableSeats > 0;

  return (
    <Card
      variant="outlined"
      padding="md"
      className={className}
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              Seats
            </h2>

            <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
              Current passenger seat availability.
            </p>
          </div>

          <Badge
            variant={
              hasAvailableSeats
                ? 'success'
                : 'warning'
            }
            size="sm"
          >
            {hasAvailableSeats
              ? `${availableSeats} available`
              : 'Fully booked'}
          </Badge>
        </div>

        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-[var(--radius-md)] bg-[var(--background-subtle)] p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Total
            </dt>

            <dd className="mt-1 text-xl font-semibold text-[var(--foreground)]">
              {totalSeats}
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] bg-[var(--background-subtle)] p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Booked
            </dt>

            <dd className="mt-1 text-xl font-semibold text-[var(--foreground)]">
              {bookedSeats}
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] bg-[var(--background-subtle)] p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Available
            </dt>

            <dd className="mt-1 text-xl font-semibold text-[var(--foreground)]">
              {availableSeats}
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}