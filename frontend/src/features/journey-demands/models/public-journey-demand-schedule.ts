// -----------------------------------------------------------------------------
// sisiMove — Public Journey Demand Schedule
// -----------------------------------------------------------------------------
//
// Public scheduling requirements for a Journey Demand.
//
// A Journey has a concrete departure time.
//
// A Journey Demand is different: the traveller may provide a flexible
// departure window. Therefore the public model exposes the complete requested
// window rather than pretending that the demand has a single departure time.
// -----------------------------------------------------------------------------

export interface PublicJourneyDemandSchedule {
  /**
   * Earliest acceptable departure time.
   */
  earliestDeparture: string;

  /**
   * Latest acceptable departure time.
   */
  latestDeparture: string;

  /**
   * Preferred/target arrival time, when supplied.
   */
  targetArrival: string | null;

  /**
   * Latest acceptable arrival time, when supplied.
   */
  maximumArrival: string | null;

  /**
   * IANA timezone associated with the requested schedule.
   *
   * Example:
   * `Africa/Nairobi`
   */
  timezone: string;
}