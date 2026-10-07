// -----------------------------------------------------------------------------
// Path: src/features/journey/mappers/journey-vehicle.mapper.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Journey Vehicle Mapper
//
// Translates the authenticated Journey vehicle HTTP projection into the
// frontend JourneyVehicle read model.
//
// Architecture:
//
//     JourneyVehicleResponse
//             ↓
//     JourneyVehicleMapper
//             ↓
//     JourneyVehicle
//
// The mapper is the boundary between the transport/API representation and
// the frontend read-model representation.
//
// IMPORTANT
// ---------
//
// The backend Asset response currently provides:
//
//     publicId
//     url
//
// while the frontend JourneyVehicleAsset read model requires:
//
//     publicId
//     url
//     alt
//
// The mapper therefore supplies `alt: null` when the backend does not provide
// alternative text.
//
// We intentionally do NOT:
//
// - make `alt` optional in the frontend model;
// - invent an accessibility label from the vehicle make/model;
// - treat assetPublicId as an image URL;
// - expose authenticated Asset-management fields;
// - recreate Asset domain behaviour;
// - mutate or enrich the backend response outside the read-model contract.
//
// -----------------------------------------------------------------------------
//
// BOUNDED-CONTEXT REFERENCE
// -----------------------------------------------------------------------------
//
// `assetPublicId` remains an opaque reference to the Asset bounded context.
//
// The resolved `asset` object is only the browser-facing representation
// supplied by the Journey API.
//
//     assetPublicId
//          │
//          └── opaque Asset reference
//
//     asset
//          │
//          └── browser-facing resolved Asset projection
//
// -----------------------------------------------------------------------------

import type { JourneyVehicle } from '../models/journey-vehicle';

// =============================================================================
// Resolved Asset API Response
// =============================================================================

/**
 * Asset representation returned inside the Journey vehicle API projection.
 *
 * This is deliberately kept separate from `JourneyVehicleAsset`.
 *
 * The API currently returns only the fields required to identify and render
 * the resolved Asset URL.
 *
 * `alt` is not currently part of the transport contract, so the mapper
 * supplies the frontend read-model value separately.
 */
export interface JourneyVehicleAssetResponse {
  /**
   * Public Asset identifier.
   */
  readonly publicId: string;

  /**
   * Browser-facing Asset URL.
   */
  readonly url: string;
}

// =============================================================================
// Vehicle API Response
// =============================================================================

/**
 * Journey vehicle representation returned by the API.
 *
 * This is a transport contract, not the frontend read model.
 */
export interface JourneyVehicleResponse {
  /**
   * Public Journey vehicle identifier.
   */
  readonly publicId: string;

  /**
   * Vehicle manufacturer/make.
   */
  readonly make: string;

  /**
   * Vehicle model.
   */
  readonly model: string;

  /**
   * Optional manufacturing/model year.
   */
  readonly year: number | null;

  /**
   * Optional vehicle color.
   */
  readonly color: string | null;

  /**
   * Optional vehicle registration.
   */
  readonly registration: string | null;

  /**
   * Opaque reference to the Asset bounded context.
   */
  readonly assetPublicId: string | null;

  /**
   * Resolved browser-facing Asset reference.
   *
   * The API currently does not include alternative text.
   */
  readonly asset: JourneyVehicleAssetResponse | null;
}

// =============================================================================
// Mapper
// =============================================================================

/**
 * Maps the Journey vehicle HTTP projection into the frontend
 * `JourneyVehicle` read model.
 *
 * The mapper owns transport-to-read-model differences.
 *
 * In particular:
 *
 *     API asset
 *         {
 *           publicId,
 *           url
 *         }
 *
 *             ↓
 *
 *     Frontend asset
 *         {
 *           publicId,
 *           url,
 *           alt: null
 *         }
 *
 * `null` is used rather than inventing alternative text because the API has
 * not supplied an authoritative accessibility description.
 */
export const JourneyVehicleMapper = {
  fromResponse(response: JourneyVehicleResponse): JourneyVehicle {
    return {
      publicId: response.publicId,
      make: response.make,
      model: response.model,
      year: response.year,
      color: response.color,
      registration: response.registration,
      assetPublicId: response.assetPublicId,

      asset: response.asset
        ? {
            publicId: response.asset.publicId,
            url: response.asset.url,
            alt: null,
          }
        : null,
    };
  },
};