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
// - safely initialize editors for progressively assembled Draft Journeys;
// - pass resolved Asset presentation data to the vehicle editor;
// - allow the owning Asset workflow to initiate vehicle-photo replacement;
// - optionally compose the Journey publish action.
//
// Non-responsibilities:
// - no Journey lifecycle implementation;
// - no direct publish mutation;
// - no status inference for publish eligibility;
// - no authorization decisions;
// - no verification decisions;
// - no navigation;
// - no backend aggregate reconstruction;
// - no generic Journey update command;
// - no Asset URL construction;
// - no Asset upload implementation;
// - no standalone Journey Asset editing.
//
// Publish action:
// - JourneyEditor does not perform the publish mutation itself;
// - JourneyPublishAction owns the publish mutation and its pending/error state;
// - JourneyEditor only decides whether the action is rendered;
// - successful publication refreshes the authenticated Journey projection;
// - JourneyEditor reports successful publication to its parent;
// - the parent decides how to acknowledge successful publication;
// - navigation remains the responsibility of the parent page;
// - the backend remains authoritative for publication eligibility.
//
// Publication UX:
// - publication success must be communicated to the user;
// - the user should know that the Journey is now live;
// - the user should know that the Journey can receive bookings;
// - the user should be given explicit next-step choices;
// - JourneyEditor does not automatically navigate after publication.
//
// Asset presentation:
// - JourneyVehicle stores assetPublicId as the opaque Asset reference;
// - the authenticated Journey read model also provides vehicle.asset;
// - vehicle.asset is already resolved by the backend Asset capability;
// - the vehicle editor displays vehicle.asset.url;
// - vehicle photo replacement remains part of the Vehicle workflow;
// - there is no duplicate standalone Assets section.
//
// -----------------------------------------------------------------------------

"use client";

import { useMemo, useState } from "react";

import { ErrorState } from "@/components/ui/error-state";
import { cn } from "@/foundation/utils/cn";

import type {
  JourneyConversationPreference,
  JourneyLuggagePolicy,
  JourneyMusicPreference,
  JourneyPetsPolicy,
  JourneySmokingPolicy,
  MyJourney,
} from "@/features/journey/models";

import {
  useAttachJourneyCapacity,
  useAttachJourneyCorridor,
  useAttachJourneyPreferences,
  useAttachJourneyPricing,
  useAttachJourneySchedule,
  useAttachJourneyVehicle,
} from "@/features/journey/hooks/mutations";

import type { JourneyVehicleAssetOption } from "../vehicle";

import { JourneyEditorSections } from "./journey-editor-sections";
import { JourneyPublishAction } from "./journey-publish-action";

// =============================================================================
// Props
// =============================================================================

export interface JourneyEditorProps {
  readonly journey: MyJourney;

  readonly onChanged?: () => void | Promise<void>;

  /**
   * Requests the owning workflow to open the vehicle Asset upload or
   * replacement flow.
   *
   * Asset upload/replacement remains owned by the Asset capability.
   */
  readonly onChangeVehicleAsset?: () => void;

  /**
   * Controls whether the publish action is rendered.
   *
   * The editor does not infer publish eligibility. The parent management
   * surface decides whether the action belongs in this presentation.
   *
   * The backend remains authoritative for whether publication can succeed.
   */
  readonly showPublishAction?: boolean;

  /**
   * Called after the publish command succeeds and the Journey projection
   * has been refreshed.
   *
   * The parent owns the successful-publication acknowledgement and any
   * subsequent navigation or presentation response.
   */
  readonly onPublished?: () => void | Promise<void>;

  readonly className?: string;
}

// =============================================================================
// Helpers
// =============================================================================

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

// =============================================================================
// Date / Time Presentation
// =============================================================================

function toDateTimeLocalValue(
  value: string | null | undefined,
): string {
  if (value === null || value === undefined) {
    return "";
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    return "";
  }

  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (part: number): string =>
    part.toString().padStart(2, "0");

  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    "T",
    pad(date.getHours()),
    ":",
    pad(date.getMinutes()),
  ].join("");
}

// =============================================================================
// Component
// =============================================================================

export function JourneyEditor({
  journey,
  onChanged,
  onChangeVehicleAsset,
  showPublishAction = false,
  onPublished,
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

  const journeyPublicId =
    journey.publicId.trim();

  // ---------------------------------------------------------------------------
  // Current vehicle Asset
  // ---------------------------------------------------------------------------

  const selectedVehicleAsset =
    useMemo((): JourneyVehicleAssetOption | null => {
      const asset =
        journey.vehicle?.asset;

      if (
        asset === null ||
        asset === undefined
      ) {
        return null;
      }

      const publicId =
        asset.publicId.trim();

      const url =
        asset.url.trim();

      if (
        publicId.length === 0 ||
        url.length === 0
      ) {
        return null;
      }

      return {
        publicId,
        url,
        label: "Vehicle photo",
      };
    }, [journey.vehicle?.asset]);

  // ---------------------------------------------------------------------------
  // Initial values
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

  // ---------------------------------------------------------------------------
  // Schedule initial values
  // ---------------------------------------------------------------------------

  const scheduleInitialValue = useMemo(
    () => ({
      departureAt:
        toDateTimeLocalValue(
          journey.schedule?.departureAt,
        ),

      arrivalAt:
        toDateTimeLocalValue(
          journey.schedule?.arrivalAt,
        ),

      timezone:
        journey.schedule?.timezone ??
        "Africa/Nairobi",
    }),
    [journey],
  );

  // ---------------------------------------------------------------------------
  // Vehicle initial values
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Capacity initial values
  // ---------------------------------------------------------------------------

  const capacityInitialValue = useMemo(
    () => ({
      totalSeats:
        journey.capacity?.totalSeats ?? 0,
    }),
    [journey],
  );

  // ---------------------------------------------------------------------------
  // Pricing initial values
  // ---------------------------------------------------------------------------

  const pricingInitialValue = useMemo(
    () => ({
      amount:
        journey.pricing?.amount !== null &&
        journey.pricing?.amount !== undefined
          ? String(
              journey.pricing.amount,
            )
          : "",

      currency:
        journey.pricing?.currency ?? "KES",
    }),
    [journey],
  );

  // ---------------------------------------------------------------------------
  // Preferences initial values
  // ---------------------------------------------------------------------------

  const preferencesInitialValue =
    useMemo(
      (): {
        smoking: JourneySmokingPolicy;
        pets: JourneyPetsPolicy;
        luggage: JourneyLuggagePolicy;
        conversation: JourneyConversationPreference;
        music: JourneyMusicPreference;
      } => ({
        smoking:
          journey.preferences?.smoking ??
          "NOT_ALLOWED",

        pets:
          journey.preferences?.pets ??
          "NOT_ALLOWED",

        luggage:
          journey.preferences?.luggage ??
          "STANDARD",

        conversation:
          journey.preferences?.conversation ??
          "MODERATE",

        music:
          journey.preferences?.music ??
          "LOW",
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
    attachPreferences.isPending;

  // ---------------------------------------------------------------------------
  // Refresh
  // ---------------------------------------------------------------------------

  async function refreshAfterChange(): Promise<void> {
    await onChanged?.();
  }

  // ---------------------------------------------------------------------------
  // Publish success
  // ---------------------------------------------------------------------------
  //
  // Publishing belongs entirely to JourneyPublishAction.
  //
  // After the command succeeds:
  //
  //   1. refresh the authoritative MyJourney projection;
  //   2. notify the parent;
  //
  // JourneyEditor does not perform navigation.
  //
  // The parent decides how to communicate the successful publication and
  // which next actions should be presented to the user.
  //
  // ---------------------------------------------------------------------------

  async function handlePublished(): Promise<void> {
    await refreshAfterChange();
    await onPublished?.();
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

          ...(values.arrivalAt.trim().length > 0
            ? {
                arrivalAt:
                  values.arrivalAt.trim(),
              }
            : {}),

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
      const year =
        parseOptionalInteger(
          values.year,
        );

      const color =
        values.color.trim();

      const registration =
        values.registration.trim();

      const assetPublicId =
        values.assetPublicId.trim();

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

          ...(year !== undefined
            ? { year }
            : {}),

          ...(color.length > 0
            ? { color }
            : {}),

          ...(registration.length > 0
            ? { registration }
            : {}),

          ...(assetPublicId.length > 0
            ? { assetPublicId }
            : {}),
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

  async function handlePreferencesSubmit(
    values: typeof preferencesInitialValue,
  ): Promise<void> {
    setError(null);
    setActiveMutation("preferences");

    try {
      await attachPreferences.attach(
        journeyPublicId,
        {
          smoking: values.smoking,
          pets: values.pets,
          luggage: values.luggage,
          conversation: values.conversation,
          music: values.music,
        },
      );

      await refreshAfterChange();
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error(
              "Unable to save the Journey preferences.",
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
        "w-full",
        "space-y-4",
        "sm:space-y-5",
        "lg:space-y-6",
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
        vehicleSelectedAsset={
          selectedVehicleAsset
        }
        onVehicleSubmit={
          handleVehicleSubmit
        }
        onChangeVehicleAsset={
          onChangeVehicleAsset
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
        submitting={isSubmitting}
      />

      {showPublishAction && (
        <section
          aria-label="Journey actions"
          className={cn(
            "rounded-[var(--radius-xl)]",
            "border border-[var(--border)]",
            "bg-[var(--surface)]",
            "p-4",
            "shadow-[var(--shadow-sm)]",
            "sm:p-5",
          )}
        >
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Journey actions
            </h2>

            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              When your Journey is ready, publish it for travellers to
              discover and book.
            </p>
          </div>

          <JourneyPublishAction
            journeyPublicId={journeyPublicId}
            disabled={isSubmitting}
            onPublished={handlePublished}
          />
        </section>
      )}
    </div>
  );
}