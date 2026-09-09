// -----------------------------------------------------------------------------
// sisiMove — Journey Demand API Types
// -----------------------------------------------------------------------------
//
// Transport contracts for the Journey Demand HTTP API.
//
// These types represent the shape of data exchanged with the backend.
// They are NOT frontend feature models and must not contain presentation
// concerns, React types, domain entities, Prisma types, or business logic.
//
// Architectural boundary:
//
// HTTP response
//      ↓
// Journey Demand API types
//      ↓
// JourneyDemandMapper
//      ↓
// Journey Demand feature models
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Journey Demand Status
// -----------------------------------------------------------------------------

/**
 * Lifecycle status returned by the Journey Demand API.
 *
 * DRAFT is an authenticated/private workflow state and must never be exposed
 * through public discovery read models.
 */
export type JourneyDemandStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'MATCHED'
  | 'CONVERTED'
  | 'FULFILLED'
  | 'CANCELLED'
  | 'EXPIRED';

// -----------------------------------------------------------------------------
// Journey Demand Response
// -----------------------------------------------------------------------------

/**
 * HTTP response representation of a Journey Demand.
 */
export interface JourneyDemandResponse {
  /**
   * Public identifier of the Journey Demand.
   */
  publicId: string;

  /**
   * Public identifier of the traveller who created the demand.
   *
   * This is a cross-domain public reference.
   */
  requesterPublicId: string;

  /**
   * Current Journey Demand lifecycle status.
   */
  status: JourneyDemandStatus;

  /**
   * Requested travel route.
   */
  route: JourneyDemandRouteResponse;

  /**
   * Requested travel schedule.
   */
  schedule: JourneyDemandScheduleResponse;

  /**
   * Requested seat capacity.
   */
  capacity: JourneyDemandCapacityResponse;

  /**
   * Requester's pricing preferences.
   */
  pricing: JourneyDemandPricingResponse;

  /**
   * Whether the demand is currently active.
   *
   * This value is authoritative backend state.
   */
  isActive: boolean;

  /**
   * Whether the demand can currently participate in matching.
   *
   * This value is authoritative backend state and must not be derived
   * from status by the frontend.
   */
  isMatchable: boolean;
}

// -----------------------------------------------------------------------------
// Route Response
// -----------------------------------------------------------------------------

/**
 * HTTP response representation of a Journey Demand route.
 */
export interface JourneyDemandRouteResponse {
  /**
   * Public identifier of the route.
   */
  publicId: string;

  /**
   * Public origin name.
   */
  originName: string;

  /**
   * Public destination name.
   */
  destinationName: string;

  /**
   * Ordered route waypoints.
   */
  waypoints: JourneyDemandWaypointResponse[];
}

// -----------------------------------------------------------------------------
// Waypoint Response
// -----------------------------------------------------------------------------

/**
 * Functional role of a Journey Demand waypoint.
 */
export type JourneyDemandWaypointType =
  | 'ORIGIN'
  | 'DESTINATION'
  | 'PICKUP'
  | 'DROPOFF'
  | 'WAYPOINT';

/**
 * HTTP response representation of a Journey Demand waypoint.
 */
export interface JourneyDemandWaypointResponse {
  /**
   * Public identifier of the waypoint.
   */
  publicId: string;

  /**
   * Functional role of the waypoint.
   */
  type: JourneyDemandWaypointType;

  /**
   * Ordered position within the requested route.
   */
  sequence: number;

  /**
   * Public location name.
   */
  name: string;

  /**
   * Whether pickup is required at this waypoint.
   */
  pickupRequired: boolean;

  /**
   * Whether drop-off is required at this waypoint.
   */
  dropoffRequired: boolean;
}

// -----------------------------------------------------------------------------
// Schedule Response
// -----------------------------------------------------------------------------

/**
 * HTTP response representation of a Journey Demand schedule.
 */
export interface JourneyDemandScheduleResponse {
  /**
   * Public identifier of the schedule.
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
   *
   * ISO-8601 datetime string.
   */
  targetArrival: string | null;

  /**
   * Latest acceptable arrival time.
   *
   * Null when no maximum arrival time was specified.
   *
   * ISO-8601 datetime string.
   */
  maximumArrival: string | null;

  /**
   * IANA timezone used to interpret the schedule.
   *
   * Example: Africa/Nairobi.
   */
  timezone: string;
}

// -----------------------------------------------------------------------------
// Capacity Response
// -----------------------------------------------------------------------------

/**
 * HTTP response representation of Journey Demand seat capacity.
 */
export interface JourneyDemandCapacityResponse {
  /**
   * Public identifier of the capacity record.
   */
  publicId: string;

  /**
   * Total number of seats requested.
   */
  requestedSeats: number;

  /**
   * Number of requested seats currently matched.
   */
  matchedSeats: number;

  /**
   * Number of requested seats still requiring a match.
   *
   * This value is calculated authoritatively by the backend.
   */
  remainingSeats: number;
}

// -----------------------------------------------------------------------------
// Pricing Response
// -----------------------------------------------------------------------------

/**
 * HTTP response representation of Journey Demand pricing preferences.
 *
 * These are traveller preferences and are not Commercial-domain data.
 */
export interface JourneyDemandPricingResponse {
  /**
   * Public identifier of the pricing preference record.
   */
  publicId: string;

  /**
   * Maximum amount the requester is willing to pay per seat.
   *
   * Null means no maximum was specified.
   */
  maximumPricePerSeat: number | null;

  /**
   * Preferred amount the requester would like to pay per seat.
   *
   * Null means no preferred amount was specified.
   */
  preferredPricePerSeat: number | null;

  /**
   * ISO 4217 currency code.
   *
   * Example: KES.
   */
  currency: string;
}

// -----------------------------------------------------------------------------
// Collection Response
// -----------------------------------------------------------------------------

/**
 * HTTP response representation for a collection of Journey Demands.
 *
 * Pagination metadata is intentionally kept transport-level and does not
 * become part of the JourneyDemand feature model.
 */
export interface JourneyDemandsResponse {
  /**
   * Journey Demand records returned by the API.
   */
  items: JourneyDemandResponse[];

  /**
   * Total number of records matching the request.
   *
   * Null when the endpoint does not provide a total count.
   */
  total: number | null;

  /**
   * Number of records skipped before this page.
   */
  offset: number;

  /**
   * Maximum number of records requested for this page.
   */
  limit: number;
}