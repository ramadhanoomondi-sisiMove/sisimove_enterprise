import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";

import type { MemberVerification } from "../models/member-verification.model";

/**
 * Request body accepted by the grant-member and grant-driver endpoints.
 *
 * The backend uses this request public ID to identify the reviewed evidence
 * request. It is not the identity public ID or verification public ID.
 */
export interface GrantVerificationRequest {
  verificationRequestPublicId: string;
}

/**
 * Verification API operations used by the admin members feature.
 *
 * Backend contract:
 * - GET /verifications/by-identity/:identityPublicId looks up verification
 *   using the owning Identity public ID. This requires the backend controller
 *   endpoint to be installed and deployed.
 * - GET /verifications/:verificationPublicId expects a Verification public ID.
 * - Grant operations require reviewer permissions enforced by the backend.
 * - Approving a request and granting aggregate verification are separate actions.
 */
export const memberVerificationApi = {
  /**
   * Fetch the Verification aggregate associated with an Identity public ID.
   * GET /verifications/by-identity/:identityPublicId
   *
   * Requires the backend by-identity endpoint to be installed.
   */
  getByIdentityPublicId(identityPublicId: string): Promise<MemberVerification> {
    const id = encodeURIComponent(identityPublicId);

    return authenticatedApiClient.get<MemberVerification>(
      `/verifications/by-identity/${id}`,
    );
  },

  /**
   * Fetch a Verification aggregate by its own public ID.
   * GET /verifications/:verificationPublicId
   */
  getByPublicId(verificationPublicId: string): Promise<MemberVerification> {
    const id = encodeURIComponent(verificationPublicId);

    return authenticatedApiClient.get<MemberVerification>(`/verifications/${id}`);
  },

  /**
   * Fetch the number of pending Verification aggregates.
   * GET /verifications/pending-count
   */
  getPendingCount(): Promise<number> {
    return authenticatedApiClient.get<number>("/verifications/pending-count");
  },

  /**
   * Grant MEMBER verification after the relevant request has been reviewed.
   * PATCH /verifications/:verificationPublicId/grant-member
   */
  grantMember(
    verificationPublicId: string,
    request: GrantVerificationRequest,
  ): Promise<MemberVerification> {
    const id = encodeURIComponent(verificationPublicId);

    return authenticatedApiClient.patch<MemberVerification>(
      `/verifications/${id}/grant-member`,
      request,
    );
  },

  /**
   * Grant DRIVER verification after the relevant request has been reviewed.
   * PATCH /verifications/:verificationPublicId/grant-driver
   */
  grantDriver(
    verificationPublicId: string,
    request: GrantVerificationRequest,
  ): Promise<MemberVerification> {
    const id = encodeURIComponent(verificationPublicId);

    return authenticatedApiClient.patch<MemberVerification>(
      `/verifications/${id}/grant-driver`,
      request,
    );
  },
};

export default memberVerificationApi;
