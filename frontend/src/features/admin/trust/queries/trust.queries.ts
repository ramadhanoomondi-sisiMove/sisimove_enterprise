/**
 * sisiMove — Trust Queries
 *
 * React Query hooks for reading paginated Trust profiles, individual
 * Trust profiles, ratings, reviews, badge assignments, trust events,
 * and badge definitions.
 */

import { useQuery } from '@tanstack/react-query';

import {
  trustBadgesApi,
  trustProfilesApi,
} from '../api';

import {
  TrustProfileModelMapper,
  TrustProfileSummaryModelMapper,
} from '../models';

import { trustKeys } from './trust.keys';

// -----------------------------------------------------------------------------
// Trust profiles
// -----------------------------------------------------------------------------

/**
 * Retrieves a paginated collection of Trust profile summaries.
 *
 * The API response is mapped to frontend summary models before it is
 * exposed to consuming components.
 *
 * The page and page size are included in the query key so each page
 * has its own cache entry.
 */
export function useTrustProfilesPage(
  page = 1,
  pageSize = 20,
) {
  return useQuery({
    queryKey: trustKeys.profilePage(page, pageSize),
    queryFn: async () => {
      const response = await trustProfilesApi.getPage({
        page,
        pageSize,
      });

      return {
        ...response,
        profiles: TrustProfileSummaryModelMapper.fromApiList(
          response.profiles,
        ),
      };
    },
  });
}

export function useTrustProfile(publicId: string) {
  return useQuery({
    queryKey: trustKeys.profile(publicId),
    queryFn: async () => {
      const response = await trustProfilesApi.getByPublicId(publicId);

      return response === null
        ? null
        : TrustProfileModelMapper.fromApi(response);
    },
    enabled: publicId.trim().length > 0,
  });
}

export function useTrustProfileByMember(memberPublicId: string) {
  return useQuery({
    queryKey: trustKeys.profileByMember(memberPublicId),
    queryFn: async () => {
      const response =
        await trustProfilesApi.getByMemberPublicId(memberPublicId);

      return response === null
        ? null
        : TrustProfileModelMapper.fromApi(response);
    },
    enabled: memberPublicId.trim().length > 0,
  });
}

export function usePublicTrustProfileByMember(
  memberPublicId: string,
) {
  return useQuery({
    queryKey: trustKeys.publicProfileByMember(memberPublicId),
    queryFn: () =>
      trustProfilesApi.getPublicByMemberPublicId(memberPublicId),
    enabled: memberPublicId.trim().length > 0,
  });
}

// -----------------------------------------------------------------------------
// Ratings
// -----------------------------------------------------------------------------

export function useTrustRatings(profileId: string) {
  return useQuery({
    queryKey: trustKeys.ratings(profileId),
    queryFn: () => trustProfilesApi.getRatings(profileId),
    enabled: profileId.trim().length > 0,
  });
}

export function useTrustRating(
  profileId: string,
  ratingId: string,
) {
  return useQuery({
    queryKey: trustKeys.rating(profileId, ratingId),
    queryFn: () =>
      trustProfilesApi.getRating(profileId, ratingId),
    enabled:
      profileId.trim().length > 0 &&
      ratingId.trim().length > 0,
  });
}

// -----------------------------------------------------------------------------
// Reviews
// -----------------------------------------------------------------------------

export function useTrustReviews(profileId: string) {
  return useQuery({
    queryKey: trustKeys.reviews(profileId),
    queryFn: () => trustProfilesApi.getReviews(profileId),
    enabled: profileId.trim().length > 0,
  });
}

export function useTrustReview(
  profileId: string,
  reviewId: string,
) {
  return useQuery({
    queryKey: trustKeys.review(profileId, reviewId),
    queryFn: () =>
      trustProfilesApi.getReview(profileId, reviewId),
    enabled:
      profileId.trim().length > 0 &&
      reviewId.trim().length > 0,
  });
}

// -----------------------------------------------------------------------------
// Profile badge assignments
// -----------------------------------------------------------------------------

export function useTrustProfileBadges(profileId: string) {
  return useQuery({
    queryKey: trustKeys.profileBadges(profileId),
    queryFn: () =>
      trustProfilesApi.getProfileBadges(profileId),
    enabled: profileId.trim().length > 0,
  });
}

export function useTrustProfileBadge(
  profileId: string,
  profileBadgeId: string,
) {
  return useQuery({
    queryKey: trustKeys.profileBadge(profileId, profileBadgeId),
    queryFn: () =>
      trustProfilesApi.getProfileBadge(profileId, profileBadgeId),
    enabled:
      profileId.trim().length > 0 &&
      profileBadgeId.trim().length > 0,
  });
}

// -----------------------------------------------------------------------------
// Trust events
// -----------------------------------------------------------------------------

export function useTrustEvents(profileId: string) {
  return useQuery({
    queryKey: trustKeys.events(profileId),
    queryFn: () => trustProfilesApi.getEvents(profileId),
    enabled: profileId.trim().length > 0,
  });
}

// -----------------------------------------------------------------------------
// Badge definitions
// -----------------------------------------------------------------------------

export function useActiveTrustBadges() {
  return useQuery({
    queryKey: trustKeys.activeBadges(),
    queryFn: () => trustBadgesApi.getActive(),
  });
}

export function useTrustBadge(publicId: string) {
  return useQuery({
    queryKey: trustKeys.badge(publicId),
    queryFn: () => trustBadgesApi.getByPublicId(publicId),
    enabled: publicId.trim().length > 0,
  });
}

export function useTrustBadgeByName(name: string) {
  return useQuery({
    queryKey: trustKeys.badgeByName(name),
    queryFn: () => trustBadgesApi.getByName(name),
    enabled: name.trim().length > 0,
  });
}

export function useTrustBadgesByType(type: string) {
  return useQuery({
    queryKey: trustKeys.badgesByType(type),
    queryFn: () => trustBadgesApi.getByType(type),
    enabled: type.trim().length > 0,
  });
}

export function useTrustBadgesByAsset(assetPublicId: string) {
  return useQuery({
    queryKey: trustKeys.badgesByAsset(assetPublicId),
    queryFn: () =>
      trustBadgesApi.getByAssetPublicId(assetPublicId),
    enabled: assetPublicId.trim().length > 0,
  });
}
