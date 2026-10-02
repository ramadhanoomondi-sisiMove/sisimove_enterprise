// -----------------------------------------------------------------------------
// sisiMove — Journey Corridor Editor
// -----------------------------------------------------------------------------
//
// Presentation-only editor for Journey corridor configuration.
//
// State ownership:
//
//   JourneyEditor
//        │
//        ├── origin
//        ├── destination
//        ├── originQuery
//        └── destinationQuery
//                 │
//                 ▼
//        JourneyCorridorEditor
//
// This component does NOT keep local location state.
//
// Therefore when the user moves:
//
//   Corridor → another Journey component → Corridor
//
// the previously selected From / To values remain available because the
// owning Journey workflow remains the single source of truth.
//
// User-facing requirement:
// - From
// - To
//
// The user never enters:
// - latitude;
// - longitude;
// - coordinates;
// - geocoding/provider details.
//
// Supported locations are supplied by the owning Journey workflow.
//
// The component does not:
// - resolve locations;
// - search locations;
// - geocode locations;
// - call the Journey API;
// - create a JourneyCorridor entity;
// - construct domain value objects;
// - persist anything.
//
// JourneyEditor / owning workflow owns:
// - resolved location state;
// - location query state;
// - supported-location filtering;
// - corridor resolution;
// - Journey API mutation;
// - validation;
// - refresh.
//
// LocationSelector owns:
// - location input;
// - location suggestions;
// - location selection.
//
// -----------------------------------------------------------------------------
//
// Physical-world model:
//
// The editor represents the Journey's physical corridor:
//
//   From → To
//
// It does not expose the geographic representation of those places.
// Coordinates and other location-resolution details remain behind the
// presentation/application boundary.
//
// -----------------------------------------------------------------------------
//
// Directionality:
//
// Supported corridors are resolved independently of direction.
//
// Therefore both:
//
//   Nairobi → Kisumu
//
// and:
//
//   Kisumu → Nairobi
//
// may be presented by the owning workflow when supported by the canonical
// corridor catalogue.
//
// The editor itself does not contain corridor-resolution logic.
//
// -----------------------------------------------------------------------------

"use client";

import type { FormEvent } from "react";

import {
  Button,
} from "@/components/ui";

import {
  LocationSelector,
  type ResolvedLocation,
} from "@/foundation/location";

import { cn } from "@/foundation/utils/cn";

// =============================================================================
// Types
// =============================================================================

export interface JourneyCorridorFormValues {
  readonly origin: ResolvedLocation;
  readonly destination: ResolvedLocation;
}

export interface JourneyCorridorEditorProps {
  /**
   * Previously selected origin.
   *
   * Controlled by the owning Journey workflow so the selection survives
   * component remounting and editor navigation.
   */
  readonly origin: ResolvedLocation | null;

  /**
   * Previously selected destination.
   *
   * Controlled by the owning Journey workflow.
   */
  readonly destination: ResolvedLocation | null;

  /**
   * Current origin search text.
   *
   * Controlled by the owning Journey workflow.
   */
  readonly originQuery: string;

  /**
   * Current destination search text.
   *
   * Controlled by the owning Journey workflow.
   */
  readonly destinationQuery: string;

  /**
   * SisiMove-supported locations available for the origin selector.
   */
  readonly originSuggestions: readonly ResolvedLocation[];

  /**
   * SisiMove-supported destinations available for the selected origin.
   */
  readonly destinationSuggestions: readonly ResolvedLocation[];

  readonly originError?: string | null;

  readonly destinationError?: string | null;

  readonly disabled?: boolean;

  /**
   * Presentation-only submission boundary.
   *
   * The owning workflow decides how the selected physical locations are
   * validated, resolved into a corridor, and persisted.
   */
  readonly onSubmit: (
    values: JourneyCorridorFormValues,
  ) => void;

  readonly onCancel?: () => void;

  readonly submitting?: boolean;

  readonly submitLabel?: string;

  readonly className?: string;

  readonly onOriginQueryChange: (
    query: string,
  ) => void;

  readonly onDestinationQueryChange: (
    query: string,
  ) => void;

  readonly onOriginSelect: (
    location: ResolvedLocation,
  ) => void;

  readonly onDestinationSelect: (
    location: ResolvedLocation,
  ) => void;
}

// =============================================================================
// Helpers
// =============================================================================

function toFormValues(
  origin: ResolvedLocation,
  destination: ResolvedLocation,
): JourneyCorridorFormValues {
  return {
    origin,
    destination,
  };
}

// =============================================================================
// Component
// =============================================================================

export function JourneyCorridorEditor({
  origin,
  destination,
  originQuery,
  destinationQuery,
  originSuggestions,
  destinationSuggestions,
  originError = null,
  destinationError = null,
  disabled = false,
  onSubmit,
  onCancel,
  submitting = false,
  submitLabel = "Save corridor",
  className,
  onOriginQueryChange,
  onDestinationQueryChange,
  onOriginSelect,
  onDestinationSelect,
}: JourneyCorridorEditorProps) {
  // ===========================================================================
  // Submit
  // ===========================================================================

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    if (
      origin === null ||
      destination === null
    ) {
      return;
    }

    onSubmit(
      toFormValues(
        origin,
        destination,
      ),
    );
  }

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "w-full",
        "space-y-5",
        className,
      )}
    >
      {/* --------------------------------------------------------------------- */}
      {/* Header                                                                */}
      {/* --------------------------------------------------------------------- */}

      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Where are you going?
        </h2>

        <p className="text-sm text-[var(--foreground-secondary)]">
          Choose your starting point and destination.
        </p>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* Location Selection                                                    */}
      {/* --------------------------------------------------------------------- */}

      <div className="grid gap-5 sm:grid-cols-2">
        {/* ------------------------------------------------------------------- */}
        {/* Origin                                                              */}
        {/* ------------------------------------------------------------------- */}

        <LocationSelector
          label="From"
          placeholder="Select starting point"
          value={origin}
          query={originQuery}
          suggestions={originSuggestions}
          disabled={
            disabled ||
            submitting
          }
          error={originError}
          onQueryChange={
            onOriginQueryChange
          }
          onSelect={
            onOriginSelect
          }
        />

        {/* ------------------------------------------------------------------- */}
        {/* Destination                                                         */}
        {/* ------------------------------------------------------------------- */}

        <LocationSelector
          label="To"
          placeholder={
            origin !== null
              ? "Select destination"
              : "Select starting point first"
          }
          value={destination}
          query={destinationQuery}
          suggestions={destinationSuggestions}
          disabled={
            disabled ||
            submitting ||
            origin === null
          }
          error={destinationError}
          onQueryChange={
            onDestinationQueryChange
          }
          onSelect={
            onDestinationSelect
          }
        />
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* Actions                                                               */}
      {/* --------------------------------------------------------------------- */}

      <div
        className={cn(
          "flex",
          "flex-col-reverse",
          "gap-3",
          "sm:flex-row",
          "sm:justify-end",
        )}
      >
        {onCancel !== undefined && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={
              disabled ||
              submitting
            }
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          variant="primary"
          loading={submitting}
          disabled={
            disabled ||
            origin === null ||
            destination === null
          }
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default JourneyCorridorEditor;
