// -----------------------------------------------------------------------------
// sisiMove — My Journey Mapper
// -----------------------------------------------------------------------------
//
// Maps the authenticated "My Journeys" response into the frontend Journey
// model.
//
// Architectural responsibility:
// - Normalize Journey records returned by the authenticated management API.
// - Reuse the canonical Journey mapper.
// - Keep authenticated management concerns separate from public marketplace
//   presentation.
//
// The backend `/journeys/me` endpoint derives the provider from the
// authenticated identity. The frontend therefore does NOT provide or infer
// the provider identity when requesting this collection.
//
// This mapper intentionally does NOT:
// - Resolve Traveller Profile or Trust Profile data.
// - Make additional API requests.
// - Construct public marketplace models.
// - Remove providerPublicId.
// - Format dates, prices, or status labels.
// - Apply lifecycle or authorization rules.
// -----------------------------------------------------------------------------

import type { Journey } from '../models';

import {
  mapJourney,
  type JourneyApiResponse,
} from './journey.mapper';

// -----------------------------------------------------------------------------
// API Response
// -----------------------------------------------------------------------------

/**
 * Transport representation returned by the authenticated `/journeys/me`
 * endpoint.
 *
 * The My Journeys endpoint returns authenticated Journey management data.
 * Its individual Journey records use the same transport shape as the
 * canonical Journey mapper.
 */
export type MyJourneyApiResponse = JourneyApiResponse;

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps one authenticated My Journey API response into the frontend Journey
 * model.
 *
 * Keeping this as a dedicated mapper gives the My Journeys feature a stable
 * mapping boundary while allowing the underlying Journey representation to
 * remain centralized.
 */
export function mapMyJourney(
  journey: MyJourneyApiResponse,
): Journey {
  return mapJourney(journey);
}

/**
 * Maps a collection returned by `/journeys/me`.
 *
 * Collection mapping deliberately delegates each item to `mapMyJourney`
 * rather than duplicating Journey normalization logic.
 */
export function mapMyJourneys(
  journeys: MyJourneyApiResponse[],
): Journey[] {
  return journeys.map(mapMyJourney);
}