'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Route Step
// -----------------------------------------------------------------------------
//
// Composes the route portion of the Journey Demand creation workflow.
//
// Responsibilities:
// - Present the corridor.
// - Present optional waypoints.
// - Coordinate the step-level completion state.
//
// This component intentionally does not create the Journey Demand. The draft
// aggregate must already exist before the creation wizard reaches this step.
// -----------------------------------------------------------------------------

import { useMemo } from 'react';

import { Card, Divider } from '@/components/ui';
import {
  useJourneyDemandCorridor,
  useJourneyDemandWaypoints,
} from '@/features/journey-demand/hooks';
import type {
  JourneyDemandCorridor,
  JourneyDemandWaypoint,
} from '@/features/journey-demand/models';

import { JourneyDemandCorridorForm } from './journey-demand-corridor-form';
import { JourneyDemandWaypointsForm } from './journey-demand-waypoints-form';

export interface JourneyDemandRouteStepProps {
  journeyDemandPublicId: string;
  onComplete?: () => void;
}

interface CorridorData extends JourneyDemandCorridor {
  origin?: {
    name?: string | null;
  } | null;
  destination?: {
    name?: string | null;
  } | null;
}

function extractItems<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (
    value &&
    typeof value === 'object' &&
    'items' in value &&
    Array.isArray((value as { items?: unknown }).items)
  ) {
    return (value as { items: T[] }).items;
  }

  return [];
}

export function JourneyDemandRouteStep({
  journeyDemandPublicId,
  onComplete,
}: JourneyDemandRouteStepProps) {
  const {
    data: corridor,
    isLoading: isCorridorLoading,
    isError: isCorridorError,
  } = useJourneyDemandCorridor(journeyDemandPublicId);

  const {
    data: waypointData,
    isLoading: isWaypointsLoading,
    isError: isWaypointsError,
  } = useJourneyDemandWaypoints(journeyDemandPublicId);

  const waypoints = useMemo(
    () => extractItems<JourneyDemandWaypoint>(waypointData),
    [waypointData],
  );

  const corridorData = corridor as CorridorData | undefined;

  const origin = corridorData?.origin?.name ?? '';
  const destination = corridorData?.destination?.name ?? '';

  const corridorReady = Boolean(origin && destination);

  const handleSaved = () => {
    if (corridorReady) {
      onComplete?.();
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-slate-500">
          Step 1 of 5
        </p>

        <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
          Plan your route
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
          Start with your main route, then add any stops that matter to
          your journey.
        </p>
      </div>

      <JourneyDemandCorridorForm
        journeyDemandPublicId={journeyDemandPublicId}
        initialOrigin={origin}
        initialDestination={destination}
        onSaved={handleSaved}
      />

      <Divider />

      <JourneyDemandWaypointsForm
        journeyDemandPublicId={journeyDemandPublicId}
        waypoints={waypoints}
      />

      {(isCorridorLoading || isWaypointsLoading) ? (
        <Card padding="sm" variant="muted">
          <p className="text-sm text-slate-500">
            Loading your saved route…
          </p>
        </Card>
      ) : null}

      {isCorridorError || isWaypointsError ? (
        <Card padding="sm" variant="muted">
          <p className="text-sm text-slate-500">
            Some saved route information could not be loaded. You can
            still retry from this step.
          </p>
        </Card>
      ) : null}
    </div>
  );
}