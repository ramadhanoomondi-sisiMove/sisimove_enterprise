// -----------------------------------------------------------------------------
// sisiMove — Journey Create Form
// -----------------------------------------------------------------------------
//
// Journey creation workflow orchestrator.
//
// Responsibilities:
// - own the creation step;
// - own all primitive form state;
// - render the current creation step;
// - create the Journey root;
// - attach Journey-owned components through their mutation hooks;
// - validate/normalize presentation values before persistence;
// - translate presentation-only preference booleans into backend policy values;
// - advance between creation steps;
// - expose submission/loading/error state.
//
// Presentation components intentionally do NOT perform API calls.
//
// Backend creation flow:
//
//   POST /journeys
//          |
//          v
//   attach corridor
//          |
//          v
//   attach schedule
//          |
//          v
//   attach vehicle
//          |
//          v
//   attach capacity
//          |
//          v
//   attach pricing
//          |
//          v
//   attach preferences
//          |
//          v
//   attach assets
//          |
//          v
//   Journey remains DRAFT
//
// Publication is a separate lifecycle command and is intentionally NOT
// performed by this form. The caller/workflow decides when to publish.
//
// Important:
// - No generic "update Journey" operation is used.
// - Coordinates remain strings until submission.
// - Amount remains a string until submission.
// - Year remains a string until submission.
// - Sort order remains a string until submission.
// - bookedSeats and availableSeats are never submitted.
// - Asset lifecycle remains owned by the Asset capability.
// - The backend creates the Journey public ID.
// - The frontend never generates a Journey public ID.
// - Mutation hooks own HTTP mutation concerns.
// - This component owns workflow orchestration only.
// -----------------------------------------------------------------------------

"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { cn } from "@/foundation/utils/cn";

import {
  JOURNEY_CREATE_STEPS,
  type JourneyCreateStepId,
} from "./journey-create-progress";
import { JourneyCreateProgress } from "./journey-create-progress";

import {
  JourneyCreateWhere,
  type JourneyCreateWhereValues,
} from "./journey-create-where";

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
} from "./journey-create-preferences";

import {
  JourneyCreateAssets,
  type JourneyCreateAssetOption,
  type JourneyCreateAssetValues,
} from "./journey-create-assets";

import {
  useCreateJourney,
  useAttachJourneyCorridor,
  useAttachJourneySchedule,
  useAttachJourneyVehicle,
  useAttachJourneyCapacity,
  useAttachJourneyPricing,
  useAttachJourneyPreferences,
  useAttachJourneyAsset,
} from "@/features/journey/hooks/mutations";

import type {
  JourneyConversationPreference,
  JourneyLuggagePolicy,
  JourneyMusicPreference,
  JourneyPetsPolicy,
  JourneySmokingPolicy,
} from "@/features/journey/models";

const INITIAL_WHERE_VALUES: JourneyCreateWhereValues = {
  originName: "",
  originLatitude: "",
  originLongitude: "",
  destinationName: "",
  destinationLatitude: "",
  destinationLongitude: "",
};

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

/*
 * The current presentation component intentionally uses booleans for its
 * controls.
 *
 * These are UI values, not backend domain values.
 *
 * The workflow translates them into the exact Journey preference unions when
 * constructing AttachJourneyPreferencesRequest.
 */
const INITIAL_PREFERENCES_VALUES: JourneyCreatePreferencesValues = {
  smoking: false,
  pets: false,
  luggage: true,
  conversation: true,
  music: true,
};

const INITIAL_ASSET_VALUES: JourneyCreateAssetValues = {
  assetPublicId: "",
  type: "VEHICLE",
  sortOrder: "0",
};

export interface JourneyCreateFormProps {
  /**
   * Assets available to associate with the Journey.
   *
   * Asset loading remains outside this form. The form only consumes the
   * capability's public references.
   */
  readonly assetOptions?: readonly JourneyCreateAssetOption[];

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

/**
 * Converts an optional integer input.
 *
 * Empty input becomes undefined.
 *
 * This is appropriate for optional vehicle year because the backend permits
 * the year to be omitted.
 */
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

function parseRequiredCoordinate(
  value: string,
  fieldName: string,
): number {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new Error(`${fieldName} is required.`);
  }

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    throw new Error(
      `Enter a valid ${fieldName.toLowerCase()}.`,
    );
  }

  return parsed;
}

function parseRequiredAmount(value: string): number {
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
    throw new Error(`${fieldName} must be greater than zero.`);
  }

  return value;
}

function parseRequiredNonNegativeInteger(
  value: string,
  fieldName: string,
): number {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new Error(`${fieldName} is required.`);
  }

  const parsed = Number(normalized);

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(
      `${fieldName} must be a whole number greater than or equal to zero.`,
    );
  }

  return parsed;
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

/**
 * Translate the presentation smoking toggle into the backend domain policy.
 */
function toSmokingPolicy(
  value: boolean,
): JourneySmokingPolicy {
  return value ? "ALLOWED" : "NOT_ALLOWED";
}

/**
 * Translate the presentation pets toggle into the backend domain policy.
 */
function toPetsPolicy(
  value: boolean,
): JourneyPetsPolicy {
  return value ? "ALLOWED" : "NOT_ALLOWED";
}

/**
 * Translate the presentation luggage toggle into the backend domain policy.
 *
 * The UI currently asks whether luggage is allowed rather than asking the
 * traveller to choose a luggage size/limit.
 *
 * Therefore:
 *
 *   enabled  -> STANDARD
 *   disabled -> NONE
 */
function toLuggagePolicy(
  value: boolean,
): JourneyLuggagePolicy {
  return value ? "STANDARD" : "NONE";
}

/**
 * Translate the presentation conversation toggle into the backend preference.
 *
 * The current UI exposes conversation as enabled/disabled.
 *
 * Therefore:
 *
 *   enabled  -> MODERATE
 *   disabled -> QUIET
 */
function toConversationPreference(
  value: boolean,
): JourneyConversationPreference {
  return value ? "MODERATE" : "QUIET";
}

/**
 * Translate the presentation music toggle into the backend preference.
 *
 * The current UI exposes music as enabled/disabled.
 *
 * Therefore:
 *
 *   enabled  -> MODERATE
 *   disabled -> NONE
 */
function toMusicPreference(
  value: boolean,
): JourneyMusicPreference {
  return value ? "MODERATE" : "NONE";
}

/**
 * The create API intentionally exposes its serialized result as unknown.
 *
 * The form needs one value from that response — the backend-generated
 * Journey public ID — because every subsequent component command addresses
 * the Journey by public ID.
 *
 * This runtime boundary does not construct or generate an ID. It only accepts
 * a value that the backend actually returned and rejects everything else.
 */
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

  const publicId =
    (result as { publicId?: unknown }).publicId;

  if (
    typeof publicId !== "string" ||
    publicId.trim().length === 0
  ) {
    throw new Error(
      "Journey creation succeeded but returned an invalid Journey public ID.",
    );
  }

  return publicId;
}

export function JourneyCreateForm({
  assetOptions = [],
  onCreated,
  onCancel,
  className,
}: JourneyCreateFormProps) {
  const [currentStep, setCurrentStep] =
    useState<JourneyCreateStepId>("where");

  const [where, setWhere] =
    useState<JourneyCreateWhereValues>(
      INITIAL_WHERE_VALUES,
    );

  const [when, setWhen] =
    useState<JourneyCreateWhenValues>(
      INITIAL_WHEN_VALUES,
    );

  const [vehicle, setVehicle] =
    useState<JourneyCreateVehicleValues>(
      INITIAL_VEHICLE_VALUES,
    );

  const [totalSeats, setTotalSeats] = useState(0);

  const [price, setPrice] =
    useState<JourneyCreatePriceValues>(
      INITIAL_PRICE_VALUES,
    );

  const [preferences, setPreferences] =
    useState<JourneyCreatePreferencesValues>(
      INITIAL_PREFERENCES_VALUES,
    );

  const [asset, setAsset] =
    useState<JourneyCreateAssetValues>(
      INITIAL_ASSET_VALUES,
    );

  /*
   * The ID is supplied by the backend after createJourney().
   *
   * It is never generated by the frontend.
   */
  const [journeyPublicId, setJourneyPublicId] =
    useState<string | null>(null);

  /*
   * Individual mutation hooks expose their own mutation state.
   *
   * This orchestration-level state is still necessary because one Continue
   * operation may perform several sequential asynchronous operations.
   */
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<Error | null>(null);

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

  const attachAssetMutation =
    useAttachJourneyAsset();

  const currentStepIndex =
    JOURNEY_CREATE_STEPS.findIndex(
      (step) => step.id === currentStep,
    );

  const isFirstStep =
    currentStepIndex === 0;

  const isLastStep =
    currentStepIndex ===
    JOURNEY_CREATE_STEPS.length - 1;

  function updateWhere(
    field: keyof JourneyCreateWhereValues,
    value: string,
  ) {
    setWhere((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateWhen(
    field: keyof JourneyCreateWhenValues,
    value: string,
  ) {
    setWhen((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateVehicle(
    field: keyof JourneyCreateVehicleValues,
    value: string,
  ) {
    setVehicle((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updatePrice(
    field: keyof JourneyCreatePriceValues,
    value: string,
  ) {
    setPrice((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updatePreferences(
    field: keyof JourneyCreatePreferencesValues,
    value: boolean,
  ) {
    setPreferences((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateAsset(
    field: keyof JourneyCreateAssetValues,
    value: string,
  ) {
    setAsset((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateCurrentStep(): void {
    switch (currentStep) {
      case "where": {
        validateRequiredText(
          where.originName,
          "Origin",
        );

        validateRequiredText(
          where.destinationName,
          "Destination",
        );

        /*
         * AttachJourneyCorridorRequest requires all four coordinates.
         *
         * Validation therefore happens through the required-coordinate
         * conversion rather than an optional conversion.
         */
        parseRequiredCoordinate(
          where.originLatitude,
          "Origin latitude",
        );

        parseRequiredCoordinate(
          where.originLongitude,
          "Origin longitude",
        );

        parseRequiredCoordinate(
          where.destinationLatitude,
          "Destination latitude",
        );

        parseRequiredCoordinate(
          where.destinationLongitude,
          "Destination longitude",
        );

        return;
      }

      case "when": {
        if (when.departureAt.trim().length === 0) {
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
          parseOptionalInteger(vehicle.year) ===
            undefined
        ) {
          throw new Error(
            "Enter a valid vehicle year.",
          );
        }

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

      case "assets": {
        /*
         * Assets are optional. An empty asset reference means that this step
         * has nothing to persist.
         */
        if (
          asset.assetPublicId.trim().length === 0
        ) {
          return;
        }

        parseRequiredNonNegativeInteger(
          asset.sortOrder,
          "Asset display order",
        );

        return;
      }

      default:
        return;
    }
  }

  async function ensureJourneyCreated(): Promise<string> {
    if (journeyPublicId !== null) {
      return journeyPublicId;
    }

    const result =
      await createJourneyMutation.create();

    const publicId =
      extractJourneyPublicId(result);

    setJourneyPublicId(publicId);

    return publicId;
  }

  async function persistCurrentStep(
    publicId: string,
  ): Promise<void> {
    switch (currentStep) {
      case "where": {
        await attachCorridorMutation.attach(
          publicId,
          {
            originName: validateRequiredText(
              where.originName,
              "Origin",
            ),
            originLatitude:
              parseRequiredCoordinate(
                where.originLatitude,
                "Origin latitude",
              ),
            originLongitude:
              parseRequiredCoordinate(
                where.originLongitude,
                "Origin longitude",
              ),
            destinationName:
              validateRequiredText(
                where.destinationName,
                "Destination",
              ),
            destinationLatitude:
              parseRequiredCoordinate(
                where.destinationLatitude,
                "Destination latitude",
              ),
            destinationLongitude:
              parseRequiredCoordinate(
                where.destinationLongitude,
                "Destination longitude",
              ),
          },
        );

        return;
      }

      case "when":
        await attachScheduleMutation.attach(
          publicId,
          {
            departureAt: when.departureAt,
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
              vehicle.assetPublicId.trim().length > 0
                ? vehicle.assetPublicId.trim()
                : undefined,
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
            amount: parseRequiredAmount(
              price.amount,
            ),
            currency: validateRequiredText(
              price.currency,
              "Currency",
            ),
          },
        );

        return;

      case "preferences":
        /*
         * The presentation component currently exposes simple booleans.
         *
         * The backend command requires domain-specific policies. This is the
         * correct translation boundary: presentation state is converted into
         * the exact API contract here without weakening the API types.
         */
        await attachPreferencesMutation.attach(
          publicId,
          {
            smoking: toSmokingPolicy(
              preferences.smoking,
            ),
            pets: toPetsPolicy(
              preferences.pets,
            ),
            luggage: toLuggagePolicy(
              preferences.luggage,
            ),
            conversation:
              toConversationPreference(
                preferences.conversation,
              ),
            music: toMusicPreference(
              preferences.music,
            ),
          },
        );

        return;

      case "assets": {
        const assetPublicId =
          asset.assetPublicId.trim();

        /*
         * Asset association is optional. Do not send an empty public ID to the
         * backend.
         */
        if (assetPublicId.length === 0) {
          return;
        }

        await attachAssetMutation.attach(
          publicId,
          {
            assetPublicId,
            type: asset.type,
            sortOrder:
              parseRequiredNonNegativeInteger(
                asset.sortOrder,
                "Asset display order",
              ),
          },
        );

        return;
      }

      default:
        return;
    }
  }

  async function handleNext(): Promise<void> {
    if (isSubmitting) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      validateCurrentStep();

      /*
       * The first Continue creates the Journey root and immediately persists
       * the first component.
       *
       * Subsequent Continue operations use the already-created Journey public
       * ID and invoke only the command corresponding to the current step.
       */
      const publicId =
        await ensureJourneyCreated();

      await persistCurrentStep(publicId);

      if (isLastStep) {
        /*
         * Creation intentionally finishes in DRAFT.
         *
         * Publication is a separate lifecycle command and belongs to the
         * caller/workflow rather than this component.
         */
        onCreated(publicId);
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
    if (isSubmitting || isFirstStep) {
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

  function renderCurrentStep() {
    switch (currentStep) {
      case "where":
        return (
          <JourneyCreateWhere
            values={where}
            onChange={updateWhere}
            disabled={isSubmitting}
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
            onChange={updatePreferences}
            disabled={isSubmitting}
          />
        );

      case "assets":
        return (
          <JourneyCreateAssets
            values={asset}
            options={assetOptions}
            onChange={updateAsset}
            disabled={isSubmitting}
          />
        );

      default:
        return null;
    }
  }

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-3xl",
        "space-y-6",
        className,
      )}
    >
      <JourneyCreateProgress
        currentStep={currentStep}
      />

      {error !== null && (
        <ErrorState
          title="We couldn't save this step"
          description={error.message}
          retryAction={{
            label: "Try again",
            onClick: handleNext,
            disabled: isSubmitting,
          }}
        />
      )}

      <div className="surface p-5 sm:p-6">
        {renderCurrentStep()}
      </div>

      <div
        className={cn(
          "flex flex-col-reverse gap-3",
          "sm:flex-row sm:items-center sm:justify-between",
        )}
      >
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
          {isLastStep ? "Finish" : "Continue"}
        </Button>
      </div>
    </div>
  );
}