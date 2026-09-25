// -----------------------------------------------------------------------------
// sisiMove — Journey Asset Type
// -----------------------------------------------------------------------------
//
// Stable frontend representation of the JourneyAssetType enum exposed by the
// Journey HTTP API.
//
// Backend:
//
//   VEHICLE
//   ROUTE
//   OTHER
//
// A JourneyAsset represents an asset attached to a Journey. The actual asset
// resource belongs to the Assets domain and is referenced through
// `assetPublicId`.
//
// This type therefore describes the Journey-level role of the asset, not the
// underlying Asset domain resource type.
//
// -----------------------------------------------------------------------------

/**
 * Semantic role of an asset attached to a Journey.
 */
export type JourneyAssetType =
  | 'VEHICLE'
  | 'ROUTE'
  | 'OTHER';

/**
 * All supported Journey asset types.
 *
 * Kept as a readonly tuple for runtime iteration, validation, filtering,
 * and UI option generation.
 */
export const JOURNEY_ASSET_TYPES = [
  'VEHICLE',
  'ROUTE',
  'OTHER',
] as const satisfies readonly JourneyAssetType[];

/**
 * Runtime guard for JourneyAssetType.
 */
export function isJourneyAssetType(
  value: unknown,
): value is JourneyAssetType {
  return (
    typeof value === 'string' &&
    (JOURNEY_ASSET_TYPES as readonly string[]).includes(value)
  );
}