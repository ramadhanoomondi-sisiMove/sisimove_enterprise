// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile API
// -----------------------------------------------------------------------------
//
// Frontend API adapter for Traveller Profile read boundaries.
//
// This adapter deliberately separates:
//
//   1. Public Traveller Profile reads
//   2. Authenticated current-Traveller Profile reads
//
// Public reads return the reduced PublicTraveller model.
//
// The authenticated `/me` read returns the complete authenticated
// TravellerProfile model required by the Profile UI.
//
// Architectural boundary:
//
//   Backend Traveller Profile API
//              ↓
//   REST response
//              ↓
//   This API adapter
//              ↓
//   Frontend Traveller Profile model
//              ↓
//   UI
//
// The frontend does not consume:
//
// - TravellerProfile domain entities;
// - Prisma models;
// - internal database IDs;
// - Identity domain objects;
// - backend domain value objects.
//
// Asset rule:
//
// The backend owns Asset URL resolution.
//
// Public Traveller endpoints return a resolved public avatar:
//
//     avatar: {
//       publicId,
//       url,
//       alt
//     }
//
// The authenticated `/me` endpoint currently returns:
//
//     avatarAssetPublicId
//
// as an opaque Asset reference.
//
// Therefore the authenticated TravellerProfile model intentionally retains
// `avatarAssetPublicId` rather than constructing a URL. The Profile UI may
// resolve that public Asset through the dedicated Assets feature when it needs
// to display the avatar.
//
// Authentication rule:
//
// Public Traveller Profile endpoints use the generic `apiClient` because they
// do not require an authenticated session.
//
// The authenticated `/me` endpoint uses `authenticatedApiClient` because the
// backend derives the current Traveller Profile from the authenticated
// Identity represented by the Bearer access token.
//
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http/api-client';
import { authenticatedApiClient } from '@/features/authentication';

import type {
  PublicTraveller,
  PublicTravellerAvatar,
  TravellerProfile,
  TravellerProfileCorridor,
  TravellerProfilePreferences,
} from '../models';

// =============================================================================
// API Paths
// =============================================================================

const TRAVELLER_PROFILE_API_PATH = '/traveller-profiles';

// =============================================================================
// Backend Transport Types — Public Read Boundary
// =============================================================================
//
// These interfaces represent the deliberately reduced public REST response.
//
// They remain local to this adapter so the rest of the frontend does not
// become coupled to backend transport contracts.
//
// =============================================================================

/**
 * Public avatar representation returned by the backend.
 *
 * The public Traveller Profile read boundary is responsible for resolving
 * the Asset reference into a browser-consumable URL.
 */
interface PublicTravellerAvatarResponse {
  readonly publicId: string;
  readonly url: string;
  readonly alt: string | null;
}

/**
 * Deliberately reduced public Traveller Profile response.
 *
 * This is the transport contract exposed by the public Traveller Profile
 * endpoints.
 */
interface PublicTravellerResponse {
  readonly publicId: string;
  readonly handle: string;
  readonly bio: string | null;
  readonly avatar: PublicTravellerAvatarResponse | null;
  readonly countryCode: string;
}

// =============================================================================
// Backend Transport Types — Authenticated Current Traveller
// =============================================================================
//
// GET /traveller-profiles/me returns the broad
// TravellerProfileResponse produced by:
//
//     TravellerProfileResponseMapper
//
// This adapter maps that transport representation into the frontend
// TravellerProfile model.
//
// The frontend model intentionally preserves:
//
//     avatarAssetPublicId
//
// as an opaque Asset reference.
//
// The adapter does NOT construct an Asset URL.
//
// =============================================================================

interface CurrentTravellerProfilePreferencesResponse {
  readonly id: string;
  readonly publicId: string;
  readonly profileId: string;
  readonly showJourneyHistory: boolean;
  readonly showJourneyStatistics: boolean;
  readonly allowJourneyInvites: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface CurrentTravellerProfileCorridorResponse {
  readonly id: string;
  readonly publicId: string;
  readonly profileId: string;
  readonly originName: string;
  readonly destinationName: string;
  readonly originLatitude: number;
  readonly originLongitude: number;
  readonly destinationLatitude: number;
  readonly destinationLongitude: number;
  readonly corridorKey: string | null;
  readonly isPrimary: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Current authenticated Traveller Profile REST response.
 *
 * This mirrors the current backend TravellerProfileResponseMapper contract.
 *
 * `id` fields are transport details and are intentionally not propagated into
 * the frontend TravellerProfile model where the model uses public IDs.
 */
interface CurrentTravellerProfileResponse {
  readonly id: string;
  readonly publicId: string;
  readonly memberPublicId: string;
  readonly handle: string;
  readonly bio: string | null;
  readonly avatarAssetPublicId: string | null;
  readonly countryCode: string;
  readonly status: string;
  readonly visibility: string;
  readonly totalJourneys: number;
  readonly completedJourneys: number;
  readonly providerJourneys: number;
  readonly passengerJourneys: number;
  readonly completedProviderJourneys: number;
  readonly completedPassengerJourneys: number;
  readonly preferences: CurrentTravellerProfilePreferencesResponse | null;
  readonly corridors: CurrentTravellerProfileCorridorResponse[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

// =============================================================================
// Authenticated Traveller Profile Query
// =============================================================================

/**
 * Load the Traveller Profile belonging to the currently authenticated
 * Identity.
 *
 * Backend:
 *
 *     GET /traveller-profiles/me
 *
 * Authentication:
 *
 *     Bearer access token
 *
 * The frontend does NOT send:
 *
 * - identityPublicId;
 * - memberPublicId;
 * - travellerProfilePublicId;
 * - travellerHandle.
 *
 * The authenticated access token is the only identity selector required.
 *
 * The backend resolves:
 *
 *     Access Token
 *          ↓
 *     CurrentIdentity
 *          ↓
 *     identityPublicId
 *          ↓
 *     GetTravellerProfileByMemberPublicIdQuery
 *          ↓
 *     TravellerProfileAggregate
 *          ↓
 *     TravellerProfileResponseMapper
 *
 * The adapter then maps the transport response into the complete frontend
 * TravellerProfile model.
 */
export async function getCurrentTravellerProfile(): Promise<TravellerProfile> {
  const response =
    await authenticatedApiClient.get<CurrentTravellerProfileResponse | null>(
      `${TRAVELLER_PROFILE_API_PATH}/me`,
    );

  if (response === null) {
    throw new Error('Authenticated Traveller Profile was not found.');
  }

  return mapCurrentTravellerProfileResponse(response);
}

// =============================================================================
// Public Traveller Profile Queries
// =============================================================================

/**
 * Load a public Traveller Profile by its public profile identifier.
 *
 * Backend:
 *
 *     GET /traveller-profiles/public/:publicId
 *
 * Authentication:
 *
 *     None
 */
export async function getTravellerProfileByPublicId(
  travellerProfilePublicId: string,
): Promise<PublicTraveller | null> {
  const normalizedPublicId = travellerProfilePublicId.trim();

  if (normalizedPublicId.length === 0) {
    throw new Error('Traveller profile public ID is required.');
  }

  const response = await apiClient.get<PublicTravellerResponse | null>(
    `${TRAVELLER_PROFILE_API_PATH}/public/${encodeURIComponent(
      normalizedPublicId,
    )}`,
  );

  return response === null
    ? null
    : mapPublicTravellerResponse(response);
}

/**
 * Load a public Traveller Profile by the associated Member public identifier.
 *
 * Backend:
 *
 *     GET /traveller-profiles/public/member/:memberPublicId
 *
 * Authentication:
 *
 *     None
 */
export async function getTravellerProfileByMemberPublicId(
  memberPublicId: string,
): Promise<PublicTraveller | null> {
  const normalizedMemberPublicId = memberPublicId.trim();

  if (normalizedMemberPublicId.length === 0) {
    throw new Error('Member public ID is required.');
  }

  const response = await apiClient.get<PublicTravellerResponse | null>(
    `${TRAVELLER_PROFILE_API_PATH}/public/member/${encodeURIComponent(
      normalizedMemberPublicId,
    )}`,
  );

  return response === null
    ? null
    : mapPublicTravellerResponse(response);
}

/**
 * Load a public Traveller Profile by its public handle.
 *
 * Backend:
 *
 *     GET /traveller-profiles/public/handle/:handle
 *
 * Authentication:
 *
 *     None
 */
export async function getTravellerProfileByHandle(
  handle: string,
): Promise<PublicTraveller | null> {
  const normalizedHandle = handle.trim();

  if (normalizedHandle.length === 0) {
    throw new Error('Traveller handle is required.');
  }

  const response = await apiClient.get<PublicTravellerResponse | null>(
    `${TRAVELLER_PROFILE_API_PATH}/public/handle/${encodeURIComponent(
      normalizedHandle,
    )}`,
  );

  return response === null
    ? null
    : mapPublicTravellerResponse(response);
}

// =============================================================================
// Authenticated Traveller Profile Mapper
// =============================================================================

/**
 * Map the authenticated `/me` transport representation into the frontend
 * TravellerProfile model.
 *
 * Important:
 *
 * `avatarAssetPublicId` remains an opaque Asset reference.
 *
 * This mapper does NOT construct an Asset URL.
 *
 * The Assets feature remains responsible for public Asset retrieval when the
 * authenticated UI needs to render the avatar.
 */
function mapCurrentTravellerProfileResponse(
  response: CurrentTravellerProfileResponse,
): TravellerProfile {
  return {
    publicId: response.publicId,
    memberPublicId: response.memberPublicId,
    handle: response.handle,
    bio: response.bio,
    avatarAssetPublicId: response.avatarAssetPublicId,
    countryCode: response.countryCode,
    status: mapTravellerProfileStatus(response.status),
    visibility: mapTravellerProfileVisibility(response.visibility),

    totalJourneys: response.totalJourneys,
    completedJourneys: response.completedJourneys,
    providerJourneys: response.providerJourneys,
    passengerJourneys: response.passengerJourneys,
    completedProviderJourneys: response.completedProviderJourneys,
    completedPassengerJourneys: response.completedPassengerJourneys,

    preferences:
      response.preferences === null
        ? null
        : mapTravellerProfilePreferencesResponse(response.preferences),

    corridors: response.corridors.map(
      mapTravellerProfileCorridorResponse,
    ),

    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

// =============================================================================
// Authenticated Traveller Profile Value Mappers
// =============================================================================

/**
 * Keep backend status values constrained to the frontend model.
 *
 * The backend currently serializes the enum as a string. We validate the
 * transport value at this adapter boundary instead of spreading arbitrary
 * strings through the application.
 */
function mapTravellerProfileStatus(
  status: string,
): TravellerProfile['status'] {
  switch (status) {
    case 'ACTIVE':
    case 'RESTRICTED':
    case 'SUSPENDED':
    case 'CLOSED':
      return status;

    default:
      throw new Error(
        `Unsupported Traveller Profile status received: ${status}`,
      );
  }
}

/**
 * Keep backend visibility values constrained to the frontend model.
 */
function mapTravellerProfileVisibility(
  visibility: string,
): TravellerProfile['visibility'] {
  switch (visibility) {
    case 'PUBLIC':
    case 'LIMITED':
    case 'PRIVATE':
      return visibility;

    default:
      throw new Error(
        `Unsupported Traveller Profile visibility received: ${visibility}`,
      );
  }
}

function mapTravellerProfilePreferencesResponse(
  response: CurrentTravellerProfilePreferencesResponse,
): TravellerProfilePreferences {
  return {
    publicId: response.publicId,
    profileId: response.profileId,
    showJourneyHistory: response.showJourneyHistory,
    showJourneyStatistics: response.showJourneyStatistics,
    allowJourneyInvites: response.allowJourneyInvites,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

function mapTravellerProfileCorridorResponse(
  response: CurrentTravellerProfileCorridorResponse,
): TravellerProfileCorridor {
  return {
    publicId: response.publicId,
    profileId: response.profileId,
    originName: response.originName,
    destinationName: response.destinationName,
    originLatitude: response.originLatitude,
    originLongitude: response.originLongitude,
    destinationLatitude: response.destinationLatitude,
    destinationLongitude: response.destinationLongitude,
    corridorKey: response.corridorKey,
    isPrimary: response.isPrimary,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

// =============================================================================
// Public Traveller Profile Mapper
// =============================================================================

/**
 * Map the backend public Traveller Profile transport representation into the
 * frontend PublicTraveller model.
 *
 * This is transport-to-frontend mapping only.
 *
 * It does not:
 *
 * - apply Traveller Profile business rules;
 * - reconstruct omitted backend information;
 * - resolve Assets;
 * - infer private profile information;
 * - construct URLs.
 */
function mapPublicTravellerResponse(
  response: PublicTravellerResponse,
): PublicTraveller {
  return {
    publicId: response.publicId,
    handle: response.handle,
    bio: response.bio,
    avatar:
      response.avatar === null
        ? null
        : mapPublicTravellerAvatarResponse(response.avatar),
    countryCode: response.countryCode,
  };
}

// =============================================================================
// Public Traveller Avatar Mapper
// =============================================================================

/**
 * Map the backend public avatar representation into the public avatar model.
 *
 * The URL is supplied by the backend public read boundary.
 *
 * No URL is constructed from the avatar public ID.
 */
function mapPublicTravellerAvatarResponse(
  response: PublicTravellerAvatarResponse,
): PublicTravellerAvatar {
  return {
    publicId: response.publicId,
    url: response.url,
    alt: response.alt,
  };
}