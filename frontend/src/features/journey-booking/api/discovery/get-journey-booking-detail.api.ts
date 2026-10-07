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
 * The API response is already aligned with the feature detail model.
 * The mapper layer remains responsible for converting transport data into
 * feature-specific application/view models when the representations diverge.
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
 * @returns The detailed Journey Booking response.
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
