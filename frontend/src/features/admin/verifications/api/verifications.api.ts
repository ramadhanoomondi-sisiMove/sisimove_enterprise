
import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

import type {
  VerificationApiResponse,
} from "../types/verification-api.types";

/**
 * sisiMove — Admin Verifications API
 *
 * Transport adapter for verification aggregate reads, lifecycle actions,
 * and private verification evidence retrieval.
 *
 * Backend:
 * GET   /verifications/by-identity/:identityPublicId
 * GET   /verifications/:verificationPublicId
 * GET   /verifications/pending-count
 * GET   /verifications/review-queue
 * GET   /verifications/:verificationPublicId/requests/:verificationRequestPublicId/evidence
 * POST  /verifications
 * PATCH /verifications/:verificationPublicId/grant-member
 * PATCH /verifications/:verificationPublicId/grant-driver
 * PATCH /verifications/:verificationPublicId/reject
 * PATCH /verifications/:verificationPublicId/reopen
 * PATCH /verifications/:verificationPublicId/expire
 * PATCH /verifications/:verificationPublicId/revoke
 *
 * Required reviewer permission for protected reads/actions:
 * verification:read and action-specific permissions enforced by the backend.
 *
 * Keep this file focused on HTTP transport. Do not put business rules,
 * permission decisions, or response mapping here.
 */

export const verificationsApi = {
  async getByIdentityPublicId(
    identityPublicId: string,
    options: RequestOptions = {},
  ): Promise<VerificationApiResponse> {
    const id = encodeURIComponent(identityPublicId);

    return authenticatedApiClient.get<VerificationApiResponse>(
      `/verifications/by-identity/${id}`,
      options,
    );
  },

  async getByPublicId(
    verificationPublicId: string,
    options: RequestOptions = {},
  ): Promise<VerificationApiResponse> {
    const id = encodeURIComponent(verificationPublicId);

    return authenticatedApiClient.get<VerificationApiResponse>(
      `/verifications/${id}`,
      options,
    );
  },

  async getPendingCount(
    options: RequestOptions = {},
  ): Promise<number> {
    return authenticatedApiClient.get<number>(
      "/verifications/pending-count",
      options,
    );
  },

  async getReviewQueue(
    options: RequestOptions = {},
  ): Promise<VerificationApiResponse[]> {
    return authenticatedApiClient.get<VerificationApiResponse[]>(
      "/verifications/review-queue",
      options,
    );
  },

  /**
   * Retrieves private evidence associated with a verification request.
   *
   * The backend authorizes the reviewer and resolves the asset through
   * the specified verification request. The caller cannot supply an
   * arbitrary asset ID.
   *
   * Requires authenticatedApiClient to support Blob responses.
   */
  async getVerificationEvidence(
    verificationPublicId: string,
    verificationRequestPublicId: string,
    options: RequestOptions = {},
  ): Promise<Blob> {
    const verificationId = encodeURIComponent(verificationPublicId);
    const requestId = encodeURIComponent(verificationRequestPublicId);

    return authenticatedApiClient.get<Blob>(
      `/verifications/${verificationId}/requests/${requestId}/evidence`,
      options,
    );
  },

  async create(
    options: RequestOptions = {},
  ): Promise<VerificationApiResponse> {
    return authenticatedApiClient.post<VerificationApiResponse>(
      "/verifications",
      undefined,
      options,
    );
  },

  async grantMember(
    verificationPublicId: string,
    verificationRequestPublicId: string,
    options: RequestOptions = {},
  ): Promise<VerificationApiResponse> {
    const id = encodeURIComponent(verificationPublicId);

    return authenticatedApiClient.patch<VerificationApiResponse>(
      `/verifications/${id}/grant-member`,
      { verificationRequestPublicId },
      options,
    );
  },

  async grantDriver(
    verificationPublicId: string,
    verificationRequestPublicId: string,
    options: RequestOptions = {},
  ): Promise<VerificationApiResponse> {
    const id = encodeURIComponent(verificationPublicId);

    return authenticatedApiClient.patch<VerificationApiResponse>(
      `/verifications/${id}/grant-driver`,
      { verificationRequestPublicId },
      options,
    );
  },

  async reject(
    verificationPublicId: string,
    requestPublicId: string,
    reason: string,
    options: RequestOptions = {},
  ): Promise<VerificationApiResponse> {
    const id = encodeURIComponent(verificationPublicId);

    return authenticatedApiClient.patch<VerificationApiResponse>(
      `/verifications/${id}/reject`,
      { requestPublicId, reason },
      options,
    );
  },

  async reopen(
    verificationPublicId: string,
    options: RequestOptions = {},
  ): Promise<VerificationApiResponse> {
    const id = encodeURIComponent(verificationPublicId);

    return authenticatedApiClient.patch<VerificationApiResponse>(
      `/verifications/${id}/reopen`,
      undefined,
      options,
    );
  },

  async expire(
    verificationPublicId: string,
    options: RequestOptions = {},
  ): Promise<VerificationApiResponse> {
    const id = encodeURIComponent(verificationPublicId);

    return authenticatedApiClient.patch<VerificationApiResponse>(
      `/verifications/${id}/expire`,
      undefined,
      options,
    );
  },

  async revoke(
    verificationPublicId: string,
    reason: string,
    options: RequestOptions = {},
  ): Promise<VerificationApiResponse> {
    const id = encodeURIComponent(verificationPublicId);

    return authenticatedApiClient.patch<VerificationApiResponse>(
      `/verifications/${id}/revoke`,
      { reason },
      options,
    );
  },
};

export default verificationsApi;
