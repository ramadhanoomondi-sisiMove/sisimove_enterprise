// src/domains/journey-booking/presentation/rest/mappers/journey-booking-detail-response.mapper.ts

// -----------------------------------------------------------------------------
// Journey Booking — Detail REST Response Mapper
// -----------------------------------------------------------------------------

import type { JourneyBookingDetailResponse } from '../../../application/responses/journey-booking-detail.response';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps the application Journey Booking detail response to the REST boundary.
 *
 * The application query handler composes:
 *
 * - Booking detail
 * - Journey detail
 * - Provider Traveller profile
 * - Provider Trust profile
 * - Journey activity summary
 *
 * This mapper performs no additional queries or domain logic.
 *
 * Activity counts are supplied by the application query handler and are
 * passed through unchanged.
 */
export class JourneyBookingDetailResponseMapper {
  // ===========================================================================
  // Response
  // ===========================================================================

  public static toResponse(
    response: JourneyBookingDetailResponse,
  ): JourneyBookingDetailResponse {
    return {
      booking: response.booking,
      activitySummary: response.activitySummary,
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyBookingDetailResponseMapper;
