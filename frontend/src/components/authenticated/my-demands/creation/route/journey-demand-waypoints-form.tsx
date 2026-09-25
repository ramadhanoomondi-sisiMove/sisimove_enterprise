'use client';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Waypoints Form
// -----------------------------------------------------------------------------
//
// Manages optional intermediate waypoints for a Journey Demand.
//
// Responsibilities:
// - Display the current waypoint collection.
// - Add a waypoint.
// - Update an existing waypoint.
// - Remove a waypoint.
// - Keep waypoint ordering explicit.
//
// The primary origin and destination belong to the corridor form and are not
// duplicated here.
//
// Waypoint persistence is delegated to the Journey Demand waypoint hooks.
// -----------------------------------------------------------------------------

import { useMemo, useState } from 'react';

import { Badge, Button, Card, Input } from '@/components/ui';
import {
  useAddJourneyDemandWaypoint,
  useRemoveJourneyDemandWaypoint,
  useUpdateJourneyDemandWaypoint,
} from '@/features/journey-demand/hooks';
import type {
  JourneyDemandWaypoint,
  JourneyDemandWaypointType,
} from '@/features/journey-demand/models';
import { JOURNEY_DEMAND_WAYPOINT_TYPES } from '@/features/journey-demand/models';

export interface JourneyDemandWaypointsFormProps {
  journeyDemandPublicId: string;
  waypoints?: JourneyDemandWaypoint[];
  onSaved?: () => void;
}

interface WaypointDraft {
  name: string;
  type: JourneyDemandWaypointType;
}

interface FormErrors {
  name?: string;
  form?: string;
}

function waypointLabel(type: JourneyDemandWaypointType): string {
  switch (type) {
    case 'PICKUP':
      return 'Pickup';
    case 'DROPOFF':
      return 'Drop-off';
    case 'WAYPOINT':
      return 'Waypoint';
    case 'ORIGIN':
      return 'Origin';
    case 'DESTINATION':
      return 'Destination';
    default:
      return type;
  }
}

function sortWaypoints(
  waypoints: JourneyDemandWaypoint[],
): JourneyDemandWaypoint[] {
  return [...waypoints].sort((a, b) => a.sequence - b.sequence);
}

export function JourneyDemandWaypointsForm({
  journeyDemandPublicId,
  waypoints = [],
  onSaved,
}: JourneyDemandWaypointsFormProps) {
  const [draft, setDraft] = useState<WaypointDraft>({
    name: '',
    type: 'WAYPOINT',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [editingPublicId, setEditingPublicId] = useState<string | null>(
    null,
  );
  const [editingName, setEditingName] = useState('');

  const addWaypointMutation = useAddJourneyDemandWaypoint();
  const updateWaypointMutation = useUpdateJourneyDemandWaypoint();
  const removeWaypointMutation = useRemoveJourneyDemandWaypoint();

  const orderedWaypoints = useMemo(
    () => sortWaypoints(waypoints),
    [waypoints],
  );

  const isPending =
    addWaypointMutation.isPending ||
    updateWaypointMutation.isPending ||
    removeWaypointMutation.isPending;

  const handleDraftChange = (
    field: keyof WaypointDraft,
    value: string,
  ) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field === 'name' ? 'name' : 'form']: undefined,
    }));
  };

  const handleAdd = () => {
    const name = draft.name.trim();

    if (!name) {
      setErrors({
        name: 'Enter a waypoint name.',
      });
      return;
    }

    setErrors({});

    const sequence =
      orderedWaypoints.length > 0
        ? Math.max(...orderedWaypoints.map((waypoint) => waypoint.sequence)) + 1
        : 1;

    addWaypointMutation.mutate(
      {
        journeyDemandPublicId,
        input: {
          type: draft.type,
          sequence,
          name,
        },
      },
      {
        onSuccess: () => {
          setDraft({
            name: '',
            type: 'WAYPOINT',
          });

          onSaved?.();
        },
        onError: (error) => {
          setErrors({
            form:
              error instanceof Error
                ? error.message
                : 'We could not add this waypoint.',
          });
        },
      },
    );
  };

  const startEditing = (waypoint: JourneyDemandWaypoint) => {
    setEditingPublicId(waypoint.publicId);
    setEditingName(waypoint.name);
    setErrors({});
  };

  const cancelEditing = () => {
    setEditingPublicId(null);
    setEditingName('');
    setErrors({});
  };

  const handleUpdate = (waypoint: JourneyDemandWaypoint) => {
    const name = editingName.trim();

    if (!name) {
      setErrors({
        name: 'Enter a waypoint name.',
      });
      return;
    }

    setErrors({});

    updateWaypointMutation.mutate(
      {
        journeyDemandPublicId,
        waypointPublicId: waypoint.publicId,
        input: {
          name,
          sequence: waypoint.sequence,
        },
      },
      {
        onSuccess: () => {
          cancelEditing();
          onSaved?.();
        },
        onError: (error) => {
          setErrors({
            form:
              error instanceof Error
                ? error.message
                : 'We could not update this waypoint.',
          });
        },
      },
    );
  };

  const handleRemove = (waypoint: JourneyDemandWaypoint) => {
    setErrors({});

    removeWaypointMutation.mutate(
      {
        journeyDemandPublicId,
        waypointPublicId: waypoint.publicId,
      },
      {
        onSuccess: () => {
          if (editingPublicId === waypoint.publicId) {
            cancelEditing();
          }

          onSaved?.();
        },
        onError: (error) => {
          setErrors({
            form:
              error instanceof Error
                ? error.message
                : 'We could not remove this waypoint.',
          });
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      <Card padding="md" variant="default">
        <div className="space-y-5">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Stops along the way
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add places where you would like to stop, be picked up, or be
              dropped off.
            </p>
          </div>

          {orderedWaypoints.length > 0 ? (
            <div className="space-y-3">
              {orderedWaypoints.map((waypoint) => {
                const isEditing =
                  editingPublicId === waypoint.publicId;

                return (
                  <div
                    key={waypoint.publicId}
                    className="rounded-lg border border-slate-200 p-3"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          label="Waypoint name"
                          value={editingName}
                          onChange={(event) =>
                            setEditingName(event.target.value)
                          }
                          disabled={isPending}
                          error={errors.name}
                          autoFocus
                        />

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={cancelEditing}
                            disabled={isPending}
                          >
                            Cancel
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdate(waypoint)}
                            disabled={isPending}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-medium text-slate-900">
                              {waypoint.name}
                            </p>

                            <Badge size="sm" variant="default">
                              {waypointLabel(waypoint.type)}
                            </Badge>
                          </div>

                          <p className="mt-1 text-xs text-slate-500">
                            Stop {waypoint.sequence}
                          </p>
                        </div>

                        <div className="flex shrink-0 gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(waypoint)}
                            disabled={isPending}
                          >
                            Edit
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(waypoint)}
                            disabled={isPending}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-slate-200 px-4 py-5 text-center text-sm text-slate-500">
              No additional stops yet.
            </p>
          )}
        </div>
      </Card>

      <Card padding="md" variant="default">
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-950">
              Add a stop
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Waypoints are optional. You can continue without adding one.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Place"
              value={draft.name}
              onChange={(event) =>
                handleDraftChange('name', event.target.value)
              }
              placeholder="e.g. Nakuru"
              disabled={isPending}
              error={errors.name}
            />

            <div>
              <label
                htmlFor="journey-demand-waypoint-type"
                className="mb-1.5 block text-sm font-medium text-slate-900"
              >
                Stop type
              </label>

              <select
                id="journey-demand-waypoint-type"
                value={draft.type}
                onChange={(event) =>
                  handleDraftChange(
                    'type',
                    event.target.value,
                  )
                }
                disabled={isPending}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                {JOURNEY_DEMAND_WAYPOINT_TYPES
                  .filter(
                    (type) =>
                      type !== 'ORIGIN' &&
                      type !== 'DESTINATION',
                  )
                  .map((type) => (
                    <option key={type} value={type}>
                      {waypointLabel(type)}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {errors.form ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.form}
            </p>
          ) : null}

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleAdd}
              disabled={isPending}
            >
              {addWaypointMutation.isPending
                ? 'Adding…'
                : 'Add stop'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}