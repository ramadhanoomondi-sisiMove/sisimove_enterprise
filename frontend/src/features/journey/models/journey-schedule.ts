// -----------------------------------------------------------------------------
// sisiMove — Journey Schedule Model
// -----------------------------------------------------------------------------
//
// Frontend representation of a Journey schedule exposed by the Journey HTTP
// API.
//
// A schedule defines when a Journey departs and, when known, when it is
// expected to arrive.
//
// Internal database identifiers are intentionally excluded. The frontend uses
// the public schedule identifier exposed by the API.
//
// -----------------------------------------------------------------------------

/**
 * Journey schedule.
 */
export interface JourneySchedule {
  /**
   * Public identifier of the schedule.
   */
  publicId: string;

  /**
   * Journey departure timestamp.
   *
   * Expected to be an ISO-8601 timestamp returned by the API.
   */
  departureAt: string;

  /**
   * Expected arrival timestamp, when provided.
   *
   * The backend allows this value to be absent.
   */
  arrivalAt?: string | null;

  /**
   * IANA timezone used to interpret the schedule timestamps.
   *
   * The backend defaults this to `Africa/Nairobi`.
   */
  timezone: string;

  /**
   * Creation timestamp returned by the API, when available.
   */
  createdAt?: string;

  /**
   * Last update timestamp returned by the API, when available.
   */
  updatedAt?: string;
}