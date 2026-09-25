'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Corridor Form
// -----------------------------------------------------------------------------
//
// Captures the primary origin and destination for a Journey Demand.
//
// Responsibilities:
// - Present origin and destination inputs.
// - Validate the corridor through the shared Journey Demand schema.
// - Persist the corridor through the Journey Demand application hook.
// - Report successful completion to the parent creation step.
//
// Deliberately does NOT:
// - Manage waypoints.
// - Manage schedule, seats, or pricing.
// - Create the Journey Demand aggregate.
// - Publish the Journey Demand.
// - Resolve requester identity.
//
// The creation workflow owns the aggregate lifecycle; this component only
// manages the corridor portion of that workflow.
// -----------------------------------------------------------------------------

import { useEffect, useState } from 'react';

import { Button, Card, Input } from '@/components/ui';
import { useUpdateJourneyDemandCorridor } from '@/features/journey-demand/hooks';

export interface JourneyDemandCorridorFormProps {
  journeyDemandPublicId: string;
  initialOrigin?: string;
  initialDestination?: string;
  onSaved?: () => void;
}

interface CorridorFormState {
  origin: string;
  destination: string;
}

interface CorridorFormErrors {
  origin?: string;
  destination?: string;
  form?: string;
}

function normalizeValue(value?: string): string {
  return value?.trim() ?? '';
}

export function JourneyDemandCorridorForm({
  journeyDemandPublicId,
  initialOrigin = '',
  initialDestination = '',
  onSaved,
}: JourneyDemandCorridorFormProps) {
  const [form, setForm] = useState<CorridorFormState>({
    origin: normalizeValue(initialOrigin),
    destination: normalizeValue(initialDestination),
  });

  const [errors, setErrors] = useState<CorridorFormErrors>({});

  const { mutate, isPending, isError, error } =
    useUpdateJourneyDemandCorridor();

  useEffect(() => {
    setForm({
      origin: normalizeValue(initialOrigin),
      destination: normalizeValue(initialDestination),
    });
  }, [initialDestination, initialOrigin]);

  const updateField = (
    field: keyof CorridorFormState,
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

  const validate = (): CorridorFormErrors => {
    const nextErrors: CorridorFormErrors = {};

    if (!form.origin.trim()) {
      nextErrors.origin = 'Enter your starting point.';
    }

    if (!form.destination.trim()) {
      nextErrors.destination = 'Enter your destination.';
    }

    if (
      form.origin.trim() &&
      form.destination.trim() &&
      form.origin.trim().toLowerCase() ===
        form.destination.trim().toLowerCase()
    ) {
      nextErrors.destination =
        'Your destination must be different from your starting point.';
    }

    return nextErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate();

    if (
      validationErrors.origin ||
      validationErrors.destination
    ) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    mutate(
      {
        journeyDemandPublicId,
        input: {
          origin: form.origin.trim(),
          destination: form.destination.trim(),
        },
      },
      {
        onSuccess: () => {
          onSaved?.();
        },
        onError: (mutationError) => {
          setErrors({
            form:
              mutationError instanceof Error
                ? mutationError.message
                : 'We could not save your route. Please try again.',
          });
        },
      },
    );
  };

  const serverError =
    isError && error instanceof Error ? error.message : undefined;

  return (
    <Card padding="md" variant="default">
      <form
        className="space-y-5"
        onSubmit={handleSubmit}
        noValidate
      >
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Where do you need to go?
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Tell us where your journey starts and where you want to arrive.
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label="From"
            value={form.origin}
            onChange={(event) =>
              updateField('origin', event.target.value)
            }
            placeholder="e.g. Nairobi"
            autoComplete="address-level2"
            disabled={isPending}
            error={errors.origin}
          />

          <Input
            label="To"
            value={form.destination}
            onChange={(event) =>
              updateField('destination', event.target.value)
            }
            placeholder="e.g. Kisumu"
            autoComplete="address-level2"
            disabled={isPending}
            error={errors.destination}
          />
        </div>

        {errors.form || serverError ? (
          <p
            className="text-sm text-red-600"
            role="alert"
          >
            {errors.form ?? serverError}
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
  );
}