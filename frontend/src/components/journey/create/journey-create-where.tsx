// -----------------------------------------------------------------------------
// Path: src/features/journey/components/create/JourneyCreateWhere.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Create Where
//
// Presentation-only Journey corridor selection step.
//
// State ownership:
//
//   JourneyCreateForm
//        │
//        ├── origin
//        ├── destination
//        ├── originQuery
//        └── destinationQuery
//                 │
//                 ▼
//        JourneyCreateWhere
//
// This component does NOT keep local location state.
//
// Therefore when the user moves:
//
//   Where → When → Vehicle → Back
//
// the previously entered From / To values remain available because the
// JourneyCreateForm remains the single source of truth.
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
// Supported locations are supplied by the Journey creation workflow.
// The component does not resolve, search, geocode, or persist locations.
//
// JourneyCreateForm owns:
// - resolved location state;
// - location query state;
// - supported-location filtering;
// - corridor resolution;
// - Journey creation;
// - corridor persistence;
// - validation;
// - workflow navigation.
//
// LocationSelector owns:
// - location input;
// - location suggestions;
// - location selection.
// -----------------------------------------------------------------------------

"use client";

import {
  LocationSelector,
  type ResolvedLocation,
} from "@/foundation/location";

import { cn } from "@/foundation/utils/cn";

// =============================================================================
// Props
// =============================================================================

export interface JourneyCreateWhereProps {
  /**
   * Previously selected origin.
   *
   * Controlled by JourneyCreateForm so the selection survives step
   * navigation/remounting.
   */
  readonly origin: ResolvedLocation | null;

  /**
   * Previously selected destination.
   *
   * Controlled by JourneyCreateForm so the selection survives step
   * navigation/remounting.
   */
  readonly destination: ResolvedLocation | null;

  /**
   * Current origin search text.
   *
   * Controlled by JourneyCreateForm.
   */
  readonly originQuery: string;

  /**
   * Current destination search text.
   *
   * Controlled by JourneyCreateForm.
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
// Component
// =============================================================================

export function JourneyCreateWhere({
  origin,
  destination,
  originQuery,
  destinationQuery,
  originSuggestions,
  destinationSuggestions,
  originError = null,
  destinationError = null,
  disabled = false,
  className,
  onOriginQueryChange,
  onDestinationQueryChange,
  onOriginSelect,
  onDestinationSelect,
}: JourneyCreateWhereProps) {
  return (
    <section
      aria-labelledby="journey-create-where-title"
      className={cn(
        "space-y-6",
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div className="space-y-1">
        <h2
          id="journey-create-where-title"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          Where are you going?
        </h2>

        <p className="text-sm text-[var(--foreground-secondary)]">
          Choose your starting point and destination.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Location Selection                                                  */}
      {/* ------------------------------------------------------------------- */}

      <div className="grid gap-5 sm:grid-cols-2">
        {/* ----------------------------------------------------------------- */}
        {/* Origin                                                            */}
        {/* ----------------------------------------------------------------- */}

        <LocationSelector
          label="From"
          placeholder="Select starting point"
          value={origin}
          query={originQuery}
          suggestions={originSuggestions}
          disabled={disabled}
          error={originError}
          onQueryChange={
            onOriginQueryChange
          }
          onSelect={
            onOriginSelect
          }
        />

        {/* ----------------------------------------------------------------- */}
        {/* Destination                                                       */}
        {/* ----------------------------------------------------------------- */}

        <LocationSelector
          label="To"
          placeholder={
            origin !== null
              ? "Select destination"
              : "Select starting point first"
          }
          value={destination}
          query={destinationQuery}
          suggestions={
            destinationSuggestions
          }
          disabled={
            disabled ||
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
    </section>
  );
}

export default JourneyCreateWhere;