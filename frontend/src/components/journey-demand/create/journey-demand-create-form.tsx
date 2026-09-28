// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Create Form
// -----------------------------------------------------------------------------
//
// Multi-step Journey Demand creation form.
//
// Architecture:
// - Owns temporary client-side form state for the creation workflow.
// - Owns the current creation step.
// - Composes the individual create-step components.
// - Performs no API requests.
// - Performs no authorization checks.
// - Does not construct a backend JourneyDemand aggregate.
// - Does not derive backend lifecycle, pricing, capacity, or schedule flags.
// - Parent/route may provide the final onSubmit handler.
// - Backend remains authoritative for creation validation and persistence.
//
// Creation flow:
//
//   Where → When → Seats → Price
//
// The form values are intentionally lightweight creation-form representations.
// They are not authenticated JourneyDemand domain models.
// -----------------------------------------------------------------------------

'use client';

import { useState } from 'react';

import { Button } from '@/components/ui';
import { cn } from '@/foundation';

import {
  JourneyDemandCreatePrice,
  type JourneyDemandCreatePriceValue,
} from './journey-demand-create-price';
import {
  JourneyDemandCreateProgress,
  type JourneyDemandCreateStep,
} from './journey-demand-create-progress';
import {
  JourneyDemandCreateSeats,
  type JourneyDemandCreateSeatsValue,
} from './journey-demand-create-seats';
import {
  JourneyDemandCreateWhen,
  type JourneyDemandCreateWhenValue,
} from './journey-demand-create-when';
import {
  JourneyDemandCreateWhere,
  type JourneyDemandCreateWhereValue,
} from './journey-demand-create-where';

// -----------------------------------------------------------------------------
// Form Value
// -----------------------------------------------------------------------------

export interface JourneyDemandCreateFormValue {
  readonly where: JourneyDemandCreateWhereValue;
  readonly when: JourneyDemandCreateWhenValue;
  readonly seats: JourneyDemandCreateSeatsValue;
  readonly price: JourneyDemandCreatePriceValue;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyDemandCreateFormProps {
  readonly initialValue?: JourneyDemandCreateFormValue;
  readonly currency?: string;
  readonly isSubmitting?: boolean;
  readonly disabled?: boolean;
  readonly onSubmit?: (value: JourneyDemandCreateFormValue) => void;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const DEFAULT_VALUE: JourneyDemandCreateFormValue = {
  where: {
    origin: '',
    destination: '',
  },
  when: {
    earliestDeparture: '',
    latestDeparture: '',
    targetArrival: '',
    maximumArrival: '',
  },
  seats: {
    requestedSeats: 0,
  },
  price: {
    preferredPricePerSeat: undefined,
    maximumPricePerSeat: undefined,
  },
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandCreateForm({
  initialValue,
  currency = 'KES',
  isSubmitting = false,
  disabled = false,
  onSubmit,
  className,
}: JourneyDemandCreateFormProps) {
  const [currentStep, setCurrentStep] =
    useState<JourneyDemandCreateStep>('where');

  const [value, setValue] =
    useState<JourneyDemandCreateFormValue>(
      () => initialValue ?? DEFAULT_VALUE,
    );

  const controlsDisabled = disabled || isSubmitting;

  const updateWhere = (
    where: JourneyDemandCreateWhereValue,
  ): void => {
    setValue((current) => ({
      ...current,
      where,
    }));
  };

  const updateWhen = (
    when: JourneyDemandCreateWhenValue,
  ): void => {
    setValue((current) => ({
      ...current,
      when,
    }));
  };

  const updateSeats = (
    seats: JourneyDemandCreateSeatsValue,
  ): void => {
    setValue((current) => ({
      ...current,
      seats,
    }));
  };

  const updatePrice = (
    price: JourneyDemandCreatePriceValue,
  ): void => {
    setValue((current) => ({
      ...current,
      price,
    }));
  };

  const handleNext = (): void => {
    if (currentStep === 'where') {
      setCurrentStep('when');
      return;
    }

    if (currentStep === 'when') {
      setCurrentStep('seats');
      return;
    }

    if (currentStep === 'seats') {
      setCurrentStep('price');
    }
  };

  const handleBack = (): void => {
    if (currentStep === 'price') {
      setCurrentStep('seats');
      return;
    }

    if (currentStep === 'seats') {
      setCurrentStep('when');
      return;
    }

    if (currentStep === 'when') {
      setCurrentStep('where');
    }
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();

    if (controlsDisabled || !onSubmit) {
      return;
    }

    onSubmit(value);
  };

  const isFirstStep = currentStep === 'where';
  const isLastStep = currentStep === 'price';

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'min-w-0',
        className,
      )}
    >
      <JourneyDemandCreateProgress
        currentStep={currentStep}
      />

      <div className="mt-8 min-w-0">
        {currentStep === 'where' ? (
          <JourneyDemandCreateWhere
            value={value.where}
            onChange={updateWhere}
            disabled={controlsDisabled}
          />
        ) : null}

        {currentStep === 'when' ? (
          <JourneyDemandCreateWhen
            value={value.when}
            onChange={updateWhen}
            disabled={controlsDisabled}
          />
        ) : null}

        {currentStep === 'seats' ? (
          <JourneyDemandCreateSeats
            value={value.seats}
            onChange={updateSeats}
            disabled={controlsDisabled}
          />
        ) : null}

        {currentStep === 'price' ? (
          <JourneyDemandCreatePrice
            value={value.price}
            onChange={updatePrice}
            currency={currency}
            disabled={controlsDisabled}
          />
        ) : null}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[var(--border-subtle)] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {!isFirstStep ? (
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={handleBack}
              disabled={controlsDisabled}
            >
              Back
            </Button>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {!isLastStep ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNext}
              disabled={controlsDisabled}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isSubmitting}
              disabled={disabled || !onSubmit}
            >
              Create travel need
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

