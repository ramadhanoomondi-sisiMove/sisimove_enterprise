// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Mapper
// -----------------------------------------------------------------------------
//
// Maps the public Traveller Profile HTTP response into the canonical
// TravellerProfile feature model.
//
// Boundary:
//
// HTTP transport
//      ↓
// PublicTravellerProfileResponse
//      ↓
// TravellerProfileMapper
//      ↓
// TravellerProfile
//
// Responsibilities:
// - Normalize public profile transport data.
// - Convert transport representations into feature models.
// - Protect the feature layer from transport-specific details.
//
// Non-responsibilities:
// - No Prisma access.
// - No repository access.
// - No business rules.
// - No authentication or authorization.
// - No trust calculations.
// - No matching calculations.
// - No private-data exposure.
//
// Trust is intentionally NOT mapped here because TravellerProfile does not
// own the Trust model. Trust has its own feature boundary and mapper.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Feature Models
// -----------------------------------------------------------------------------

import type {
  TravellerCorridor,
  TravellerCorridorWaypoint,
  TravellerPreferences,
  TravellerProfile,
  TravellerTravelStyle,
} from '../models';

// -----------------------------------------------------------------------------
// API Transport Types
// -----------------------------------------------------------------------------

import type {
  PublicTravellerProfileCorridorResponse,
  PublicTravellerProfileCorridorWaypointResponse,
  PublicTravellerProfilePreferencesResponse,
  PublicTravellerProfileResponse,
} from '../api/traveller-profile.types';

// -----------------------------------------------------------------------------
// Public Mapper Contract
// -----------------------------------------------------------------------------

export interface TravellerProfileMapper {
  map(
    response: PublicTravellerProfileResponse,
  ): TravellerProfile;
}

// -----------------------------------------------------------------------------
// String Normalization
// -----------------------------------------------------------------------------

function normalizeRequiredString(
  value: string,
): string {
  return value.trim();
}

function normalizeNullableString(
  value: string | null,
): string | null {
  if (value === null) {
    return null;
  }

  const normalized = value.trim();

  return normalized || null;
}

// -----------------------------------------------------------------------------
// Integer Normalization
// -----------------------------------------------------------------------------

function normalizeNonNegativeInteger(
  value: number,
): number | null {
  if (!Number.isFinite(value)) {
    return null;
  }

  const normalized = Math.floor(value);

  if (normalized < 0) {
    return null;
  }

  return normalized;
}

// -----------------------------------------------------------------------------
// Travel Style
// -----------------------------------------------------------------------------

function mapTravellerTravelStyle(
  value: string | null,
): TravellerTravelStyle | null {
  if (value === null) {
    return null;
  }

  switch (value.trim().toUpperCase()) {
    case 'QUIET':
      return 'QUIET';

    case 'SOCIAL':
      return 'SOCIAL';

    case 'FLEXIBLE':
      return 'FLEXIBLE';

    default:
      return null;
  }
}

// -----------------------------------------------------------------------------
// Traveller Preferences
// -----------------------------------------------------------------------------

function mapTravellerPreferences(
  response: PublicTravellerProfilePreferencesResponse,
): TravellerPreferences {
  return {
    travelStyle:
      mapTravellerTravelStyle(
        response.travelStyle,
      ),

    prefersDaytimeTravel:
      response.prefersDaytimeTravel,

    prefersNighttimeTravel:
      response.prefersNighttimeTravel,

    flexibleDeparture:
      response.flexibleDeparture,

    preferredCompanionCount:
      response.preferredCompanionCount === null
        ? null
        : normalizeNonNegativeInteger(
            response.preferredCompanionCount,
          ),
  };
}

// -----------------------------------------------------------------------------
// Corridor Waypoint
// -----------------------------------------------------------------------------

function mapTravellerCorridorWaypoint(
  response:
    PublicTravellerProfileCorridorWaypointResponse,
): TravellerCorridorWaypoint {
  return {
    publicId: normalizeRequiredString(
      response.publicId,
    ),

    name: normalizeRequiredString(
      response.name,
    ),

    order:
      normalizeNonNegativeInteger(
        response.order,
      ) ?? 0,
  };
}

// -----------------------------------------------------------------------------
// Primary Corridor
// -----------------------------------------------------------------------------

function mapTravellerCorridor(
  response:
    | PublicTravellerProfileCorridorResponse
    | null,
): TravellerCorridor | null {
  if (response === null) {
    return null;
  }

  return {
    publicId: normalizeRequiredString(
      response.publicId,
    ),

    origin: normalizeRequiredString(
      response.origin,
    ),

    destination: normalizeRequiredString(
      response.destination,
    ),

    waypoints:
      response.waypoints.map(
        mapTravellerCorridorWaypoint,
      ),
  };
}

// -----------------------------------------------------------------------------
// Traveller Profile
// -----------------------------------------------------------------------------

function mapTravellerProfile(
  response: PublicTravellerProfileResponse,
): TravellerProfile {
  return {
    handle: normalizeRequiredString(
      response.traveller.handle,
    ),

    displayName: normalizeRequiredString(
      response.traveller.displayName,
    ),

    avatarUrl: normalizeNullableString(
      response.traveller.avatarUrl,
    ),

    bio: normalizeNullableString(
      response.traveller.bio,
    ),

    primaryCorridor:
      mapTravellerCorridor(
        response.primaryCorridor,
      ),

    preferences:
      mapTravellerPreferences(
        response.preferences,
      ),

    isPublic:
      response.isPublic,
  };
}

// -----------------------------------------------------------------------------
// Mapper Implementation
// -----------------------------------------------------------------------------

class DefaultTravellerProfileMapper
  implements TravellerProfileMapper
{
  map(
    response: PublicTravellerProfileResponse,
  ): TravellerProfile {
    return mapTravellerProfile(response);
  }
}

// -----------------------------------------------------------------------------
// Public Mapper
// -----------------------------------------------------------------------------

export const travellerProfileMapper:
  TravellerProfileMapper =
    new DefaultTravellerProfileMapper();