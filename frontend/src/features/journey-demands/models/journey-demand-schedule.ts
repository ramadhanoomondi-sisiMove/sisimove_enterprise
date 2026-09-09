// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Schedule
// -----------------------------------------------------------------------------
//
// Frontend representation of the requested travel time window.
//
// The API returns ISO-8601 datetime strings. The frontend should treat these
// values as transport representations and use shared date formatters for
// presentation.
//
// -----------------------------------------------------------------------------

export interface JourneyDemandSchedule {
  /**
   * Public identifier of the schedule record.
   */
  publicId: string;

  /**
   * Earliest acceptable departure time.
   *
   * ISO-8601 datetime string.
   */
  earliestDeparture: string;

  /**
   * Latest acceptable departure time.
   *
   * ISO-8601 datetime string.
   */
  latestDeparture: string;

  /**
   * Preferred arrival time.
   *
   * Null when no preferred arrival time was specified.
   */
  targetArrival: string | null;

  /**
   * Latest acceptable arrival time.
   *
   * Null when no maximum arrival time was specified.
   */
  maximumArrival: string | null;

  /**
   * IANA timezone used to interpret the schedule.
   *
   * Example: Africa/Nairobi.
   */
  timezone: string;
}