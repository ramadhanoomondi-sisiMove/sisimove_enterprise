// -----------------------------------------------------------------------------
// SisiMove — Journey Route
// -----------------------------------------------------------------------------
//
// Public/frontend representation of the route of a Journey.
//
// This model is a frontend read model and is intentionally independent of:
// - Prisma models
// - backend domain entities
// - aggregates
// - persistence structures
//
// The backend owns the authoritative route and location data. This model
// exposes only information appropriate for public Journey discovery and
// presentation.
//
// It must not contain:
// - precise coordinates
// - private pickup locations
// - private drop-off locations
// - exact meeting points
// - traveller contact information
// - booking-specific operational data
// - internal persistence identifiers
// -----------------------------------------------------------------------------

import type { JourneyWaypoint } from './journey-waypoint';

// -----------------------------------------------------------------------------
// Journey Route
// -----------------------------------------------------------------------------

export interface JourneyRoute {
  /**
   * Stable public identifier of the route representation.
   *
   * This is an opaque frontend-safe identifier. The frontend must not assume
   * that it corresponds directly to a particular persistence model or database
   * record.
   */
  publicId: string;

  /**
   * Public origin name.
   *
   * Examples:
   * - Nairobi
   * - Nairobi CBD
   * - Nairobi Railway Station
   *
   * The value must represent a publicly safe location label and must not
   * contain a private meeting-point description.
   */
  originName: string;

  /**
   * Public destination name.
   *
   * Examples:
   * - Kisumu
   * - Bungoma
   * - Kisii
   *
   * The value must represent a publicly safe location label.
   */
  destinationName: string;

  /**
   * Publicly discoverable waypoints along the Journey corridor.
   *
   * These are public corridor locations only. Exact pickup/drop-off
   * arrangements and private meeting points must never be placed here.
   */
  waypoints: JourneyWaypoint[];
}