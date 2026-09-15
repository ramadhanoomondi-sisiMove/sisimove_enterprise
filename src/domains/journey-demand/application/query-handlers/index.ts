// -----------------------------------------------------------------------------
// Journey Demand — Query Handlers
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Core Journey Demand Queries
// -----------------------------------------------------------------------------

export * from './get-journey-demand.handler';

export * from './get-journey-demand-by-public-id.handler';

export * from './get-journey-demands.handler';

export * from './get-my-journey-demands.handler';

// -----------------------------------------------------------------------------
// Public Marketplace Discovery
// -----------------------------------------------------------------------------
//
// Both public handlers use the same public Journey Demand response contract.
//
// The singular handler exports the public response types. The plural handler
// exports only its query handler to prevent duplicate named exports.
//

export { GetPublicJourneyDemandQueryHandler } from './get-public-journey-demand.query-handler';

export { GetPublicJourneyDemandsQueryHandler } from './get-public-journey-demands.query-handler';

// -----------------------------------------------------------------------------
// Participants
// -----------------------------------------------------------------------------

export * from './get-journey-demand-participants.handler';

export * from './get-journey-demand-participant.handler';

// -----------------------------------------------------------------------------
// Journey Demand Components
// -----------------------------------------------------------------------------

export * from './get-journey-demand-corridor.handler';

export * from './get-journey-demand-schedule.handler';

export * from './get-journey-demand-capacity.handler';

export * from './get-journey-demand-pricing.handler';

export * from './get-journey-demand-waypoints.handler';

// -----------------------------------------------------------------------------
// Internal Discovery
// -----------------------------------------------------------------------------

export * from './find-open-journey-demands.handler';

export * from './find-matchable-journey-demands.handler';

export * from './find-journey-demands-by-corridor.handler';

export * from './find-journey-demands-by-schedule.handler';

export * from './find-journey-demands-by-requester.handler';
