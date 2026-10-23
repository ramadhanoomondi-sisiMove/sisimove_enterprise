
/**
 * sisiMove — Journey Model
 *
 * Frontend domain model for the Journey API response.
 *
 * Represents the journey and its nested operational details:
 * - corridor and waypoints;
 * - schedule;
 * - vehicle;
 * - capacity;
 * - pricing;
 * - passenger preferences;
 * - associated assets.
 *
 * Field names and nullability follow the established backend
 * JourneyResponse contract.
 *
 * This file contains types only. It does not perform API calls,
 * data mapping, validation, or business operations.
 */

import type { JourneyStatus } from '../utils/journey-status';

// -----------------------------------------------------------------------------
// Shared audit fields
// -----------------------------------------------------------------------------

export interface JourneyAuditFields {
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Journey coordinates
// -----------------------------------------------------------------------------

export interface JourneyCoordinates {
  latitude: number;
  longitude: number;
}

// -----------------------------------------------------------------------------
// Journey waypoint
// -----------------------------------------------------------------------------

export interface JourneyWaypoint extends JourneyAuditFields {
  id: string;
  publicId: string;
  type: string;
  sequence: number;
  name: string;
  latitude: number;
  longitude: number;
  isPickup: boolean;
  isDropoff: boolean;
}

// -----------------------------------------------------------------------------
// Journey corridor
// -----------------------------------------------------------------------------

export interface JourneyCorridor extends JourneyAuditFields {
  id: string;
  publicId: string;
  originName: string;
  destinationName: string;
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  corridorKey: string | null;
  waypoints: JourneyWaypoint[];
}

// -----------------------------------------------------------------------------
// Journey schedule
// -----------------------------------------------------------------------------

export interface JourneySchedule extends JourneyAuditFields {
  id: string;
  publicId: string;
  departureAt: string;
  arrivalAt: string | null;
  timezone: string;
}

// -----------------------------------------------------------------------------
// Journey vehicle
// -----------------------------------------------------------------------------

export interface JourneyVehicle extends JourneyAuditFields {
  id: string;
  publicId: string;
  make: string;
  model: string;
  year: number | null;
  color: string | null;
  registration: string | null;
  assetPublicId: string | null;
}

// -----------------------------------------------------------------------------
// Journey capacity
// -----------------------------------------------------------------------------

export interface JourneyCapacity extends JourneyAuditFields {
  id: string;
  publicId: string;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
}

// -----------------------------------------------------------------------------
// Journey pricing
// -----------------------------------------------------------------------------

export interface JourneyPricing extends JourneyAuditFields {
  id: string;
  publicId: string;
  amount: number;
  currency: string;
}

// -----------------------------------------------------------------------------
// Journey passenger preferences
// -----------------------------------------------------------------------------

export interface JourneyPreferences extends JourneyAuditFields {
  id: string;
  publicId: string;
  smoking: string;
  pets: string;
  luggage: string;
  conversation: string;
  music: string;
}

// -----------------------------------------------------------------------------
// Journey asset
// -----------------------------------------------------------------------------

export interface JourneyAsset extends JourneyAuditFields {
  id: string;
  publicId: string;
  assetPublicId: string;
  type: string;
  sortOrder: number;
}

// -----------------------------------------------------------------------------
// Journey aggregate response
// -----------------------------------------------------------------------------

export interface Journey extends JourneyAuditFields {
  id: string;
  publicId: string;
  providerPublicId: string;
  status: JourneyStatus;

  publishedAt: string | null;
  startedAt: string | null;
  completionRequestedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  expiredAt: string | null;

  version: number;

  corridor: JourneyCorridor;
  schedule: JourneySchedule;
  vehicle: JourneyVehicle;
  capacity: JourneyCapacity;
  pricing: JourneyPricing;
  preferences: JourneyPreferences;
  assets: JourneyAsset[];
}

// -----------------------------------------------------------------------------
// Public aliases
// -----------------------------------------------------------------------------

/**
 * API response shape for a single journey.
 *
 * Kept as an alias so API and mapper code can use an explicit
 * response-oriented name without duplicating the contract.
 */
export type JourneyResponseModel = Journey;

/**
 * Public identifier used to address a journey through the API.
 */
export type JourneyPublicId = string;

/**
 * Public identifier used to address the journey provider.
 */
export type JourneyProviderPublicId = string;
