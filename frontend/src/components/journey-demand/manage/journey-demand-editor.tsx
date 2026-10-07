'use client';

// -----------------------------------------------------------------------------
// Path:
// src/features/journey-demand/components/manage/journey-demand-editor.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Demand Editor
//
// Authenticated/application Journey Demand editing workflow.
//
// -----------------------------------------------------------------------------
//
// ARCHITECTURAL POSITION
// -----------------------------------------------------------------------------
//
// JourneyDemandEditor receives an already-loaded `MyJourneyDemand` projection
// and owns the editing workflow for the mutable Journey Demand components.
//
// It intentionally sits above the individual section editors.
//
//
//   JourneyDemandEditor
//          │
//          ├── location presentation state
//          ├── location resolution
//          ├── corridor mutation
//          ├── schedule draft
//          ├── schedule mutation
//          ├── capacity draft
//          ├── capacity mutation
//          ├── pricing draft
//          ├── pricing mutation
//          ├── authoritative refresh coordination
//          └── component-change acknowledgement
//                   │
//                   ▼
//        JourneyDemandEditorSections
//                   │
//          ┌────────┼───────────┬───────────┐
//          ▼        ▼           ▼           ▼
//       Overview Corridor   Schedule    Capacity / Pricing
//
// Individual section editors remain controlled presentation editors.
//
// They do NOT:
//
// - fetch;
// - mutate;
// - resolve corridors;
// - authorize;
// - determine lifecycle capability;
// - navigate;
// - own server state.
//
// They expose controlled values and save boundaries back to this workflow
// owner.
//
// -----------------------------------------------------------------------------
//
// COMPONENT CHANGE WORKFLOW
// -----------------------------------------------------------------------------
//
//     edit section
//          ↓
//     local controlled draft
//          ↓
//     save
//          ↓
//     JourneyDemandEditor mutation hook
//          ↓
//     authoritative projection refresh
//          ↓
//     component-change acknowledgement
//
// A component change is therefore not considered complete merely because the
// backend mutation resolves.
//
// The editor waits for the owning query boundary to refresh the authoritative
// `MyJourneyDemand` projection before showing the success acknowledgement.
//
// -----------------------------------------------------------------------------
//
// LIFECYCLE OWNERSHIP
// -----------------------------------------------------------------------------
//
// JourneyDemandEditor does NOT own Journey Demand lifecycle transitions.
//
// It does NOT:
//
// - publish;
// - cancel;
// - match;
// - convert;
// - fulfil;
// - infer lifecycle capabilities;
// - perform authorization;
// - perform verification checks.
//
// Lifecycle actions are composed outside this editor.
//
// For example:
//
//   /my-demands/[publicId]/edit
//          │
//          ├── JourneyDemandEditor
//          │      └── component editing
//          │
//          └── JourneyDemandPublishAction
//                 └── publication lifecycle mutation
//
// This keeps component editing independent from Journey Demand lifecycle.
//
// -----------------------------------------------------------------------------
//
// QUERY OWNERSHIP
// -----------------------------------------------------------------------------
//
// JourneyDemandEditor does NOT query the Journey Demand.
//
// The loaded projection is supplied by its parent.
//
// Typical authenticated flow:
//
//   useMyJourneyDemand(publicId)
//          │
//          ▼
//   MyJourneyDemand
//          │
//          ▼
//   JourneyDemandEditor
//
// After a successful component mutation:
//
//   JourneyDemandEditor
//          │
//          │ onChanged()
//          ▼
//   owning query boundary
//          │
//          │ refetch()
//          ▼
//   authoritative MyJourneyDemand
//
// The editor never merges mutation responses into its existing projection.
//
// -----------------------------------------------------------------------------
//
// NON-RESPONSIBILITIES
// -----------------------------------------------------------------------------
//
// This component does NOT:
//
// - query the Journey Demand;
// - publish;
// - cancel;
// - match;
// - convert;
// - fulfil;
// - infer lifecycle capabilities;
// - perform authorization;
// - perform verification;
// - navigate;
// - reconstruct backend aggregates;
// - create a PublicJourneyDemand;
// - issue a generic Journey Demand update;
// - geocode;
// - route externally;
// - maintain a second corridor catalogue;
// - render LocationSelector directly.
//
// -----------------------------------------------------------------------------
//
// LOCATION OWNERSHIP
// -----------------------------------------------------------------------------
//
// `SUPPORTED_CORRIDORS` remains the canonical supported-location catalogue.
//
// The editor derives the selectable location presentation collection from
// that catalogue.
//
// Supported origin/destination compatibility is delegated to:
//
//   getSupportedDestinations()
//   resolveSupportedCorridor()
//
// The editor therefore does not duplicate corridor business rules.
//
// -----------------------------------------------------------------------------
//
// SUCCESS ACKNOWLEDGEMENT
// -----------------------------------------------------------------------------
//
// The outer editor remains mounted while the inner editing surface is keyed
// by the authoritative corridor projection.
//
// This is intentional.
//
// A corridor mutation causes:
//
//   mutation
//      ↓
//   refetch
//      ↓
//   new corridor projection
//      ↓
//   new inner editing surface
//
// The success acknowledgement therefore lives outside that keyed subtree so
// that it is not lost when the editing surface is reinitialized.
//
// -----------------------------------------------------------------------------

import {
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  ErrorState,
  SuccessModal,
} from '@/components/ui';

import { cn } from '@/foundation';

import type {
  ResolvedLocation,
} from '@/foundation/location';

import {
  getSupportedDestinations,
  resolveSupportedCorridor,
} from '@/foundation/location/data/resolve-supported-corridor';

import {
  SUPPORTED_CORRIDORS,
} from '@/foundation/location/data/supported-corridors';

import type {
  JourneyDemandCapacity,
  JourneyDemandPricing,
  JourneyDemandSchedule,
  MyJourneyDemand,
} from '@/features/journey-demand/models';

import {
  useUpdateJourneyDemandCapacity,
  useUpdateJourneyDemandCorridor,
  useUpdateJourneyDemandPricing,
  useUpdateJourneyDemandSchedule,
} from '@/features/journey-demand/hooks/mutations';

import {
  JourneyDemandCapacityEditor,
} from '../capacity/journey-demand-capacity-editor';

import {
  JourneyDemandCorridorEditor,
  type JourneyDemandCorridorFormValues,
} from '../corridor/journey-demand-corridor-editor';

import {
  JourneyDemandPricingEditor,
} from '../pricing/journey-demand-pricing-editor';

import {
  JourneyDemandScheduleEditor,
} from '../schedule/journey-demand-schedule-editor';

import {
  JourneyDemandEditorSections,
} from './journey-demand-editor-sections';

import {
  MyJourneyDemandOverview,
} from './my-journey-demand-overview';

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandEditorProps {
  /**
   * Authoritative authenticated/application Journey Demand projection.
   *
   * The editor never queries this projection itself.
   */
  readonly demand: MyJourneyDemand;

  /**
   * Requests the owning query boundary to refresh the authoritative Journey
   * Demand projection after a successful component mutation.
   *
   * The editor does not know how the refresh is implemented.
   */
  readonly onChanged?: () => void | Promise<void>;

  /**
   * Optional actions displayed by the component-change success acknowledgement.
   *
   * These are presentation slots only.
   *
   * JourneyDemandEditor does not interpret these actions, execute lifecycle
   * mutations, or perform navigation from them.
   *
   * Lifecycle actions such as Publish remain owned by their dedicated action
   * components and their owning page/container.
   */
  readonly changedActions?: ReactNode;

  /**
   * Optional accessible/editor heading content.
   *
   * The editor does not use these values to determine workflow behaviour.
   */
  readonly title?: string;

  readonly description?: string;

  readonly className?: string;
}

// =============================================================================
// Supported-location presentation helpers
// =============================================================================

interface LocationLike {
  readonly key: string;
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
}

interface JourneyDemandRoutePointLike {
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
}

/**
 * Converts a canonical supported location into the presentation contract
 * consumed by the corridor editor.
 *
 * This function does not create or maintain another location catalogue.
 *
 * `SUPPORTED_CORRIDORS` remains the canonical source.
 */
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
 * Builds the selectable location collection from the canonical corridor
 * catalogue.
 *
 * A physical location may participate in multiple supported corridors.
 *
 * A Map keyed by the stable location key removes those duplicates without
 * introducing a second source of truth.
 */
const SUPPORTED_LOCATIONS: readonly ResolvedLocation[] =
  (() => {
    const locations = new Map<
      string,
      ResolvedLocation
    >();

    for (const corridor of SUPPORTED_CORRIDORS) {
      const candidates: readonly LocationLike[] = [
        corridor.origin,
        corridor.destination,
        ...corridor.routes.map(
          (route) => route.location,
        ),
      ];

      for (const location of candidates) {
        const key = location.key
          .trim()
          .toUpperCase();

        if (key.length === 0) {
          continue;
        }

        if (!locations.has(key)) {
          locations.set(
            key,
            toResolvedLocation(location),
          );
        }
      }
    }

    return Array.from(
      locations.values(),
    );
  })();

/**
 * Rehydrates a persisted Journey Demand corridor point into the
 * `ResolvedLocation` presentation contract.
 *
 * The authenticated backend projection contains physical location data.
 * The selector requires the stable frontend location key as well.
 *
 * The key is therefore recovered by matching the persisted physical location
 * against the canonical supported-location catalogue.
 */
function resolveJourneyDemandRoutePoint(
  location:
    | JourneyDemandRoutePointLike
    | null
    | undefined,
): ResolvedLocation | null {
  if (
    location === null ||
    location === undefined
  ) {
    return null;
  }

  const name = location.name.trim();

  if (name.length === 0) {
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

/**
 * Filters the supported presentation locations using the user's current
 * selector query.
 *
 * Empty queries intentionally return only a small initial set so the editor
 * remains compact.
 */
function filterLocations(
  locations: readonly ResolvedLocation[],
  query: string,
): readonly ResolvedLocation[] {
  const normalizedQuery = query
    .trim()
    .toLowerCase();

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

// =============================================================================
// Projection helpers
// =============================================================================

function getJourneyDemandOrigin(
  demand: MyJourneyDemand,
): JourneyDemandRoutePointLike | null {
  const corridor = demand.corridor;

  if (
    corridor === null ||
    corridor === undefined
  ) {
    return null;
  }

  return {
    name: corridor.originName,
    latitude:
      corridor.originCoordinates.latitude,
    longitude:
      corridor.originCoordinates.longitude,
  };
}

function getJourneyDemandDestination(
  demand: MyJourneyDemand,
): JourneyDemandRoutePointLike | null {
  const corridor = demand.corridor;

  if (
    corridor === null ||
    corridor === undefined
  ) {
    return null;
  }

  return {
    name: corridor.destinationName,
    latitude:
      corridor.destinationCoordinates.latitude,
    longitude:
      corridor.destinationCoordinates.longitude,
  };
}

/**
 * Gives the inner editing surface a stable identity tied to the authoritative
 * corridor projection.
 *
 * When the query boundary refreshes after a successful corridor mutation, the
 * changed projection produces a new key and therefore a fresh editing
 * surface.
 *
 * The outer JourneyDemandEditor intentionally remains mounted so that its
 * success acknowledgement is preserved.
 */
function getJourneyDemandRouteKey(
  demand: MyJourneyDemand,
): string {
  const corridor = demand.corridor;

  return [
    demand.publicId,
    corridor?.originName ?? '',
    corridor?.originCoordinates?.latitude ?? '',
    corridor?.originCoordinates?.longitude ?? '',
    corridor?.destinationName ?? '',
    corridor?.destinationCoordinates?.latitude ?? '',
    corridor?.destinationCoordinates?.longitude ?? '',
  ].join('|');
}

// =============================================================================
// Stable outer editor
// =============================================================================

/**
 * Stable outer editor boundary.
 *
 * The success acknowledgement lives here rather than inside the keyed editing
 * content.
 *
 * This prevents a successful corridor refresh from unmounting the success
 * acknowledgement before the user can see it.
 */
export function JourneyDemandEditor({
  demand,
  onChanged,
  changedActions,
  title,
  description,
  className,
}: JourneyDemandEditorProps) {
  const [
    successMessage,
    setSuccessMessage,
  ] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const routeKey =
    getJourneyDemandRouteKey(
      demand,
    );

  /**
   * A component mutation is acknowledged only after the authoritative
   * projection has been refreshed.
   *
   * The mutation hook itself establishes that the backend accepted the
   * command. `onChanged` establishes that the frontend has converged back to
   * the authoritative read model.
   */
  async function completeChange(
    successTitle: string,
    successDescription: string,
  ): Promise<void> {
    await onChanged?.();

    setSuccessMessage({
      title: successTitle,
      description: successDescription,
    });
  }

  return (
    <>
      <JourneyDemandEditorContent
        key={routeKey}
        demand={demand}
        title={title}
        description={description}
        className={className}
        onCompleteChange={
          completeChange
        }
      />

      <SuccessModal
        open={successMessage !== null}
        title={
          successMessage?.title ?? ''
        }
        description={
          successMessage?.description
        }
        onClose={() =>
          setSuccessMessage(null)
        }
        actions={changedActions}
      >
        <p className="text-sm leading-6 text-[var(--foreground-muted)]">
          Your travel need has been updated successfully.
        </p>
      </SuccessModal>
    </>
  );
}

// =============================================================================
// Editing surface
// =============================================================================

interface JourneyDemandEditorContentProps {
  readonly demand: MyJourneyDemand;
  readonly title?: string;
  readonly description?: string;
  readonly className?: string;
  readonly onCompleteChange: (
    title: string,
    description: string,
  ) => Promise<void>;
}

function JourneyDemandEditorContent({
  demand,
  title,
  description,
  className,
  onCompleteChange,
}: JourneyDemandEditorContentProps) {
  // ===========================================================================
  // General workflow state
  // ===========================================================================

  const [
    error,
    setError,
  ] = useState<Error | null>(null);

  /**
   * Identifies the currently active editor mutation.
   *
   * This is workflow state only. It does not represent backend lifecycle
   * status or lifecycle capability.
   */
  const [
    activeMutation,
    setActiveMutation,
  ] = useState<string | null>(null);

  // ===========================================================================
  // Component mutation hooks
  // ===========================================================================

  const updateCorridorMutation =
    useUpdateJourneyDemandCorridor();

  const updateScheduleMutation =
    useUpdateJourneyDemandSchedule();

  const updateCapacityMutation =
    useUpdateJourneyDemandCapacity();

  const updatePricingMutation =
    useUpdateJourneyDemandPricing();

  const journeyDemandPublicId =
    demand.publicId.trim();

  // ===========================================================================
  // Initial corridor projection
  // ===========================================================================

  const initialOrigin =
    resolveJourneyDemandRoutePoint(
      getJourneyDemandOrigin(
        demand,
      ),
    );

  const initialDestination =
    resolveJourneyDemandRoutePoint(
      getJourneyDemandDestination(
        demand,
      ),
    );

  // ===========================================================================
  // Controlled corridor state
  // ===========================================================================

  const [
    origin,
    setOrigin,
  ] = useState<ResolvedLocation | null>(
    initialOrigin,
  );

  const [
    destination,
    setDestination,
  ] = useState<ResolvedLocation | null>(
    initialDestination,
  );

  const [
    originQuery,
    setOriginQuery,
  ] = useState(
    initialOrigin?.name ?? '',
  );

  const [
    destinationQuery,
    setDestinationQuery,
  ] = useState(
    initialDestination?.name ?? '',
  );

  const [
    originError,
    setOriginError,
  ] = useState<string | null>(null);

  const [
    destinationError,
    setDestinationError,
  ] = useState<string | null>(null);

  // ===========================================================================
  // Controlled component drafts
  // ===========================================================================
  //
  // Each section editor is deliberately controlled.
  //
  // JourneyDemandEditor owns:
  //
  //     projection → draft → mutation
  //
  // The section editor does not persist its own state.
  //
  // The inner editor is keyed by the authoritative corridor projection so a
  // refreshed projection rehydrates the editing surface.
  //
  // ===========================================================================

  const [
    schedule,
    setSchedule,
  ] = useState<JourneyDemandSchedule | null>(
    demand.schedule ?? null,
  );

  const [
    capacity,
    setCapacity,
  ] = useState<JourneyDemandCapacity | null>(
    demand.capacity ?? null,
  );

  const [
    pricing,
    setPricing,
  ] = useState<JourneyDemandPricing | null>(
    demand.pricing ?? null,
  );

  // ===========================================================================
  // Location suggestions
  // ===========================================================================

  const originSuggestions =
    useMemo(
      (): readonly ResolvedLocation[] =>
        filterLocations(
          SUPPORTED_LOCATIONS,
          originQuery,
        ),
      [originQuery],
    );

  /**
   * Destination options are constrained by the selected origin.
   *
   * The editor does not reproduce corridor compatibility rules.
   *
   * `getSupportedDestinations()` remains the canonical resolver.
   */
  const supportedDestinations =
    useMemo(
      (): readonly ResolvedLocation[] => {
        if (origin === null) {
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
        filterLocations(
          supportedDestinations,
          destinationQuery,
        ),
      [
        supportedDestinations,
        destinationQuery,
      ],
    );

  // ===========================================================================
  // Location query changes
  // ===========================================================================

  function handleOriginQueryChange(
    query: string,
  ): void {
    setOriginQuery(query);

    /*
     * Destination compatibility depends on the selected origin.
     *
     * Once the origin query changes, the previous origin selection is no longer
     * authoritative, so the destination must also be cleared.
     */
    setOrigin(null);
    setDestination(null);
    setDestinationQuery('');

    setOriginError(null);
    setDestinationError(null);
  }

  function handleDestinationQueryChange(
    query: string,
  ): void {
    setDestinationQuery(query);
    setDestination(null);
    setDestinationError(null);
  }

  // ===========================================================================
  // Location selections
  // ===========================================================================

  function handleOriginSelect(
    location: ResolvedLocation,
  ): void {
    const resolvedLocation =
      toResolvedLocation(location);

    setOrigin(resolvedLocation);
    setOriginQuery(
      resolvedLocation.name,
    );

    /*
     * Changing the origin invalidates the current destination selection.
     */
    setDestination(null);
    setDestinationQuery('');

    setOriginError(null);
    setDestinationError(null);
  }

  function handleDestinationSelect(
    location: ResolvedLocation,
  ): void {
    const resolvedLocation =
      toResolvedLocation(location);

    setDestination(resolvedLocation);
    setDestinationQuery(
      resolvedLocation.name,
    );

    setDestinationError(null);
  }

  // ===========================================================================
  // Submission state
  // ===========================================================================
  //
  // The mutation hooks expose:
  //
  //     isLoading
  //     error
  //     execute(...)
  //
  // They are not React Query mutation objects.
  //
  // Therefore this workflow deliberately uses `isLoading`, not `isPending`.
  //
  // ===========================================================================

  const isSubmitting =
    activeMutation !== null ||
    updateCorridorMutation.isLoading ||
    updateScheduleMutation.isLoading ||
    updateCapacityMutation.isLoading ||
    updatePricingMutation.isLoading;

  // ===========================================================================
  // Corridor / Where save
  // ===========================================================================

  async function handleCorridorSubmit(
    values: JourneyDemandCorridorFormValues,
  ): Promise<void> {
    setError(null);
    setOriginError(null);
    setDestinationError(null);
    setActiveMutation('corridor');

    try {
      const originKey =
        values.origin.key.trim();

      const destinationKey =
        values.destination.key.trim();

      if (originKey.length === 0) {
        const message =
          'Choose a valid starting point.';

        setOriginError(message);

        throw new Error(message);
      }

      if (
        destinationKey.length === 0
      ) {
        const message =
          'Choose a valid destination.';

        setDestinationError(message);

        throw new Error(message);
      }

      /*
       * The resolver owns canonical/reverse corridor directionality.
       *
       * The editor does not determine whether a pair is supported.
       */
      const resolvedCorridor =
        resolveSupportedCorridor(
          originKey,
          destinationKey,
        );

      if (
        resolvedCorridor === undefined
      ) {
        const message =
          `${values.origin.name} to ${values.destination.name} is not a supported Journey Demand corridor.`;

        setDestinationError(message);

        throw new Error(message);
      }

      const resolvedOrigin =
        resolvedCorridor.origin;

      const resolvedDestination =
        resolvedCorridor.destination;

      await updateCorridorMutation
        .updateJourneyDemandCorridor(
          journeyDemandPublicId,
          {
            origin:
              resolvedOrigin.name,

            originLatitude:
              resolvedOrigin.latitude,

            originLongitude:
              resolvedOrigin.longitude,

            destination:
              resolvedDestination.name,

            destinationLatitude:
              resolvedDestination.latitude,

            destinationLongitude:
              resolvedDestination.longitude,

            correlationId:
              crypto.randomUUID(),
          },
        );

      /*
       * The mutation has succeeded, but the editor does not acknowledge the
       * change until the owning query boundary has refreshed the authoritative
       * projection.
       */
      await onCompleteChange(
        'Route updated',
        'Your travel need route has been saved successfully.',
      );
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error(
              'Unable to save the Journey Demand route.',
            );

      setError(nextError);

      throw nextError;
    } finally {
      setActiveMutation(null);
    }
  }

  // ===========================================================================
  // Schedule save
  // ===========================================================================

  async function handleScheduleSave(): Promise<void> {
    if (schedule === null) {
      return;
    }

    setError(null);
    setActiveMutation('schedule');

    try {
      /*
       * Frontend model:
       *
       *     Date
       *
       * HTTP API:
       *
       *     ISO-compatible string
       *
       * This conversion belongs at the API boundary.
       */
      await updateScheduleMutation
        .updateJourneyDemandSchedule(
          journeyDemandPublicId,
          {
            earliestDeparture:
              schedule.scheduleWindow
                .earliestDeparture
                .toISOString(),

            latestDeparture:
              schedule.scheduleWindow
                .latestDeparture
                .toISOString(),

            ...(schedule.arrivalWindow
              .targetArrival
              ? {
                  targetArrival:
                    schedule.arrivalWindow
                      .targetArrival
                      .toISOString(),
                }
              : {}),

            ...(schedule.arrivalWindow
              .maximumArrival
              ? {
                  maximumArrival:
                    schedule.arrivalWindow
                      .maximumArrival
                      .toISOString(),
                }
              : {}),

            correlationId:
              crypto.randomUUID(),
          },
        );

      await onCompleteChange(
        'Schedule updated',
        'Your travel window has been saved successfully.',
      );
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error(
              'Unable to save the Journey Demand schedule.',
            );

      setError(nextError);

      throw nextError;
    } finally {
      setActiveMutation(null);
    }
  }

  // ===========================================================================
  // Capacity save
  // ===========================================================================

  async function handleCapacitySave(): Promise<void> {
    if (capacity === null) {
      return;
    }

    setError(null);
    setActiveMutation('capacity');

    try {
      if (
        !Number.isInteger(
          capacity.requestedSeats,
        ) ||
        capacity.requestedSeats <= 0
      ) {
        throw new Error(
          'Requested seats must be greater than zero.',
        );
      }

      await updateCapacityMutation
        .updateJourneyDemandCapacity(
          journeyDemandPublicId,
          {
            /*
             * Frontend read model:
             *
             *     requestedSeats
             *
             * Backend command:
             *
             *     seatsRequired
             *
             * This translation belongs at the API mutation boundary.
             */
            seatsRequired:
              capacity.requestedSeats,

            correlationId:
              crypto.randomUUID(),
          },
        );

      await onCompleteChange(
        'Capacity updated',
        'Your requested passenger capacity has been saved successfully.',
      );
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error(
              'Unable to save Journey Demand capacity.',
            );

      setError(nextError);

      throw nextError;
    } finally {
      setActiveMutation(null);
    }
  }

  // ===========================================================================
  // Pricing save
  // ===========================================================================

  async function handlePricingSave(): Promise<void> {
    if (pricing === null) {
      return;
    }

    setError(null);
    setActiveMutation('pricing');

    try {
      /*
       * The backend pricing mutation requires `maxFare`.
       *
       * An absent maximum price must therefore not be silently converted into
       * zero or another invented value.
       */
      const maximumPrice =
        pricing.maximumPricePerSeat;

      if (
        !pricing.hasMaximumPrice ||
        maximumPrice === undefined
      ) {
        throw new Error(
          'A maximum price per seat is required before pricing can be saved.',
        );
      }

      if (
        !Number.isFinite(
          maximumPrice,
        ) ||
        maximumPrice < 0
      ) {
        throw new Error(
          'Enter a valid maximum price per seat.',
        );
      }

      const currency =
        pricing.currency.trim();

      if (currency.length === 0) {
        throw new Error(
          'A currency is required before pricing can be saved.',
        );
      }

      await updatePricingMutation
        .updateJourneyDemandPricing(
          journeyDemandPublicId,
          {
            /*
             * Frontend read model:
             *
             *     maximumPricePerSeat
             *
             * Backend command:
             *
             *     maxFare
             *
             * Keep this translation at the API boundary.
             */
            maxFare:
              maximumPrice,

            currency,

            correlationId:
              crypto.randomUUID(),
          },
        );

      await onCompleteChange(
        'Pricing updated',
        'Your travel budget has been saved successfully.',
      );
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error(
              'Unable to save Journey Demand pricing.',
            );

      setError(nextError);

      throw nextError;
    } finally {
      setActiveMutation(null);
    }
  }

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <div
      className={cn(
        'w-full',
        'space-y-4',
        'sm:space-y-5',
        'lg:space-y-6',
        className,
      )}
    >
      {/* =====================================================================
          Component-editing error
          ===================================================================== */}

      {error !== null ? (
        <ErrorState
          title="We couldn't save the travel need"
          description={error.message}
          retryAction={{
            label: 'Dismiss',
            onClick: () =>
              setError(null),
            disabled: isSubmitting,
          }}
        />
      ) : null}

      {/* =====================================================================
          Canonical editor section composition

          JourneyDemandEditorSections is intentionally a pure renderer.

          The editor owns:
          - section order;
          - section content;
          - controlled state;
          - persistence boundaries.

          JourneyDemandEditorSections itself owns none of those concerns.
          ===================================================================== */}

      <JourneyDemandEditorSections
        sections={[
          // ===================================================================
          // Overview
          // ===================================================================

          {
            id: 'overview',
            label: 'Travel need overview',
            content: (
              <MyJourneyDemandOverview
                demand={demand}
              />
            ),
          },

          // ===================================================================
          // Corridor
          // ===================================================================

          {
            id: 'corridor',
            label: 'Travel route',
            content: (
              <JourneyDemandCorridorEditor
                origin={origin}
                destination={destination}
                originQuery={originQuery}
                destinationQuery={destinationQuery}
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
                disabled={isSubmitting}
                onSubmit={
                  handleCorridorSubmit
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
              />
            ),
          },

          // ===================================================================
          // Schedule
          // ===================================================================

          ...(schedule !== null
            ? [
                {
                  id: 'schedule',
                  label: 'Travel schedule',
                  content: (
                    <JourneyDemandScheduleEditor
                      schedule={schedule}
                      onChange={
                        setSchedule
                      }
                      onSave={
                        handleScheduleSave
                      }
                      isSaving={
                        updateScheduleMutation
                          .isLoading
                      }
                      disabled={
                        isSubmitting
                      }
                    />
                  ),
                },
              ]
            : []),

          // ===================================================================
          // Capacity
          // ===================================================================

          ...(capacity !== null
            ? [
                {
                  id: 'capacity',
                  label: 'Requested capacity',
                  content: (
                    <JourneyDemandCapacityEditor
                      capacity={capacity}
                      onChange={
                        setCapacity
                      }
                      onSave={
                        handleCapacitySave
                      }
                      isSaving={
                        updateCapacityMutation
                          .isLoading
                      }
                      disabled={
                        isSubmitting
                      }
                    />
                  ),
                },
              ]
            : []),

          // ===================================================================
          // Pricing
          // ===================================================================

          ...(pricing !== null
            ? [
                {
                  id: 'pricing',
                  label: 'Travel budget',
                  content: (
                    <JourneyDemandPricingEditor
                      pricing={pricing}
                      onChange={
                        setPricing
                      }
                      onSave={
                        handlePricingSave
                      }
                      isSaving={
                        updatePricingMutation
                          .isLoading
                      }
                      disabled={
                        isSubmitting
                      }
                    />
                  ),
                },
              ]
            : []),
        ]}
      />

      {/* =====================================================================
          Optional accessible title/description

          These values do not participate in editing or lifecycle behaviour.
          They provide an optional semantic heading boundary for consumers
          that need to describe the editor without adding another visible
          layout surface.
          ===================================================================== */}

      {title || description ? (
        <div className="sr-only">
          {title ? (
            <h1>{title}</h1>
          ) : null}

          {description ? (
            <p>{description}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}