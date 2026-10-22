/**
 * sisiMove — Trust Profiles API
 *
 * HTTP transport for Trust profile and profile-related reads.
 */

import {
  apiClient,
  type RequestOptions,
} from '@/foundation/http';

import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

import type {
  TrustEventApiResponse,
  TrustProfileApiResponse,
  TrustProfileBadgeApiResponse,
  TrustProfilesPageApiResponse,
  TrustRatingApiResponse,
  TrustReviewApiResponse,
} from '../types/trust.types';

// -----------------------------------------------------------------------------
// Public Marketplace Response
// -----------------------------------------------------------------------------

/**
 * Reduced public marketplace response.
 * This is deliberately not the full TrustProfileApiResponse.
 */
export interface PublicTrustProfileApiResponse {
  verificationLevel: string;
  ratingAverage: number;
  ratingCount: number;
  completedJourneys: number;
  badges: PublicTrustBadgeApiResponse[];
}

export interface PublicTrustBadgeApiResponse {
  publicId: string;
  type: string;
  name: string;
  description: string | null;
  asset: PublicTrustBadgeAssetApiResponse | null;
}

export interface PublicTrustBadgeAssetApiResponse {
  publicId: string;
  url: string;
  alt: string;
}

// -----------------------------------------------------------------------------
// Paginated Trust Profiles
// -----------------------------------------------------------------------------

export interface GetTrustProfilesPageParams {
  page?: number;
  pageSize?: number;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export const trustProfilesApi = {
  /**
   * GET /trust-profiles?page=1&pageSize=20
   *
   * Retrieves a page of Trust profile summaries without loading
   * full aggregates or nested collections.
   */
  getPage(
    params: GetTrustProfilesPageParams = {},
    options?: RequestOptions,
  ): Promise<TrustProfilesPageApiResponse> {
    const query = new URLSearchParams();

    if (params.page !== undefined) {
      query.set('page', String(params.page));
    }

    if (params.pageSize !== undefined) {
      query.set('pageSize', String(params.pageSize));
    }

    const queryString = query.toString();
    const path = queryString
      ? `/trust-profiles?${queryString}`
      : '/trust-profiles';

    return apiClient.get<TrustProfilesPageApiResponse>(
      path,
      options,
    );
  },

  /**
   * GET /trust-profiles/public/:publicId
   */
  getByPublicId(
    publicId: string,
    options?: RequestOptions,
  ): Promise<TrustProfileApiResponse | null> {
    return apiClient.get<TrustProfileApiResponse | null>(
      `/trust-profiles/public/${encodeURIComponent(publicId)}`,
      options,
    );
  },

  /**
   * GET /trust-profiles/public/member/:memberPublicId
   */
  getPublicByMemberPublicId(
    memberPublicId: string,
    options?: RequestOptions,
  ): Promise<PublicTrustProfileApiResponse> {
    return apiClient.get<PublicTrustProfileApiResponse>(
      `/trust-profiles/public/member/${encodeURIComponent(memberPublicId)}`,
      options,
    );
  },

  /**
   * GET /trust-profiles/member/:memberPublicId
   */
  getByMemberPublicId(
    memberPublicId: string,
    options?: RequestOptions,
  ): Promise<TrustProfileApiResponse | null> {
    return apiClient.get<TrustProfileApiResponse | null>(
      `/trust-profiles/member/${encodeURIComponent(memberPublicId)}`,
      options,
    );
  },

  /**
   * GET /trust-profiles/:trustProfileId/ratings
   */
  getRatings(
    trustProfileId: string,
    options?: RequestOptions,
  ): Promise<TrustRatingApiResponse[]> {
    return apiClient.get<TrustRatingApiResponse[]>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/ratings`,
      options,
    );
  },

  /**
   * GET /trust-profiles/:trustProfileId/ratings/:ratingId
   */
  getRating(
    trustProfileId: string,
    ratingId: string,
    options?: RequestOptions,
  ): Promise<TrustRatingApiResponse | null> {
    return apiClient.get<TrustRatingApiResponse | null>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/ratings/${encodeURIComponent(ratingId)}`,
      options,
    );
  },

  /**
   * GET /trust-profiles/:trustProfileId/reviews
   */
  getReviews(
    trustProfileId: string,
    options?: RequestOptions,
  ): Promise<TrustReviewApiResponse[]> {
    return apiClient.get<TrustReviewApiResponse[]>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/reviews`,
      options,
    );
  },

  /**
   * GET /trust-profiles/:trustProfileId/reviews/:reviewId
   */
  getReview(
    trustProfileId: string,
    reviewId: string,
    options?: RequestOptions,
  ): Promise<TrustReviewApiResponse | null> {
    return apiClient.get<TrustReviewApiResponse | null>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/reviews/${encodeURIComponent(reviewId)}`,
      options,
    );
  },

  /**
   * GET /trust-profiles/:trustProfileId/badges
   */
  getProfileBadges(
    trustProfileId: string,
    options?: RequestOptions,
  ): Promise<TrustProfileBadgeApiResponse[]> {
    return apiClient.get<TrustProfileBadgeApiResponse[]>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/badges`,
      options,
    );
  },

  /**
   * GET /trust-profiles/:trustProfileId/badges/:profileBadgeId
   */
  getProfileBadge(
    trustProfileId: string,
    profileBadgeId: string,
    options?: RequestOptions,
  ): Promise<TrustProfileBadgeApiResponse | null> {
    return apiClient.get<TrustProfileBadgeApiResponse | null>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/badges/${encodeURIComponent(profileBadgeId)}`,
      options,
    );
  },

  /**
   * GET /trust-profiles/:trustProfileId/events
   * Requires authentication and trust:read permission.
   */
  getEvents(
    trustProfileId: string,
    options?: RequestOptions,
  ): Promise<TrustEventApiResponse[]> {
    return authenticatedApiClient.get<TrustEventApiResponse[]>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/events`,
      options,
    );
  },
};
