// -----------------------------------------------------------------------------
// sisiMove — Journey Detail Vehicle
// -----------------------------------------------------------------------------
//
// Presentation component for the vehicle section of an authenticated Journey
// detail surface.
//
// Architectural boundary:
// - Does NOT fetch vehicle data.
// - Does NOT create or update vehicle records.
// - Does NOT attach/detach vehicles.
// - Does NOT expose internal database identifiers.
// - Does NOT perform Journey mutations.
//
// The parent detail container supplies the already-composed Journey model.
// -----------------------------------------------------------------------------

import type { Journey } from '@/features/journey/models/journey';

import { Card } from '@/components/ui';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDetailVehicleProps {
  journey: Journey;
  className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDetailVehicle({
  journey,
  className,
}: JourneyDetailVehicleProps) {
  const vehicle =
    journey.vehicle;

  if (!vehicle) {
    return (
      <Card
        variant="outlined"
        padding="md"
        className={className}
      >
        <div className="space-y-2">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Vehicle
          </h2>

          <p className="text-sm leading-6 text-[var(--foreground-muted)]">
            No vehicle has been configured for this Journey yet.
          </p>
        </div>
      </Card>
    );
  }

  const vehicleName =
    `${vehicle.make} ${vehicle.model}`;

  return (
    <Card
      variant="outlined"
      padding="md"
      className={className}
    >
      <div className="space-y-5">
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Vehicle
          </h2>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            Vehicle information for this Journey.
          </p>
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Vehicle
            </dt>

            <dd className="mt-1 text-base font-semibold text-[var(--foreground)]">
              {vehicleName}
            </dd>
          </div>

          {vehicle.year !== null &&
          vehicle.year !== undefined ? (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Year
              </dt>

              <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
                {vehicle.year}
              </dd>
            </div>
          ) : null}

          {vehicle.color ? (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Color
              </dt>

              <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
                {vehicle.color}
              </dd>
            </div>
          ) : null}

          {vehicle.registration ? (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Registration
              </dt>

              <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">
                {vehicle.registration}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </Card>
  );
}