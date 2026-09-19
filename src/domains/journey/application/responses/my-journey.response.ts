// -----------------------------------------------------------------------------
// sisiMove — Authenticated My Journey Response
// -----------------------------------------------------------------------------
//
// HTTP/application response contract for the authenticated provider's own
// Journeys.
//
// Architectural boundary:
//
//     JourneyAggregate
//           │
//           ▼
//     MyJourneyMapper
//           │
//           ▼
//     MyJourneyResponse
//           │
//           ▼
//     GET /journeys/me
//
// This response is intentionally different from:
//
//     JourneyResponse
//         - internal/general REST representation
//         - exposes internal entity identifiers
//         - exposes providerPublicId
//         - exposes version
//
//     PublicJourneyProjection
//         - public marketplace representation
//         - only represents publicly discoverable Journeys
//         - renames corridor → route
//         - excludes lifecycle ownership state
//
// MyJourneyResponse represents the authenticated owner's Journey-management
// view.
//
// It therefore:
//   - exposes Journey lifecycle state;
//   - exposes lifecycle timestamps;
//   - exposes safe public component identifiers;
//   - supports incomplete/draft Journeys;
//   - excludes internal persistence identifiers;
//   - excludes providerPublicId;
//   - excludes aggregate version.
//
// IMPORTANT
// -----------------------------------------------------------------------------
//
// This is an HTTP/application contract.
//
// It must contain primitives only.
//
// Do NOT expose:
//
//   - JourneyAggregate
//   - JourneyEntity
//   - Value Objects
//   - UniqueEntityId
//   - Prisma models
//   - domain entities
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// My Journey Response
// -----------------------------------------------------------------------------

export interface MyJourneyResponse {
  // ---------------------------------------------------------------------------
  // Journey identity
  // ---------------------------------------------------------------------------
  //
  // Stable public Journey identifier.
  //
  // Internal JourneyEntity.id is intentionally not exposed.
  //
  readonly publicId: string;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  readonly status: string;

  readonly publishedAt: Date | null;

  readonly startedAt: Date | null;

  readonly completionRequestedAt: Date | null;

  readonly completedAt: Date | null;

  readonly cancelledAt: Date | null;

  readonly expiredAt: Date | null;

  // ---------------------------------------------------------------------------
  // Journey timestamps
  // ---------------------------------------------------------------------------

  readonly createdAt: Date;

  readonly updatedAt: Date;

  // ---------------------------------------------------------------------------
  // Journey components
  // ---------------------------------------------------------------------------
  //
  // These are nullable because My Journeys includes DRAFT/incomplete
  // Journeys.
  //
  // A Journey does not need to be fully configured merely to appear in the
  // authenticated owner's Journey list.
  //

  readonly corridor: MyJourneyRouteResponse | null;

  readonly schedule: MyJourneyScheduleResponse | null;

  readonly vehicle: MyJourneyVehicleResponse | null;

  readonly capacity: MyJourneyCapacityResponse | null;

  readonly pricing: MyJourneyPricingResponse | null;

  readonly preferences: MyJourneyPreferencesResponse | null;

  readonly assets: readonly MyJourneyAssetResponse[];
}

// -----------------------------------------------------------------------------
// Corridor / Route Response
// -----------------------------------------------------------------------------
//
// Internally the Journey domain calls this a corridor.
//
// We intentionally retain "corridor" in the authenticated Journey-management
// contract. The "route" terminology belongs to the public marketplace
// projection.
//
// -----------------------------------------------------------------------------

export interface MyJourneyRouteResponse {
  readonly origin: MyJourneyLocationResponse;

  readonly destination: MyJourneyLocationResponse;

  readonly waypoints: readonly MyJourneyWaypointResponse[];
}

// -----------------------------------------------------------------------------
// Location Response
// -----------------------------------------------------------------------------

export interface MyJourneyLocationResponse {
  readonly name: string;

  readonly latitude: number;

  readonly longitude: number;
}

// -----------------------------------------------------------------------------
// Waypoint Response
// -----------------------------------------------------------------------------

export interface MyJourneyWaypointResponse {
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
// Schedule Response
// -----------------------------------------------------------------------------

export interface MyJourneyScheduleResponse {
  readonly publicId: string;

  readonly departureAt: Date;

  readonly arrivalAt: Date | null;

  readonly timezone: string;
}

// -----------------------------------------------------------------------------
// Vehicle Response
// -----------------------------------------------------------------------------

export interface MyJourneyVehicleResponse {
  readonly publicId: string;

  readonly make: string;

  readonly model: string;

  readonly year: number | null;

  readonly color: string | null;

  readonly registration: string | null;

  readonly assetPublicId: string | null;
}

// -----------------------------------------------------------------------------
// Capacity Response
// -----------------------------------------------------------------------------

export interface MyJourneyCapacityResponse {
  readonly publicId: string;

  readonly totalSeats: number;

  readonly bookedSeats: number;

  readonly availableSeats: number;
}

// -----------------------------------------------------------------------------
// Pricing Response
// -----------------------------------------------------------------------------

export interface MyJourneyPricingResponse {
  readonly publicId: string;

  readonly amount: number;

  readonly currency: string;
}

// -----------------------------------------------------------------------------
// Preferences Response
// -----------------------------------------------------------------------------

export interface MyJourneyPreferencesResponse {
  readonly publicId: string;

  readonly smoking: string;

  readonly pets: string;

  readonly luggage: string;

  readonly conversation: string;

  readonly music: string;
}

// -----------------------------------------------------------------------------
// Asset Response
// -----------------------------------------------------------------------------

export interface MyJourneyAssetResponse {
  readonly publicId: string;

  readonly assetPublicId: string;

  readonly type: string;

  readonly sortOrder: number;
}
