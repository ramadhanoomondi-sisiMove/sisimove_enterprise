// -----------------------------------------------------------------------------
// Path: src/features/journey-demand/components/create/JourneyDemandCreateForm.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Demand Create Form
//
// Journey Demand creation workflow orchestrator.
//
// Creation lifecycle:
//
//   Start Travel Need
//          |
//          v
//   POST /journey-demands
//          |
//          v
//   Journey Demand DRAFT created
//          |
//          v
//   Where → update corridor
//          |
//          v
//   When → update schedule
//          |
//          v
//   Seats → update capacity
//          |
//          v
//   Price → update pricing
//          |
//          v
//   Journey Demand remains DRAFT
//          |
//          v
//   Journey Demand Editor
//
// Important:
// - Starting Demand creation creates the aggregate root exactly once.
// - Component steps progressively configure the existing DRAFT aggregate.
// - Where does NOT create the Demand.
// - When does NOT create the Demand.
// - Seats does NOT create the Demand.
// - Price does NOT create the Demand.
// - The frontend never generates a Demand public ID.
// - Each component is persisted through its dedicated mutation.
// - Mutation hooks own HTTP concerns.
// - This component owns workflow orchestration only.
//
// Demand payload mapping:
//
//   presentation requestedSeats
//       → backend seatsRequired
//
//   presentation maximumPricePerSeat
//       → backend maxFare
//
//   presentation origin/destination
//       → backend corridor
//
//   presentation origin/destination coordinates
//       → backend corridor coordinates
//
//   presentation departure/arrival windows
//       → backend schedule
//
// Creation does NOT publish the Demand.
//
// The completed DRAFT is handed to the authenticated Demand editing surface.
//
// -----------------------------------------------------------------------------

'use client';

import {
  useMemo,
  useState,
} from 'react';

import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';

import { useCurrentIdentity } from '@/features/identity/hooks/use-current-identity';

import {
  useCreateJourneyDemand,
  useUpdateJourneyDemandCorridor,
  useUpdateJourneyDemandSchedule,
  useUpdateJourneyDemandCapacity,
  useUpdateJourneyDemandPricing,
} from '@/features/journey-demand/hooks/mutations';

import type { ResolvedLocation } from '@/foundation/location';

import {
  findSupportedLocation,
  getSupportedDestinations,
} from '@/foundation/location/data/resolve-supported-corridor';

import { cn } from '@/foundation/utils/cn';

import {
  JourneyDemandCreateProgress,
  type JourneyDemandCreateStep,
} from './journey-demand-create-progress';

import {
  JourneyDemandCreateWhere,
  type JourneyDemandCreateWhereValue,
} from './journey-demand-create-where';

import {
  JourneyDemandCreateWhen,
  type JourneyDemandCreateWhenValue,
} from './journey-demand-create-when';

import {
  JourneyDemandCreateSeats,
  type JourneyDemandCreateSeatsValue,
} from './journey-demand-create-seats';

import {
  JourneyDemandCreatePrice,
  type JourneyDemandCreatePriceValue,
} from './journey-demand-create-price';

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

  readonly disabled?: boolean;

  /**
   * Called after the Demand draft and all configured Demand components have
   * been successfully persisted.
   *
   * Publishing is deliberately outside this form.
   */
  readonly onCreated?: (
    journeyDemandPublicId: string,
  ) => void;

  readonly onCancel?: () => void;

  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------------

const INITIAL_WHEN_VALUES: JourneyDemandCreateWhenValue = {
  earliestDeparture: '',
  latestDeparture: '',
  targetArrival: '',
  maximumArrival: '',
};

const INITIAL_SEATS_VALUE: JourneyDemandCreateSeatsValue = {
  requestedSeats: 0,
};

const INITIAL_PRICE_VALUE: JourneyDemandCreatePriceValue = {
  maximumPricePerSeat: undefined,
};

// -----------------------------------------------------------------------------
// Validation Errors
// -----------------------------------------------------------------------------

interface JourneyDemandCreateValidationErrors {
  readonly where: {
    readonly origin: string | null;
    readonly destination: string | null;
  };

  readonly when: {
    readonly earliestDeparture: string | null;
    readonly latestDeparture: string | null;
  };

  readonly seats: string | null;

  readonly price: {
    readonly maximumPrice: string | null;
  };
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function normalizeQuery(
  value: string,
): string {
  return value.trim().toLowerCase();
}

function matchesLocation(
  location: ResolvedLocation,
  query: string,
): boolean {
  const normalizedQuery =
    normalizeQuery(query);

  if (normalizedQuery.length === 0) {
    return true;
  }

  return (
    location.name
      .toLowerCase()
      .includes(normalizedQuery) ||
    location.key
      .toLowerCase()
      .includes(normalizedQuery)
  );
}

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

function validateForm(
  value: JourneyDemandCreateFormValue,
): JourneyDemandCreateValidationErrors {
  const earliestDeparture =
    value.when.earliestDeparture.trim();

  const latestDeparture =
    value.when.latestDeparture.trim();

  const hasEarliestDeparture =
    earliestDeparture.length > 0;

  const hasLatestDeparture =
    latestDeparture.length > 0;

  const departureOrderInvalid =
    hasEarliestDeparture &&
    hasLatestDeparture &&
    latestDeparture < earliestDeparture;

  const maximumPrice =
    value.price.maximumPricePerSeat;

  return {
    where: {
      origin:
        value.where.origin === null
          ? 'Please select a starting point.'
          : null,

      destination:
        value.where.destination === null
          ? 'Please select a destination.'
          : null,
    },

    when: {
      earliestDeparture:
        !hasEarliestDeparture
          ? 'Please select your earliest departure time.'
          : null,

      latestDeparture:
        !hasLatestDeparture
          ? 'Please select your latest departure time.'
          : departureOrderInvalid
            ? 'Latest departure cannot be earlier than earliest departure.'
            : null,
    },

    seats:
      value.seats.requestedSeats < 1
        ? 'Please enter at least 1 seat.'
        : null,

    price: {
      maximumPrice:
        maximumPrice === undefined
          ? 'Please enter your maximum price per seat.'
          : maximumPrice < 0
            ? 'Price cannot be negative.'
            : null,
    },
  };
}

function hasWhereErrors(
  errors: JourneyDemandCreateValidationErrors,
): boolean {
  return (
    errors.where.origin !== null ||
    errors.where.destination !== null
  );
}

function hasWhenErrors(
  errors: JourneyDemandCreateValidationErrors,
): boolean {
  return (
    errors.when.earliestDeparture !== null ||
    errors.when.latestDeparture !== null
  );
}

function hasSeatsErrors(
  errors: JourneyDemandCreateValidationErrors,
): boolean {
  return errors.seats !== null;
}

function hasPriceErrors(
  errors: JourneyDemandCreateValidationErrors,
): boolean {
  return errors.price.maximumPrice !== null;
}

// -----------------------------------------------------------------------------
// Backend Result Boundary
// -----------------------------------------------------------------------------

function extractJourneyDemandPublicId(
  result: unknown,
): string {
  if (
    typeof result !== 'object' ||
    result === null ||
    !('publicId' in result)
  ) {
    throw new Error(
      'Journey Demand creation succeeded but did not return a Demand public ID.',
    );
  }

  const publicIdValue =
    result.publicId;

  if (
    typeof publicIdValue !== 'string' ||
    publicIdValue.trim().length === 0
  ) {
    throw new Error(
      'Journey Demand creation succeeded but returned an invalid Demand public ID.',
    );
  }

  return publicIdValue;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyDemandCreateForm({
  initialValue,
  currency = 'KES',
  disabled = false,
  onCreated,
  onCancel,
  className,
}: JourneyDemandCreateFormProps) {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  const {
    data: identity,
    isLoading: isIdentityLoading,
    error: identityError,
  } = useCurrentIdentity();

  // ---------------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------------
  //
  // The aggregate is created once.
  //
  // The remaining mutations configure individual components of that existing
  // DRAFT aggregate.
  //
  // Naming intentionally follows the Journey Demand mutation barrel:
  //
  //   useCreateJourneyDemand
  //   useUpdateJourneyDemandCorridor
  //   useUpdateJourneyDemandSchedule
  //   useUpdateJourneyDemandCapacity
  //   useUpdateJourneyDemandPricing
  //
  // ---------------------------------------------------------------------------

  const createJourneyDemandMutation =
    useCreateJourneyDemand();

  const updateCorridorMutation =
    useUpdateJourneyDemandCorridor();

  const updateScheduleMutation =
    useUpdateJourneyDemandSchedule();

  const updateCapacityMutation =
    useUpdateJourneyDemandCapacity();

  const updatePricingMutation =
    useUpdateJourneyDemandPricing();

  // ---------------------------------------------------------------------------
  // Workflow State
  // ---------------------------------------------------------------------------

  const [isStarted, setIsStarted] =
    useState(false);

  const [currentStep, setCurrentStep] =
    useState<JourneyDemandCreateStep>('where');

  const [journeyDemandPublicId, setJourneyDemandPublicId] =
    useState<string | null>(null);

  const [value, setValue] =
    useState<JourneyDemandCreateFormValue>(
      () => ({
        where:
          initialValue?.where ?? {
            origin: null,
            destination: null,
          },

        when:
          initialValue?.when ??
          INITIAL_WHEN_VALUES,

        seats:
          initialValue?.seats ??
          INITIAL_SEATS_VALUE,

        price:
          initialValue?.price ??
          INITIAL_PRICE_VALUE,
      }),
    );

  const [originQuery, setOriginQuery] =
    useState(
      () =>
        initialValue?.where.origin?.name ?? '',
    );

  const [destinationQuery, setDestinationQuery] =
    useState(
      () =>
        initialValue?.where.destination?.name ?? '',
    );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<Error | null>(null);

  const [showValidation, setShowValidation] =
    useState(false);

  // ---------------------------------------------------------------------------
  // Presentation State
  // ---------------------------------------------------------------------------

  const controlsDisabled =
    disabled ||
    isIdentityLoading ||
    isSubmitting;

  const validationErrors =
    useMemo(
      () => validateForm(value),
      [value],
    );

  const currentStepHasErrors =
    currentStep === 'where'
      ? hasWhereErrors(validationErrors)
      : currentStep === 'when'
        ? hasWhenErrors(validationErrors)
        : currentStep === 'seats'
          ? hasSeatsErrors(validationErrors)
          : hasPriceErrors(validationErrors);

  const isFirstStep =
    currentStep === 'where';

  const isLastStep =
    currentStep === 'price';

  // ---------------------------------------------------------------------------
  // Location Suggestions
  // ---------------------------------------------------------------------------

  const supportedOriginSuggestions =
    useMemo<readonly ResolvedLocation[]>(
      () => {
        const locations: ResolvedLocation[] = [];
        const seen = new Set<string>();

        const addLocation = (
          location: ResolvedLocation | undefined,
        ): void => {
          if (
            location === undefined ||
            seen.has(location.key)
          ) {
            return;
          }

          if (
            !matchesLocation(
              location,
              originQuery,
            )
          ) {
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
          addLocation(
            findSupportedLocation(key),
          );
        }

        return locations;
      },
      [originQuery],
    );

  const destinationSuggestions =
    useMemo<readonly ResolvedLocation[]>(
      () => {
        if (value.where.origin === null) {
          return [];
        }

        return getSupportedDestinations(
          value.where.origin.key,
        )
          .filter(
            (destination) =>
              matchesLocation(
                destination,
                destinationQuery,
              ),
          )
          .slice(0, 5);
      },
      [
        value.where.origin,
        destinationQuery,
      ],
    );

  // ---------------------------------------------------------------------------
  // Start Demand Creation
  // ---------------------------------------------------------------------------
  //
  // The Demand aggregate is created exactly once.
  //
  // This command creates only the DRAFT root.
  // Corridor, schedule, capacity and pricing are configured afterwards.
  //
  // ---------------------------------------------------------------------------

  async function handleStartDemand(): Promise<void> {
    if (
      controlsDisabled ||
      isStarted
    ) {
      return;
    }

    if (!identity?.publicId) {
      setError(
        new Error(
          'Your account could not be identified.',
        ),
      );

      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result =
        await createJourneyDemandMutation.createJourneyDemand(
          {
            requesterPublicId:
              identity.publicId,

            correlationId:
              crypto.randomUUID(),
          },
        );

      const publicId =
        extractJourneyDemandPublicId(
          result,
        );

      setJourneyDemandPublicId(
        publicId,
      );

      setIsStarted(true);
      setCurrentStep('where');
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause
          : new Error(
              'Unable to start travel need creation.',
            ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Where
  // ---------------------------------------------------------------------------

  function updateWhere(
    where: JourneyDemandCreateWhereValue,
  ): void {
    setValue((current) => ({
      ...current,
      where,
    }));

    setShowValidation(false);
  }

  function handleOriginQueryChange(
    query: string,
  ): void {
    setOriginQuery(query);

    updateWhere({
      origin: null,
      destination: null,
    });

    setDestinationQuery('');
  }

  function handleDestinationQueryChange(
    query: string,
  ): void {
    setDestinationQuery(query);

    updateWhere({
      ...value.where,
      destination: null,
    });
  }

  function handleOriginSelect(
    location: ResolvedLocation,
  ): void {
    setOriginQuery(location.name);
    setDestinationQuery('');

    updateWhere({
      origin: location,
      destination: null,
    });
  }

  function handleDestinationSelect(
    location: ResolvedLocation,
  ): void {
    setDestinationQuery(location.name);

    updateWhere({
      ...value.where,
      destination: location,
    });
  }

  // ---------------------------------------------------------------------------
  // Field Updates
  // ---------------------------------------------------------------------------

  function updateWhen(
    when: JourneyDemandCreateWhenValue,
  ): void {
    setValue((current) => ({
      ...current,
      when,
    }));

    setShowValidation(false);
  }

  function updateSeats(
    seats: JourneyDemandCreateSeatsValue,
  ): void {
    setValue((current) => ({
      ...current,
      seats,
    }));

    setShowValidation(false);
  }

  function updatePrice(
    price: JourneyDemandCreatePriceValue,
  ): void {
    setValue((current) => ({
      ...current,
      price,
    }));

    setShowValidation(false);
  }

  // ---------------------------------------------------------------------------
  // Existing Demand Guard
  // ---------------------------------------------------------------------------

  function requireJourneyDemandPublicId(): string {
    if (
      journeyDemandPublicId === null
    ) {
      throw new Error(
        'Start travel need creation before configuring the request.',
      );
    }

    return journeyDemandPublicId;
  }

  // ---------------------------------------------------------------------------
  // Step Persistence
  // ---------------------------------------------------------------------------

  async function persistCurrentStep(): Promise<void> {
    const publicId =
      requireJourneyDemandPublicId();

    switch (currentStep) {
      // -----------------------------------------------------------------------
      // Where → Corridor
      // -----------------------------------------------------------------------

      case 'where': {
        const origin =
          value.where.origin;

        const destination =
          value.where.destination;

        if (
          origin === null ||
          destination === null
        ) {
          throw new Error(
            'Origin and destination are required.',
          );
        }

        // ---------------------------------------------------------------------
        // The selected locations are already fully resolved against the
        // SisiMove-owned supported corridor catalogue.
        //
        // ResolvedLocation contains:
        //
        //   key
        //   name
        //   latitude
        //   longitude
        //
        // The coordinates therefore come directly from the selected
        // presentation value. No geocoding or second location lookup is
        // required here.
        //
        // The backend corridor command expects:
        //
        //   origin
        //   originLatitude
        //   originLongitude
        //   destination
        //   destinationLatitude
        //   destinationLongitude
        //
        // Sending all six corridor values keeps the API boundary explicit and
        // ensures the backend can construct the Journey Demand corridor with
        // the exact locations selected by the traveller.
        // ---------------------------------------------------------------------

        await updateCorridorMutation.updateJourneyDemandCorridor(
          publicId,
          {
            origin:
              origin.name,

            originLatitude:
              origin.latitude,

            originLongitude:
              origin.longitude,

            destination:
              destination.name,

            destinationLatitude:
              destination.latitude,

            destinationLongitude:
              destination.longitude,

            correlationId:
              crypto.randomUUID(),
          },
        );

        return;
      }

      // -----------------------------------------------------------------------
      // When → Schedule
      // -----------------------------------------------------------------------

      case 'when': {
        await updateScheduleMutation.updateJourneyDemandSchedule(
          publicId,
          {
            earliestDeparture:
              value.when.earliestDeparture,

            latestDeparture:
              value.when.latestDeparture,

            targetArrival:
              value.when.targetArrival.trim()
                .length > 0
                ? value.when.targetArrival
                : undefined,

            maximumArrival:
              value.when.maximumArrival.trim()
                .length > 0
                ? value.when.maximumArrival
                : undefined,

            timezone:
              'Africa/Nairobi',

            correlationId:
              crypto.randomUUID(),
          },
        );

        return;
      }

      // -----------------------------------------------------------------------
      // Seats → Capacity
      // -----------------------------------------------------------------------

      case 'seats': {
        await updateCapacityMutation.updateJourneyDemandCapacity(
          publicId,
          {
            seatsRequired:
              value.seats.requestedSeats,

            correlationId:
              crypto.randomUUID(),
          },
        );

        return;
      }

      // -----------------------------------------------------------------------
      // Price → Pricing
      // -----------------------------------------------------------------------

      case 'price': {
        const maximumPricePerSeat =
          value.price.maximumPricePerSeat;

        // The form value permits undefined while the user is filling the
        // presentation form, but the backend pricing contract requires:
        //
        //   maxFare: number
        //
        // Narrow the value explicitly before crossing the API boundary.
        if (
          maximumPricePerSeat === undefined
        ) {
          throw new Error(
            'Maximum price per seat is required.',
          );
        }

        await updatePricingMutation.updateJourneyDemandPricing(
          publicId,
          {
            currency,

            maxFare:
              maximumPricePerSeat,

            correlationId:
              crypto.randomUUID(),
          },
        );

        return;
      }

      default:
        return;
    }
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  async function handleNext(): Promise<void> {
    if (
      controlsDisabled ||
      !isStarted ||
      journeyDemandPublicId === null
    ) {
      return;
    }

    setError(null);

    const errors =
      validateForm(value);

    if (currentStep === 'where') {
      if (hasWhereErrors(errors)) {
        setShowValidation(true);
        return;
      }
    }

    if (currentStep === 'when') {
      if (hasWhenErrors(errors)) {
        setShowValidation(true);
        return;
      }
    }

    if (currentStep === 'seats') {
      if (hasSeatsErrors(errors)) {
        setShowValidation(true);
        return;
      }
    }

    if (currentStep === 'price') {
      if (hasPriceErrors(errors)) {
        setShowValidation(true);
        return;
      }
    }

    setShowValidation(false);
    setIsSubmitting(true);

    try {
      await persistCurrentStep();

      if (isLastStep) {
        onCreated?.(
          journeyDemandPublicId,
        );

        return;
      }

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
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause
          : new Error(
              'Unable to save this travel need step.',
            ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBack(): void {
    if (
      controlsDisabled ||
      !isStarted
    ) {
      return;
    }

    setError(null);
    setShowValidation(false);

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
  }

  // ---------------------------------------------------------------------------
  // Current Step
  // ---------------------------------------------------------------------------

  function renderCurrentStep() {
    switch (currentStep) {
      case 'where':
        return (
          <JourneyDemandCreateWhere
            value={value.where}
            originQuery={originQuery}
            destinationQuery={
              destinationQuery
            }
            originSuggestions={
              supportedOriginSuggestions
            }
            destinationSuggestions={
              destinationSuggestions
            }
            originError={
              showValidation
                ? validationErrors.where
                    .origin ?? undefined
                : undefined
            }
            destinationError={
              showValidation
                ? validationErrors.where
                    .destination ?? undefined
                : undefined
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
        );

      case 'when':
        return (
          <JourneyDemandCreateWhen
            value={value.when}
            onChange={updateWhen}
            earliestDepartureError={
              showValidation
                ? validationErrors.when
                    .earliestDeparture ??
                  undefined
                : undefined
            }
            latestDepartureError={
              showValidation
                ? validationErrors.when
                    .latestDeparture ??
                  undefined
                : undefined
            }
            disabled={controlsDisabled}
          />
        );

      case 'seats':
        return (
          <JourneyDemandCreateSeats
            value={value.seats}
            onChange={updateSeats}
            error={
              showValidation
                ? validationErrors.seats ??
                  undefined
                : undefined
            }
            disabled={controlsDisabled}
          />
        );

      case 'price':
        return (
          <JourneyDemandCreatePrice
            value={value.price}
            onChange={updatePrice}
            maximumPriceError={
              showValidation
                ? validationErrors.price
                    .maximumPrice ??
                  undefined
                : undefined
            }
            currency={currency}
            disabled={controlsDisabled}
          />
        );

      default:
        return null;
    }
  }

  // ---------------------------------------------------------------------------
  // Start Screen
  // ---------------------------------------------------------------------------

  if (!isStarted) {
    return (
      <div
        className={cn(
          'min-h-[calc(100vh-4rem)]',
          'bg-[var(--background-brand)]',
          'px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12',
          className,
        )}
      >
        <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-3xl items-center justify-center">
          <section
            aria-label="Start travel need creation"
            className={cn(
              'w-full',
              'overflow-hidden',
              'rounded-[var(--radius-2xl)]',
              'border border-[var(--border)]',
              'bg-[var(--surface)]',
              'shadow-[var(--shadow-lg)]',
            )}
          >
            <div
              aria-hidden="true"
              className="h-1 bg-[var(--brand)]"
            />

            <div className="p-6 sm:p-10 lg:p-12">
              <div className="mb-10">
                <JourneyDemandCreateProgress
                  currentStep="where"
                />
              </div>

              <div className="text-center">
                <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-[var(--radius-2xl)] bg-[var(--brand)] text-[var(--brand-foreground)] shadow-[var(--shadow-sm)]">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="size-7"
                    aria-hidden="true"
                  >
                    <path
                      d="M10 3.5v13M3.5 10h13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="mb-8">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
                    Travel need creation
                  </p>

                  <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
                    Create a travel need
                  </h1>

                  <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[var(--foreground-secondary)] sm:text-base">
                    Tell us where you want to travel, when you want to
                    leave, how many seats you need, and your maximum price.
                  </p>
                </div>

                {error !== null ? (
                  <div className="mb-6 text-left">
                    <ErrorState
                      title="We couldn't start travel need creation"
                      description={
                        error.message
                      }
                      retryAction={{
                        label: 'Try again',
                        onClick:
                          handleStartDemand,
                        disabled:
                          controlsDisabled,
                      }}
                    />
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  {onCancel ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onCancel}
                      disabled={
                        controlsDisabled
                      }
                    >
                      Cancel
                    </Button>
                  ) : null}

                  <Button
                    type="button"
                    variant="primary"
                    onClick={
                      handleStartDemand
                    }
                    loading={
                      isSubmitting
                    }
                  >
                    Start travel need

                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="size-4"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 10h11M11 6l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-center">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="size-4 text-[var(--foreground-subtle)]"
                    aria-hidden="true"
                  >
                    <path
                      d="M10 2.75 16 5v4.5c0 3.5-2.15 6.35-6 7.75-3.85-1.4-6-4.25-6-7.75V5l6-2.25Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />

                    <path
                      d="m7.5 10 1.7 1.7 3.3-3.4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <p className="text-xs text-[var(--foreground-muted)]">
                    Your travel need starts as a draft and stays that way
                    until it is ready for the next stage.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render Creation Workflow
  // ---------------------------------------------------------------------------

  return (
    <div
      className={cn(
        'min-h-[calc(100vh-4rem)]',
        'bg-[var(--background-brand)]',
        'px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-4xl">
        {/* ----------------------------------------------------------------- */}
        {/* Creation Header                                                   */}
        {/* ----------------------------------------------------------------- */}

        <div className="mb-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand)] text-[var(--brand-foreground)] shadow-[var(--shadow-sm)]">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="size-4"
                aria-hidden="true"
              >
                <path
                  d="M4 15.5V5.75C4 4.784 4.784 4 5.75 4h8.5C15.216 4 16 4.784 16 5.75v9.75"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                <path
                  d="M3 15.5h14M6.5 12.5h2M11.5 12.5h2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
              Travel need creation
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
                Create a travel need
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-[var(--foreground-secondary)] sm:text-base">
                Tell travellers where you want to go, when you want to
                leave, how many seats you need, and your price limit.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 shadow-[var(--shadow-sm)]">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-[var(--brand)]"
              />

              <span className="text-xs font-medium text-[var(--foreground-secondary)]">
                Draft
              </span>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Progress                                                          */}
        {/* ----------------------------------------------------------------- */}

        <div className="mb-6 rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
          <JourneyDemandCreateProgress
            currentStep={currentStep}
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Error                                                             */}
        {/* ----------------------------------------------------------------- */}

        {error !== null ? (
          <div className="mb-6">
            <ErrorState
              title="We couldn't save this step"
              description={error.message}
              retryAction={{
                label: 'Try again',
                onClick: handleNext,
                disabled:
                  controlsDisabled,
              }}
            />
          </div>
        ) : null}

        {/* ----------------------------------------------------------------- */}
        {/* Identity Error                                                    */}
        {/* ----------------------------------------------------------------- */}

        {identityError ? (
          <div
            className="mb-6 rounded-[var(--radius-md)] border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3"
            role="alert"
          >
            <p className="text-sm text-[var(--danger)]">
              We could not load your current account. Please try again.
            </p>
          </div>
        ) : null}

        {/* ----------------------------------------------------------------- */}
        {/* Form Surface                                                      */}
        {/* ----------------------------------------------------------------- */}

        <section
          aria-label="Journey Demand creation form"
          className={cn(
            'overflow-hidden',
            'rounded-[var(--radius-2xl)]',
            'border border-[var(--border)]',
            'bg-[var(--surface)]',
            'shadow-[var(--shadow-lg)]',
          )}
        >
          <div
            aria-hidden="true"
            className="h-1 bg-[var(--brand)]"
          />

          <div className="p-5 sm:p-8 lg:p-10">
            {renderCurrentStep()}

            {/* ------------------------------------------------------------- */}
            {/* Current-step Validation Summary                               */}
            {/* ------------------------------------------------------------- */}

            {showValidation &&
            currentStepHasErrors ? (
              <div
                className={cn(
                  'mt-6 rounded-[var(--radius-md)]',
                  'border border-[var(--danger)]',
                  'bg-[var(--danger-soft)]',
                  'px-4 py-3',
                )}
                role="alert"
              >
                <p className="text-sm font-medium text-[var(--danger)]">
                  Please complete the required information before continuing.
                </p>
              </div>
            ) : null}
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* Actions                                                           */}
          {/* ----------------------------------------------------------------- */}

          <div className="border-t border-[var(--border-subtle)] bg-[var(--background-subtle)] px-5 py-4 sm:px-8 sm:py-5 lg:px-10">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {isFirstStep ? (
                  onCancel ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onCancel}
                      disabled={
                        controlsDisabled
                      }
                    >
                      Cancel
                    </Button>
                  ) : null
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleBack}
                    disabled={
                      controlsDisabled
                    }
                  >
                    Back
                  </Button>
                )}
              </div>

              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                loading={isSubmitting}
                disabled={
                  controlsDisabled
                }
              >
                {isLastStep ? (
                  <>
                    Continue to editor

                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="size-4"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 10h11M11 6l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    Continue

                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="size-4"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 10h11M11 6l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* Footer reassurance                                               */}
        {/* ----------------------------------------------------------------- */}

        <div className="mt-5 flex items-center justify-center gap-2 text-center">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="size-4 text-[var(--foreground-subtle)]"
            aria-hidden="true"
          >
            <path
              d="M10 2.75 16 5v4.5c0 3.5-2.15 6.35-6 7.75-3.85-1.4-6-4.25-6-7.75V5l6-2.25Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            <path
              d="m7.5 10 1.7 1.7 3.3-3.4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="text-xs text-[var(--foreground-muted)]">
            Your travel need stays in draft while you complete the request.
          </p>
        </div>
      </div>
    </div>
  );
}

export default JourneyDemandCreateForm;