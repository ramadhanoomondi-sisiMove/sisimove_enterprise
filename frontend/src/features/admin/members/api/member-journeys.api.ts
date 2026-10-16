
import { authenticatedApiClient } from "@/features/authentication/http/authenticated-api-client";
import type { RequestOptions } from "@/foundation/http";

/**
 * sisiMove — Admin Member Journeys API
 *
 * Transport adapter for reading journeys belonging to a selected member.
 *
 * Backend:
 * GET /journeys/provider/:providerPublicId
 *
 * Required permission:
 * journey:read
 *
 * The supplied controller currently returns JourneyAggregate[] from this
 * endpoint rather than an explicitly mapped frontend response DTO.
 * Keep the response as unknown until the backend response contract is
 * confirmed; do not fabricate a JourneyResponse shape.
 */
export const memberJourneysApi = {
  async getByProviderPublicId(
    providerPublicId: string,
    options: RequestOptions = {},
  ): Promise<unknown[]> {
    const id = encodeURIComponent(providerPublicId);

    return authenticatedApiClient.get<unknown[]>(
      `/journeys/provider/${id}`,
      options,
    );
  },
};

export default memberJourneysApi;
