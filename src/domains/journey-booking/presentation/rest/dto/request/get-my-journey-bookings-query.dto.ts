// -----------------------------------------------------------------------------
// Journey Booking — Get My Journey Bookings Query DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * Request query parameters for retrieving the authenticated passenger's
 * Journey Bookings.
 *
 * The passenger identity is intentionally not supplied by the client.
 * It must be resolved from the authenticated request/application context
 * and mapped to JourneyBookingPassengerPublicId before creating the query.
 *
 * The current GetMyJourneyBookingsQuery does not support client-supplied
 * filtering or pagination parameters, so this DTO intentionally contains
 * no request fields.
 */
export class GetMyJourneyBookingsQueryDto {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMyJourneyBookingsQueryDto;
