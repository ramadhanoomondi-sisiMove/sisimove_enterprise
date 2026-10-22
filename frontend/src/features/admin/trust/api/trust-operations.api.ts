
/**
 * sisiMove — Trust Operations API
 *
 * HTTP transport for Trust profile administration and moderation.
 *
 * This adapter does not enforce permissions or implement Trust business rules.
 * The backend remains responsible for authorization and validation.
 */

import type { RequestOptions } from '@/foundation/http';
import { authenticatedApiClient } from '@/features/authentication/http/authenticated-api-client';

import type { TrustProfileApiResponse } from '../types/trust.types';

// -----------------------------------------------------------------------------
// Request Contracts
// -----------------------------------------------------------------------------

export interface CreateTrustProfileRequest {
  memberPublicId: string;
}

export interface ChangeTrustProfileStatusRequest {
  status: string;
}

export interface GrantTrustVerificationRequest {
  verificationLevel: string;
}

export interface ReceiveTrustRatingRequest {
  ratingId: string;
  reviewerPublicId: string;
  revieweePublicId: string;
  journeyPublicId: string;
  bookingPublicId: string | null;
  role: string;
  score: number;
}

export interface ChangeTrustRatingScoreRequest {
  score: number;
}

export interface ModerateTrustRatingRequest {
  reason: string;
}

export interface CreateTrustReviewRequest {
  reviewId: string;
  ratingId: string;
  content: string;
}

export interface UpdateTrustReviewRequest {
  content: string;
}

export interface ModerateTrustReviewRequest {
  reason: string;
}

export interface AwardTrustBadgeRequest {
  badgeId: string;
  profileBadgeId: string;
}

export interface RevokeTrustBadgeRequest {
  reason: string;
}

export interface ApplyTrustJourneyCompletedRequest {
  journeyPublicId: string;
  role: string;
  bookingPublicId: string | null;
}

export interface ApplyTrustJourneyCancelledRequest {
  journeyPublicId: string;
  role: string;
  bookingPublicId: string | null;
  reason: string;
}

export interface ApplyTrustDisputeOpenedRequest {
  disputePublicId: string;
  journeyPublicId: string | null;
  bookingPublicId: string | null;
  actorPublicId: string | null;
  reason: string;
}

export interface ApplyTrustDisputeResolvedRequest {
  disputePublicId: string;
  journeyPublicId: string | null;
  bookingPublicId: string | null;
  actorPublicId: string | null;
  resolution: string;
}

export interface ApplyTrustManualAdjustmentRequest {
  actorPublicId: string;
  reason: string;
  adjustment: number;
  metadata: Record<string, unknown> | null;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

export const trustOperationsApi = {
  // ===========================================================================
  // Profile
  // ===========================================================================

  /**
   * POST /trust-profiles
   * Returns the created profile response.
   */
  createProfile(
    body: CreateTrustProfileRequest,
    options?: RequestOptions,
  ): Promise<TrustProfileApiResponse> {
    return authenticatedApiClient.post<TrustProfileApiResponse>(
      '/trust-profiles',
      body,
      options,
    );
  },

  /**
   * PATCH /trust-profiles/:trustProfileId/status
   * Backend returns no response body.
   */
  changeProfileStatus(
    trustProfileId: string,
    body: ChangeTrustProfileStatusRequest,
    options?: RequestOptions,
  ): Promise<void> {
    return authenticatedApiClient.patch<void>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/status`,
      body,
      options,
    );
  },

  // ===========================================================================
  // Verification
  // ===========================================================================

  /**
   * POST /trust-profiles/:trustProfileId/verification
   */
  grantVerification(
    trustProfileId: string,
    body: GrantTrustVerificationRequest,
    options?: RequestOptions,
  ): Promise<void> {
    return authenticatedApiClient.post<void>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/verification`,
      body,
      options,
    );
  },

  /**
   * PATCH /trust-profiles/:trustProfileId/verification/revoke
   */
  revokeVerification(
    trustProfileId: string,
    options?: RequestOptions,
  ): Promise<void> {
    return authenticatedApiClient.patch<void>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/verification/revoke`,
      undefined,
      options,
    );
  },

  // ===========================================================================
  // Ratings
  // ===========================================================================

  /**
   * POST /trust-profiles/:trustProfileId/ratings
   */
  receiveRating(
    trustProfileId: string,
    body: ReceiveTrustRatingRequest,
    options?: RequestOptions,
  ): Promise<void> {
    return authenticatedApiClient.post<void>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/ratings`,
      body,
      options,
    );
  },

  /**
   * PATCH /trust-profiles/:trustProfileId/ratings/:ratingId/score
   */
  changeRatingScore(
    trustProfileId: string,
    ratingId: string,
    body: ChangeTrustRatingScoreRequest,
    options?: RequestOptions,
  ): Promise<void> {
    return authenticatedApiClient.patch<void>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/ratings/${encodeURIComponent(ratingId)}/score`,
      body,
      options,
    );
  },

  /**
   * PATCH /trust-profiles/:trustProfileId/ratings/:ratingId/hide
   */
  hideRating(
    trustProfileId: string,
    ratingId: string,
    body: ModerateTrustRatingRequest,
    options?: RequestOptions,
  ): Promise<void> {
    return authenticatedApiClient.patch<void>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/ratings/${encodeURIComponent(ratingId)}/hide`,
      body,
      options,
    );
  },

  /**
   * PATCH /trust-profiles/:trustProfileId/ratings/:ratingId/remove
   */
  removeRating(
    trustProfileId: string,
    ratingId: string,
    body: ModerateTrustRatingRequest,
    options?: RequestOptions,
  ): Promise<void> {
    return authenticatedApiClient.patch<void>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/ratings/${encodeURIComponent(ratingId)}/remove`,
      body,
      options,
    );
  },

  /**
   * PATCH /trust-profiles/:trustProfileId/ratings/:ratingId/restore
   */
  restoreRating(
    trustProfileId: string,
    ratingId: string,
    options?: RequestOptions,
  ): Promise<void> {
    return authenticatedApiClient.patch<void>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/ratings/${encodeURIComponent(ratingId)}/restore`,
      undefined,
      options,
    );
  },

  // ===========================================================================
  // Reviews
  // ===========================================================================

  /**
   * POST /trust-profiles/:trustProfileId/reviews
   */
  createReview(
    trustProfileId: string,
    body: CreateTrustReviewRequest,
    options?: RequestOptions,
  ): Promise<void> {
    return authenticatedApiClient.post<void>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/reviews`,
      body,
      options,
    );
  },

  /**
   * PATCH /trust-profiles/:trustProfileId/reviews/:reviewId
   */
  updateReview(
    trustProfileId: string,
    reviewId: string,
    body: UpdateTrustReviewRequest,
    options?: RequestOptions,
  ): Promise<void> {
    return authenticatedApiClient.patch<void>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/reviews/${encodeURIComponent(reviewId)}`,
      body,
      options,
    );
  },

  /**
   * PATCH /trust-profiles/:trustProfileId/reviews/:reviewId/remove
   */
  removeReview(
    trustProfileId: string,
    reviewId: string,
    body: ModerateTrustReviewRequest,
    options?: RequestOptions,
  ): Promise<void> {
    return authenticatedApiClient.patch<void>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/reviews/${encodeURIComponent(reviewId)}/remove`,
      body,
      options,
    );
  },

  // ===========================================================================
  // Profile Badges
  // ===========================================================================

  /**
   * POST /trust-profiles/:trustProfileId/badges
   */
  awardBadge(
    trustProfileId: string,
    body: AwardTrustBadgeRequest,
    options?: RequestOptions,
  ): Promise<void> {
    return authenticatedApiClient.post<void>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/badges`,
      body,
      options,
    );
  },

  /**
   * PATCH /trust-profiles/:trustProfileId/badges/:profileBadgeId/revoke
   */
  revokeBadge(
    trustProfileId: string,
    profileBadgeId: string,
    body: RevokeTrustBadgeRequest,
    options?: RequestOptions,
  ): Promise<void> {
    return authenticatedApiClient.patch<void>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/badges/${encodeURIComponent(profileBadgeId)}/revoke`,
      body,
      options,
    );
  },

  // ===========================================================================
  // Journey Projections
  // ===========================================================================

  /**
   * POST /trust-profiles/:trustProfileId/journeys/completed
   */
  applyJourneyCompleted(
    trustProfileId: string,
    body: ApplyTrustJourneyCompletedRequest,
    options?: RequestOptions,
  ): Promise<void> {
    return authenticatedApiClient.post<void>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/journeys/completed`,
      body,
      options,
    );
  },

  /**
   * POST /trust-profiles/:trustProfileId/journeys/cancelled
   */
  applyJourneyCancelled(
    trustProfileId: string,
    body: ApplyTrustJourneyCancelledRequest,
    options?: RequestOptions,
  ): Promise<void> {
    return authenticatedApiClient.post<void>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/journeys/cancelled`,
      body,
      options,
    );
  },

  // ===========================================================================
  // Dispute Projections
  // ===========================================================================

  /**
   * POST /trust-profiles/:trustProfileId/disputes/opened
   */
  applyDisputeOpened(
    trustProfileId: string,
    body: ApplyTrustDisputeOpenedRequest,
    options?: RequestOptions,
  ): Promise<void> {
    return authenticatedApiClient.post<void>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/disputes/opened`,
      body,
      options,
    );
  },

  /**
   * POST /trust-profiles/:trustProfileId/disputes/resolved
   */
  applyDisputeResolved(
    trustProfileId: string,
    body: ApplyTrustDisputeResolvedRequest,
    options?: RequestOptions,
  ): Promise<void> {
    return authenticatedApiClient.post<void>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/disputes/resolved`,
      body,
      options,
    );
  },

  // ===========================================================================
  // Manual Adjustment
  // ===========================================================================

  /**
   * POST /trust-profiles/:trustProfileId/adjustments
   */
  applyManualAdjustment(
    trustProfileId: string,
    body: ApplyTrustManualAdjustmentRequest,
    options?: RequestOptions,
  ): Promise<void> {
    return authenticatedApiClient.post<void>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/adjustments`,
      body,
      options,
    );
  },
};
