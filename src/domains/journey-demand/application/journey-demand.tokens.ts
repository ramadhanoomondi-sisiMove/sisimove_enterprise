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
    // Public discovery is intentionally separate from the generic
    // GetJourneyDemandByPublicIdQuery.
    //
    // A Journey Demand may exist internally without being publicly
    // discoverable. The public query therefore has its own application
    // handler and repository read contract.
    //

    GET_PUBLIC: Symbol('GetPublicJourneyDemandQueryHandler'),

    // -------------------------------------------------------------------------
    // Collections
    // -------------------------------------------------------------------------

    GET_ALL: Symbol('GetJourneyDemandsQueryHandler'),

    GET_MY: Symbol('GetMyJourneyDemandsQueryHandler'),

    // -------------------------------------------------------------------------
    // Discovery
    // -------------------------------------------------------------------------

    FIND_OPEN: Symbol('FindOpenJourneyDemandsQueryHandler'),

    FIND_MATCHABLE: Symbol('FindMatchableJourneyDemandsQueryHandler'),

    FIND_BY_CORRIDOR: Symbol('FindJourneyDemandsByCorridorQueryHandler'),

    FIND_BY_SCHEDULE: Symbol('FindJourneyDemandsByScheduleQueryHandler'),

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
