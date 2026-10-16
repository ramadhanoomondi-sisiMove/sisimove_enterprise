import { useQuery } from "@tanstack/react-query";

import { memberJourneysApi } from "../api/member-journeys.api";
import { membersKeys } from "../queries/members.keys";

/**
 * sisiMove — Admin Member Journeys hook
 *
 * Loads journeys associated with the selected member/provider public ID.
 * The API currently returns unknown[] because the backend controller's
 * JourneyAggregate response has not yet been confirmed as a frontend DTO.
 *
 * The backend enforces the required journey:read permission. A non-empty ID
 * enables the query; this hook does not grant permissions or bypass access
 * control.
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
