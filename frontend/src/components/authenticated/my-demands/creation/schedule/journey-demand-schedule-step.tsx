'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Schedule Step
// -----------------------------------------------------------------------------
//
// Captures the requested travel window for a Journey Demand.
//
// The backend model supports:
// - Earliest departure
// - Latest departure
// - Optional target arrival
// - Optional maximum arrival
// - Timezone
//
// This step only manages schedule data. It does not publish the demand.
// -----------------------------------------------------------------------------

import { useEffect, useState } from 'react';

import { Button, Card, Input } from '@/components/ui';
import {
  useJourneyDemandSchedule,
  useUpdateJourneyDemandSchedule,
} from '@/features/journey-demand/hooks';
import type { JourneyDemandSchedule } from '@/features/journey-demand/models';

export interface JourneyDemandScheduleStepProps {
  journeyDemandPublicId: string;
  onComplete?: () => void;
}

interface ScheduleFormState {
  earliestDeparture: string;
  latestDeparture: string;
  targetArrival: string;
  maximumArrival: string;
  timezone: string;
}

interface ScheduleFormErrors {
  earliestDeparture?: string;
  latestDeparture?: string;
  targetArrival?: string;
  maximumArrival?: string;
  form?: string;
}

const DEFAULT_TIMEZONE = 'Africa/Nairobi';

function toDateTimeLocal(value?: string | null): string {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const offsetDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  );

  return offsetDate.toISOString().slice(0, 16);
}

function toIsoString(value: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
}

function mapScheduleToForm(
  schedule?: JourneyDemandSchedule | null,
): ScheduleFormState {
  return {
    earliestDeparture: toDateTimeLocal(schedule?.earliestDeparture),
    latestDeparture: toDateTimeLocal(schedule?.latestDeparture),
    targetArrival: toDateTimeLocal(schedule?.targetArrival),
    maximumArrival: toDateTimeLocal(schedule?.maximumArrival),
    timezone: schedule?.timezone ?? DEFAULT_TIMEZONE,
  };
}

export function JourneyDemandScheduleStep({
  journeyDemandPublicId,
  onComplete,
}: JourneyDemandScheduleStepProps) {
  const {
    data: schedule,
    isLoading,
    isError,
  } = useJourneyDemandSchedule(journeyDemandPublicId);

  const updateScheduleMutation =
    useUpdateJourneyDemandSchedule();

  const [form, setForm] = useState<ScheduleFormState>(
    mapScheduleToForm(schedule),
  );

  const [errors, setErrors] = useState<ScheduleFormErrors>({});

  useEffect(() => {
    if (schedule) {
      setForm(mapScheduleToForm(schedule));
    }
  }, [schedule]);

  const updateField = (
    field: keyof ScheduleFormState,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
      form: undefined,
    }));
  };

  const validate = (): ScheduleFormErrors => {
    const nextErrors: ScheduleFormErrors = {};

    if (!form.earliestDeparture) {
      nextErrors.earliestDeparture =
        'Choose the earliest time you can depart.';
    }

    if (!form.latestDeparture) {
      nextErrors.latestDeparture =
        'Choose the latest time you can depart.';
    }

    if (
      form.earliestDeparture &&
      form.latestDeparture &&
      new Date(form.latestDeparture) <
        new Date(form.earliestDeparture)
    ) {
      nextErrors.latestDeparture =
        'Latest departure must be after the earliest departure.';
    }

    if (
      form.targetArrival &&
      form.maximumArrival &&
      new Date(form.maximumArrival) <
        new Date(form.targetArrival)
    ) {
      nextErrors.maximumArrival =
        'Maximum arrival must be after the target arrival.';
    }

    if (
      form.latestDeparture &&
      form.targetArrival &&
      new Date(form.targetArrival) <
        new Date(form.latestDeparture)
    ) {
      nextErrors.targetArrival =
        'Target arrival must not be before the latest departure.';
    }

    return nextErrors;
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    updateScheduleMutation.mutate(
      {
        journeyDemandPublicId,
        input: {
          earliestDeparture:
            toIsoString(form.earliestDeparture) ??
            form.earliestDeparture,

          latestDeparture:
            toIsoString(form.latestDeparture) ??
            form.latestDeparture,

          targetArrival:
            toIsoString(form.targetArrival),

          maximumArrival:
            toIsoString(form.maximumArrival),

          timezone: form.timezone || DEFAULT_TIMEZONE,
        },
      },
      {
        onSuccess: () => {
          onComplete?.();
        },
        onError: (error) => {
          setErrors({
            form:
              error instanceof Error
                ? error.message
                : 'We could not save your travel schedule.',
          });
        },
      },
    );
  };

  const isPending = updateScheduleMutation.isPending;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Step 2 of 5
        </p>

        <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
          When do you want to travel?
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
          Give drivers a travel window rather than a single fixed
          departure time.
        </p>
      </div>

      <Card padding="md" variant="default">
        <form
          className="space-y-5"
          onSubmit={handleSubmit}
          noValidate
        >
          {isLoading ? (
            <p className="text-sm text-slate-500">
              Loading your saved schedule…
            </p>
          ) : null}

          {isError ? (
            <p className="text-sm text-slate-500">
              We could not load your saved schedule. You can enter it
              again below.
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Earliest departure"
              type="datetime-local"
              value={form.earliestDeparture}
              onChange={(event) =>
                updateField(
                  'earliestDeparture',
                  event.target.value,
                )
              }
              disabled={isPending}
              error={errors.earliestDeparture}
            />

            <Input
              label="Latest departure"
              type="datetime-local"
              value={form.latestDeparture}
              onChange={(event) =>
                updateField(
                  'latestDeparture',
                  event.target.value,
                )
              }
              disabled={isPending}
              error={errors.latestDeparture}
            />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Arrival preference
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Optional. Add an arrival window if reaching your
              destination by a certain time matters.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Target arrival"
              type="datetime-local"
              value={form.targetArrival}
              onChange={(event) =>
                updateField(
                  'targetArrival',
                  event.target.value,
                )
              }
              disabled={isPending}
              error={errors.targetArrival}
            />

            <Input
              label="Latest acceptable arrival"
              type="datetime-local"
              value={form.maximumArrival}
              onChange={(event) =>
                updateField(
                  'maximumArrival',
                  event.target.value,
                )
              }
              disabled={isPending}
              error={errors.maximumArrival}
            />
          </div>

          <Input
            label="Timezone"
            value={form.timezone}
            onChange={(event) =>
              updateField('timezone', event.target.value)
            }
            disabled={isPending}
            error={undefined}
          />

          {errors.form ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.form}
            </p>
          ) : null}

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isPending}
            >
              {isPending ? 'Saving…' : 'Continue'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}