// -----------------------------------------------------------------------------
// sisiMove — My Journey Demand Model
// -----------------------------------------------------------------------------
//
// Authenticated owner read model for a Journey Demand.
//
// This model represents a Journey Demand belonging to the currently
// authenticated requester.
//
// It is intentionally separate from:
//   - PublicJourneyDemand — public marketplace representation;
//   - JourneyDemandAggregate — backend domain representation;
//   - Prisma JourneyDemand — persistence representation.
//
// The model mirrors the backend MyJourneyDemandResponse contract while
// converting optional backend dates into nullable frontend values.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Waypoint
// -----------------------------------------------------------------------------

export interface MyJourneyDemandWaypoint {
  readonly publicId: string;
  readonly type: string;
  readonly sequence: number;
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly pickupAllowed: boolean;
  readonly dropoffAllowed: boolean;
}

// -----------------------------------------------------------------------------
// Corridor
// -----------------------------------------------------------------------------

export interface MyJourneyDemandCorridor {
  readonly origin: MyJourneyDemandWaypoint | null;
  readonly destination: MyJourneyDemandWaypoint | null;
  readonly waypoints: readonly MyJourneyDemandWaypoint[];
}

// -----------------------------------------------------------------------------
// Schedule
// -----------------------------------------------------------------------------

export interface MyJourneyDemandSchedule {
  readonly departureAt: string;
  readonly arrivalAt: string | null;
  readonly timezone: string;
}

// -----------------------------------------------------------------------------
// Capacity
// -----------------------------------------------------------------------------

export interface MyJourneyDemandCapacity {
  readonly seats: number;
}

// -----------------------------------------------------------------------------
// Pricing
// -----------------------------------------------------------------------------

export interface MyJourneyDemandPricing {
  readonly amount: number;
  readonly currency: string;
}

// -----------------------------------------------------------------------------
// Participant
// -----------------------------------------------------------------------------

export interface MyJourneyDemandParticipant {
  readonly publicId: string;
  readonly memberPublicId: string;
  readonly status: string;
}

// -----------------------------------------------------------------------------
// My Journey Demand
// -----------------------------------------------------------------------------

/**
 * Authenticated owner projection of a Journey Demand.
 *
 * Ownership is established by the backend `/journey-demands/me` boundary.
 *
 * The frontend must not infer ownership from `requesterPublicId`.
 */
export interface MyJourneyDemand {
  readonly publicId: string;

  /**
   * Public identifier of the requester who owns the demand.
   *
   * This is retained because it is part of the authenticated owner response
   * contract, but it is not used by the frontend to establish ownership.
   */
  readonly requesterPublicId: string;

  readonly status: string;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  readonly publishedAt: string | null;
  readonly matchedAt: string | null;
  readonly convertedAt: string | null;
  readonly fulfilledAt: string | null;
  readonly cancelledAt: string | null;
  readonly expiredAt: string | null;

  /**
   * Aggregate version exposed by the authenticated owner projection.
   *
   * This may be useful for future optimistic-concurrency workflows.
   */
  readonly version: number;

  /**
   * Public identifier of the Journey created/matched from this demand.
   *
   * Null when no Journey has been associated with the demand.
   */
  readonly matchedJourneyPublicId: string | null;

  // ---------------------------------------------------------------------------
  // Journey Demand components
  // ---------------------------------------------------------------------------

  readonly corridor: MyJourneyDemandCorridor | null;
  readonly schedule: MyJourneyDemandSchedule | null;
  readonly capacity: MyJourneyDemandCapacity | null;
  readonly pricing: MyJourneyDemandPricing | null;

  readonly participants: readonly MyJourneyDemandParticipant[];

  // ---------------------------------------------------------------------------
  // Lifecycle state
  // ---------------------------------------------------------------------------

  readonly isDraft: boolean;
  readonly isOpen: boolean;
  readonly isMatched: boolean;
  readonly isConverted: boolean;
  readonly isFulfilled: boolean;
  readonly isCancelled: boolean;
  readonly isExpired: boolean;
  readonly isPublished: boolean;
  readonly isTerminal: boolean;
  readonly isActive: boolean;

  readonly hasMatchedJourney: boolean;

  // ---------------------------------------------------------------------------
  // Component state
  // ---------------------------------------------------------------------------

  readonly hasCorridor: boolean;
  readonly hasSchedule: boolean;
  readonly hasCapacity: boolean;
  readonly hasPricing: boolean;
  readonly hasParticipants: boolean;

  readonly participantCount: number;

  // ---------------------------------------------------------------------------
  // Resource timestamps
  // ---------------------------------------------------------------------------

  readonly createdAt: string;
  readonly updatedAt: string;
}