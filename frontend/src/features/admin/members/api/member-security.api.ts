
import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";

import type { IdentityResponseDto } from "../types/member-api.types";

import type {
  MemberSecurityIdentityStatus,
  MemberSecurityOverview,
} from "../models/member-security.model";

/**
 * Reads identity lifecycle information for the member security overview.
 *
 * Authentication, sessions, devices, and recovery data remain separate
 * aggregates and are not fabricated by this adapter.
 */
export const memberSecurityApi = {
  async getByIdentityPublicId(
    identityPublicId: string,
  ): Promise<MemberSecurityOverview | null> {
    const id = encodeURIComponent(identityPublicId);

    const identity =
      await authenticatedApiClient.get<IdentityResponseDto | null>(
        `/identities/${id}`,
      );

    if (identity === null) {
      return null;
    }

    const identityStatus: MemberSecurityIdentityStatus = {
      identityPublicId: identity.publicId,
      status:
        identity.status as MemberSecurityIdentityStatus["status"],
      activatedAt: identity.activatedAt,
      suspendedAt: identity.suspendedAt,
      closedAt: identity.closedAt,
      createdAt: identity.createdAt,
      updatedAt: identity.updatedAt,
    };

    return {
      identity: identityStatus,
    };
  },
};

export default memberSecurityApi;
