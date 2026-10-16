import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";

/**
 * Response contract from:
 * GET /trust-profiles/:trustProfileId/events
 *
 * Dates are serialized as ISO strings by the HTTP transport.
 */
export interface MemberTrustActivityEvent {
  id: string;
  publicId: string;
  profileId: string;
  type: string;
  journeyPublicId: string | null;
  bookingPublicId: string | null;
  ratingPublicId: string | null;
  badgePublicId: string | null;
  disputePublicId: string | null;
  actorPublicId: string | null;
  reason: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

interface TrustProfileLookupResponse {
  id: string;
  publicId: string;
  memberPublicId: string;
}

export const memberActivityApi = {
  /**
   * Loads trust events for a member.
   *
   * The member public ID is resolved to a trust profile first because the
   * events endpoint is keyed by trustProfileId, not memberPublicId.
   *
   * Both requests use the authenticated API client. The events endpoint
   * requires the caller to have the `trust-profile:read` permission.
   */
  async getTrustEventsByMemberPublicId(
    memberPublicId: string,
  ): Promise<MemberTrustActivityEvent[]> {
    const memberId = encodeURIComponent(memberPublicId);

    const profile = await authenticatedApiClient.get<
      TrustProfileLookupResponse | null
    >(`/trust-profiles/member/${memberId}`);

    if (!profile) {
      return [];
    }

    const trustProfileId = encodeURIComponent(profile.id);

    return authenticatedApiClient.get<MemberTrustActivityEvent[]>(
      `/trust-profiles/${trustProfileId}/events`,
    );
  },
};

export default memberActivityApi;
