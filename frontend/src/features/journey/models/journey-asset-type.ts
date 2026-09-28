// -----------------------------------------------------------------------------
// sisiMove — Journey Asset Type Model
// -----------------------------------------------------------------------------
//
// Frontend read-model contract for Journey-owned asset associations.
//
// This model mirrors the backend JourneyAssetType enum exactly.
//
// Important boundary:
//
// JourneyAsset does NOT own the underlying Asset.
// Journey owns the association:
//
//     JourneyAsset
//          │
//          └── assetPublicId ──> Asset bounded context
//
// Therefore this type describes the role of an asset within a Journey. It
// does not describe the Asset itself, its URL, metadata, or storage details.
//
// -----------------------------------------------------------------------------

/**
 * Journey asset type.
 *
 * Corresponds exactly to the backend JourneyAssetType enum:
 *
 *   VEHICLE
 *   ROUTE
 *   OTHER
 */
export type JourneyAssetType =
  | 'VEHICLE'
  | 'ROUTE'
  | 'OTHER';

/**
 * Runtime collection of all supported Journey asset types.
 *
 * Used by:
 * - API response validation;
 * - Journey mappers;
 * - presentation configuration;
 * - asset filtering where required.
 */
export const JOURNEY_ASSET_TYPES = [
  'VEHICLE',
  'ROUTE',
  'OTHER',
] as const satisfies readonly JourneyAssetType[];

/**
 * Runtime guard for values received from the API.
 */
export function isJourneyAssetType(
  value: string,
): value is JourneyAssetType {
  return (JOURNEY_ASSET_TYPES as readonly string[]).includes(value);
}