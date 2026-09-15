// src/domains/journey-demand/application/journey-demand.tokens.ts

// -----------------------------------------------------------------------------
// Journey Demand — Dependency Injection Tokens
// -----------------------------------------------------------------------------

export const JOURNEY_DEMAND_TOKENS = {
  // ===========================================================================
  // Repository
  // ===========================================================================

  REPOSITORY: Symbol('JourneyDemandRepository'),

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    // -------------------------------------------------------------------------
    // Journey Demand Lifecycle
    // -------------------------------------------------------------------------

    CREATE: Symbol('CreateJourneyDemandHandler'),
    UPDATE: Symbol('UpdateJourneyDemandHandler'),
    PUBLISH: Symbol('PublishJourneyDemandHandler'),
    MATCH: Symbol('MatchJourneyDemandHandler'),
    CONVERT: Symbol('ConvertJourneyDemandHandler'),
    FULFILL: Symbol('FulfillJourneyDemandHandler'),
    CANCEL: Symbol('CancelJourneyDemandHandler'),
    EXPIRE: Symbol('ExpireJourneyDemandHandler'),

    // -------------------------------------------------------------------------
    // Corridor
    // -------------------------------------------------------------------------

    UPDATE_CORRIDOR: Symbol('UpdateJourneyDemandCorridorHandler'),

    // -------------------------------------------------------------------------
    // Waypoints
    // -------------------------------------------------------------------------

    ADD_WAYPOINT: Symbol('AddJourneyDemandWaypointHandler'),
    UPDATE_WAYPOINT: Symbol('UpdateJourneyDemandWaypointHandler'),
    REMOVE_WAYPOINT: Symbol('RemoveJourneyDemandWaypointHandler'),

    // -------------------------------------------------------------------------
    // Schedule
    // -------------------------------------------------------------------------

    UPDATE_SCHEDULE: Symbol('UpdateJourneyDemandScheduleHandler'),

    // -------------------------------------------------------------------------
    // Capacity
    // -------------------------------------------------------------------------

    UPDATE_CAPACITY: Symbol('UpdateJourneyDemandCapacityHandler'),

    // -------------------------------------------------------------------------
    // Pricing
    // -------------------------------------------------------------------------

    UPDATE_PRICING: Symbol('UpdateJourneyDemandPricingHandler'),

    // -------------------------------------------------------------------------
    // Participants
    // -------------------------------------------------------------------------

    ADD_PARTICIPANT: Symbol('AddJourneyDemandParticipantHandler'),
    UPDATE_PARTICIPANT: Symbol('UpdateJourneyDemandParticipantHandler'),
    WITHDRAW_PARTICIPANT: Symbol('WithdrawJourneyDemandParticipantHandler'),
    REMOVE_PARTICIPANT: Symbol('RemoveJourneyDemandParticipantHandler'),
  },

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    // -------------------------------------------------------------------------
    // Journey Demand
    // -------------------------------------------------------------------------

    GET: Symbol('GetJourneyDemandQueryHandler'),

    GET_BY_PUBLIC_ID: Symbol('GetJourneyDemandByPublicIdQueryHandler'),

    // -------------------------------------------------------------------------
    // Public Discovery
    // -------------------------------------------------------------------------
    //
    // Public discovery is deliberately separated from generic Journey Demand
    // queries. These handlers return public read models and may compose data
    // from Traveller Profile and Trust bounded contexts.
    //
    // Public visibility is enforced by the public repository/query contract.
    //

    /**
     * Retrieves one publicly discoverable Journey Demand by public ID.
     */
    GET_PUBLIC: Symbol('GetPublicJourneyDemandQueryHandler'),

    /**
     * Retrieves the public Journey Demand marketplace collection.
     *
     * Supports an empty query for all publicly discoverable demands, together
     * with optional origin, destination, date, limit, and offset filters.
     */
    GET_PUBLIC_MANY: Symbol('GetPublicJourneyDemandsQueryHandler'),

    // -------------------------------------------------------------------------
    // Internal Collections
    // -------------------------------------------------------------------------

    /**
     * Retrieves the internal Journey Demand collection.
     *
     * This is not the public marketplace read boundary.
     */
    GET_ALL: Symbol('GetJourneyDemandsQueryHandler'),

    /**
     * Retrieves Journey Demands belonging to the authenticated requester.
     */
    GET_MY: Symbol('GetMyJourneyDemandsQueryHandler'),

    // -------------------------------------------------------------------------
    // Internal Discovery
    // -------------------------------------------------------------------------

    /**
     * Retrieves open Journey Demands for internal application workflows.
     */
    FIND_OPEN: Symbol('FindOpenJourneyDemandsQueryHandler'),

    /**
     * Retrieves Journey Demands eligible for matching workflows.
     */
    FIND_MATCHABLE: Symbol('FindMatchableJourneyDemandsQueryHandler'),

    /**
     * Retrieves Journey Demands by corridor.
     */
    FIND_BY_CORRIDOR: Symbol('FindJourneyDemandsByCorridorQueryHandler'),

    /**
     * Retrieves Journey Demands by schedule.
     */
    FIND_BY_SCHEDULE: Symbol('FindJourneyDemandsByScheduleQueryHandler'),

    /**
     * Retrieves Journey Demands by requester.
     */
    FIND_BY_REQUESTER: Symbol('FindJourneyDemandsByRequesterQueryHandler'),

    // -------------------------------------------------------------------------
    // Components
    // -------------------------------------------------------------------------

    GET_CORRIDOR: Symbol('GetJourneyDemandCorridorQueryHandler'),

    GET_SCHEDULE: Symbol('GetJourneyDemandScheduleQueryHandler'),

    GET_CAPACITY: Symbol('GetJourneyDemandCapacityQueryHandler'),

    GET_PRICING: Symbol('GetJourneyDemandPricingQueryHandler'),

    GET_WAYPOINTS: Symbol('GetJourneyDemandWaypointsQueryHandler'),

    // -------------------------------------------------------------------------
    // Participants
    // -------------------------------------------------------------------------

    GET_PARTICIPANT: Symbol('GetJourneyDemandParticipantQueryHandler'),

    GET_PARTICIPANTS: Symbol('GetJourneyDemandParticipantsQueryHandler'),
  },
} as const;
