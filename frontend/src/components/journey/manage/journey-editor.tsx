// -----------------------------------------------------------------------------
// sisiMove — Journey Editor
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - compose the existing Journey component editors;
// - own Journey component persistence for the editing surface;
// - translate presentation values into Journey API requests;
// - own component mutation pending/error state;
// - refresh the Journey projection after successful mutations;
// - provide the existing Journey projection as initial values;
// - safely initialize editors for progressively assembled Draft Journeys.
//
// Non-responsibilities:
// - no Journey lifecycle transitions;
// - no publish/start/complete/cancel/expire handling;
// - no navigation;
// - no authorization decisions;
// - no verification decisions;
// - no backend aggregate reconstruction;
// - no generic Journey update command.
//
// Each existing editor remains presentation-only:
//
//   JourneyCorridorEditor
//   JourneyScheduleEditor
//   JourneyVehicleEditor
//   JourneyCapacityEditor
//   JourneyPricingEditor
//   JourneyPreferencesEditor
//   JourneyAssetEditor
//
// This component translates their presentation values into the exact
// Journey bounded-context commands.
//
// -----------------------------------------------------------------------------
// IMPORTANT
// -----------------------------------------------------------------------------
//
// MyJourney is intentionally progressively assembled.
//
// The following projections may therefore be null:
//
//   journey.route
//   journey.schedule
//   journey.vehicle
//   journey.capacity
//   journey.pricing
//   journey.preferences
//
// A missing component does NOT mean the editor cannot be rendered.
//
// It means that the corresponding editor receives empty/default presentation
// values and can attach the missing component through its existing command.
//
// The editor therefore does not use non-null assertions to hide the nullable
// projection contract.
// -----------------------------------------------------------------------------

"use client";

import { useMemo, useState } from "react";

import { ErrorState } from "@/components/ui/error-state";
import { cn } from "@/foundation/utils/cn";

import type { JourneyAssetPickerOption } from "@/components/journey/assets";
import type { MyJourney } from "@/features/journey/models";

import {
  useAttachJourneyAsset,
  useAttachJourneyCapacity,
  useAttachJourneyCorridor,
  useAttachJourneyPreferences,
  useAttachJourneyPricing,
  useAttachJourneySchedule,
  useAttachJourneyVehicle,
} from "@/features/journey/hooks/mutations";

import { JourneyEditorSections } from "./journey-editor-sections";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyEditorProps {
  /**
   * Authenticated Journey projection being edited.
   *
   * The projection may represent a partially assembled Draft Journey.
   */
  readonly journey: MyJourney;

  /**
   * Refetches the authoritative Journey projection after a successful
   * component mutation.
   */
  readonly onChanged?: () => void | Promise<void>;

  /**
   * Available Asset references supplied by the Asset capability.
   *
   * Journey does not fetch or own Asset records.
   */
  readonly assetOptions?: readonly JourneyAssetPickerOption[];

  /**
   * Optional additional classes.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
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
    throw new Error("Enter a valid whole number.");
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

function requireText(
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
// Component
// -----------------------------------------------------------------------------

export function JourneyEditor({
  journey,
  onChanged,
  assetOptions = [],
  className,
}: JourneyEditorProps) {
  const [error, setError] =
    useState<Error | null>(null);

  const [activeMutation, setActiveMutation] =
    useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Component mutation hooks
  // ---------------------------------------------------------------------------

  const attachCorridor =
    useAttachJourneyCorridor();

  const attachSchedule =
    useAttachJourneySchedule();

  const attachVehicle =
    useAttachJourneyVehicle();

  const attachCapacity =
    useAttachJourneyCapacity();

  const attachPricing =
    useAttachJourneyPricing();

  const attachPreferences =
    useAttachJourneyPreferences();

  const attachAsset =
    useAttachJourneyAsset();

  const journeyPublicId =
    journey.publicId.trim();

  // ---------------------------------------------------------------------------
  // Initial values
  // ---------------------------------------------------------------------------
  //
  // Each Journey child is optional while the Draft is being assembled.
  //
  // Missing backend components are represented by empty presentation values.
  // The existing editors can therefore create those components.
  //
  // These values are only initial values. The presentation editors own their
  // transient local form state after mounting.
  // ---------------------------------------------------------------------------

  const corridorInitialValue = useMemo(
    () => ({
      originName:
        journey.route?.origin.name ?? "",
      originLatitude:
        journey.route?.origin.latitude !==
        undefined
          ? String(
              journey.route.origin.latitude,
            )
          : "",
      originLongitude:
        journey.route?.origin.longitude !==
        undefined
          ? String(
              journey.route.origin.longitude,
            )
          : "",
      destinationName:
        journey.route?.destination.name ?? "",
      destinationLatitude:
        journey.route?.destination.latitude !==
        undefined
          ? String(
              journey.route.destination.latitude,
            )
          : "",
      destinationLongitude:
        journey.route?.destination.longitude !==
        undefined
          ? String(
              journey.route.destination.longitude,
            )
          : "",
    }),
    [journey],
  );

  const scheduleInitialValue = useMemo(
    () => ({
      departureAt:
        journey.schedule?.departureAt ?? "",
      arrivalAt:
        journey.schedule?.arrivalAt ?? "",
      timezone:
        journey.schedule?.timezone ??
        "Africa/Nairobi",
    }),
    [journey],
  );

  const vehicleInitialValue = useMemo(
    () => ({
      make:
        journey.vehicle?.make ?? "",
      model:
        journey.vehicle?.model ?? "",
      year:
        journey.vehicle?.year !== null &&
        journey.vehicle?.year !== undefined
          ? String(journey.vehicle.year)
          : "",
      color:
        journey.vehicle?.color ?? "",
      registration:
        journey.vehicle?.registration ?? "",
      assetPublicId:
        journey.vehicle?.assetPublicId ?? "",
    }),
    [journey],
  );

  const capacityInitialValue = useMemo(
    () => ({
      totalSeats:
        journey.capacity?.totalSeats ?? 0,
    }),
    [journey],
  );

  const pricingInitialValue = useMemo(
    () => ({
      amount:
        journey.pricing?.amount !==
          null &&
        journey.pricing?.amount !==
          undefined
          ? String(
              journey.pricing.amount,
            )
          : "",
      currency:
        journey.pricing?.currency ?? "KES",
    }),
    [journey],
  );

  const preferencesInitialValue =
    useMemo(
      () => ({
        smoking:
          journey.preferences?.smoking ===
          "ALLOWED",

        pets:
          journey.preferences?.pets ===
          "ALLOWED",

        luggage:
          journey.preferences?.luggage !==
          "NONE",

        conversation:
          journey.preferences?.conversation !==
          "QUIET",

        music:
          journey.preferences?.music !==
          "NONE",
      }),
      [journey],
    );

  const assetInitialValue = useMemo(
    () => ({
      assetPublicId:
        journey.assets[0]?.assetPublicId ??
        "",

      type:
        journey.assets[0]?.type ??
        "VEHICLE",

      sortOrder:
        journey.assets[0] !== undefined
          ? String(
              journey.assets[0].sortOrder,
            )
          : "0",
    }),
    [journey],
  );

  // ---------------------------------------------------------------------------
  // Submission state
  // ---------------------------------------------------------------------------

  const isSubmitting =
    activeMutation !== null ||
    attachCorridor.isPending ||
    attachSchedule.isPending ||
    attachVehicle.isPending ||
    attachCapacity.isPending ||
    attachPricing.isPending ||
    attachPreferences.isPending ||
    attachAsset.isPending;

  // ---------------------------------------------------------------------------
  // Refresh
  // ---------------------------------------------------------------------------
  //
  // The API mutation response is not used to fabricate a new MyJourney
  // projection. The parent refreshes the authoritative projection instead.
  // ---------------------------------------------------------------------------

  async function refreshAfterChange(): Promise<void> {
    await onChanged?.();
  }

  // ---------------------------------------------------------------------------
  // Corridor
  // ---------------------------------------------------------------------------

  async function handleCorridorSubmit(
    values: typeof corridorInitialValue,
  ): Promise<void> {
    setError(null);
    setActiveMutation("corridor");

    try {
      await attachCorridor.attach(
        journeyPublicId,
        {
          originName: requireText(
            values.originName,
            "Origin",
          ),

          originLatitude:
            parseRequiredCoordinate(
              values.originLatitude,
              "Origin latitude",
            ),

          originLongitude:
            parseRequiredCoordinate(
              values.originLongitude,
              "Origin longitude",
            ),

          destinationName:
            requireText(
              values.destinationName,
              "Destination",
            ),

          destinationLatitude:
            parseRequiredCoordinate(
              values.destinationLatitude,
              "Destination latitude",
            ),

          destinationLongitude:
            parseRequiredCoordinate(
              values.destinationLongitude,
              "Destination longitude",
            ),
        },
      );

      await refreshAfterChange();
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error(
              "Unable to save the Journey corridor.",
            );

      setError(nextError);

      throw nextError;
    } finally {
      setActiveMutation(null);
    }
  }

  // ---------------------------------------------------------------------------
  // Schedule
  // ---------------------------------------------------------------------------

  async function handleScheduleSubmit(
    values: typeof scheduleInitialValue,
  ): Promise<void> {
    setError(null);
    setActiveMutation("schedule");

    try {
      await attachSchedule.attach(
        journeyPublicId,
        {
          departureAt:
            requireText(
              values.departureAt,
              "Departure time",
            ),

          arrivalAt:
            values.arrivalAt.trim().length > 0
              ? values.arrivalAt.trim()
              : undefined,

          timezone:
            requireText(
              values.timezone,
              "Timezone",
            ),
        },
      );

      await refreshAfterChange();
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error(
              "Unable to save the Journey schedule.",
            );

      setError(nextError);

      throw nextError;
    } finally {
      setActiveMutation(null);
    }
  }

  // ---------------------------------------------------------------------------
  // Vehicle
  // ---------------------------------------------------------------------------

  async function handleVehicleSubmit(
    values: typeof vehicleInitialValue,
  ): Promise<void> {
    setError(null);
    setActiveMutation("vehicle");

    try {
      await attachVehicle.attach(
        journeyPublicId,
        {
          make: requireText(
            values.make,
            "Vehicle make",
          ),

          model: requireText(
            values.model,
            "Vehicle model",
          ),

          year: parseOptionalInteger(
            values.year,
          ),

          color:
            values.color.trim().length > 0
              ? values.color.trim()
              : undefined,

          registration:
            values.registration.trim().length > 0
              ? values.registration.trim()
              : undefined,

          assetPublicId:
            values.assetPublicId.trim().length > 0
              ? values.assetPublicId.trim()
              : undefined,
        },
      );

      await refreshAfterChange();
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error(
              "Unable to save the Journey vehicle.",
            );

      setError(nextError);

      throw nextError;
    } finally {
      setActiveMutation(null);
    }
  }

  // ---------------------------------------------------------------------------
  // Capacity
  // ---------------------------------------------------------------------------

  async function handleCapacitySubmit(
    values: {
      totalSeats: number;
    },
  ): Promise<void> {
    setError(null);
    setActiveMutation("capacity");

    try {
      if (
        !Number.isInteger(
          values.totalSeats,
        ) ||
        values.totalSeats <= 0
      ) {
        throw new Error(
          "Passenger seats must be greater than zero.",
        );
      }

      await attachCapacity.attach(
        journeyPublicId,
        {
          totalSeats:
            values.totalSeats,
        },
      );

      await refreshAfterChange();
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error(
              "Unable to save Journey capacity.",
            );

      setError(nextError);

      throw nextError;
    } finally {
      setActiveMutation(null);
    }
  }

  // ---------------------------------------------------------------------------
  // Pricing
  // ---------------------------------------------------------------------------

  async function handlePricingSubmit(
    values: typeof pricingInitialValue,
  ): Promise<void> {
    setError(null);
    setActiveMutation("pricing");

    try {
      await attachPricing.attach(
        journeyPublicId,
        {
          amount:
            parseRequiredAmount(
              values.amount,
            ),

          currency:
            requireText(
              values.currency,
              "Currency",
            ),
        },
      );

      await refreshAfterChange();
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error(
              "Unable to save Journey pricing.",
            );

      setError(nextError);

      throw nextError;
    } finally {
      setActiveMutation(null);
    }
  }

  // ---------------------------------------------------------------------------
  // Preferences
  // ---------------------------------------------------------------------------
  //
  // The editor intentionally uses booleans because that is the existing
  // presentation contract.
  //
  // Translation into the Journey API's explicit policy unions happens here at
  // the orchestration boundary.
  // ---------------------------------------------------------------------------

  async function handlePreferencesSubmit(
    values: typeof preferencesInitialValue,
  ): Promise<void> {
    setError(null);
    setActiveMutation("preferences");

    try {
      await attachPreferences.attach(
        journeyPublicId,
        {
          smoking: values.smoking
            ? "ALLOWED"
            : "NOT_ALLOWED",

          pets: values.pets
            ? "ALLOWED"
            : "NOT_ALLOWED",

          luggage: values.luggage
            ? "STANDARD"
            : "NONE",

          conversation:
            values.conversation
              ? "MODERATE"
              : "QUIET",

          music: values.music
            ? "MODERATE"
            : "NONE",
        },
      );

      await refreshAfterChange();
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error(
              "Unable to save Journey preferences.",
            );

      setError(nextError);

      throw nextError;
    } finally {
      setActiveMutation(null);
    }
  }

  // ---------------------------------------------------------------------------
  // Asset
  // ---------------------------------------------------------------------------

  async function handleAssetSubmit(
    values: typeof assetInitialValue,
  ): Promise<void> {
    setError(null);
    setActiveMutation("asset");

    try {
      const assetPublicId =
        values.assetPublicId.trim();

      if (assetPublicId.length === 0) {
        throw new Error(
          "Asset selection is required.",
        );
      }

      const sortOrder =
        Number(values.sortOrder);

      if (
        !Number.isInteger(sortOrder) ||
        sortOrder < 0
      ) {
        throw new Error(
          "Asset display order must be a non-negative whole number.",
        );
      }

      await attachAsset.attach(
        journeyPublicId,
        {
          assetPublicId,
          type: values.type,
          sortOrder,
        },
      );

      await refreshAfterChange();
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error(
              "Unable to save the Journey asset.",
            );

      setError(nextError);

      throw nextError;
    } finally {
      setActiveMutation(null);
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div
      className={cn(
        "space-y-6",
        className,
      )}
    >
      {error !== null && (
        <ErrorState
          title="We couldn't save the Journey"
          description={error.message}
          retryAction={{
            label: "Dismiss",
            onClick: () => setError(null),
            disabled: isSubmitting,
          }}
        />
      )}

      <JourneyEditorSections
        corridorInitialValue={
          corridorInitialValue
        }
        onCorridorSubmit={
          handleCorridorSubmit
        }
        scheduleInitialValue={
          scheduleInitialValue
        }
        onScheduleSubmit={
          handleScheduleSubmit
        }
        vehicleInitialValue={
          vehicleInitialValue
        }
        onVehicleSubmit={
          handleVehicleSubmit
        }
        capacityInitialValue={
          capacityInitialValue
        }
        onCapacitySubmit={
          handleCapacitySubmit
        }
        pricingInitialValue={
          pricingInitialValue
        }
        onPricingSubmit={
          handlePricingSubmit
        }
        preferencesInitialValue={
          preferencesInitialValue
        }
        onPreferencesSubmit={
          handlePreferencesSubmit
        }
        assetInitialValue={
          assetInitialValue
        }
        assetOptions={assetOptions}
        onAssetSubmit={
          handleAssetSubmit
        }
        submitting={isSubmitting}
      />
    </div>
  );
}

