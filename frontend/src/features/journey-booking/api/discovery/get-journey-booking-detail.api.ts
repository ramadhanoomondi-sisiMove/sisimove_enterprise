
// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { authenticatedApiClient } from '@/features/authentication/http';

// -----------------------------------------------------------------------------
// Models
// -----------------------------------------------------------------------------

import type {
  JourneyBookingDetailResponse,
} from '../../models/journey-booking-detail';

// -----------------------------------------------------------------------------
// Response
// -----------------------------------------------------------------------------

/**
 * Response returned by the Journey Booking detail endpoint.
 *
 * Includes the detailed booking and the backend-provided Journey activity
 * summary. No client-side activity calculations are performed here.
 */
export type GetJourneyBookingDetailResponse =
  JourneyBookingDetailResponse;

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

/**
 * Fetches a Journey Booking by its public identifier.
 *
 * @param journeyBookingPublicId - Public identifier of the booking.
 * @returns Booking details and the associated activity summary.
 */
export async function getJourneyBookingDetail(
  journeyBookingPublicId: string,
): Promise<GetJourneyBookingDetailResponse> {
  const normalizedPublicId = journeyBookingPublicId.trim();

  if (!normalizedPublicId) {
    throw new TypeError(
      'A Journey Booking public identifier is required.',
    );
  }

  return authenticatedApiClient.get<GetJourneyBookingDetailResponse>(
    `/journey-bookings/${encodeURIComponent(normalizedPublicId)}/detail`,
  );
}
