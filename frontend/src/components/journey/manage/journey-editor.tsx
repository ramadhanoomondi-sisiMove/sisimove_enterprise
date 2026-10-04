// -----------------------------------------------------------------------------
// sisiMove — Journey Editor
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - compose the existing Journey component editors;
// - own Journey component persistence for the editing surface;
// - own controlled Journey location presentation state;
// - own supported-location filtering for the Where editor;
// - resolve the selected From + To pair through the supported-corridor resolver;
// - translate resolved presentation values into Journey API requests;
// - own component mutation pending/error state;
// - refresh the Journey projection after successful mutations;
// - acknowledge successful component changes through SuccessModal;
// - acknowledge successful publication through SuccessModal;
// - provide publication next-action presentation supplied by the owning page;
// - provide the existing Journey projection as initial values;
// - safely initialize editors for progressively assembled Draft Journeys;
// - pass the authoritative resolved Asset presentation to the vehicle editor;
// - optionally compose the Journey publish action;
// - present published Journeys as read-only;
// - present cancelled Journeys as read-only historical records.
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
// - no standalone Journey Asset editing;
// - no LocationSelector rendering;
// - no corridor catalogue duplication;
// - no external geocoding;
// - no external routing.
//
// Component change UX:
// - component mutations are owned by their respective mutation hooks;
// - successful mutations refresh the authoritative Journey projection;
// - success is acknowledged only after the refresh succeeds;
// - component SuccessModal is owned outside the keyed editing surface so that a
//   route refresh/remount cannot discard the acknowledgement;
// - the modal does not perform navigation or mutation;
// - failed mutations remain represented by ErrorState.
//
// Publication UX:
// - JourneyPublishAction owns the publish mutation;
// - successful publication immediately acknowledges success through the stable
//   outer editor;
// - the Journey projection refresh is triggered after publication so the
//   editing surface can converge on the authoritative published projection;
// - publication acknowledgement is not blocked by the projection refresh;
// - publication acknowledgement is owned by the stable outer editor;
// - publication next-action controls are supplied by the owning page;
// - the editor never performs navigation;
// - published Journeys become read-only when the refreshed projection reports
//   PUBLISHED.
//
// Cancelled Journey:
// - CANCELLED is a terminal persisted status supplied by the backend;
// - cancelled Journeys remain visible as historical records;
// - cancelled Journeys are presented as read-only;
// - component mutation controls are not reachable through the cancelled UI;
// - publication controls are not rendered;
// - the editor does not provide a cancel action;
// - no lifecycle transition is inferred or implemented here;
// - the backend aggregate remains the final invariant boundary.
//
// Where workflow:
// - JourneyEditor owns the controlled From / To selections;
// - JourneyEditor owns the location queries;
// - JourneyEditor owns supported-location filtering;
// - JourneyEditor derives destination suggestions from the selected origin;
// - changing From clears the previous To because the valid destination set
//   depends on the selected origin;
// - changing To replaces the controlled destination selection;
// - saving Where resolves the final From + To pair through the supported
//   corridor resolver;
// - canonical and reverse corridor direction is owned by the resolver;
// - an unsupported pair is rejected before the Journey mutation is called;
// - the editor translates the resolved physical locations into the existing
//   Journey corridor API request at the persistence boundary.
//
// Physical-world location model:
//
//   JourneyEditor
//        │
//        ├── origin: ResolvedLocation | null
//        ├── destination: ResolvedLocation | null
//        ├── originQuery
//        ├── destinationQuery
//        ├── originSuggestions
//        └── destinationSuggestions
//                 │
//                 ▼
//        JourneyEditorSections
//                 │
//                 ▼
//        JourneyCorridorEditor
//                 │
//                 ▼
//        LocationSelector
//
// The user-facing Where editor exposes only:
//
//   From → To
//
// Coordinates remain properties of ResolvedLocation and are never exposed as
// independent presentation fields.
//
// Supported-corridor directionality:
//
//   canonical catalogue:
//     Nairobi → Kisumu
//
//   resolved directional Journey:
//     Nairobi → Kisumu
//     Kisumu  → Nairobi
//
// The catalogue remains canonical. Reverse direction is derived by
// resolveSupportedCorridor().
//
// Published Journey:
// - the backend treats a published Journey as immutable;
// - JourneyEditor reflects that invariant in the presentation layer;
// - JourneyEditorSections receives readOnly=true;
// - component mutation controls are therefore not reachable through the
//   published UI;
// - the backend aggregate remains the final invariant boundary.
//
// Asset presentation:
// - JourneyVehicle stores assetPublicId as the opaque Asset reference;
// - the authenticated Journey read model may provide vehicle.asset as the
//   authoritative resolved Asset presentation;
// - JourneyEditor passes that authoritative Asset presentation to the vehicle
//   editing surface;
// - JourneyVehicleEditor owns the local selected Asset presentation after an
//   upload/change;
// - JourneyVehicleEditor resolves the newly selected Asset through the Asset
//   delivery boundary rather than constructing an Asset URL here;
// - JourneyEditor does not duplicate Asset state;
// - there is no standalone Journey Assets section.
//
// -----------------------------------------------------------------------------

"use client";

import {
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  ErrorState,
  SuccessModal,
} from "@/components/ui";

import type {
  ResolvedLocation,
} from "@/foundation/location";

import {
  getSupportedDestinations,
  resolveSupportedCorridor,
} from "@/foundation/location/data/resolve-supported-corridor";

import {
  SUPPORTED_CORRIDORS,
} from "@/foundation/location/data/supported-corridors";

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

import type {
  JourneyVehicleAssetOption,
  JourneyVehicleFieldValues,
} from "../vehicle";

import type {
  JourneyCorridorFormValues,
} from "../corridor/journey-corridor-editor";

import type {
  JourneyScheduleFieldValues,
} from "../schedule";

import type {
  JourneyCapacityFieldValues,
} from "../capacity";

import type {
  JourneyPriceFieldValues,
} from "../pricing";

import type {
  JourneyPreferencesFieldValues,
} from "../preferences";

import { JourneyEditorSections } from "./journey-editor-sections";
import { JourneyPublishAction } from "./journey-publish-action";

// =============================================================================
// Props
// =============================================================================

export interface JourneyEditorProps {
  readonly journey: MyJourney;

  readonly onChanged?: () => void | Promise<void>;

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
   * Optional actions presented after successful publication.
   *
   * The owning page supplies these actions because navigation belongs to the
   * owning route surface, not to JourneyEditor.
   *
   * JourneyEditor only presents the supplied React nodes inside SuccessModal.
   */
  readonly publishedActions?: ReactNode;

  readonly className?: string;
}

// =============================================================================
// Internal editing-surface props
// =============================================================================

interface JourneyEditorContentProps
  extends JourneyEditorProps {
  /**
   * Completes a successful Journey component-change acknowledgement after the
   * owning Journey projection has refreshed.
   *
   * This callback intentionally belongs to the stable outer editor so that
   * SuccessModal state survives route-keyed remounts of the editing surface.
   */
  readonly onCompleteChange: (
    title: string,
    description: string,
  ) => Promise<void>;

  /**
   * Completes publication acknowledgement.
   *
   * Publication has already succeeded when this callback is invoked.
   */
  readonly onCompletePublication: () => void;
}

// =============================================================================
// Location helpers
// =============================================================================

interface LocationLike {
  readonly key: string;
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
}

interface JourneyRoutePointLike {
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
}

function toResolvedLocation(
  location: LocationLike,
): ResolvedLocation {
  return {
    key: location.key,
    name: location.name,
    latitude: location.latitude,
    longitude: location.longitude,
  };
}

/**
 * Unique locations derived from the existing supported corridor catalogue.
 *
 * This is a projection of SUPPORTED_CORRIDORS, not a second location
 * catalogue.
 */
const SUPPORTED_LOCATIONS:
  readonly ResolvedLocation[] =
  (() => {
    const locations =
      new Map<
        string,
        ResolvedLocation
      >();

    for (const corridor of SUPPORTED_CORRIDORS) {
      const candidates:
        readonly LocationLike[] = [
        corridor.origin,
        corridor.destination,
        ...corridor.routes.map(
          (route) =>
            route.location,
        ),
      ];

      for (const location of candidates) {
        const key =
          location.key
            .trim()
            .toUpperCase();

        if (key.length === 0) {
          continue;
        }

        if (!locations.has(key)) {
          locations.set(
            key,
            toResolvedLocation(
              location,
            ),
          );
        }
      }
    }

    return Array.from(
      locations.values(),
    );
  })();

function resolveJourneyRoutePoint(
  location:
    | JourneyRoutePointLike
    | null
    | undefined,
): ResolvedLocation | null {
  if (
    location === null ||
    location === undefined
  ) {
    return null;
  }

  const match =
    SUPPORTED_LOCATIONS.find(
      (supportedLocation) =>
        supportedLocation.name ===
          location.name &&
        supportedLocation.latitude ===
          location.latitude &&
        supportedLocation.longitude ===
          location.longitude,
    );

  return match ?? null;
}

function filterLocations(
  locations:
    readonly ResolvedLocation[],
  query: string,
): readonly ResolvedLocation[] {
  const normalizedQuery =
    query
      .trim()
      .toLowerCase();

  if (
    normalizedQuery.length === 0
  ) {
    return locations.slice(
      0,
      5,
    );
  }

  return locations
    .filter(
      (location) => {
        const name =
          location.name.toLowerCase();

        const key =
          location.key.toLowerCase();

        return (
          name.includes(
            normalizedQuery,
          ) ||
          key.includes(
            normalizedQuery,
          )
        );
      },
    )
    .slice(0, 5);
}

function filterDestinationLocations(
  locations:
    readonly ResolvedLocation[],
  query: string,
): readonly ResolvedLocation[] {
  return filterLocations(
    locations,
    query,
  );
}

// =============================================================================
// Generic value helpers
// =============================================================================

function parseOptionalInteger(
  value: string,
): number | undefined {
  const normalized =
    value.trim();

  if (
    normalized.length === 0
  ) {
    return undefined;
  }

  const parsed =
    Number(normalized);

  if (!Number.isInteger(parsed)) {
    throw new Error(
      "Enter a valid whole number.",
    );
  }

  return parsed;
}

function parseRequiredAmount(
  value: string,
): number {
  const normalized =
    value.trim();

  if (
    normalized.length === 0
  ) {
    throw new Error(
      "Price amount is required.",
    );
  }

  const parsed =
    Number(normalized);

  if (!Number.isFinite(parsed)) {
    throw new Error(
      "Enter a valid price amount.",
    );
  }

  return parsed;
}

function requireText(
  value: string,
  fieldName: string,
): string {
  const normalized =
    value.trim();

  if (
    normalized.length === 0
  ) {
    throw new Error(
      `${fieldName} is required.`,
    );
  }

  return normalized;
}

// =============================================================================
// Date / Time Presentation
// =============================================================================

function toDateTimeLocalValue(
  value:
    | string
    | null
    | undefined,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  const normalized =
    value.trim();

  if (
    normalized.length === 0
  ) {
    return "";
  }

  const date =
    new Date(normalized);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  const pad = (
    part: number,
  ): string =>
    part
      .toString()
      .padStart(2, "0");

  return [
    date.getFullYear(),
    "-",
    pad(
      date.getMonth() + 1,
    ),
    "-",
    pad(
      date.getDate(),
    ),
    "T",
    pad(
      date.getHours(),
    ),
    ":",
    pad(
      date.getMinutes(),
    ),
  ].join("");
}

// =============================================================================
// Journey route synchronization
// =============================================================================

function getJourneyRouteKey(
  journey: MyJourney,
): string {
  const origin =
    journey.route?.origin;

  const destination =
    journey.route?.destination;

  return [
    journey.publicId,
    origin?.name ?? "",
    origin?.latitude ?? "",
    origin?.longitude ?? "",
    destination?.name ?? "",
    destination?.latitude ?? "",
    destination?.longitude ?? "",
  ].join("|");
}

// =============================================================================
// Public JourneyEditor
// =============================================================================

/**
 * Stable JourneyEditor boundary.
 *
 * Success acknowledgement is deliberately outside the keyed editing surface.
 * A refreshed Journey projection may cause the editing surface to remount, but
 * that must not close or discard an acknowledgement that has already been
 * earned.
 *
 * Both component changes and publication therefore converge on the same
 * stable SuccessModal boundary.
 */
export function JourneyEditor(
  props: JourneyEditorProps,
) {
  const [
    successMessage,
    setSuccessMessage,
  ] =
    useState<{
      kind:
        | "change"
        | "publication";
      title: string;
      description: string;
    } | null>(null);

  const routeKey =
    getJourneyRouteKey(
      props.journey,
    );

  // ---------------------------------------------------------------------------
  // Component change acknowledgement
  // ---------------------------------------------------------------------------

  /**
   * Component mutation success is acknowledged only after the parent has
   * successfully refreshed the authoritative Journey projection.
   */
  async function completeChange(
    title: string,
    description: string,
  ): Promise<void> {
    await props.onChanged?.();

    setSuccessMessage({
      kind: "change",
      title,
      description,
    });
  }

  // ---------------------------------------------------------------------------
  // Publication acknowledgement
  // ---------------------------------------------------------------------------

  /**
   * Publication acknowledgement is intentionally independent from the query
   * refresh.
   *
   * The publish API has already succeeded before this callback is invoked.
   */
  function completePublication(): void {
    setSuccessMessage({
      kind: "publication",
      title: "Your Journey is now live",
      description:
        "Your Journey has been published successfully and is now available for travellers to discover and book.",
    });

    void props.onChanged?.();
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <JourneyEditorContent
        key={routeKey}
        {...props}
        onCompleteChange={
          completeChange
        }
        onCompletePublication={
          completePublication
        }
      />

      <SuccessModal
        open={
          successMessage !== null
        }
        title={
          successMessage?.title ?? ""
        }
        description={
          successMessage?.description
        }
        onClose={() =>
          setSuccessMessage(
            null,
          )
        }
        actions={
          successMessage?.kind ===
          "publication"
            ? props.publishedActions
            : undefined
        }
      >
        {successMessage?.kind ===
          "publication" && (
          <p className="text-sm leading-6 text-[var(--foreground-muted)]">
            You can continue managing your Journey here, return to your
            Journeys, or open the published Journey as travellers will see it.
          </p>
        )}
      </SuccessModal>
    </>
  );
}

// =============================================================================
// Editing surface
// =============================================================================

function JourneyEditorContent({
  journey,
  showPublishAction = false,
  className,
  onCompleteChange,
  onCompletePublication,
}: JourneyEditorContentProps) {
  // ---------------------------------------------------------------------------
  // General editor state
  // ---------------------------------------------------------------------------

  const [error, setError] =
    useState<Error | null>(null);

  const [
    activeMutation,
    setActiveMutation,
  ] =
    useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Terminal presentation
  // ---------------------------------------------------------------------------

  const isPublished =
    journey.status ===
    "PUBLISHED";

  const isCancelled =
    journey.status ===
    "CANCELLED";

  const isReadOnly =
    isPublished ||
    isCancelled;

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
  // Controlled Where state
  // ---------------------------------------------------------------------------

  const initialOrigin =
    resolveJourneyRoutePoint(
      journey.route?.origin,
    );

  const initialDestination =
    resolveJourneyRoutePoint(
      journey.route?.destination,
    );

  const [
    origin,
    setOrigin,
  ] =
    useState<ResolvedLocation | null>(
      initialOrigin,
    );

  const [
    destination,
    setDestination,
  ] =
    useState<ResolvedLocation | null>(
      initialDestination,
    );

  const [
    originQuery,
    setOriginQuery,
  ] =
    useState(
      initialOrigin?.name ??
        "",
    );

  const [
    destinationQuery,
    setDestinationQuery,
  ] =
    useState(
      initialDestination?.name ??
        "",
    );

  const [
    originError,
    setOriginError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    destinationError,
    setDestinationError,
  ] =
    useState<string | null>(
      null,
    );

  // ---------------------------------------------------------------------------
  // Supported origin suggestions
  // ---------------------------------------------------------------------------

  const originSuggestions =
    useMemo(
      (): readonly ResolvedLocation[] =>
        filterLocations(
          SUPPORTED_LOCATIONS,
          originQuery,
        ),
      [originQuery],
    );

  // ---------------------------------------------------------------------------
  // Supported destination suggestions
  // ---------------------------------------------------------------------------

  const supportedDestinations =
    useMemo(
      (): readonly ResolvedLocation[] => {
        if (
          origin === null
        ) {
          return [];
        }

        return getSupportedDestinations(
          origin.key,
        ).map(
          (location) =>
            toResolvedLocation(
              location,
            ),
        );
      },
      [origin],
    );

  const destinationSuggestions =
    useMemo(
      (): readonly ResolvedLocation[] =>
        filterDestinationLocations(
          supportedDestinations,
          destinationQuery,
        ),
      [
        supportedDestinations,
        destinationQuery,
      ],
    );

  // ---------------------------------------------------------------------------
  // Where query changes
  // ---------------------------------------------------------------------------

  function handleOriginQueryChange(
    query: string,
  ): void {
    setOriginQuery(query);
    setOrigin(null);

    setDestination(null);
    setDestinationQuery("");

    setOriginError(null);
    setDestinationError(null);
  }

  function handleDestinationQueryChange(
    query: string,
  ): void {
    setDestinationQuery(
      query,
    );

    setDestination(null);
    setDestinationError(null);
  }

  // ---------------------------------------------------------------------------
  // Where selections
  // ---------------------------------------------------------------------------

  function handleOriginSelect(
    location: ResolvedLocation,
  ): void {
    const resolvedLocation =
      toResolvedLocation(
        location,
      );

    setOrigin(
      resolvedLocation,
    );

    setOriginQuery(
      resolvedLocation.name,
    );

    setDestination(null);
    setDestinationQuery("");

    setOriginError(null);
    setDestinationError(null);
  }

  function handleDestinationSelect(
    location: ResolvedLocation,
  ): void {
    const resolvedLocation =
      toResolvedLocation(
        location,
      );

    setDestination(
      resolvedLocation,
    );

    setDestinationQuery(
      resolvedLocation.name,
    );

    setDestinationError(null);
  }

  // ---------------------------------------------------------------------------
  // Authoritative vehicle Asset presentation
  // ---------------------------------------------------------------------------

  /**
   * This is the Asset currently represented by the authoritative Journey
   * projection.
   *
   * JourneyEditor does not resolve, upload, or construct Asset URLs.
   *
   * JourneyVehicleEditor may temporarily resolve a newly uploaded Asset from
   * its local assetPublicId before the Journey projection has refreshed.
   */
  const selectedVehicleAsset =
    useMemo(
      (): JourneyVehicleAssetOption | null => {
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
          label:
            asset.alt?.trim() ||
            "Vehicle photo",
        };
      },
      [journey.vehicle?.asset],
    );

  // ---------------------------------------------------------------------------
  // Current Journey component initial values
  // ---------------------------------------------------------------------------

  const corridorInitialValue =
    useMemo(
      (): JourneyCorridorFormValues => ({
        origin:
          origin ??
          initialOrigin ?? {
            key: "",
            name: "",
            latitude: 0,
            longitude: 0,
          },

        destination:
          destination ??
          initialDestination ?? {
            key: "",
            name: "",
            latitude: 0,
            longitude: 0,
          },
      }),
      [
        origin,
        destination,
        initialOrigin,
        initialDestination,
      ],
    );

  const scheduleInitialValue =
    useMemo(
      (): JourneyScheduleFieldValues => ({
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
      [
        journey.schedule?.departureAt,
        journey.schedule?.arrivalAt,
        journey.schedule?.timezone,
      ],
    );

  const vehicleInitialValue =
    useMemo(
      (): JourneyVehicleFieldValues => ({
        make:
          journey.vehicle?.make ??
          "",

        model:
          journey.vehicle?.model ??
          "",

        year:
          journey.vehicle?.year !==
            null &&
          journey.vehicle?.year !==
            undefined
            ? String(
                journey.vehicle.year,
              )
            : "",

        color:
          journey.vehicle?.color ??
          "",

        registration:
          journey.vehicle?.registration ??
          "",

        assetPublicId:
          journey.vehicle?.assetPublicId ??
          "",
      }),
      [
        journey.vehicle?.make,
        journey.vehicle?.model,
        journey.vehicle?.year,
        journey.vehicle?.color,
        journey.vehicle?.registration,
        journey.vehicle?.assetPublicId,
      ],
    );

  const capacityInitialValue =
    useMemo(
      (): JourneyCapacityFieldValues => ({
        totalSeats:
          journey.capacity
            ?.totalSeats ??
          0,
      }),
      [
        journey.capacity?.totalSeats,
      ],
    );

  const pricingInitialValue =
    useMemo(
      (): JourneyPriceFieldValues => ({
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
          journey.pricing?.currency ??
          "KES",
      }),
      [
        journey.pricing?.amount,
        journey.pricing?.currency,
      ],
    );

  const preferencesInitialValue =
    useMemo(
      (): JourneyPreferencesFieldValues => ({
        smoking:
          journey.preferences
            ?.smoking ??
          ("NOT_ALLOWED" satisfies JourneySmokingPolicy),

        pets:
          journey.preferences?.pets ??
          ("NOT_ALLOWED" satisfies JourneyPetsPolicy),

        luggage:
          journey.preferences?.luggage ??
          ("STANDARD" satisfies JourneyLuggagePolicy),

        conversation:
          journey.preferences
            ?.conversation ??
          ("MODERATE" satisfies JourneyConversationPreference),

        music:
          journey.preferences?.music ??
          ("LOW" satisfies JourneyMusicPreference),
      }),
      [
        journey.preferences?.smoking,
        journey.preferences?.pets,
        journey.preferences?.luggage,
        journey.preferences?.conversation,
        journey.preferences?.music,
      ],
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
  // Publish success
  // ---------------------------------------------------------------------------

  function handlePublished(): void {
    onCompletePublication();
  }

  // ---------------------------------------------------------------------------
  // Corridor / Where
  // ---------------------------------------------------------------------------

  async function handleCorridorSubmit(
    values: JourneyCorridorFormValues,
  ): Promise<void> {
    setError(null);
    setOriginError(null);
    setDestinationError(null);
    setActiveMutation(
      "corridor",
    );

    try {
      const originLocation =
        values.origin;

      const destinationLocation =
        values.destination;

      const originKey =
        originLocation.key.trim();

      const destinationKey =
        destinationLocation.key.trim();

      if (
        originKey.length === 0
      ) {
        const message =
          "Choose a valid starting point.";

        setOriginError(message);

        throw new Error(
          message,
        );
      }

      if (
        destinationKey.length === 0
      ) {
        const message =
          "Choose a valid destination.";

        setDestinationError(
          message,
        );

        throw new Error(
          message,
        );
      }

      const resolvedCorridor =
        resolveSupportedCorridor(
          originKey,
          destinationKey,
        );

      if (
        resolvedCorridor ===
        undefined
      ) {
        const message =
          `${originLocation.name} to ${destinationLocation.name} is not a supported Journey corridor.`;

        setDestinationError(
          message,
        );

        throw new Error(
          message,
        );
      }

      const resolvedOrigin =
        resolvedCorridor.origin;

      const resolvedDestination =
        resolvedCorridor.destination;

      await attachCorridor.attach(
        journeyPublicId,
        {
          originName:
            requireText(
              resolvedOrigin.name,
              "Origin",
            ),

          originLatitude:
            resolvedOrigin.latitude,

          originLongitude:
            resolvedOrigin.longitude,

          destinationName:
            requireText(
              resolvedDestination.name,
              "Destination",
            ),

          destinationLatitude:
            resolvedDestination.latitude,

          destinationLongitude:
            resolvedDestination.longitude,
        },
      );

      await onCompleteChange(
        "Route updated",
        "Your Journey route has been saved successfully.",
      );
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
    values: JourneyScheduleFieldValues,
  ): Promise<void> {
    setError(null);
    setActiveMutation(
      "schedule",
    );

    try {
      await attachSchedule.attach(
        journeyPublicId,
        {
          departureAt:
            requireText(
              values.departureAt,
              "Departure time",
            ),

          ...(values.arrivalAt.trim()
            .length > 0
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

      await onCompleteChange(
        "Schedule updated",
        "Your Journey schedule has been saved successfully.",
      );
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
    values: JourneyVehicleFieldValues,
  ): Promise<void> {
    setError(null);
    setActiveMutation(
      "vehicle",
    );

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
          make:
            requireText(
              values.make,
              "Vehicle make",
            ),

          model:
            requireText(
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

      await onCompleteChange(
        "Vehicle updated",
        "Your Journey vehicle details have been saved successfully.",
      );
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
    values: JourneyCapacityFieldValues,
  ): Promise<void> {
    setError(null);
    setActiveMutation(
      "capacity",
    );

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

      await onCompleteChange(
        "Capacity updated",
        "Your Journey passenger capacity has been saved successfully.",
      );
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
    values: JourneyPriceFieldValues,
  ): Promise<void> {
    setError(null);
    setActiveMutation(
      "pricing",
    );

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

      await onCompleteChange(
        "Price updated",
        "Your Journey price has been saved successfully.",
      );
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
    values: JourneyPreferencesFieldValues,
  ): Promise<void> {
    setError(null);
    setActiveMutation(
      "preferences",
    );

    try {
      await attachPreferences.attach(
        journeyPublicId,
        {
          smoking:
            values.smoking,

          pets:
            values.pets,

          luggage:
            values.luggage,

          conversation:
            values.conversation,

          music:
            values.music,
        },
      );

      await onCompleteChange(
        "Preferences updated",
        "Your Journey preferences have been saved successfully.",
      );
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
            onClick: () =>
              setError(null),
            disabled:
              isSubmitting,
          }}
        />
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Published state                                                     */}
      {/* ------------------------------------------------------------------- */}

      {isPublished && (
        <section
          aria-label="Published Journey"
          className={cn(
            "rounded-[var(--radius-xl)]",
            "border border-[var(--border)]",
            "bg-[var(--surface)]",
            "p-4",
            "shadow-[var(--shadow-sm)]",
            "sm:p-5",
          )}
        >
          <div className="flex items-start gap-3">
            <div
              aria-hidden="true"
              className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--brand)]"
            />

            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-[var(--foreground)]">
                Journey published
              </h2>

              <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
                This Journey is live and can receive bookings. Its details
                are now read-only.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Cancelled state                                                     */}
      {/* ------------------------------------------------------------------- */}

      {isCancelled && (
        <section
          aria-label="Cancelled Journey"
          className={cn(
            "rounded-[var(--radius-xl)]",
            "border border-[var(--border)]",
            "bg-[var(--surface)]",
            "p-4",
            "shadow-[var(--shadow-sm)]",
            "sm:p-5",
          )}
        >
          <div className="flex items-start gap-3">
            <div
              aria-hidden="true"
              className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--foreground-muted)]"
            />

            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-[var(--foreground)]">
                Journey cancelled
              </h2>

              <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
                This Journey has been cancelled and is retained as a
                historical record. Its details are read-only.
              </p>
            </div>
          </div>
        </section>
      )}

      <JourneyEditorSections
        origin={origin}
        destination={destination}
        originQuery={originQuery}
        destinationQuery={
          destinationQuery
        }
        originSuggestions={
          originSuggestions
        }
        destinationSuggestions={
          destinationSuggestions
        }
        originError={originError}
        destinationError={
          destinationError
        }
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
        submitting={
          isSubmitting
        }
        readOnly={
          isReadOnly
        }
      />

      {/* ------------------------------------------------------------------- */}
      {/* Publish action                                                      */}
      {/* ------------------------------------------------------------------- */}

      {showPublishAction &&
        !isPublished &&
        !isCancelled && (
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
              journeyPublicId={
                journeyPublicId
              }
              disabled={
                isSubmitting
              }
              onPublished={
                handlePublished
              }
            />
          </section>
        )}
    </div>
  );
}

export default JourneyEditor;