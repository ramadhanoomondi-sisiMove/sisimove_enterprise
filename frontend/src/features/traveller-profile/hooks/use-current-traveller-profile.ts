// -----------------------------------------------------------------------------
// sisiMove — Current Traveller Profile Hook
// -----------------------------------------------------------------------------
//
// React hook for consuming the authenticated current Traveller Profile read
// boundary.
//
// This hook is intentionally separate from `useTravellerProfile()`.
//
// Public Traveller:
//
//   useTravellerProfile()
//       ↓
//   Public Traveller Profile API
//       ↓
//   PublicTraveller
//
// Authenticated current Traveller:
//
//   useCurrentTravellerProfile()
//       ↓
//   GET /traveller-profiles/me
//       ↓
//   TravellerProfile
//
// The authenticated API determines the current Traveller from the access
// token. The frontend therefore never supplies:
//
// - identityPublicId;
// - memberPublicId;
// - travellerProfilePublicId;
// - travellerHandle.
//
// The backend resolves the current Identity and uses its public identifier
// to locate TravellerProfile.
//
// Responsibilities:
//
// - expose the authenticated TravellerProfile as TanStack Query state;
// - provide a stable query key;
// - keep HTTP concerns inside the API adapter;
// - keep server state outside presentation components.
//
// This hook does not:
//
// - access the backend directly;
// - construct Asset URLs;
// - know backend transport DTOs;
// - access Prisma/domain entities;
// - infer the current Traveller from AuthSession;
// - contain Traveller Profile business rules.
//
// -----------------------------------------------------------------------------

'use client';


// -----------------------------------------------------------------------------
// TanStack Query
// -----------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';


// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

import {
  getCurrentTravellerProfile,
} from '../api';


// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

import type {
  TravellerProfile,
} from '../models';


// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

const CURRENT_TRAVELLER_PROFILE_QUERY_KEY = [
  'traveller-profile',
  'me',
] as const;


// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Consume the Traveller Profile belonging to the currently authenticated
 * Identity.
 *
 * The backend resolves the current Traveller from the authenticated access
 * token:
 *
 *   Access Token
 *        ↓
 *   JwtAuthGuard
 *        ↓
 *   identityPublicId
 *        ↓
 *   TravellerProfile.memberPublicId
 *        ↓
 *   TravellerProfile
 *
 * No frontend identity identifier is required.
 *
 * Unlike the public Traveller hook, this hook returns the authenticated
 * TravellerProfile model.
 *
 * This distinction is important because authenticated profile surfaces may
 * legitimately consume authenticated-only profile fields such as:
 *
 * - memberPublicId;
 * - avatarAssetPublicId;
 * - preferences;
 * - corridors;
 * - materialized journey statistics;
 * - lifecycle status;
 * - visibility;
 * - audit timestamps.
 */
export function useCurrentTravellerProfile() {
  return useQuery<TravellerProfile | null, Error>({
    queryKey: CURRENT_TRAVELLER_PROFILE_QUERY_KEY,

    queryFn: getCurrentTravellerProfile,

    staleTime: 5 * 60 * 1000,
  });
}


export default useCurrentTravellerProfile;