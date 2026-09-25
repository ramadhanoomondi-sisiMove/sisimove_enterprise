'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Seats Step
// -----------------------------------------------------------------------------
//
// Captures the number of seats the requester needs.
//
// Backend contract:
//   PUT /journey-demands/:journeyDemandPublicId/capacity
//
// The frontend presents this as a simple passenger requirement. Matching,
// availability, and final booking capacity remain backend/domain concerns.
// -----------------------------------------------------------------------------

import { useEffect, useState } from 'react';

import { Button, Card, Input } from '@/components/ui';
import {
  useJourneyDemandCapacity,
  useUpdateJourneyDemandCapacity,
} from '@/features/journey-demand/hooks';
import type { JourneyDemandCapacity } from '@/features/journey-demand/models';

export interface JourneyDemandSeatsStepProps {
  journeyDemandPublicId: string;
  onComplete?: () => void;
}

interface SeatsFormState {
  seatsRequired: string;
}

interface SeatsFormErrors {
  seatsRequired?: string;
  form?: string;
}

function mapCapacityToForm(
  capacity?: JourneyDemandCapacity | null,
): SeatsFormState {
  return {
    seatsRequired:
      capacity?.requestedSeats !== undefined &&
      capacity?.requestedSeats !== null
        ? String(capacity.requestedSeats)
        : '',
  };
}

export function JourneyDemandSeatsStep({
  journeyDemandPublicId,
  onComplete,
}: JourneyDemandSeatsStepProps) {
  const {
    data: capacity,
    isLoading,
    isError,
  } = useJourneyDemandCapacity(journeyDemandPublicId);

  const updateCapacityMutation =
    useUpdateJourneyDemandCapacity();

  const [form, setForm] = useState<SeatsFormState>(
    mapCapacityToForm(capacity),
  );

  const [errors, setErrors] = useState<SeatsFormErrors>({});

  useEffect(() => {
    if (capacity) {
      setForm(mapCapacityToForm(capacity));
    }
  }, [capacity]);

  const handleChange = (value: string) => {
    setForm({
      seatsRequired: value,
    });

    setErrors((current) => ({
      ...current,
      seatsRequired: undefined,
      form: undefined,
    }));
  };

  const validate = (): SeatsFormErrors => {
    const nextErrors: SeatsFormErrors = {};

    if (!form.seatsRequired.trim()) {
      nextErrors.seatsRequired =
        'Enter the number of seats you need.';
      return nextErrors;
    }

    const seats = Number(form.seatsRequired);

    if (!Number.isInteger(seats)) {
      nextErrors.seatsRequired =
        'Enter a whole number of seats.';
    } else if (seats < 1) {
      nextErrors.seatsRequired =
        'You need at least one seat.';
    } else if (seats > 50) {
      nextErrors.seatsRequired =
        'Enter a realistic number of seats.';
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

    updateCapacityMutation.mutate(
      {
        journeyDemandPublicId,
        input: {
          seatsRequired: Number(form.seatsRequired),
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
                : 'We could not save your seat requirement.',
          });
        },
      },
    );
  };

  const isPending = updateCapacityMutation.isPending;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Step 3 of 5
        </p>

        <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
          How many seats do you need?
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
          Tell drivers how many people will be travelling with you.
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
              Loading your saved seat requirement…
            </p>
          ) : null}

          {isError ? (
            <p className="text-sm text-slate-500">
              We could not load your saved seat requirement. You can
              enter it again below.
            </p>
          ) : null}

          <div className="max-w-sm">
            <Input
              label="Seats needed"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={form.seatsRequired}
              onChange={(event) =>
                handleChange(event.target.value)
              }
              placeholder="1"
              disabled={isPending}
              error={errors.seatsRequired}
            />
          </div>

          <p className="text-sm text-slate-500">
            The number of seats requested can be used when matching
            your demand with available journeys.
          </p>

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