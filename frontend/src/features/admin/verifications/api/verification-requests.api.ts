
import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

import type {
  VerificationRequestResponse,
} from "../types/verification-request.types";

/**
 * sisiMove — Verification Requests API
 *
 * Transport adapter for verification request operations.
 *
 * Backend:
 * GET   /verifications/:verificationPublicId/requests
 * GET   /verifications/:verificationPublicId/requests/:verificationRequestPublicId
 * GET   /verifications/:verificationPublicId/requests/:verificationRequestPublicId/evidence
 * PATCH /verifications/:verificationPublicId/requests/:verificationRequestPublicId/approve
 * PATCH /verifications/:verificationPublicId/requests/:verificationRequestPublicId/reject
 * PATCH /verifications/:verificationPublicId/requests/:verificationRequestPublicId/cancel
 *
 * Request approval accepts submitted evidence. It does not grant
 * aggregate-level MEMBER or DRIVER verification.
 *
 * Private evidence is retrieved through a dedicated authenticated endpoint.
 * Backend authorization remains authoritative.
 */

export const verificationRequestsApi = {
  async getByVerificationPublicId(
    verificationPublicId: string,
    options: RequestOptions = {},
  ): Promise<VerificationRequestResponse[]> {
    const id = encodeURIComponent(verificationPublicId);

    return authenticatedApiClient.get<VerificationRequestResponse[]>(
      `/verifications/${id}/requests`,
      options,
    );
  },

  async getByPublicId(
    verificationPublicId: string,
    verificationRequestPublicId: string,
    options: RequestOptions = {},
  ): Promise<VerificationRequestResponse | null> {
    const verificationId = encodeURIComponent(verificationPublicId);
    const requestId = encodeURIComponent(verificationRequestPublicId);

    return authenticatedApiClient.get<VerificationRequestResponse | null>(
      `/verifications/${verificationId}/requests/${requestId}`,
      options,
    );
  },

  /**
   * Retrieves private evidence for a verification request.
   *
   * Requests a Blob response from the foundation ApiClient so binary
   * evidence is not incorrectly parsed as text or JSON.
   *
   * Access control remains enforced by the backend endpoint.
   */
  async getEvidence(
    verificationPublicId: string,
    verificationRequestPublicId: string,
    options: RequestOptions = {},
  ): Promise<Blob> {
    const verificationId = encodeURIComponent(verificationPublicId);
    const requestId = encodeURIComponent(verificationRequestPublicId);

    return authenticatedApiClient.get<Blob>(
      `/verifications/${verificationId}/requests/${requestId}/evidence`,
      {
        ...options,
        responseType: "blob",
      },
    );
  },

  async approve(
    verificationPublicId: string,
    verificationRequestPublicId: string,
    options: RequestOptions = {},
  ): Promise<VerificationRequestResponse> {
    const verificationId = encodeURIComponent(verificationPublicId);
    const requestId = encodeURIComponent(verificationRequestPublicId);

    return authenticatedApiClient.patch<VerificationRequestResponse>(
      `/verifications/${verificationId}/requests/${requestId}/approve`,
      undefined,
      options,
    );
  },

  async reject(
    verificationPublicId: string,
    verificationRequestPublicId: string,
    reason: string,
    options: RequestOptions = {},
  ): Promise<VerificationRequestResponse> {
    const verificationId = encodeURIComponent(verificationPublicId);
    const requestId = encodeURIComponent(verificationRequestPublicId);

    return authenticatedApiClient.patch<VerificationRequestResponse>(
      `/verifications/${verificationId}/requests/${requestId}/reject`,
      { reason },
      options,
    );
  },

  async cancel(
    verificationPublicId: string,
    verificationRequestPublicId: string,
    options: RequestOptions = {},
  ): Promise<VerificationRequestResponse> {
    const verificationId = encodeURIComponent(verificationPublicId);
    const requestId = encodeURIComponent(verificationRequestPublicId);

    return authenticatedApiClient.patch<VerificationRequestResponse>(
      `/verifications/${verificationId}/requests/${requestId}/cancel`,
      undefined,
      options,
    );
  },
};

export default verificationRequestsApi;
