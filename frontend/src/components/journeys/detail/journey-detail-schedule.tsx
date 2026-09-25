// -----------------------------------------------------------------------------
// sisiMove — Journey Detail Schedule
// -----------------------------------------------------------------------------
//
// Presentation component for the schedule section of an authenticated
// Journey detail surface.
//
// Architectural boundary:
// - Does NOT fetch schedule data.
// - Does NOT create, update, or delete schedules.
// - Does NOT perform Journey lifecycle mutations.
// - Does NOT own navigation.
//
// The parent detail container supplies the already-composed Journey model.
// -----------------------------------------------------------------------------

import type { Journey } from '@/features/journey/models/journey';

import { Card } from '@/components/ui';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDetailScheduleProps {
  journey: Journey;
  className?: string;
}

// -----------------------------------------------------------------------------
// Formatting
// -----------------------------------------------------------------------------

function formatDateTime(
  value?: string | null,
): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDetailSchedule({
  journey,
  className,
}: JourneyDetailScheduleProps) {
  const schedule =
    journey.schedule;

  if (!schedule) {
    return (
      <Card
        variant="outlined"
        padding="md"
        className={className}
      >
        <div className="space-y-2">
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Schedule
          </h2>

          <p className="text-sm leading-6 text-[var(--foreground-muted)]">
            No schedule has been configured for this Journey yet.
          </p>
        </div>
      </Card>
    );
  }

  const departure =
    formatDateTime(
      schedule.departureAt,
    );

  const arrival =
    formatDateTime(
      schedule.arrivalAt,
    );

  return (
    <Card
      variant="outlined"
      padding="md"
      className={className}
    >
      <div className="space-y-5">
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            Schedule
          </h2>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            Departure and arrival information for this Journey.
          </p>
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {departure ? (
            <div className="rounded-[var(--radius-md)] bg-[var(--background-subtle)] p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Departure
              </dt>

              <dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                {departure}
              </dd>
            </div>
          ) : null}

          {arrival ? (
            <div className="rounded-[var(--radius-md)] bg-[var(--background-subtle)] p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Arrival
              </dt>

              <dd className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                {arrival}
              </dd>
            </div>
          ) : null}
        </dl>

        {!departure && !arrival ? (
          <p className="text-sm text-[var(--foreground-muted)]">
            Schedule times have not been configured.
          </p>
        ) : null}
      </div>
    </Card>
  );
}