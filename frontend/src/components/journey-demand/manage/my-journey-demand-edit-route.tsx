// -----------------------------------------------------------------------------
// sisiMove — My Journey Demand Edit Route
// -----------------------------------------------------------------------------
//
// Authenticated owner edit surface for one Journey Demand.
//
// Architectural responsibilities
// -----------------------------------------------------------------------------
//
// Route layer:
// - loads the authenticated owner's MyJourneyDemand;
// - presents loading/error states;
// - establishes the owner edit boundary.
//
// Edit surface:
// - owns temporary section drafts;
// - composes the existing controlled editors;
// - invokes the existing mutation hooks;
// - refetches the owner projection after successful mutations.
//
// Important model boundary:
//
// MyJourneyDemand is intentionally kept as the source model for this
// authenticated owner flow. It is never cast or converted into JourneyDemand.
//
// The backend remains responsible for:
// - authorization;
// - validation;
// - domain rules;
// - aggregate state transitions;
// - derived values;
// - corridor consistency;
// - capacity/matching rules;
// - pricing rules.
//
// -----------------------------------------------------------------------------

'use client';

import { useCallback, useState } from 'react';

import {
  useUpdateJourneyDemandCapacity,
  useUpdateJourneyDemandCorridor,
  useUpdateJourneyDemandPricing,
  useUpdateJourneyDemandSchedule,
} from '@/features/journey-demand/hooks/mutations';
import { useMyJourneyDemand } from '@/features/journey-demand/hooks/queries/use-my-journey-demand';
import type {
  JourneyDemandCapacity,
  JourneyDemandCorridor,
  JourneyDemandPricing,
  JourneyDemandSchedule,
  MyJourneyDemand,
} from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { JourneyDemandCapacityEditor } from '../capacity/journey-demand-capacity-editor';
import { JourneyDemandCorridorEditor } from '../corridor/journey-demand-corridor-editor';
import { JourneyDemandPricingEditor } from '../pricing/journey-demand-pricing-editor';
import { JourneyDemandScheduleEditor } from '../schedule/journey-demand-schedule-editor';

import { MyJourneyDemandError } from './my-journey-demand-error';
import { MyJourneyDemandLoading } from './my-journey-demand-loading';

// =============================================================================
// Props
// =============================================================================

export interface MyJourneyDemandEditRouteProps {
  readonly journeyDemandPublicId: string;
  readonly className?: string;
}

// =============================================================================
// Route
// =============================================================================

export function MyJourneyDemandEditRoute({
  journeyDemandPublicId,
  className,
}: MyJourneyDemandEditRouteProps) {
  const {
    demand,
    isLoading,
    error,
    refetch,
  } = useMyJourneyDemand(journeyDemandPublicId);

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return <MyJourneyDemandLoading />;
  }

  // ---------------------------------------------------------------------------
  // Query error
  // ---------------------------------------------------------------------------

  if (error) {
    return (
      <MyJourneyDemandError
        error={error}
        onRetry={refetch}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Defensive empty state
  // ---------------------------------------------------------------------------

  if (demand === undefined) {
    return (
      <MyJourneyDemandError
        error={new Error('Journey Demand could not be loaded.')}
        onRetry={refetch}
      />
    );
  }

  return (
    <MyJourneyDemandEditSurface
      key={demand.publicId}
      demand={demand}
      refetch={refetch}
      className={className}
    />
  );
}

// =============================================================================
// Edit Surface
// =============================================================================
//
// Deliberately separated from the query/loading route.
//
// The key supplied by MyJourneyDemandEditRoute causes a fresh mount whenever
// the owner navigates from one Journey Demand to another.
//
// Draft state can therefore be initialized directly from demand without an
// effect that copies server state into local state.
//
// -----------------------------------------------------------------------------

interface MyJourneyDemandEditSurfaceProps {
  readonly demand: MyJourneyDemand;
  readonly refetch: () => Promise<void>;
  readonly className?: string;
}

function MyJourneyDemandEditSurface({
  demand,
  refetch,
  className,
}: MyJourneyDemandEditSurfaceProps) {
  // ===========================================================================
  // Mutation hooks
  // ===========================================================================

  const {
    isLoading: isSavingCorridor,
    error: corridorError,
    updateJourneyDemandCorridor,
  } = useUpdateJourneyDemandCorridor();

  const {
    isLoading: isSavingSchedule,
    error: scheduleError,
    updateJourneyDemandSchedule,
  } = useUpdateJourneyDemandSchedule();

  const {
    isLoading: isSavingCapacity,
    error: capacityError,
    updateJourneyDemandCapacity,
  } = useUpdateJourneyDemandCapacity();

  const {
    isLoading: isSavingPricing,
    error: pricingError,
    updateJourneyDemandPricing,
  } = useUpdateJourneyDemandPricing();

  // ===========================================================================
  // Draft state
  // ===========================================================================
  //
  // These are UI drafts only.
  //
  // They are initialized directly from the authenticated owner projection.
  // They are not domain entities and do not replace the backend aggregate.
  //
  // ===========================================================================

  const [corridorDraft, setCorridorDraft] =
    useState<JourneyDemandCorridor | undefined>(
      demand.corridor,
    );

  const [scheduleDraft, setScheduleDraft] =
    useState<JourneyDemandSchedule | undefined>(
      demand.schedule,
    );

  const [capacityDraft, setCapacityDraft] =
    useState<JourneyDemandCapacity | undefined>(
      demand.capacity,
    );

  const [pricingDraft, setPricingDraft] =
    useState<JourneyDemandPricing | undefined>(
      demand.pricing,
    );

  // ===========================================================================
  // Corridor
  // ===========================================================================
  //
  // The backend corridor DTO currently accepts only:
  //
  // - origin
  // - destination
  // - correlationId
  // - causationId
  //
  // Coordinates, corridorKey, and waypoints are intentionally not sent.
  //
  // ===========================================================================

  const handleSaveCorridor = useCallback(async (): Promise<void> => {
    if (corridorDraft === undefined) {
      return;
    }

    await updateJourneyDemandCorridor(demand.publicId, {
      origin: corridorDraft.originName,
      destination: corridorDraft.destinationName,
      correlationId: crypto.randomUUID(),
    });

    await refetch();
  }, [
    corridorDraft,
    demand.publicId,
    refetch,
    updateJourneyDemandCorridor,
  ]);

  // ===========================================================================
  // Schedule
  // ===========================================================================
  //
  // Frontend models use Date objects.
  //
  // HTTP requests use ISO strings because that is the backend DTO contract.
  //
  // targetArrival and maximumArrival remain independent constraints.
  // Neither is used as a fallback for the other.
  //
  // ===========================================================================

  const handleSaveSchedule = useCallback(async (): Promise<void> => {
    if (scheduleDraft === undefined) {
      return;
    }

    await updateJourneyDemandSchedule(demand.publicId, {
      earliestDeparture:
        scheduleDraft.scheduleWindow.earliestDeparture.toISOString(),

      latestDeparture:
        scheduleDraft.scheduleWindow.latestDeparture.toISOString(),

      ...(scheduleDraft.arrivalWindow.targetArrival !== undefined
        ? {
            targetArrival:
              scheduleDraft.arrivalWindow.targetArrival.toISOString(),
          }
        : {}),

      ...(scheduleDraft.arrivalWindow.maximumArrival !== undefined
        ? {
            maximumArrival:
              scheduleDraft.arrivalWindow.maximumArrival.toISOString(),
          }
        : {}),

      timezone: scheduleDraft.timezone,
      correlationId: crypto.randomUUID(),
    });

    await refetch();
  }, [
    demand.publicId,
    refetch,
    scheduleDraft,
    updateJourneyDemandSchedule,
  ]);

  // ===========================================================================
  // Capacity
  // ===========================================================================
  //
  // Only requestedSeats is writable.
  //
  // matchedSeats and capacity convenience flags remain backend-owned.
  //
  // ===========================================================================

  const handleSaveCapacity = useCallback(async (): Promise<void> => {
    if (capacityDraft === undefined) {
      return;
    }

    await updateJourneyDemandCapacity(demand.publicId, {
      seatsRequired: capacityDraft.requestedSeats,
      correlationId: crypto.randomUUID(),
    });

    await refetch();
  }, [
    capacityDraft,
    demand.publicId,
    refetch,
    updateJourneyDemandCapacity,
  ]);

  // ===========================================================================
  // Pricing
  // ===========================================================================
  //
  // The currently implemented backend pricing mutation accepts:
  //
  // - maxFare
  // - currency
  //
  // preferredPricePerSeat exists in the read model but is not currently a
  // writable field. We therefore do not send or invent a mutation for it.
  //
  // ===========================================================================

  const handleSavePricing = useCallback(async (): Promise<void> => {
    if (pricingDraft === undefined) {
      return;
    }

    if (pricingDraft.maximumPricePerSeat === undefined) {
      return;
    }

    await updateJourneyDemandPricing(demand.publicId, {
      maxFare: pricingDraft.maximumPricePerSeat,
      currency: pricingDraft.currency,
      correlationId: crypto.randomUUID(),
    });

    await refetch();
  }, [
    demand.publicId,
    pricingDraft,
    refetch,
    updateJourneyDemandPricing,
  ]);

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <main
      className={cn(
        'page-container',
        'py-4 sm:py-5',
        className,
      )}
    >
      <div className="min-w-0">
        {/* -------------------------------------------------------------------
            Page header
        ------------------------------------------------------------------- */}

        <header className="min-w-0 border-b border-border pb-4">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-foreground sm:text-xl">
              Edit travel need
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-foreground-muted">
              Update the route, travel time, seats, and pricing for this
              Journey Demand.
            </p>
          </div>
        </header>

        {/* -------------------------------------------------------------------
            Editable sections
        ------------------------------------------------------------------- */}

        <div className="mt-5 min-w-0 space-y-4">
          {/* -----------------------------------------------------------------
              Corridor
          ----------------------------------------------------------------- */}

          {corridorDraft ? (
            <JourneyDemandCorridorEditor
              corridor={corridorDraft}
              onChange={setCorridorDraft}
              onSave={() => {
                void handleSaveCorridor().catch(() => undefined);
              }}
              isSaving={isSavingCorridor}
            />
          ) : null}

          {corridorError ? (
            <MutationError
              message={corridorError.message}
              section="route"
            />
          ) : null}

          {/* -----------------------------------------------------------------
              Schedule
          ----------------------------------------------------------------- */}

          {scheduleDraft ? (
            <JourneyDemandScheduleEditor
              schedule={scheduleDraft}
              onChange={setScheduleDraft}
              onSave={() => {
                void handleSaveSchedule().catch(() => undefined);
              }}
              isSaving={isSavingSchedule}
            />
          ) : null}

          {scheduleError ? (
            <MutationError
              message={scheduleError.message}
              section="travel time"
            />
          ) : null}

          {/* -----------------------------------------------------------------
              Capacity
          ----------------------------------------------------------------- */}

          {capacityDraft ? (
            <JourneyDemandCapacityEditor
              capacity={capacityDraft}
              onChange={setCapacityDraft}
              onSave={() => {
                void handleSaveCapacity().catch(() => undefined);
              }}
              isSaving={isSavingCapacity}
            />
          ) : null}

          {capacityError ? (
            <MutationError
              message={capacityError.message}
              section="seats"
            />
          ) : null}

          {/* -----------------------------------------------------------------
              Pricing
          ----------------------------------------------------------------- */}

          {pricingDraft ? (
            <JourneyDemandPricingEditor
              pricing={pricingDraft}
              onChange={setPricingDraft}
              onSave={() => {
                void handleSavePricing().catch(() => undefined);
              }}
              isSaving={isSavingPricing}
            />
          ) : null}

          {pricingError ? (
            <MutationError
              message={pricingError.message}
              section="pricing"
            />
          ) : null}

          {/* -----------------------------------------------------------------
              Separately managed data
          ----------------------------------------------------------------- */}

          <EditBoundaryNotice />
        </div>
      </div>
    </main>
  );
}

// =============================================================================
// Mutation Error
// =============================================================================

interface MutationErrorProps {
  readonly message: string;
  readonly section: string;
}

function MutationError({
  message,
  section,
}: MutationErrorProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-[var(--radius-md)]',
        'border border-[var(--danger)]',
        'bg-[var(--danger-soft)]',
        'px-3 py-2.5',
        'text-sm text-[var(--danger)]',
      )}
    >
      Unable to save {section}: {message}
    </div>
  );
}

// =============================================================================
// Edit Boundary Notice
// =============================================================================

function EditBoundaryNotice() {
  return (
    <section
      className={cn(
        'rounded-[var(--radius-lg)]',
        'border border-border-subtle',
        'bg-background-subtle',
        'p-4',
      )}
      aria-labelledby="journey-demand-edit-boundary-heading"
    >
      <div className="min-w-0">
        <h2
          id="journey-demand-edit-boundary-heading"
          className="text-sm font-semibold text-foreground"
        >
          Other journey details
        </h2>

        <p className="mt-1 text-xs leading-5 text-foreground-muted">
          Waypoints and participants are managed separately from the main
          travel-need details.
        </p>
      </div>
    </section>
  );
}
