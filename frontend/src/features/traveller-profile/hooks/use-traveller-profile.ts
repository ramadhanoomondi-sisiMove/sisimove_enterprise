// -----------------------------------------------------------------------------
// sisiMove — Public Traveller Profile Hook
// -----------------------------------------------------------------------------
//
// React hook for consuming the public Traveller Profile read boundary.
//
// Responsibilities:
//
// - expose a TanStack Query for a public Traveller Profile;
// - select the appropriate public API operation;
// - provide stable query-key semantics;
// - avoid duplicating HTTP or transport mapping logic;
// - keep server state outside presentation components.
//
// Architecture:
//
//   Component
//       ↓
//   useTravellerProfile()
//       ↓
//   TanStack Query
//       ↓
//   Traveller Profile API
//       ↓
//   PublicTraveller
//
// This hook consumes only the frontend-safe `PublicTraveller` model.
//
// It does not:
//
// - access the backend directly;
// - construct Asset URLs;
// - know backend response DTOs;
// - access Prisma/domain entities;
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
  getTravellerProfileByHandle,
  getTravellerProfileByMemberPublicId,
  getTravellerProfileByPublicId,
} from '../api';


// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

import type { PublicTraveller } from '../models';


// -----------------------------------------------------------------------------
// Query Key
// -----------------------------------------------------------------------------

const TRAVELLER_PROFILE_QUERY_KEY = 'traveller-profile';


// -----------------------------------------------------------------------------
// Query Parameters
// -----------------------------------------------------------------------------

export interface UseTravellerProfileOptions {
  /**
   * Public Traveller Profile identifier.
   *
   * When supplied, the hook loads the profile directly by its public profile
   * identifier.
   */
  readonly publicId?: string;

  /**
   * Member public identifier.
   *
   * When supplied, the hook resolves the associated public Traveller Profile.
   */
  readonly memberPublicId?: string;

  /**
   * Public Traveller handle.
   *
   * When supplied, the hook loads the public Traveller Profile through the
   * public handle endpoint.
   *
   * This is the lookup used by public Traveller Profile routes such as:
   *
   *   /travellers/:handle
   */
  readonly handle?: string;

  /**
   * Controls whether the query is allowed to execute.
   *
   * This can be used by parent components when the identifier becomes
   * available asynchronously.
   */
  readonly enabled?: boolean;
}


// -----------------------------------------------------------------------------
// Lookup Type
// -----------------------------------------------------------------------------

type TravellerProfileLookupType =
  | 'public-id'
  | 'member-public-id'
  | 'handle';


// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Consume a public Traveller Profile.
 *
 * The hook supports the three public lookup paths exposed by the feature API:
 *
 *   - Traveller Profile public ID;
 *   - Member public ID;
 *   - Traveller handle.
 *
 * When more than one identifier is supplied, the lookup precedence is:
 *
 *   publicId → memberPublicId → handle
 *
 * This keeps query selection deterministic while allowing callers to provide
 * whichever public reference is available in their read model.
 */
export function useTravellerProfile(
  options: UseTravellerProfileOptions,
) {
  const normalizedPublicId =
    options.publicId?.trim() ?? '';

  const normalizedMemberPublicId =
    options.memberPublicId?.trim() ?? '';

  const normalizedHandle =
    options.handle?.trim() ?? '';

  const hasPublicId =
    normalizedPublicId.length > 0;

  const hasMemberPublicId =
    normalizedMemberPublicId.length > 0;

  const hasHandle =
    normalizedHandle.length > 0;

  // ---------------------------------------------------------------------------
  // Deterministic lookup selection
  // ---------------------------------------------------------------------------
  //
  // Public profile ID has highest precedence, followed by member public ID,
  // followed by handle.
  //
  // `lookupType` and `lookupValue` are derived together so the query key and
  // query function always describe the same lookup operation.
  //
  // ---------------------------------------------------------------------------

  const lookupType: TravellerProfileLookupType | null =
    hasPublicId
      ? 'public-id'
      : hasMemberPublicId
        ? 'member-public-id'
        : hasHandle
          ? 'handle'
          : null;

  const lookupValue =
    hasPublicId
      ? normalizedPublicId
      : hasMemberPublicId
        ? normalizedMemberPublicId
        : normalizedHandle;

  const enabled =
    options.enabled !== false &&
    lookupType !== null &&
    lookupValue.length > 0;

  return useQuery<PublicTraveller | null, Error>({
    // -------------------------------------------------------------------------
    // Query key
    // -------------------------------------------------------------------------
    //
    // The lookup type is part of the key intentionally.
    //
    // These are different server queries:
    //
    //   ['traveller-profile', 'handle', 'ramadhan']
    //   ['traveller-profile', 'member-public-id', 'MEM-123']
    //
    // Even if they ultimately resolve to the same Traveller Profile, TanStack
    // Query should not be forced to treat the two lookup boundaries as the
    // same request.
    //
    // -------------------------------------------------------------------------

    queryKey: [
      TRAVELLER_PROFILE_QUERY_KEY,
      lookupType,
      lookupValue,
    ],

    // -------------------------------------------------------------------------
    // Query function
    // -------------------------------------------------------------------------
    //
    // The API layer owns transport details and response mapping. The hook only
    // selects the appropriate public API operation.
    //
    // -------------------------------------------------------------------------

    queryFn: () => {
      if (hasPublicId) {
        return getTravellerProfileByPublicId(
          normalizedPublicId,
        );
      }

      if (hasMemberPublicId) {
        return getTravellerProfileByMemberPublicId(
          normalizedMemberPublicId,
        );
      }

      return getTravellerProfileByHandle(
        normalizedHandle,
      );
    },

    enabled,

    staleTime: 5 * 60 * 1000,
  });
}


export default useTravellerProfile;