
/**
 * sisiMove — Journey Enums
 *
 * Shared enum-like constants and types for journey models.
 *
 * Journey lifecycle statuses are sourced from the established
 * backend contract and re-exported from the existing utility.
 */

// -----------------------------------------------------------------------------
// Journey lifecycle status
// -----------------------------------------------------------------------------

export {
  JOURNEY_STATUSES,
  type JourneyStatus,
  type JourneyStatusGroup,
  type JourneyStatusInput,
  type JourneyStatusMetadata,
  type JourneyStatusVariant,
} from '../utils/journey-status';

// -----------------------------------------------------------------------------
// Journey waypoint type
// -----------------------------------------------------------------------------
//
// Keep this open until the backend's authoritative waypoint enum
// values are confirmed. This avoids rejecting valid API values.

export type JourneyWaypointType = string;

// -----------------------------------------------------------------------------
// Journey asset type
// -----------------------------------------------------------------------------
//
// The backend response exposes an asset type, but the authoritative
// set of allowed values must come from its enum/schema.

export type JourneyAssetType = string;

// -----------------------------------------------------------------------------
// Journey preference values
// -----------------------------------------------------------------------------
//
// These fields are represented as strings by the established response
// contract. Do not narrow them without confirming backend constraints.

export type JourneySmokingPreference = string;
export type JourneyPetsPreference = string;
export type JourneyLuggagePreference = string;
export type JourneyConversationPreference = string;
export type JourneyMusicPreference = string;
