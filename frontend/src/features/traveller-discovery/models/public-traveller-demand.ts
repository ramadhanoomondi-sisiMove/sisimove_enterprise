// -----------------------------------------------------------------------------
// Public Traveller Demand
// -----------------------------------------------------------------------------
//
// Public representation of a Journey Demand displayed as traveller activity.
//
// This model is NOT the JourneyDemand domain entity and must never mirror the
// persistence model.
//
// It contains only public decision-support information:
//
// - route
// - requested travel window
// - seats needed
// - maximum acceptable price
//
// Private participant data, internal matching information, exact private
// pickup/drop-off coordinates, financial records, and domain lifecycle
// metadata must never be exposed here.
//
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// Public Traveller Demand Route
// -----------------------------------------------------------------------------

/**
 * Public route summary for a journey demand.
 *
 * This represents only the origin and destination information approved for
 * anonymous public discovery.
 */
export interface PublicTravellerDemandRoute {
  /**
   * Publicly displayable origin name.
   */
  origin: string;

  /**
   * Publicly displayable destination name.
   */
  destination: string;
}


// -----------------------------------------------------------------------------
// Public Traveller Demand Schedule
// -----------------------------------------------------------------------------

/**
 * Public schedule summary for a journey demand.
 *
 * A demand may specify an exact departure time or a flexible travel window.
 *
 * The public API supplies the normalized window; the frontend must not
 * infer or reconstruct it from other fields.
 */
export interface PublicTravellerDemandSchedule {
  /**
   * Earliest acceptable departure time.
   *
   * ISO-8601 date/time.
   */
  earliestDepartureAt: string;

  /**
   * Latest acceptable departure time.
   *
   * ISO-8601 date/time.
   *
   * When equal to earliestDepartureAt, the demand represents a specific
   * requested departure time.
   */
  latestDepartureAt: string;

  /**
   * IANA timezone identifier used when presenting the requested travel
   * window.
   *
   * Example:
   *
   * Africa/Nairobi
   */
  timezone: string;

  /**
   * Whether the traveller has explicitly requested a flexible departure.
   *
   * This is a server-provided public projection and must not be inferred
   * from timestamp equality by the frontend.
   */
  flexibleDeparture: boolean;
}


// -----------------------------------------------------------------------------
// Public Traveller Demand Capacity
// -----------------------------------------------------------------------------

/**
 * Public seat requirement for a journey demand.
 */
export interface PublicTravellerDemandCapacity {
  /**
   * Number of seats the traveller is looking for.
   */
  seatsNeeded: number;
}


// -----------------------------------------------------------------------------
// Public Traveller Demand Pricing
// -----------------------------------------------------------------------------

/**
 * Public maximum-price summary for a journey demand.
 *
 * This represents the maximum amount the traveller has publicly indicated
 * that they are willing to pay for one seat.
 */
export interface PublicTravellerDemandPricing {
  /**
   * Maximum amount the traveller has publicly indicated for one seat,
   * expressed in integer minor units.
   *
   * Null means that no public maximum price has been provided.
   */
  maxAmount: number | null;

  /**
   * ISO 4217 currency code.
   *
   * Example:
   *
   * KES
   */
  currency: string;
}


// -----------------------------------------------------------------------------
// Public Traveller Demand
// -----------------------------------------------------------------------------

/**
 * Public journey-demand representation displayed under traveller activity.
 *
 * This is a public read-model contract, not a JourneyDemand domain entity.
 *
 * It contains only information necessary for anonymous users to understand
 * what journey the traveller is looking for.
 */
export interface PublicTravellerDemand {
  /**
   * Opaque public journey-demand identifier.
   *
   * This must never be an internal database identifier.
   */
  publicId: string;

  /**
   * Public route summary.
   */
  route: PublicTravellerDemandRoute;

  /**
   * Public requested travel schedule.
   */
  schedule: PublicTravellerDemandSchedule;

  /**
   * Public seat requirement.
   */
  capacity: PublicTravellerDemandCapacity;

  /**
   * Public maximum-price information.
   */
  pricing: PublicTravellerDemandPricing;
}