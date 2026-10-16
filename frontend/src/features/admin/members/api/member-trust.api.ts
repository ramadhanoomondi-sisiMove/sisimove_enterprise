import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";

import type {
  MemberTrustProfile,
  MemberTrustRating,
  MemberTrustReview,
  MemberTrustBadge,
  MemberTrustEvent,
} from "../models/member-trust.model";

/**
 * Trust Profile API adapter for the admin members feature.
 *
 * Routes are based on TrustProfileController:
 * - GET /trust-profiles/member/:memberPublicId
 * - GET /trust-profiles/:trustProfileId/ratings
 * - GET /trust-profiles/:trustProfileId/reviews
 * - GET /trust-profiles/:trustProfileId/badges
 * - GET /trust-profiles/:trustProfileId/events
 *
 * This adapter is read-only. Trust mutations require separate methods and
 * explicit permission-aware UI flows.
 */
export const memberTrustApi = {
  /**
   * Retrieve the Trust Profile belonging to a member.
   * Returns null when no Trust Profile exists.
   */
  getByMemberPublicId(
    memberPublicId: string,
  ): Promise<MemberTrustProfile | null> {
    return authenticatedApiClient.get<MemberTrustProfile | null>(
      `/trust-profiles/member/${encodeURIComponent(memberPublicId)}`,
    );
  },

  /**
   * Retrieve ratings for a Trust Profile.
   */
  getRatings(
    trustProfileId: string,
  ): Promise<MemberTrustRating[]> {
    return authenticatedApiClient.get<MemberTrustRating[]>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/ratings`,
    );
  },

  /**
   * Retrieve reviews for a Trust Profile.
   */
  getReviews(
    trustProfileId: string,
  ): Promise<MemberTrustReview[]> {
    return authenticatedApiClient.get<MemberTrustReview[]>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/reviews`,
    );
  },

  /**
   * Retrieve awarded badges for a Trust Profile.
   */
  getBadges(
    trustProfileId: string,
  ): Promise<MemberTrustBadge[]> {
    return authenticatedApiClient.get<MemberTrustBadge[]>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/badges`,
    );
  },

  /**
   * Retrieve trust events for a Trust Profile.
   */
  getEvents(
    trustProfileId: string,
  ): Promise<MemberTrustEvent[]> {
    return authenticatedApiClient.get<MemberTrustEvent[]>(
      `/trust-profiles/${encodeURIComponent(trustProfileId)}/events`,
    );
  },
};

export default memberTrustApi;
