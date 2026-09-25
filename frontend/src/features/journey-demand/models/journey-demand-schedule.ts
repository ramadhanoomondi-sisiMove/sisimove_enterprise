// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Schedule
// -----------------------------------------------------------------------------
//
// Presentation/API model for the flexible departure/arrival window requested
// by a traveller.
//
// Date values are ISO-8601 strings at the API boundary.
//
// -----------------------------------------------------------------------------

export interface JourneyDemandSchedule {
  /**
   * Public identifier of the schedule.
   */
  publicId: string;

  /**
   * Earliest acceptable departure.
   */
  earliestDeparture: string;

  /**
   * Latest acceptable departure.
   */
  latestDeparture: string;

  /**
   * Preferred/target arrival time.
   */
  targetArrival: string | null;

  /**
   * Latest acceptable arrival time.
   */
  maximumArrival: string | null;

  /**
   * IANA timezone identifier.
   *
   * Backend default:
   *
   *     Africa/Nairobi
   */
  timezone: string;

  createdAt: string;
  updatedAt: string;
}