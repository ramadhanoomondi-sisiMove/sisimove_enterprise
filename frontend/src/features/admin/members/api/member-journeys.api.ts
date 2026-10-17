
import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

/**
 * sisiMove — Admin Member Journeys API
 *
 * Transport adapter for reading detailed journeys belonging to a selected
 * journey provider.
 *
 * Backend:
 * GET /journeys/provider/:providerPublicId/detailed
 *
 * Required permission:
 * journey:read
 *
 * Keep the response as unknown until the backend response contract is
 * confirmed. Do not fabricate a JourneyResponse shape.
 */
export const memberJourneysApi = {
  async getByProviderPublicId(
    providerPublicId: string,
    options: RequestOptions = {},
  ): Promise<unknown[]> {
    const id = encodeURIComponent(providerPublicId);

    return authenticatedApiClient.get<unknown[]>(
      `/journeys/provider/${id}/detailed`,
      options,
    );
  },
};

export default memberJourneysApi;
