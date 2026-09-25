// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle Mapper
// -----------------------------------------------------------------------------
//
// Maps the raw Journey vehicle API representation into the stable frontend
// JourneyVehicle model.
//
// Architectural boundary:
//
//   HTTP API response
//       │
//       ▼
//   mapJourneyVehicle()
//       │
//       ▼
//   JourneyVehicle model
//       │
//       ▼
//   Hooks / Components
//
// This mapper performs transport-to-model normalization only.
//
// It does NOT:
//
// - resolve the underlying vehicle asset;
// - expose internal database identifiers;
// - format registration or vehicle labels for presentation;
// - fetch additional vehicle resources;
// - modify vehicle data.
//
// The vehicle's associated asset remains an Assets-domain concern and is
// represented only through its public identifier when supplied by the API.
//
// -----------------------------------------------------------------------------

import type { JourneyVehicle } from '../models';

/**
 * Raw Journey vehicle representation returned by the HTTP API.
 */
export interface JourneyVehicleApiResponse {
  /**
   * Public identifier of the vehicle.
   */
  publicId: string;

  /**
   * Vehicle manufacturer.
   */
  make: string;

  /**
   * Vehicle model.
   */
  model: string;

  /**
   * Manufacturing model year, when available.
   */
  year?: number | null;

  /**
   * Vehicle exterior color, when provided.
   */
  color?: string | null;

  /**
   * Vehicle registration identifier, when provided.
   */
  registration?: string | null;

  /**
   * Public identifier of the associated vehicle asset, when available.
   */
  assetPublicId?: string | null;

  /**
   * Creation timestamp, when provided.
   */
  createdAt?: string;

  /**
   * Last update timestamp, when provided.
   */
  updatedAt?: string;
}

/**
 * Map a raw Journey vehicle API representation into the frontend model.
 *
 * @param vehicle Raw vehicle representation returned by the Journey API.
 * @returns Stable frontend JourneyVehicle model.
 */
export function mapJourneyVehicle(
  vehicle: JourneyVehicleApiResponse,
): JourneyVehicle {
  return {
    publicId: vehicle.publicId,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    color: vehicle.color,
    registration: vehicle.registration,
    assetPublicId: vehicle.assetPublicId,
    createdAt: vehicle.createdAt,
    updatedAt: vehicle.updatedAt,
  };
}