import { useQuery } from "@tanstack/react-query";

import { memberBookingsApi } from "../api/member-bookings.api";
import { membersKeys } from "../queries/members.keys";

/**
 * sisiMove — Admin Member Bookings hook
 *
 * Loads detailed bookings for the selected passenger using:
 * GET /journey-bookings/passenger/:passengerPublicId/detail
 *
 * Each result contains:
 * - booking: detailed booking, journey, provider, and payment information
 * - activitySummary: activity counts, or null
 *
 * The backend enforces the required booking:read permission.
 * The query stays disabled until a non-empty passenger public ID is provided.
 */
export function useMemberBookings(passengerPublicId: string) {
  const normalizedPassengerPublicId = passengerPublicId.trim();

  return useQuery({
    queryKey: membersKeys.bookings(normalizedPassengerPublicId),
    queryFn: () =>
      memberBookingsApi.getByPassengerPublicId(
        normalizedPassengerPublicId,
      ),
    enabled: normalizedPassengerPublicId.length > 0,
  });
}

export default useMemberBookings;
