// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Corridor Editor
// -----------------------------------------------------------------------------
//
// Authenticated/editor presentation for a Journey Demand corridor.
//
// Architecture:
// - Consumes the authenticated JourneyDemandCorridor model.
// - Does not fetch data.
// - Does not call the backend directly.
// - Does not create the Journey Demand aggregate.
// - Does not decide corridor business rules.
// - Does not manufacture waypoint ordering.
// - Delegates individual waypoint editing to JourneyDemandWaypointEditor.
//
// The parent/container owns:
// - loading the current corridor;
// - mutation hooks;
// - authorization/capability decisions;
// - validation orchestration;
// - persistence;
// - success/error handling;
// - navigation;
// - publication.
//
// This component owns:
// - corridor editing presentation;
// - origin/destination field composition;
// - waypoint editor composition;
// - forwarding controlled values and callbacks.
//
// IMPORTANT WORKFLOW RULE:
//
// Journey Demand creation happens before this editor is reached.
//
//     Create Journey Demand
//             ↓
//     establish journeyDemandPublicId
//             ↓
//     Edit Journey Demand
//             ↓
//     configure corridor / schedule / capacity / pricing / etc.
//             ↓
//     Publish
//
// This component therefore never creates a Journey Demand aggregate.
//
// -----------------------------------------------------------------------------

'use client';

import type { ChangeEvent } from 'react';

import type { JourneyDemandCorridor } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { JourneyDemandWaypointEditor } from './journey-demand-waypoint-editor';

export interface JourneyDemandCorridorEditorProps {
  readonly corridor: JourneyDemandCorridor;
  readonly onChange?: (corridor: JourneyDemandCorridor) => void;
  readonly onSave?: () => void;
  readonly isSaving?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function JourneyDemandCorridorEditor({
  corridor,
  onChange,
  onSave,
  isSaving = false,
  disabled = false,
  className,
}: JourneyDemandCorridorEditorProps) {
  const isDisabled = disabled || isSaving;

  const updateCorridor = (
    changes: Partial<JourneyDemandCorridor>,
  ): void => {
    onChange?.({
      ...corridor,
      ...changes,
    });
  };

  const handleOriginNameChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    updateCorridor({
      originName: event.target.value,
    });
  };

  const handleDestinationNameChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    updateCorridor({
      destinationName: event.target.value,
    });
  };

  const handleWaypointChange = (
    updatedWaypoint: JourneyDemandCorridor['waypoints'][number],
  ): void => {
    updateCorridor({
      waypoints: corridor.waypoints.map((currentWaypoint) =>
        currentWaypoint.publicId === updatedWaypoint.publicId
          ? updatedWaypoint
          : currentWaypoint,
      ),
    });
  };

  const handleWaypointRemove = (
    waypointPublicId: string,
  ): void => {
    updateCorridor({
      waypoints: corridor.waypoints.filter(
        (waypoint) => waypoint.publicId !== waypointPublicId,
      ),
    });
  };

  return (
    <section
      className={cn(
        'surface',
        'p-4 sm:p-5',
        className,
      )}
      aria-labelledby="journey-demand-corridor-editor-heading"
    >
      {/* ---------------------------------------------------------------------
          Header
      --------------------------------------------------------------------- */}

      <div className="min-w-0">
        <h2
          id="journey-demand-corridor-editor-heading"
          className="text-base font-semibold text-foreground"
        >
          Travel route
        </h2>

        <p className="mt-1 text-sm text-foreground-muted">
          Update where the Journey Demand starts, ends, and stops along
          the way.
        </p>
      </div>

      {/* ---------------------------------------------------------------------
          Origin / destination
      --------------------------------------------------------------------- */}

      <div className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
        <LocationField
          label="From"
          value={corridor.originName}
          disabled={isDisabled}
          onChange={handleOriginNameChange}
        />

        <LocationField
          label="To"
          value={corridor.destinationName}
          disabled={isDisabled}
          onChange={handleDestinationNameChange}
        />
      </div>

      {/* ---------------------------------------------------------------------
          Waypoints
      --------------------------------------------------------------------- */}

      {corridor.waypoints.length > 0 ? (
        <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground">
                Waypoints
              </h3>

              <p className="mt-1 text-xs text-foreground-muted">
                Stops included along this corridor.
              </p>
            </div>

            <span className="shrink-0 text-xs text-foreground-muted">
              {corridor.waypoints.length}{' '}
              {corridor.waypoints.length === 1 ? 'stop' : 'stops'}
            </span>
          </div>

          <ol className="mt-4 space-y-3">
            {corridor.waypoints.map((waypoint) => (
              <JourneyDemandWaypointEditor
                key={waypoint.publicId}
                waypoint={waypoint}
                disabled={isDisabled}
                onChange={handleWaypointChange}
                onRemove={() => {
                  handleWaypointRemove(waypoint.publicId);
                }}
              />
            ))}
          </ol>
        </div>
      ) : (
        <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
          <p className="text-sm text-foreground-muted">
            No waypoints have been added to this corridor.
          </p>
        </div>
      )}

      {/* ---------------------------------------------------------------------
          Save
          --------------------------------------------------------------------- */}

      {onSave ? (
        <div className="mt-6 flex justify-end border-t border-[var(--border-subtle)] pt-5">
          <button
            type="button"
            disabled={isDisabled}
            onClick={onSave}
            className={cn(
              'inline-flex min-h-10 items-center justify-center',
              'rounded-[var(--radius-md)]',
              'bg-[var(--brand)]',
              'px-4 text-sm font-medium',
              'text-[var(--brand-foreground)]',
              'transition-colors',
              'hover:bg-[var(--brand-hover)]',
              'focus-visible:outline-none',
              'focus-visible:ring-2',
              'focus-visible:ring-[var(--brand)]',
              'focus-visible:ring-offset-2',
              'disabled:pointer-events-none',
              'disabled:opacity-50',
            )}
          >
            {isSaving ? 'Saving…' : 'Save route'}
          </button>
        </div>
      ) : null}
    </section>
  );
}

// -----------------------------------------------------------------------------
// Location field
// -----------------------------------------------------------------------------

interface LocationFieldProps {
  readonly label: string;
  readonly value: string;
  readonly disabled: boolean;
  readonly onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
}

function LocationField({
  label,
  value,
  disabled,
  onChange,
}: LocationFieldProps) {
  return (
    <label className="block min-w-0">
      <span className="text-sm font-medium text-foreground">
        {label}
      </span>

      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={onChange}
        className={cn(
          'mt-2 block min-h-10 w-full rounded-[var(--radius-md)]',
          'border border-[var(--border)]',
          'bg-[var(--surface)]',
          'px-3 text-sm text-foreground',
          'placeholder:text-foreground-subtle',
          'outline-none transition-colors',
          'focus:border-[var(--brand)]',
          'focus:outline-none',
          'focus:ring-2 focus:ring-[var(--brand-soft)]',
          'disabled:cursor-not-allowed',
          'disabled:bg-[var(--background-subtle)]',
          'disabled:text-foreground-muted',
        )}
      />
    </label>
  );
}