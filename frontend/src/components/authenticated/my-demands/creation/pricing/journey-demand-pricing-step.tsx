'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Pricing Step
// -----------------------------------------------------------------------------
//
// Captures the requester's preferred and maximum acceptable price per seat.
//
// Backend contract:
//   PUT /journey-demands/:journeyDemandPublicId/pricing
//
// Pricing is expressed in the Journey Demand's currency. The current sisiMove
// marketplace uses KES, while the component keeps the currency explicit so
// the API model remains the source of truth.
//
// This component does not calculate fares or perform matching.
// -----------------------------------------------------------------------------

import { useEffect, useState } from 'react';

import { Button, Card, Input } from '@/components/ui';
import {
  useJourneyDemandPricing,
  useUpdateJourneyDemandPricing,
} from '@/features/journey-demand/hooks';
import type { JourneyDemandPricing } from '@/features/journey-demand/models';

export interface JourneyDemandPricingStepProps {
  journeyDemandPublicId: string;
  onComplete?: () => void;
}

interface PricingFormState {
  currency: string;
  preferredPricePerSeat: string;
  maximumPricePerSeat: string;
}

interface PricingFormErrors {
  currency?: string;
  preferredPricePerSeat?: string;
  maximumPricePerSeat?: string;
  form?: string;
}

function mapPricingToForm(
  pricing?: JourneyDemandPricing | null,
): PricingFormState {
  return {
    currency: pricing?.currency ?? 'KES',
    preferredPricePerSeat:
      pricing?.preferredPricePerSeat !== undefined &&
      pricing?.preferredPricePerSeat !== null
        ? String(pricing.preferredPricePerSeat)
        : '',
    maximumPricePerSeat:
      pricing?.maximumPricePerSeat !== undefined &&
      pricing?.maximumPricePerSeat !== null
        ? String(pricing.maximumPricePerSeat)
        : '',
  };
}

export function JourneyDemandPricingStep({
  journeyDemandPublicId,
  onComplete,
}: JourneyDemandPricingStepProps) {
  const {
    data: pricing,
    isLoading,
    isError,
  } = useJourneyDemandPricing(journeyDemandPublicId);

  const updatePricingMutation =
    useUpdateJourneyDemandPricing();

  const [form, setForm] = useState<PricingFormState>(
    mapPricingToForm(pricing),
  );

  const [errors, setErrors] = useState<PricingFormErrors>({});

  useEffect(() => {
    if (pricing) {
      setForm(mapPricingToForm(pricing));
    }
  }, [pricing]);

  const updateField = (
    field: keyof PricingFormState,
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

  const validate = (): PricingFormErrors => {
    const nextErrors: PricingFormErrors = {};

    if (!form.currency.trim()) {
      nextErrors.currency = 'Enter a currency.';
    }

    if (!form.preferredPricePerSeat.trim()) {
      nextErrors.preferredPricePerSeat =
        'Enter your preferred price per seat.';
    }

    if (!form.maximumPricePerSeat.trim()) {
      nextErrors.maximumPricePerSeat =
        'Enter the maximum price you are willing to pay per seat.';
    }

    const preferred = Number(form.preferredPricePerSeat);
    const maximum = Number(form.maximumPricePerSeat);

    if (
      form.preferredPricePerSeat.trim() &&
      (!Number.isFinite(preferred) || preferred < 0)
    ) {
      nextErrors.preferredPricePerSeat =
        'Enter a valid non-negative amount.';
    }

    if (
      form.maximumPricePerSeat.trim() &&
      (!Number.isFinite(maximum) || maximum < 0)
    ) {
      nextErrors.maximumPricePerSeat =
        'Enter a valid non-negative amount.';
    }

    if (
      Number.isFinite(preferred) &&
      Number.isFinite(maximum) &&
      preferred > maximum
    ) {
      nextErrors.maximumPricePerSeat =
        'Maximum price must be at least your preferred price.';
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

    updatePricingMutation.mutate(
      {
        journeyDemandPublicId,
        input: {
          currency: form.currency.trim().toUpperCase(),
          maxFare: Number(form.maximumPricePerSeat),
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
                : 'We could not save your pricing preference.',
          });
        },
      },
    );
  };

  const isPending = updatePricingMutation.isPending;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Step 4 of 5
        </p>

        <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
          What would you like to pay?
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
          Set the price range that works for you. This helps match your
          demand with suitable journeys.
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
              Loading your saved pricing…
            </p>
          ) : null}

          {isError ? (
            <p className="text-sm text-slate-500">
              We could not load your saved pricing. You can enter it
              again below.
            </p>
          ) : null}

          <div className="max-w-sm">
            <Input
              label="Currency"
              value={form.currency}
              onChange={(event) =>
                updateField('currency', event.target.value)
              }
              placeholder="KES"
              disabled={isPending}
              error={errors.currency}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Preferred price per seat"
              type="number"
              min={0}
              step="1"
              inputMode="decimal"
              value={form.preferredPricePerSeat}
              onChange={(event) =>
                updateField(
                  'preferredPricePerSeat',
                  event.target.value,
                )
              }
              placeholder="e.g. 1500"
              disabled={isPending}
              error={errors.preferredPricePerSeat}
            />

            <Input
              label="Maximum price per seat"
              type="number"
              min={0}
              step="1"
              inputMode="decimal"
              value={form.maximumPricePerSeat}
              onChange={(event) =>
                updateField(
                  'maximumPricePerSeat',
                  event.target.value,
                )
              }
              placeholder="e.g. 2000"
              disabled={isPending}
              error={errors.maximumPricePerSeat}
            />
          </div>

          <p className="text-sm text-slate-500">
            Your maximum price is the amount you are willing to pay per
            seat. The actual journey price remains determined by the
            matched journey and booking flow.
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