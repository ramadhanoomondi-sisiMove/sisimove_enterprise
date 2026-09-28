// -----------------------------------------------------------------------------
// sisiMove — Journey Schedule Model
// -----------------------------------------------------------------------------
//
// Frontend read-model contract for a Journey schedule.
//
// This model mirrors the public/My Journey response projection rather than
// the JourneyScheduleEntity persistence model.
//
// Important:
// - departureAt is required;
// - arrivalAt is optional;
// - timezone is part of the backend contract and must be preserved;
// - publicId is the JourneySchedule public identifier;
// - dates are represented as ISO strings at the frontend HTTP boundary.
//
// The frontend does not recreate schedule validation or Journey aggregate
// mutation rules.
//
// -----------------------------------------------------------------------------

/**
 * Journey schedule read model.
 */
export interface JourneySchedule {
  /**
   * Public Journey schedule identifier.
   *
   * Internal persistence identifiers are intentionally not exposed.
   */
  readonly publicId: string;

  /**
   * Scheduled Journey departure time.
   *
   * Expected to be an ISO-8601 date-time string from the API.
   */
  readonly departureAt: string;

  /**
   * Optional scheduled arrival time.
   *
   * A Journey may legitimately have no arrival time.
   */
  readonly arrivalAt: string | null;

  /**
   * IANA timezone used for the Journey schedule.
   *
   * The backend currently defaults this to `Africa/Nairobi`.
   */
  readonly timezone: string;
}