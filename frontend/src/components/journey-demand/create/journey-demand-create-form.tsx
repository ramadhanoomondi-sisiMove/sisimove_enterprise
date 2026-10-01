// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Create Form
// -----------------------------------------------------------------------------
//
// Multi-step Journey Demand creation form.
//
// Architecture:
// - Owns temporary client-side form state for the creation workflow.
// - Owns the current creation step.
// - Owns SisiMove-supported location selection for the Where step.
// - Resolves From/To through the local SisiMove-supported location catalogue.
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
// Location flow:
//
//   Supported catalogue
//        ↓
//   From selection
//        ↓
//   Supported destinations
//        ↓
//   To selection
//        ↓
//   ResolvedLocation values
//
// The form values are intentionally lightweight creation-form representations.
// They are not authenticated JourneyDemand domain models.
// -----------------------------------------------------------------------------

'use client';

import { useMemo, useState } from 'react';

import { Button } from '@/components/ui';
import {
  type ResolvedLocation,
} from '@/foundation/location';
import { cn } from '@/foundation';

import {
  getSupportedDestinations,
  findSupportedLocation,
} from '@/foundation/location/data/resolve-supported-corridor';

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
    origin: null,
    destination: null,
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
// Helpers
// -----------------------------------------------------------------------------

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase();
}

function matchesLocation(
  location: ResolvedLocation,
  query: string,
): boolean {
  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) {
    return true;
  }

  return (
    location.name.toLowerCase().includes(normalizedQuery) ||
    location.key.toLowerCase().includes(normalizedQuery)
  );
}

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

  // ---------------------------------------------------------------------------
  // Location query state
  // ---------------------------------------------------------------------------

  const [originQuery, setOriginQuery] = useState<string>(
    () => initialValue?.where.origin?.name ?? '',
  );

  const [destinationQuery, setDestinationQuery] = useState<string>(
    () => initialValue?.where.destination?.name ?? '',
  );

  // ---------------------------------------------------------------------------
  // Location suggestions
  // ---------------------------------------------------------------------------
  //
  // From:
  //   All SisiMove-supported locations.
  //
  // To:
  //   Only destinations supported from the selected origin.
  //
  // This keeps Journey Demand creation aligned with the same SisiMove-owned
  // corridor catalogue used by Journey creation.
  // ---------------------------------------------------------------------------

  const supportedOriginSuggestions =
    useMemo<readonly ResolvedLocation[]>(
      () => {
        const locations: ResolvedLocation[] = [];

        const seen = new Set<string>();

        const addLocation = (
          location: ResolvedLocation | undefined,
        ): void => {
          if (!location || seen.has(location.key)) {
            return;
          }

          if (!matchesLocation(location, originQuery)) {
            return;
          }

          seen.add(location.key);
          locations.push(location);
        };

        const knownKeys = [
          'NAIROBI',
          'NAKURU',
          'KERICHO',
          'KISUMU',
          'ELDORET',
          'MOMBASA',
          'VOI',
          'MACHAKOS',
          'KITALE',
          'KAKAMEGA',
        ];

        for (const key of knownKeys) {
          addLocation(findSupportedLocation(key));
        }

        return locations;
      },
      [originQuery],
    );

  const destinationSuggestions =
    useMemo<readonly ResolvedLocation[]>(() => {
      if (!value.where.origin) {
        return [];
      }

      const destinations = getSupportedDestinations(
        value.where.origin.key,
      );

      return destinations.filter((destination) =>
        matchesLocation(
          destination,
          destinationQuery,
        ),
      );
    }, [
      value.where.origin,
      destinationQuery,
    ]);

  const controlsDisabled =
    disabled || isSubmitting;

  // ---------------------------------------------------------------------------
  // Where
  // ---------------------------------------------------------------------------

  const updateWhere = (
    where: JourneyDemandCreateWhereValue,
  ): void => {
    setValue((current) => ({
      ...current,
      where,
    }));
  };

  const handleOriginQueryChange = (
    query: string,
  ): void => {
    setOriginQuery(query);

    /*
     * Changing the origin invalidates both resolved locations.
     *
     * The destination list is dependent on the selected origin, so the
     * existing destination must also be cleared.
     */
    if (value.where.origin) {
      updateWhere({
        origin: null,
        destination: null,
      });

      setDestinationQuery('');
      return;
    }

    /*
     * Even before a location has been selected, ensure a stale destination
     * cannot survive an origin search interaction.
     */
    if (value.where.destination) {
      updateWhere({
        origin: null,
        destination: null,
      });

      setDestinationQuery('');
    }
  };

  const handleDestinationQueryChange = (
    query: string,
  ): void => {
    setDestinationQuery(query);

    if (value.where.destination) {
      updateWhere({
        ...value.where,
        destination: null,
      });
    }
  };

  const handleOriginSelect = (
    location: ResolvedLocation,
  ): void => {
    setOriginQuery(location.name);
    setDestinationQuery('');

    updateWhere({
      origin: location,
      destination: null,
    });
  };

  const handleDestinationSelect = (
    location: ResolvedLocation,
  ): void => {
    setDestinationQuery(location.name);

    updateWhere({
      ...value.where,
      destination: location,
    });
  };

  // ---------------------------------------------------------------------------
  // When
  // ---------------------------------------------------------------------------

  const updateWhen = (
    when: JourneyDemandCreateWhenValue,
  ): void => {
    setValue((current) => ({
      ...current,
      when,
    }));
  };

  // ---------------------------------------------------------------------------
  // Seats
  // ---------------------------------------------------------------------------

  const updateSeats = (
    seats: JourneyDemandCreateSeatsValue,
  ): void => {
    setValue((current) => ({
      ...current,
      seats,
    }));
  };

  // ---------------------------------------------------------------------------
  // Price
  // ---------------------------------------------------------------------------

  const updatePrice = (
    price: JourneyDemandCreatePriceValue,
  ): void => {
    setValue((current) => ({
      ...current,
      price,
    }));
  };

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();

    if (controlsDisabled || !onSubmit) {
      return;
    }

    onSubmit(value);
  };

  // ---------------------------------------------------------------------------
  // Presentation state
  // ---------------------------------------------------------------------------

  const isFirstStep =
    currentStep === 'where';

  const isLastStep =
    currentStep === 'price';

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

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
            originQuery={originQuery}
            destinationQuery={destinationQuery}
            originSuggestions={
              supportedOriginSuggestions
            }
            destinationSuggestions={
              destinationSuggestions
            }
            disabled={controlsDisabled}
            onOriginQueryChange={
              handleOriginQueryChange
            }
            onDestinationQueryChange={
              handleDestinationQueryChange
            }
            onOriginSelect={
              handleOriginSelect
            }
            onDestinationSelect={
              handleDestinationSelect
            }
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

export default JourneyDemandCreateForm;