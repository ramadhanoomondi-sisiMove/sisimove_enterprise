// -----------------------------------------------------------------------------
// sisiMove — Public Traveller Profile API
// -----------------------------------------------------------------------------
//
// Frontend API adapter for the public Traveller Profile read boundary.
//
// The backend Traveller Profile domain owns considerably more information
// than the public marketplace requires, including:
//
// - profile lifecycle;
// - visibility and status;
// - internal Identity references;
// - avatar asset references;
// - profile preferences;
// - journey statistics;
// - frequent corridors;
// - operational profile metadata.
//
// This adapter consumes only the deliberately reduced public Traveller Profile
// representation and maps it into the frontend-safe `PublicTraveller` model.
//
// Architectural boundary:
//
//   Backend Traveller Profile API
//              ↓
//   Public Traveller Profile REST response
//              ↓
//   This API adapter
//              ↓
//   PublicTraveller frontend model
//              ↓
//   Marketplace UI
//
// The frontend does not consume TravellerProfile domain entities, Prisma
// models, internal database IDs, or private profile data.
//
// Asset rule:
//
// The backend owns Asset URL resolution. The frontend must consume a genuine
// public avatar representation when supplied and must never construct an asset
// URL from an opaque asset public ID.
//
// Public endpoints consumed by this adapter:
//
//   GET /traveller-profiles/public/:publicId
//   GET /traveller-profiles/public/member/:memberPublicId
//   GET /traveller-profiles/public/handle/:handle
//
// These endpoints intentionally form a separate public read boundary from the
// broader authenticated/operational Traveller Profile API.
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { apiClient } from '@/foundation/http/api-client';


// -----------------------------------------------------------------------------
// Frontend Models
// -----------------------------------------------------------------------------

import type {
  PublicTraveller,
  PublicTravellerAvatar,
} from '../models';


// -----------------------------------------------------------------------------
// API Paths
// -----------------------------------------------------------------------------

const TRAVELLER_PROFILE_API_PATH = '/traveller-profiles';


// -----------------------------------------------------------------------------
// Backend Transport Types
// -----------------------------------------------------------------------------
//
// These interfaces represent the REST response shape rather than the
// frontend model.
//
// They remain local to this adapter so the rest of the frontend does not
// become coupled to backend presentation contracts.
// -----------------------------------------------------------------------------


/**
 * Public avatar representation returned by the backend.
 *
 * The backend public read boundary is responsible for resolving the Asset
 * reference into a browser-consumable URL.
 */
interface PublicTravellerAvatarResponse {
  publicId: string;
  url: string;
  alt: string | null;
}


/**
 * Deliberately reduced public Traveller Profile response.
 *
 * This is the transport contract exposed by the backend public Traveller
 * Profile endpoint.
 *
 * It deliberately excludes:
 *
 * - internal database identifiers;
 * - Member/Identity references;
 * - profile lifecycle state;
 * - visibility internals;
 * - profile preferences;
 * - journey statistics;
 * - private corridors;
 * - raw Asset references;
 * - operational metadata;
 * - timestamps.
 */
interface PublicTravellerResponse {
  publicId: string;
  handle: string;
  bio: string | null;
  avatar: PublicTravellerAvatarResponse | null;
  countryCode: string;
}


// -----------------------------------------------------------------------------
// Public Traveller Profile Queries
// -----------------------------------------------------------------------------

/**
 * Load a public Traveller Profile by its public profile identifier.
 *
 * Backend endpoint:
 *
 *   GET /traveller-profiles/public/:publicId
 *
 * This endpoint is specifically intended for unauthenticated public
 * consumption.
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
 * Backend endpoint:
 *
 *   GET /traveller-profiles/public/member/:memberPublicId
 *
 * This endpoint exists specifically for public consumers whose read model
 * contains the Member public identifier rather than the Traveller Profile
 * public identifier.
 *
 * This is useful when a public Journey, Journey Demand, Trust read model, or
 * another marketplace composition boundary references the traveller through
 * the opaque Member public identifier.
 *
 * The `/public/member` path is intentional. It keeps this request inside the
 * reduced public Traveller Profile read boundary and must not be replaced with
 * the broader `/member` endpoint.
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
 * Backend endpoint:
 *
 *   GET /traveller-profiles/public/handle/:handle
 *
 * This endpoint is specifically intended for anonymous public Traveller
 * Profile pages whose route is based on the traveller's human-readable handle.
 *
 * The public handle endpoint is intentionally separate from the broader:
 *
 *   GET /traveller-profiles/handle/:handle
 *
 * The broader endpoint belongs to the operational Traveller Profile API and
 * may expose a different, richer response contract. Public marketplace pages
 * must remain inside the reduced public read boundary.
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


// -----------------------------------------------------------------------------
// Public Traveller Profile Mapper
// -----------------------------------------------------------------------------

/**
 * Map the backend public Traveller Profile transport representation into the
 * frontend `PublicTraveller` model.
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
 *
 * The backend public boundary remains authoritative for the data that is
 * actually safe for public consumption.
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


// -----------------------------------------------------------------------------
// Public Traveller Avatar Mapper
// -----------------------------------------------------------------------------

/**
 * Map the backend public avatar representation into the frontend avatar model.
 *
 * The URL is supplied by the backend Asset delivery boundary.
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
