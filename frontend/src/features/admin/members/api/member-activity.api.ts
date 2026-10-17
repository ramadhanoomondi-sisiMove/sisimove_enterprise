
import { memberTrustApi } from "./member-trust.api";

import type { MemberTrustEvent } from "../models/member-trust.model";

export type MemberTrustActivityEvent = MemberTrustEvent;

export const memberActivityApi = {
  /**
   * Loads trust events for a member.
   *
   * Resolves the member to their trust profile first because the events
   * endpoint is keyed by trustProfileId.
   */
  async getTrustEventsByMemberPublicId(
    memberPublicId: string,
  ): Promise<MemberTrustActivityEvent[]> {
    const profile = await memberTrustApi.getByMemberPublicId(
      memberPublicId,
    );

    if (!profile) {
      return [];
    }

    return memberTrustApi.getEvents(profile.id);
  },
};

export default memberActivityApi;
