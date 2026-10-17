
import { authenticatedApiClient } from "@/features/authentication";
import type { RequestOptions } from "@/foundation/http";

/**
 * sisiMove — Verification Assets API
 *
 * Transport adapter for resolving public asset references and retrieving
 * private verification evidence.
 *
 * Public endpoint:
 * GET /assets/public/:assetPublicId/reference
 *
 * Private evidence endpoint:
 * GET /verifications/:verificationPublicId/requests/:verificationRequestPublicId/evidence
 *
 * Security:
 * - Public references are available only for public, usable assets.
 * - Private evidence must be accessed through the authenticated endpoint.
 * - The backend resolves the asset from the verification request.
 * - Never use the public asset endpoint to retrieve private evidence.
 */

export interface PublicAssetReferenceResponse {
  publicId: string;
  url: string;
}

/**
 * Public asset reference API.
 */
export const verificationAssetsApi = {
  async getPublicReference(
    assetPublicId: string,
    options: RequestOptions = {},
  ): Promise<PublicAssetReferenceResponse> {
    const id = encodeURIComponent(assetPublicId);

    return authenticatedApiClient.get<PublicAssetReferenceResponse>(
      `/assets/public/${id}/reference`,
      options,
    );
  },

  /**
   * Retrieves private evidence associated with a verification request.
   *
   * IMPORTANT:
   * The authenticated API client must support binary responses (Blob).
   * Do not JSON-parse the response body.
   */
  async getPrivateEvidence(
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
};

export default verificationAssetsApi;
