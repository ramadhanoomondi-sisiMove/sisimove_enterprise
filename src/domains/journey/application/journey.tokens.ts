// src/domains/journey/application/journey.tokens.ts

// -----------------------------------------------------------------------------
// sisiMove — Journey Application Tokens
// -----------------------------------------------------------------------------
//
// Dependency-injection tokens for the Journey application layer.
//
// The token registry is intentionally grouped by application responsibility:
//
// - Repository
// - Command handlers
// - Query handlers
//
// Public Journey queries are kept distinct from general Journey queries.
// A public query represents a public read boundary and therefore has its own
// handler, even when the underlying persistence query eventually uses the same
// Journey repository.
//
// -----------------------------------------------------------------------------

export const JOURNEY_TOKENS = {
  // ===========================================================================
  // Repository
  // ===========================================================================

  REPOSITORY: Symbol('JourneyRepository'),

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    // -------------------------------------------------------------------------
    // Journey Lifecycle
    // -------------------------------------------------------------------------

    CREATE: Symbol('CreateJourneyHandler'),

    PUBLISH: Symbol('PublishJourneyHandler'),

    START: Symbol('StartJourneyHandler'),

    COMPLETE: Symbol('CompleteJourneyHandler'),

    CANCEL: Symbol('CancelJourneyHandler'),

    EXPIRE: Symbol('ExpireJourneyHandler'),

    // -------------------------------------------------------------------------
    // Corridor
    // -------------------------------------------------------------------------

    ATTACH_CORRIDOR: Symbol('AttachJourneyCorridorHandler'),

    REMOVE_CORRIDOR: Symbol('RemoveJourneyCorridorHandler'),

    // -------------------------------------------------------------------------
    // Waypoints
    // -------------------------------------------------------------------------

    ADD_WAYPOINT: Symbol('AddJourneyWaypointHandler'),

    REMOVE_WAYPOINT: Symbol('RemoveJourneyWaypointHandler'),

    // -------------------------------------------------------------------------
    // Schedule
    // -------------------------------------------------------------------------

    ATTACH_SCHEDULE: Symbol('AttachJourneyScheduleHandler'),

    REMOVE_SCHEDULE: Symbol('RemoveJourneyScheduleHandler'),

    // -------------------------------------------------------------------------
    // Vehicle
    // -------------------------------------------------------------------------

    ATTACH_VEHICLE: Symbol('AttachJourneyVehicleHandler'),

    REMOVE_VEHICLE: Symbol('RemoveJourneyVehicleHandler'),

    // -------------------------------------------------------------------------
    // Capacity
    // -------------------------------------------------------------------------

    ATTACH_CAPACITY: Symbol('AttachJourneyCapacityHandler'),

    REMOVE_CAPACITY: Symbol('RemoveJourneyCapacityHandler'),

    // -------------------------------------------------------------------------
    // Pricing
    // -------------------------------------------------------------------------

    ATTACH_PRICING: Symbol('AttachJourneyPricingHandler'),

    REMOVE_PRICING: Symbol('RemoveJourneyPricingHandler'),

    // -------------------------------------------------------------------------
    // Preferences
    // -------------------------------------------------------------------------

    ATTACH_PREFERENCES: Symbol('AttachJourneyPreferencesHandler'),

    REMOVE_PREFERENCES: Symbol('RemoveJourneyPreferencesHandler'),

    // -------------------------------------------------------------------------
    // Assets
    // -------------------------------------------------------------------------

    ATTACH_ASSET: Symbol('AttachJourneyAssetHandler'),

    REMOVE_ASSET: Symbol('RemoveJourneyAssetHandler'),
  },

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    // -------------------------------------------------------------------------
    // Journey
    // -------------------------------------------------------------------------

    /**
     * Retrieves a Journey through the general Journey application boundary.
     */
    GET: Symbol('GetJourneyQueryHandler'),

    GET_BY_PROVIDER: Symbol('GetJourneyByProviderQueryHandler'),

    GET_BY_STATUS: Symbol('GetJourneysByStatusQueryHandler'),

    GET_BY_PROVIDER_AND_STATUS: Symbol(
      'GetJourneysByProviderAndStatusQueryHandler',
    ),

    SEARCH_PUBLISHED: Symbol('SearchPublishedJourneysQueryHandler'),

    // -------------------------------------------------------------------------
    // Public Journey
    // -------------------------------------------------------------------------
    //
    // Public queries are intentionally separate from the general Journey
    // queries. The public read boundary must enforce public visibility rather
    // than exposing arbitrary Journey lifecycle state.
    //
    // -------------------------------------------------------------------------

    GET_PUBLIC: Symbol('GetPublicJourneyQueryHandler'),

    // -------------------------------------------------------------------------
    // Corridor
    // -------------------------------------------------------------------------

    GET_CORRIDOR: Symbol('GetJourneyCorridorQueryHandler'),

    // -------------------------------------------------------------------------
    // Waypoints
    // -------------------------------------------------------------------------

    GET_WAYPOINT: Symbol('GetJourneyWaypointQueryHandler'),

    GET_WAYPOINTS: Symbol('GetJourneyWaypointsQueryHandler'),

    // -------------------------------------------------------------------------
    // Schedule
    // -------------------------------------------------------------------------

    GET_SCHEDULE: Symbol('GetJourneyScheduleQueryHandler'),

    // -------------------------------------------------------------------------
    // Vehicle
    // -------------------------------------------------------------------------

    GET_VEHICLE: Symbol('GetJourneyVehicleQueryHandler'),

    // -------------------------------------------------------------------------
    // Capacity
    // -------------------------------------------------------------------------

    GET_CAPACITY: Symbol('GetJourneyCapacityQueryHandler'),

    // -------------------------------------------------------------------------
    // Pricing
    // -------------------------------------------------------------------------

    GET_PRICING: Symbol('GetJourneyPricingQueryHandler'),

    // -------------------------------------------------------------------------
    // Preferences
    // -------------------------------------------------------------------------

    GET_PREFERENCES: Symbol('GetJourneyPreferencesQueryHandler'),

    // -------------------------------------------------------------------------
    // Assets
    // -------------------------------------------------------------------------

    GET_ASSET: Symbol('GetJourneyAssetQueryHandler'),

    GET_ASSETS: Symbol('GetJourneyAssetsQueryHandler'),

    GET_ASSET_BY_REFERENCE: Symbol('GetJourneyAssetByReferenceQueryHandler'),
  },
} as const;
