// -----------------------------------------------------------------------------
// Path: src/features/journey/components/create/JourneyCreateForm.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Create Form
//
// Journey creation workflow orchestrator.
//
// Creation lifecycle:
//
//   Start Journey
//          |
//          v
//   POST /journeys
//          |
//          v
//   Journey DRAFT created
//          |
//          v
//   Where → attach corridor
//          |
//          v
//   When → attach schedule
//          |
//          v
//   Vehicle → upload vehicle asset + attach vehicle
//          |
//          v
//   Seats → attach capacity
//          |
//          v
//   Price → attach pricing
//          |
//          v
//   Preferences → attach preferences
//          |
//          v
//   Journey remains DRAFT
//
// Publication is a separate lifecycle command and is intentionally NOT
// performed by this form.
//
// Important:
// - Starting Journey creation creates the aggregate root.
// - The creation root is created exactly once.
// - Component steps progressively mutate the existing DRAFT aggregate.
// - Where does NOT create the Journey.
// - Intermediate steps do not create another Journey.
// - Each component is persisted through its dedicated mutation hook.
// - Vehicle owns the vehicle asset upload UI.
// - The resulting vehicle asset public ID is persisted as part of the
//   Journey vehicle configuration.
// - Mutation hooks own HTTP mutation concerns.
// - This component owns workflow orchestration only.
// - Coordinates come from the SisiMove-supported location catalogue.
// - Users never enter latitude/longitude manually.
// - No external geocoding service is used.
// - The frontend never generates a Journey public ID.
//
// Preference contract:
//
//   smoking      → boolean presentation → ALLOWED / NOT_ALLOWED
//   pets         → boolean presentation → ALLOWED / NOT_ALLOWED
//   luggage      → NONE | LIMITED | STANDARD | LARGE
//   conversation → QUIET | MODERATE | SOCIAL
//   music        → NONE | LOW | MODERATE | ANY
//
// -----------------------------------------------------------------------------

"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { type ResolvedLocation } from "@/foundation/location";
import { cn } from "@/foundation/utils/cn";

import { getSupportedDestinations } from "@/foundation/location/data/resolve-supported-corridor";
import { SUPPORTED_CORRIDORS } from "@/foundation/location/data/supported-corridors";

import {
  JOURNEY_CREATE_STEPS,
  type JourneyCreateStepId,
} from "./journey-create-progress";
import { JourneyCreateProgress } from "./journey-create-progress";

import { JourneyCreateWhere } from "./journey-create-where";

import {
  JourneyCreateWhen,
  type JourneyCreateWhenValues,
} from "./journey-create-when";

import {
  JourneyCreateVehicle,
  type JourneyCreateVehicleValues,
} from "./journey-create-vehicle";

import { JourneyCreateSeats } from "./journey-create-seats";

import {
  JourneyCreatePrice,
  type JourneyCreatePriceValues,
} from "./journey-create-price";

import {
  JourneyCreatePreferences,
  type JourneyCreatePreferencesValues,
  type JourneyConversationPreference,
  type JourneyLuggagePreference,
  type JourneyMusicPreference,
} from "./journey-create-preferences";

import {
  useCreateJourney,
  useAttachJourneyCorridor,
  useAttachJourneySchedule,
  useAttachJourneyVehicle,
  useAttachJourneyCapacity,
  useAttachJourneyPricing,
  useAttachJourneyPreferences,
} from "@/features/journey/hooks/mutations";

// -----------------------------------------------------------------------------
// Initial Values
// -----------------------------------------------------------------------------

const INITIAL_WHEN_VALUES: JourneyCreateWhenValues = {
  departureAt: "",
  arrivalAt: "",
  timezone: "Africa/Nairobi",
};

const INITIAL_VEHICLE_VALUES: JourneyCreateVehicleValues = {
  make: "",
  model: "",
  year: "",
  color: "",
  registration: "",
  assetPublicId: "",
};

const INITIAL_PRICE_VALUES: JourneyCreatePriceValues = {
  amount: "",
  currency: "KES",
};

const INITIAL_PREFERENCES_VALUES: JourneyCreatePreferencesValues = {
  smoking: false,
  pets: false,
  luggage: "STANDARD",
  conversation: "MODERATE",
  music: "MODERATE",
};

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCreateFormProps {
  /**
   * Called after the Journey draft and all configured Journey components have
   * been successfully persisted.
   *
   * Publishing is deliberately outside this form.
   */
  readonly onCreated: (journeyPublicId: string) => void;

  /**
   * Optional cancellation callback owned by the route/workflow.
   */
  readonly onCancel?: () => void;

  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Parsing / Validation
// -----------------------------------------------------------------------------

function parseOptionalInteger(
  value: string,
): number | undefined {
  const normalized = value.trim();

  if (normalized.length === 0) {
    return undefined;
  }

  const parsed = Number(normalized);

  if (!Number.isInteger(parsed)) {
    return undefined;
  }

  return parsed;
}

function parseRequiredAmount(
  value: string,
): number {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new Error("Price amount is required.");
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    throw new Error("Enter a valid price amount.");
  }

  return parsed;
}

function parseRequiredPositiveInteger(
  value: number,
  fieldName: string,
): number {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(
      `${fieldName} must be greater than zero.`,
    );
  }

  return value;
}

function validateRequiredText(
  value: string,
  fieldName: string,
): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalized;
}

// -----------------------------------------------------------------------------
// Supported Location Catalogue
// -----------------------------------------------------------------------------

function getSupportedLocations(): readonly ResolvedLocation[] {
  const locations = new Map<string, ResolvedLocation>();

  for (const corridor of SUPPORTED_CORRIDORS) {
    locations.set(
      corridor.origin.key,
      corridor.origin,
    );

    locations.set(
      corridor.destination.key,
      corridor.destination,
    );

    for (const route of corridor.routes) {
      locations.set(
        route.location.key,
        route.location,
      );
    }
  }

  return Array.from(locations.values());
}

const SUPPORTED_LOCATIONS =
  getSupportedLocations();

// -----------------------------------------------------------------------------
// Location Search
// -----------------------------------------------------------------------------

function normalizeLocationQuery(
  value: string,
): string {
  return value.trim().toLowerCase();
}

function filterSupportedLocations(
  query: string,
  locations: readonly ResolvedLocation[],
): readonly ResolvedLocation[] {
  const normalizedQuery =
    normalizeLocationQuery(query);

  if (normalizedQuery.length === 0) {
    return locations.slice(0, 5);
  }

  return locations
    .filter((location) => {
      const name =
        location.name.toLowerCase();

      const key =
        location.key.toLowerCase();

      return (
        name.includes(normalizedQuery) ||
        key.includes(normalizedQuery)
      );
    })
    .slice(0, 5);
}

// -----------------------------------------------------------------------------
// Resolved Location Validation
// -----------------------------------------------------------------------------

function requireResolvedLocation(
  location: ResolvedLocation | null,
  fieldName: string,
): ResolvedLocation {
  if (location === null) {
    throw new Error(
      `${fieldName} must be selected from the supported locations.`,
    );
  }

  const name = location.name.trim();

  if (name.length === 0) {
    throw new Error(
      `${fieldName} could not be resolved to a valid place.`,
    );
  }

  if (
    !Number.isFinite(location.latitude) ||
    !Number.isFinite(location.longitude)
  ) {
    throw new Error(
      `${fieldName} could not be resolved to valid coordinates.`,
    );
  }

  return {
    key: location.key,
    name,
    latitude: location.latitude,
    longitude: location.longitude,
  };
}

// -----------------------------------------------------------------------------
// Presentation → Domain Policy Translation
// -----------------------------------------------------------------------------
//
// Smoking and pets are intentionally presented as boolean controls.
//
// The actual API/domain values are:
//
//   smoking → ALLOWED | NOT_ALLOWED
//   pets    → ALLOWED | NOT_ALLOWED
//
// Luggage, conversation, and music already use their domain-compatible
// presentation values and therefore require no translation.
// -----------------------------------------------------------------------------

function toSmokingPolicy(
  value: boolean,
): "ALLOWED" | "NOT_ALLOWED" {
  return value
    ? "ALLOWED"
    : "NOT_ALLOWED";
}

function toPetsPolicy(
  value: boolean,
): "ALLOWED" | "NOT_ALLOWED" {
  return value
    ? "ALLOWED"
    : "NOT_ALLOWED";
}

// -----------------------------------------------------------------------------
// Backend Result Boundary
// -----------------------------------------------------------------------------

function extractJourneyPublicId(
  result: unknown,
): string {
  if (
    typeof result !== "object" ||
    result === null ||
    !("publicId" in result)
  ) {
    throw new Error(
      "Journey creation succeeded but did not return a Journey public ID.",
    );
  }

  const publicIdValue =
    result.publicId;

  if (
    typeof publicIdValue !== "string" ||
    publicIdValue.trim().length === 0
  ) {
    throw new Error(
      "Journey creation succeeded but returned an invalid Journey public ID.",
    );
  }

  return publicIdValue;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCreateForm({
  onCreated,
  onCancel,
  className,
}: JourneyCreateFormProps) {
  // ---------------------------------------------------------------------------
  // Creation Workflow State
  // ---------------------------------------------------------------------------

  const [isStarted, setIsStarted] =
    useState(false);

  const [currentStep, setCurrentStep] =
    useState<JourneyCreateStepId>("where");

  const [journeyPublicId, setJourneyPublicId] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<Error | null>(null);

  // ---------------------------------------------------------------------------
  // Resolved Locations
  // ---------------------------------------------------------------------------

  const [originLocation, setOriginLocation] =
    useState<ResolvedLocation | null>(null);

  const [destinationLocation, setDestinationLocation] =
    useState<ResolvedLocation | null>(null);

  const [originQuery, setOriginQuery] =
    useState("");

  const [destinationQuery, setDestinationQuery] =
    useState("");

  // ---------------------------------------------------------------------------
  // Primitive Form State
  // ---------------------------------------------------------------------------

  const [when, setWhen] =
    useState<JourneyCreateWhenValues>(
      INITIAL_WHEN_VALUES,
    );

  const [vehicle, setVehicle] =
    useState<JourneyCreateVehicleValues>(
      INITIAL_VEHICLE_VALUES,
    );

  const [totalSeats, setTotalSeats] =
    useState(0);

  const [price, setPrice] =
    useState<JourneyCreatePriceValues>(
      INITIAL_PRICE_VALUES,
    );

  const [preferences, setPreferences] =
    useState<JourneyCreatePreferencesValues>(
      INITIAL_PREFERENCES_VALUES,
    );

  // ---------------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------------

  const createJourneyMutation =
    useCreateJourney();

  const attachCorridorMutation =
    useAttachJourneyCorridor();

  const attachScheduleMutation =
    useAttachJourneySchedule();

  const attachVehicleMutation =
    useAttachJourneyVehicle();

  const attachCapacityMutation =
    useAttachJourneyCapacity();

  const attachPricingMutation =
    useAttachJourneyPricing();

  const attachPreferencesMutation =
    useAttachJourneyPreferences();

  // ---------------------------------------------------------------------------
  // Step State
  // ---------------------------------------------------------------------------

  const currentStepIndex =
    JOURNEY_CREATE_STEPS.findIndex(
      (step) => step.id === currentStep,
    );

  const isFirstStep =
    currentStepIndex === 0;

  const isLastStep =
    currentStepIndex ===
    JOURNEY_CREATE_STEPS.length - 1;

  // ---------------------------------------------------------------------------
  // Location Suggestions
  // ---------------------------------------------------------------------------

  const originSuggestions =
    useMemo(
      () =>
        filterSupportedLocations(
          originQuery,
          SUPPORTED_LOCATIONS,
        ),
      [originQuery],
    );

  const destinationSuggestions =
    useMemo(() => {
      if (originLocation === null) {
        return [];
      }

      const normalizedQuery =
        normalizeLocationQuery(
          destinationQuery,
        );

      return getSupportedDestinations(
        originLocation.key,
      )
        .filter((location) => {
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
        })
        .slice(0, 5);
    }, [
      originLocation,
      destinationQuery,
    ]);

  // ---------------------------------------------------------------------------
  // Location Updates
  // ---------------------------------------------------------------------------

  function handleOriginQueryChange(
    query: string,
  ): void {
    setOriginQuery(query);
    setOriginLocation(null);

    setDestinationQuery("");
    setDestinationLocation(null);
  }

  function handleDestinationQueryChange(
    query: string,
  ): void {
    setDestinationQuery(query);
    setDestinationLocation(null);
  }

  function handleOriginSelect(
    location: ResolvedLocation,
  ): void {
    setOriginLocation(location);
    setOriginQuery(location.name);

    setDestinationLocation(null);
    setDestinationQuery("");
  }

  function handleDestinationSelect(
    location: ResolvedLocation,
  ): void {
    setDestinationLocation(location);
    setDestinationQuery(location.name);
  }

  // ---------------------------------------------------------------------------
  // Field Updates
  // ---------------------------------------------------------------------------

  function updateWhen(
    field: keyof JourneyCreateWhenValues,
    value: string,
  ): void {
    setWhen((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateVehicle(
    field: keyof JourneyCreateVehicleValues,
    value: string,
  ): void {
    setVehicle((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updatePrice(
    field: keyof JourneyCreatePriceValues,
    value: string,
  ): void {
    setPrice((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateBooleanPreference(
    field: "smoking" | "pets",
    value: boolean,
  ): void {
    setPreferences((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateLuggagePreference(
    value: JourneyLuggagePreference,
  ): void {
    setPreferences((current) => ({
      ...current,
      luggage: value,
    }));
  }

  function updateConversationPreference(
    value: JourneyConversationPreference,
  ): void {
    setPreferences((current) => ({
      ...current,
      conversation: value,
    }));
  }

  function updateMusicPreference(
    value: JourneyMusicPreference,
  ): void {
    setPreferences((current) => ({
      ...current,
      music: value,
    }));
  }

  // ---------------------------------------------------------------------------
  // Start Journey Creation
  // ---------------------------------------------------------------------------
  //
  // This is the ONLY point where the Journey root is created.
  //
  // No Journey component is attached here.
  // ---------------------------------------------------------------------------

  async function handleStartJourney(): Promise<void> {
    if (isSubmitting || isStarted) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result =
        await createJourneyMutation.create();

      const publicId =
        extractJourneyPublicId(result);

      setJourneyPublicId(publicId);
      setIsStarted(true);
      setCurrentStep("where");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause
          : new Error(
              "Unable to start journey creation.",
            ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  function validateCurrentStep(): void {
    switch (currentStep) {
      case "where": {
        requireResolvedLocation(
          originLocation,
          "Origin",
        );

        requireResolvedLocation(
          destinationLocation,
          "Destination",
        );

        return;
      }

      case "when": {
        if (
          when.departureAt.trim().length === 0
        ) {
          throw new Error(
            "Departure time is required.",
          );
        }

        validateRequiredText(
          when.timezone,
          "Timezone",
        );

        return;
      }

      case "vehicle": {
        validateRequiredText(
          vehicle.make,
          "Vehicle make",
        );

        validateRequiredText(
          vehicle.model,
          "Vehicle model",
        );

        if (
          vehicle.year.trim().length > 0 &&
          parseOptionalInteger(
            vehicle.year,
          ) === undefined
        ) {
          throw new Error(
            "Enter a valid vehicle year.",
          );
        }

        validateRequiredText(
          vehicle.assetPublicId,
          "Vehicle photo",
        );

        return;
      }

      case "seats": {
        parseRequiredPositiveInteger(
          totalSeats,
          "Passenger seats",
        );

        return;
      }

      case "price": {
        parseRequiredAmount(price.amount);

        validateRequiredText(
          price.currency,
          "Currency",
        );

        return;
      }

      case "preferences":
        return;

      default:
        return;
    }
  }

  // ---------------------------------------------------------------------------
  // Existing Journey Guard
  // ---------------------------------------------------------------------------

  function requireJourneyPublicId(): string {
    if (journeyPublicId === null) {
      throw new Error(
        "Start journey creation before configuring journey details.",
      );
    }

    return journeyPublicId;
  }

  // ---------------------------------------------------------------------------
  // Step Persistence
  // ---------------------------------------------------------------------------

  async function persistCurrentStep(): Promise<void> {
    const publicId =
      requireJourneyPublicId();

    switch (currentStep) {
      case "where": {
        const origin =
          requireResolvedLocation(
            originLocation,
            "Origin",
          );

        const destination =
          requireResolvedLocation(
            destinationLocation,
            "Destination",
          );

        await attachCorridorMutation.attach(
          publicId,
          {
            originName: origin.name,
            originLatitude:
              origin.latitude,
            originLongitude:
              origin.longitude,
            destinationName:
              destination.name,
            destinationLatitude:
              destination.latitude,
            destinationLongitude:
              destination.longitude,
          },
        );

        return;
      }

      case "when":
        await attachScheduleMutation.attach(
          publicId,
          {
            departureAt:
              when.departureAt,
            arrivalAt:
              when.arrivalAt.trim().length > 0
                ? when.arrivalAt
                : undefined,
            timezone: validateRequiredText(
              when.timezone,
              "Timezone",
            ),
          },
        );

        return;

      case "vehicle":
        await attachVehicleMutation.attach(
          publicId,
          {
            make: validateRequiredText(
              vehicle.make,
              "Vehicle make",
            ),
            model: validateRequiredText(
              vehicle.model,
              "Vehicle model",
            ),
            year: parseOptionalInteger(
              vehicle.year,
            ),
            color:
              vehicle.color.trim().length > 0
                ? vehicle.color.trim()
                : undefined,
            registration:
              vehicle.registration.trim().length > 0
                ? vehicle.registration.trim()
                : undefined,
            assetPublicId:
              validateRequiredText(
                vehicle.assetPublicId,
                "Vehicle photo",
              ),
          },
        );

        return;

      case "seats":
        await attachCapacityMutation.attach(
          publicId,
          {
            totalSeats:
              parseRequiredPositiveInteger(
                totalSeats,
                "Passenger seats",
              ),
          },
        );

        return;

      case "price":
        await attachPricingMutation.attach(
          publicId,
          {
            amount:
              parseRequiredAmount(
                price.amount,
              ),
            currency:
              validateRequiredText(
                price.currency,
                "Currency",
              ),
          },
        );

        return;

      case "preferences":
        await attachPreferencesMutation.attach(
          publicId,
          {
            smoking:
              toSmokingPolicy(
                preferences.smoking,
              ),
            pets:
              toPetsPolicy(
                preferences.pets,
              ),
            luggage:
              preferences.luggage,
            conversation:
              preferences.conversation,
            music:
              preferences.music,
          },
        );

        return;

      default:
        return;
    }
  }

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  async function handleNext(): Promise<void> {
    if (
      isSubmitting ||
      !isStarted ||
      journeyPublicId === null
    ) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      validateCurrentStep();

      await persistCurrentStep();

      if (isLastStep) {
        onCreated(journeyPublicId);
        return;
      }

      const nextStep =
        JOURNEY_CREATE_STEPS[
          currentStepIndex + 1
        ];

      if (nextStep !== undefined) {
        setCurrentStep(nextStep.id);
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause
          : new Error(
              "Unable to save this journey step.",
            ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBack(): void {
    if (
      isSubmitting ||
      !isStarted ||
      isFirstStep
    ) {
      return;
    }

    setError(null);

    const previousStep =
      JOURNEY_CREATE_STEPS[
        currentStepIndex - 1
      ];

    if (previousStep !== undefined) {
      setCurrentStep(previousStep.id);
    }
  }

  // ---------------------------------------------------------------------------
  // Current Step
  // ---------------------------------------------------------------------------

  function renderCurrentStep() {
    switch (currentStep) {
      case "where":
        return (
          <JourneyCreateWhere
            origin={originLocation}
            destination={destinationLocation}
            originQuery={originQuery}
            destinationQuery={destinationQuery}
            originSuggestions={
              originSuggestions
            }
            destinationSuggestions={
              destinationSuggestions
            }
            originError={null}
            destinationError={null}
            disabled={isSubmitting}
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

      case "when":
        return (
          <JourneyCreateWhen
            values={when}
            onChange={updateWhen}
            disabled={isSubmitting}
          />
        );

      case "vehicle":
        return (
          <JourneyCreateVehicle
            values={vehicle}
            onChange={updateVehicle}
            disabled={isSubmitting}
          />
        );

      case "seats":
        return (
          <JourneyCreateSeats
            value={totalSeats}
            onChange={setTotalSeats}
            disabled={isSubmitting}
          />
        );

      case "price":
        return (
          <JourneyCreatePrice
            values={price}
            onChange={updatePrice}
            disabled={isSubmitting}
          />
        );

      case "preferences":
        return (
          <JourneyCreatePreferences
            values={preferences}
            onBooleanChange={
              updateBooleanPreference
            }
            onLuggageChange={
              updateLuggagePreference
            }
            onConversationChange={
              updateConversationPreference
            }
            onMusicChange={
              updateMusicPreference
            }
            disabled={isSubmitting}
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
          "min-h-[calc(100vh-4rem)]",
          "bg-[var(--background-brand)]",
          "px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12",
          className,
        )}
      >
        <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-3xl items-center justify-center">
          <section
            aria-label="Start journey creation"
            className={cn(
              "w-full",
              "overflow-hidden",
              "rounded-[var(--radius-2xl)]",
              "border border-[var(--border)]",
              "bg-[var(--surface)]",
              "shadow-[var(--shadow-lg)]",
            )}
          >
            <div
              aria-hidden="true"
              className="h-1 bg-[var(--brand)]"
            />

            <div className="p-6 sm:p-10 lg:p-12">
              <div className="mb-10">
                <JourneyCreateProgress
                  isStarted={false}
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
                </div>

                <div className="mb-8">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
                    Journey creation
                  </p>

                  <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
                    Start your journey
                  </h1>

                  <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[var(--foreground-secondary)] sm:text-base">
                    Create a journey draft first. You&apos;ll then add your
                    route, departure time, vehicle and photo, seats, price,
                    and preferences step by step.
                  </p>
                </div>

                {error !== null && (
                  <div className="mb-6 text-left">
                    <ErrorState
                      title="We couldn't start journey creation"
                      description={error.message}
                      retryAction={{
                        label: "Try again",
                        onClick:
                          handleStartJourney,
                        disabled:
                          isSubmitting,
                      }}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  {onCancel ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onCancel}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  ) : null}

                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleStartJourney}
                    loading={isSubmitting}
                  >
                    Start journey

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
                    Your journey starts as a draft and stays that way until
                    you&apos;re ready to publish.
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
        "min-h-[calc(100vh-4rem)]",
        "bg-[var(--background-brand)]",
        "px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12",
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
              Journey creation
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
                Create a journey
              </h1>

              <p className="mt-1 max-w-2xl text-sm text-[var(--foreground-secondary)] sm:text-base">
                Tell travellers where you&apos;re going, when you&apos;re
                leaving, and what the journey looks like.
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
          <JourneyCreateProgress
            isStarted={isStarted}
            currentStep={currentStep}
          />
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Error                                                             */}
        {/* ----------------------------------------------------------------- */}

        {error !== null && (
          <div className="mb-6">
            <ErrorState
              title="We couldn't save this step"
              description={error.message}
              retryAction={{
                label: "Try again",
                onClick: handleNext,
                disabled: isSubmitting,
              }}
            />
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Form Surface                                                      */}
        {/* ----------------------------------------------------------------- */}

        <section
          aria-label="Journey creation form"
          className={cn(
            "overflow-hidden",
            "rounded-[var(--radius-2xl)]",
            "border border-[var(--border)]",
            "bg-[var(--surface)]",
            "shadow-[var(--shadow-lg)]",
          )}
        >
          <div
            aria-hidden="true"
            className="h-1 bg-[var(--brand)]"
          />

          <div className="p-5 sm:p-8 lg:p-10">
            {renderCurrentStep()}
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
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  ) : null
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleBack}
                    disabled={isSubmitting}
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
              >
                {isLastStep ? (
                  <>
                    Finish journey

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
            Your journey stays in draft until you&apos;re ready to publish.
          </p>
        </div>
      </div>
    </div>
  );
}