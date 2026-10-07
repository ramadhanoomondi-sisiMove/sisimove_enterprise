// src/domains/journey-booking/presentation/rest/mappers/journey-booking-detail-response.mapper.ts

// -----------------------------------------------------------------------------
// Journey Booking — Detail REST Response Mapper
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Application Response
// -----------------------------------------------------------------------------

import type { JourneyBookingDetailResponse } from '../../../application/responses/journey-booking-detail.response';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps the application Journey Booking detail response to the REST boundary.
 *
 * The application query handler has already composed:
 *
 * - Journey
 * - Provider Traveller profile
 * - Provider Trust profile
 *
 * This mapper intentionally performs no additional queries or domain logic.
 */
export class JourneyBookingDetailResponseMapper {
  // ===========================================================================
  // Response
  // ===========================================================================

  public static toResponse(
    response: JourneyBookingDetailResponse,
  ): JourneyBookingDetailResponse {
    return response;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyBookingDetailResponseMapper;
