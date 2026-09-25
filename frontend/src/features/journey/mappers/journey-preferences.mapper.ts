// -----------------------------------------------------------------------------
// sisiMove — Journey Preferences Mapper
// -----------------------------------------------------------------------------
//
// Maps the transport/API representation of Journey Preferences into the
// frontend JourneyPreferences model.
//
// Architectural responsibility:
// - Normalize the API response into the frontend model.
// - Preserve backend enum values exactly.
// - Keep transport concerns out of UI components.
// - Avoid presentation formatting or user-facing labels.
//
// This mapper intentionally does NOT:
// - Translate enum values into display labels.
// - Apply defaults.
// - Infer missing preferences.
// - Change backend values.
// - Perform API requests.
// - Contain UI/business workflow logic.
//
// The backend Journey Preferences aggregate/component is authoritative for
// preference values. The frontend model mirrors those values for rendering,
// editing workflows, and composition with Journey data.
// -----------------------------------------------------------------------------

import type { JourneyPreferences } from '../models';

// -----------------------------------------------------------------------------
// API Response
// -----------------------------------------------------------------------------

/**
 * Transport representation returned by the Journey API.
 *
 * The API exposes the same domain values represented by JourneyPreferences.
 * Keeping this type separate from the frontend model preserves the boundary
 * between transport data and application-facing models.
 */
export interface JourneyPreferencesApiResponse {
  publicId: string;

  smoking: JourneyPreferences['smoking'];
  pets: JourneyPreferences['pets'];
  luggage: JourneyPreferences['luggage'];
  conversation: JourneyPreferences['conversation'];
  music: JourneyPreferences['music'];

  createdAt?: string;
  updatedAt?: string;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps a Journey Preferences API response into the frontend model.
 *
 * No transformation is currently required beyond copying the API fields.
 * Enum values are deliberately preserved exactly as supplied by the backend.
 */
export function mapJourneyPreferences(
  preferences: JourneyPreferencesApiResponse,
): JourneyPreferences {
  return {
    publicId: preferences.publicId,

    smoking: preferences.smoking,
    pets: preferences.pets,
    luggage: preferences.luggage,
    conversation: preferences.conversation,
    music: preferences.music,

    createdAt: preferences.createdAt,
    updatedAt: preferences.updatedAt,
  };
}