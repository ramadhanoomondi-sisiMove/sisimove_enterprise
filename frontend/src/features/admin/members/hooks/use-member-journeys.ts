
import { useQuery } from "@tanstack/react-query";

import { memberJourneysApi } from "../api/member-journeys.api";
import { membersKeys } from "../queries/members.keys";

/**
 * sisiMove — Admin Member Journeys hook
 *
 * Loads detailed journeys associated with the selected journey provider
 * public ID.
 *
 * Backend:
 * GET /journeys/provider/:providerPublicId/detailed
 *
 * The API response remains unknown[] until the backend response contract
 * is confirmed.
 *
 * A non-empty provider public ID enables the query. Authorization remains
 * enforced by the backend through the journey:read permission.
 */
export function useMemberJourneys(providerPublicId: string) {
  const normalizedProviderPublicId = providerPublicId.trim();

  return useQuery({
    queryKey: membersKeys.journeys(normalizedProviderPublicId),
    queryFn: () =>
      memberJourneysApi.getByProviderPublicId(normalizedProviderPublicId),
    enabled: normalizedProviderPublicId.length > 0,
  });
}

export default useMemberJourneys;
