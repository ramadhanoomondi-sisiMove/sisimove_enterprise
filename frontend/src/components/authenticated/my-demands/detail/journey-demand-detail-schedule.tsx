// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Detail Schedule
// -----------------------------------------------------------------------------
//
// Presents the requested travel time window.
//
// Responsibilities:
// - Display the earliest and latest requested departure.
// - Display optional arrival constraints.
// - Display the schedule timezone.
//
// This component is presentation-only. Schedule data is supplied by the
// parent detail container and is not fetched here.
// -----------------------------------------------------------------------------

import { Card } from '@/components/ui';

import type { JourneyDemandSchedule } from '@/features/journey-demand/models';

export interface JourneyDemandDetailScheduleProps {
  schedule: JourneyDemandSchedule | null;
}

function formatDateTime(
  value: string | null | undefined,
  timezone: string,
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
    timeZone: timezone,
  }).format(date);
}

export function JourneyDemandDetailSchedule({
  schedule,
}: JourneyDemandDetailScheduleProps) {
  if (!schedule) {
    return (
      <Card padding="lg">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-slate-900">
            Schedule
          </h2>

          <p className="text-sm text-slate-500">
            Schedule details have not been provided yet.
          </p>
        </div>
      </Card>
    );
  }

  const timezone = schedule.timezone || 'Africa/Nairobi';

  const earliestDeparture = formatDateTime(
    schedule.earliestDeparture,
    timezone,
  );

  const latestDeparture = formatDateTime(
    schedule.latestDeparture,
    timezone,
  );

  const targetArrival = formatDateTime(
    schedule.targetArrival,
    timezone,
  );

  const maximumArrival = formatDateTime(
    schedule.maximumArrival,
    timezone,
  );

  return (
    <Card padding="lg">
      <div className="space-y-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Schedule
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Requested travel window.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ScheduleItem
            label="Earliest departure"
            value={earliestDeparture}
          />

          <ScheduleItem
            label="Latest departure"
            value={latestDeparture}
          />

          {targetArrival ? (
            <ScheduleItem
              label="Target arrival"
              value={targetArrival}
            />
          ) : null}

          {maximumArrival ? (
            <ScheduleItem
              label="Maximum arrival"
              value={maximumArrival}
            />
          ) : null}
        </div>

        <p className="text-xs text-slate-500">
          Times shown in {timezone}.
        </p>
      </div>
    </Card>
  );
}

interface ScheduleItemProps {
  label: string;
  value: string | null;
}

function ScheduleItem({
  label,
  value,
}: ScheduleItemProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-900">
        {value ?? 'Not specified'}
      </p>
    </div>
  );
}