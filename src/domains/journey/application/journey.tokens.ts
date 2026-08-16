// src/domains/journey/application/journey.tokens.ts

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

    GET: Symbol('GetJourneyQueryHandler'),

    GET_BY_PROVIDER: Symbol('GetJourneyByProviderQueryHandler'),

    GET_BY_STATUS: Symbol('GetJourneysByStatusQueryHandler'),

    GET_BY_PROVIDER_AND_STATUS: Symbol(
      'GetJourneysByProviderAndStatusQueryHandler',
    ),

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
