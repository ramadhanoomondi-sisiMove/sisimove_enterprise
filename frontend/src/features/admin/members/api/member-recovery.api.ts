import { authenticatedApiClient } from "../../../authentication/http/authenticated-api-client";

/**
 * Transport representation of RecoveryResponse.
 * Date fields are ISO-8601 strings after JSON serialization.
 * Recovery token hashes and raw recovery tokens are never exposed.
 */
export interface MemberRecoveryResponse {
  publicId: string;
  identityPublicId: string;
  type: string;
  status: string;
  hasRecoveryToken: boolean;
  requestedAt: string;
  expiresAt: string;
  isExpired: boolean;
  isUsable: boolean;
  isNotUsable: boolean;
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompleteMemberRecoveryRequest {
  completedAt: string;
  causationId?: string;
}

export interface CancelMemberRecoveryRequest {
  cancelledAt: string;
  causationId?: string;
}

export interface ExpireMemberRecoveryRequest {
  /** Evaluation timestamp; this is not the recovery's expiresAt value. */
  referenceDate: string;
  causationId?: string;
}

/**
 * API adapter for the Recovery aggregate.
 *
 * Scope limitation: GET /recoveries has no identity filter in its controller.
 * The backend application/query layer must enforce authorization and scope.
 * This adapter therefore does not pretend that the list is automatically
 * limited to a selected member. Confirm backend scope before showing results
 * in an admin-selected-member panel.
 */
export const memberRecoveryApi = {
  /** Lists recoveries accessible to the authenticated principal per backend scope. */
  async list(): Promise<MemberRecoveryResponse[]> {
    return authenticatedApiClient.get<MemberRecoveryResponse[]>("/recoveries");
  },

  /** Retrieves a recovery by public ID; backend authorization/scope applies. */
  async getByPublicId(
    recoveryPublicId: string,
  ): Promise<MemberRecoveryResponse | null> {
    return authenticatedApiClient.get<MemberRecoveryResponse | null>(
      `/recoveries/${encodeURIComponent(recoveryPublicId)}`,
    );
  },

  /** Completes a recovery; lifecycle eligibility and scope are enforced server-side. */
  async complete(
    recoveryPublicId: string,
    request: CompleteMemberRecoveryRequest,
  ): Promise<MemberRecoveryResponse> {
    return authenticatedApiClient.patch<MemberRecoveryResponse>(
      `/recoveries/${encodeURIComponent(recoveryPublicId)}/complete`,
      request,
    );
  },

  /** Cancels a recovery; lifecycle eligibility and scope are enforced server-side. */
  async cancel(
    recoveryPublicId: string,
    request: CancelMemberRecoveryRequest,
  ): Promise<MemberRecoveryResponse> {
    return authenticatedApiClient.patch<MemberRecoveryResponse>(
      `/recoveries/${encodeURIComponent(recoveryPublicId)}/cancel`,
      request,
    );
  },

  /** Evaluates expiry using the supplied reference date. */
  async expire(
    recoveryPublicId: string,
    request: ExpireMemberRecoveryRequest,
  ): Promise<MemberRecoveryResponse> {
    return authenticatedApiClient.patch<MemberRecoveryResponse>(
      `/recoveries/${encodeURIComponent(recoveryPublicId)}/expire`,
      request,
    );
  },
};

export default memberRecoveryApi;
