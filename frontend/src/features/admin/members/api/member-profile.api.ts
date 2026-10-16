import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";

import type { MemberProfile } from "../models/member-profile.model";

/**
 * Traveller Profile API operations used by the admin members feature.
 *
 * These routes are taken from TravellerProfileController:
 * - GET /traveller-profiles/member/:memberPublicId
 * - GET /traveller-profiles/public/:publicId
 *
 * The repository contract confirms that a Traveller Profile belongs to a
 * Member through memberPublicId. The API adapter does not access repositories
 * or persistence directly.
 */
export const memberProfileApi = {
  /**
   * Fetch the Traveller Profile associated with a Member/Identity public ID.
   *
   * GET /traveller-profiles/member/:memberPublicId
   *
   * The backend controller returns the mapped profile response, or null when
   * the member has no Traveller Profile.
   */
  getByMemberPublicId(
    memberPublicId: string,
  ): Promise<MemberProfile | null> {
    const id = encodeURIComponent(memberPublicId);

    return authenticatedApiClient.get<MemberProfile | null>(
      `/traveller-profiles/member/${id}`,
    );
  },

  /**
   * Fetch a Traveller Profile by its own public ID.
   *
   * GET /traveller-profiles/public/:publicId
   *
   * This is a separate identifier from memberPublicId.
   */
  getByPublicId(publicId: string): Promise<MemberProfile | null> {
    const id = encodeURIComponent(publicId);

    return authenticatedApiClient.get<MemberProfile | null>(
      `/traveller-profiles/public/${id}`,
    );
  },
};

export default memberProfileApi;
