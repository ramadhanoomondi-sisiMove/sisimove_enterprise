// -----------------------------------------------------------------------------
// Path: src/features/journey-demand/components/corridor/journey-demand-corridor-editor.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Demand Corridor Editor
//
// This component is a PRESENTATION-ONLY corridor editor.
//
// Responsibility
// --------------
//
// The parent JourneyDemandEditor owns:
//
// - the current origin;
// - the current destination;
// - origin search/query state;
// - destination search/query state;
// - supported-location suggestions;
// - supported-corridor resolution;
// - corridor persistence;
// - mutation pending state;
// - mutation errors;
// - projection refresh.
//
// This component only renders the controlled editing surface and reports
// user intent back to the parent.
//
// Workflow:
//
//     JourneyDemandEditor
//          │
//          ├── origin / destination state
//          ├── location suggestions
//          ├── resolveSupportedCorridor()
//          ├── updateJourneyDemandCorridor()
//          └── refetch()
//                 │
//                 ▼
//     JourneyDemandCorridorEditor
//          │
//          ├── LocationSelector
//          ├── onOriginQueryChange()
//          ├── onDestinationQueryChange()
//          ├── onOriginSelect()
//          ├── onDestinationSelect()
//          └── onSubmit()
//
// The editor deliberately does NOT:
//
// - import the supported-corridor catalogue;
// - resolve corridors;
// - determine whether a route is valid;
// - call an API;
// - own mutation hooks;
// - create request DTOs;
// - decide lifecycle capability;
// - create waypoint IDs;
// - reorder or renumber waypoints;
// - persist waypoint changes;
// - reconstruct the Journey Demand aggregate.
//
// Mutation state
// --------------
//
// The parent workflow owns mutation state.
//
// The parent therefore supplies:
//
//     disabled={isSubmitting}
//
// The corridor editor does not maintain a second `submitting` or `isSaving`
// contract. This keeps the presentation contract aligned with the workflow
// owner and prevents two different sources of truth for the same interaction
// state.
//
// Waypoints
// ---------
//
// Waypoint editing is intentionally not implemented by this component.
//
// JourneyDemandWaypointEditor remains a separate controlled presentation
// editor for an individual waypoint. Collection ownership and waypoint
// persistence belong to the owning JourneyDemandEditor workflow.
//
// -----------------------------------------------------------------------------

'use client';

import type { ResolvedLocation } from '@/foundation/location';
import { cn } from '@/foundation';

import { LocationSelector } from '@/foundation/location';

// =============================================================================
// Form values
// =============================================================================

/**
 * The complete corridor value emitted when the user submits the editor.
 *
 * The parent owns the translation from these resolved presentation values
 * into the backend update request.
 */
export interface JourneyDemandCorridorFormValues {
  readonly origin: ResolvedLocation;
  readonly destination: ResolvedLocation;
}

// =============================================================================
// Props
// =============================================================================

export interface JourneyDemandCorridorEditorProps {
  /**
   * Currently selected origin.
   *
   * The parent owns this value.
   */
  readonly origin: ResolvedLocation | null;

  /**
   * Currently selected destination.
   *
   * The parent owns this value.
   */
  readonly destination: ResolvedLocation | null;

  /**
   * Current origin search text.
   */
  readonly originQuery: string;

  /**
   * Current destination search text.
   */
  readonly destinationQuery: string;

  /**
   * Locations currently available for origin selection.
   *
   * These are supplied by the parent workflow and therefore already represent
   * the authoritative location catalogue.
   */
  readonly originSuggestions: readonly ResolvedLocation[];

  /**
   * Locations currently available for destination selection.
   *
   * The parent derives these from the selected origin and the supported
   * corridor resolver.
   */
  readonly destinationSuggestions: readonly ResolvedLocation[];

  /**
   * Optional origin validation error.
   */
  readonly originError?: string | null;

  /**
   * Optional destination validation error.
   */
  readonly destinationError?: string | null;

  /**
   * Optional parent-owned persistence/mutation error.
   */
  readonly error?: string | null;

  /**
   * Prevents editing and submission.
   *
   * The parent workflow owns this state. In practice the parent passes its
   * workflow-level `isSubmitting` value here.
   */
  readonly disabled?: boolean;

  /**
   * Label for the persistence action.
   */
  readonly submitLabel?: string;

  /**
   * Called when the user submits the selected corridor.
   *
   * The parent remains responsible for resolving the corridor and translating
   * it into the backend update request.
   */
  readonly onSubmit: (
    values: JourneyDemandCorridorFormValues,
  ) => void | Promise<void>;

  /**
   * Optional cancellation callback supplied by the parent.
   */
  readonly onCancel?: () => void;

  /**
   * Called whenever origin search text changes.
   */
  readonly onOriginQueryChange: (
    query: string,
  ) => void;

  /**
   * Called whenever destination search text changes.
   */
  readonly onDestinationQueryChange: (
    query: string,
  ) => void;

  /**
   * Called when the user selects an origin.
   */
  readonly onOriginSelect: (
    location: ResolvedLocation,
  ) => void;

  /**
   * Called when the user selects a destination.
   */
  readonly onDestinationSelect: (
    location: ResolvedLocation,
  ) => void;

  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function JourneyDemandCorridorEditor({
  origin,
  destination,
  originQuery,
  destinationQuery,
  originSuggestions,
  destinationSuggestions,
  originError = null,
  destinationError = null,
  error = null,
  disabled = false,
  submitLabel = 'Save route',
  onSubmit,
  onCancel,
  onOriginQueryChange,
  onDestinationQueryChange,
  onOriginSelect,
  onDestinationSelect,
  className,
}: JourneyDemandCorridorEditorProps) {
  // ---------------------------------------------------------------------------
  // Derived interaction state
  // ---------------------------------------------------------------------------
  //
  // This is deliberately presentation state only.
  //
  // The component does not determine whether the selected locations form a
  // valid corridor. The parent has already supplied the authoritative
  // destination suggestions.
  // ---------------------------------------------------------------------------

  const canSubmit =
    !disabled &&
    origin !== null &&
    destination !== null;

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleSubmit = (): void => {
    if (
      origin === null ||
      destination === null
    ) {
      return;
    }

    void onSubmit({
      origin,
      destination,
    });
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <section
      className={cn(
        'min-w-0',
        'rounded-[var(--radius-lg)]',
        'border',
        'border-[var(--border)]',
        'bg-[var(--surface)]',
        'p-4',
        'sm:p-5',
        className,
      )}
      aria-labelledby="journey-demand-corridor-editor-heading"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div className="mb-5 min-w-0">
        <h2
          id="journey-demand-corridor-editor-heading"
          className="text-base font-semibold text-[var(--foreground)]"
        >
          Journey route
        </h2>

        <p className="mt-1 text-sm leading-5 text-[var(--foreground-muted)]">
          Choose where you want to travel from and where you want to go.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Location selectors                                                  */}
      {/* ------------------------------------------------------------------- */}

      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <LocationSelector
            label="From"
            value={origin}
            query={originQuery}
            suggestions={originSuggestions}
            error={originError}
            disabled={disabled}
            onQueryChange={
              onOriginQueryChange
            }
            onSelect={onOriginSelect}
          />
        </div>

        <div className="min-w-0">
          <LocationSelector
            label="To"
            value={destination}
            query={destinationQuery}
            suggestions={destinationSuggestions}
            error={destinationError}
            disabled={
              disabled ||
              origin === null
            }
            onQueryChange={
              onDestinationQueryChange
            }
            onSelect={
              onDestinationSelect
            }
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Route preview                                                       */}
      {/* ------------------------------------------------------------------- */}

      {origin !== null &&
      destination !== null ? (
        <div className="mt-4 rounded-[var(--radius-md)] bg-[var(--background-brand)] p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Selected route
          </p>

          <p className="mt-1 text-sm font-medium text-[var(--foreground)]">
            {origin.name} → {destination.name}
          </p>
        </div>
      ) : null}

      {/* ------------------------------------------------------------------- */}
      {/* Mutation error                                                      */}
      {/* ------------------------------------------------------------------- */}

      {error ? (
        <p
          className="mt-4 text-sm text-[var(--danger)]"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {/* ------------------------------------------------------------------- */}
      {/* Actions                                                             */}
      {/* ------------------------------------------------------------------- */}

      <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-[var(--border)] pt-4">
        {onCancel ? (
          <button
            type="button"
            disabled={disabled}
            onClick={onCancel}
            className={cn(
              'inline-flex min-h-10',
              'items-center justify-center',
              'rounded-[var(--radius-md)]',
              'border border-[var(--border)]',
              'bg-[var(--surface)]',
              'px-4 py-2',
              'text-sm font-medium',
              'text-[var(--foreground)]',
              'transition-colors',
              'hover:bg-[var(--background)]',
              'focus-visible:outline-2',
              'focus-visible:outline-[var(--brand)]',
              'focus-visible:outline-offset-2',
              'disabled:cursor-not-allowed',
              'disabled:opacity-50',
            )}
          >
            Cancel
          </button>
        ) : null}

        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
          className={cn(
            'inline-flex min-h-10',
            'items-center justify-center',
            'rounded-[var(--radius-md)]',
            'bg-[var(--brand)]',
            'px-4 py-2',
            'text-sm font-medium',
            'text-[var(--brand-foreground)]',
            'transition-opacity',
            'hover:opacity-90',
            'focus-visible:outline-2',
            'focus-visible:outline-[var(--brand)]',
            'focus-visible:outline-offset-2',
            'disabled:cursor-not-allowed',
            'disabled:opacity-50',
          )}
        >
          {submitLabel}
        </button>
      </div>
    </section>
  );
}