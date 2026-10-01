// -----------------------------------------------------------------------------
// Path: src/features/journey/types/journey-corridor.types.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Supported Corridor Types
//
// Types used by the Journey creation workflow to represent SisiMove-supported
// long-distance travel corridors.
//
// These types describe the selectable corridor catalogue. They are NOT the
// same thing as JourneyCorridorEntity, which is the persisted corridor
// snapshot owned by an individual Journey.
//
// -----------------------------------------------------------------------------

import type { SupportedLocation } from "@/foundation/location/types/location.types";

// -----------------------------------------------------------------------------
// Supported Route
// -----------------------------------------------------------------------------

/**
 * A major location along a SisiMove-supported long-distance corridor.
 *
 * This is intentionally not a JourneyWaypoint.
 *
 * Supported routes describe the major route structure known by SisiMove.
 * Journey waypoints remain optional, Journey-specific pickup/drop-off points.
 */
export interface SupportedRoute {
  /**
   * Stable identifier for the route location within the corridor catalogue.
   */
  readonly key: string;

  /**
   * Location represented by this route point.
   */
  readonly location: SupportedLocation;

  /**
   * Position within the supported corridor.
   */
  readonly sequence: number;
}

// -----------------------------------------------------------------------------
// Supported Corridor
// -----------------------------------------------------------------------------

/**
 * A SisiMove-supported long-distance travel corridor.
 *
 * A corridor represents a meaningful origin → destination relationship rather
 * than every road, town, or possible pickup point along the journey.
 */
export interface SupportedCorridor {
  /**
   * Stable identifier used for discovery and Journey matching.
   *
   * This value eventually corresponds to JourneyCorridor.corridorKey.
   *
   * Example:
   *   NAIROBI_KISUMU
   */
  readonly key: string;

  /**
   * Human-readable corridor name.
   *
   * Example:
   *   Nairobi → Kisumu
   */
  readonly name: string;

  /**
   * Supported corridor origin.
   */
  readonly origin: SupportedLocation;

  /**
   * Supported corridor destination.
   */
  readonly destination: SupportedLocation;

  /**
   * Major route locations associated with this corridor.
   *
   * These are catalogue locations, not Journey-specific waypoints.
   */
  readonly routes: readonly SupportedRoute[];
}

// -----------------------------------------------------------------------------
// Resolved Journey Corridor
// -----------------------------------------------------------------------------

/**
 * Corridor selected by the Journey creation workflow.
 *
 * This is the frontend representation that contains everything required to
 * attach the Journey corridor through the existing backend command.
 */
export interface ResolvedJourneyCorridor {
  /**
   * Stable SisiMove corridor identifier.
   */
  readonly corridorKey: string;

  /**
   * Resolved origin.
   */
  readonly origin: SupportedLocation;

  /**
   * Resolved destination.
   */
  readonly destination: SupportedLocation;
}