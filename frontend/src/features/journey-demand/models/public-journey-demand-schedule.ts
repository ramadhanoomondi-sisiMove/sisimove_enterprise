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
//
// The HTTP/API representation uses ISO-8601 datetime strings. The frontend
// presentation layer is responsible for formatting these values for the
// traveller's locale/timezone.
// -----------------------------------------------------------------------------

export interface PublicJourneyDemandSchedule {
  /**
   * Earliest acceptable departure time.
   *
   * ISO-8601 datetime string returned by the API.
   */
  readonly earliestDeparture: string;

  /**
   * Latest acceptable departure time.
   *
   * ISO-8601 datetime string returned by the API.
   */
  readonly latestDeparture: string;

  /**
   * Preferred/target arrival time, when supplied.
   *
   * ISO-8601 datetime string returned by the API.
   */
  readonly targetArrival: string | null;

  /**
   * Latest acceptable arrival time, when supplied.
   *
   * ISO-8601 datetime string returned by the API.
   */
  readonly maximumArrival: string | null;

  /**
   * IANA timezone associated with the requested schedule.
   *
   * Example:
   *
   *     Africa/Nairobi
   */
  readonly timezone: string;
}