// -----------------------------------------------------------------------------
// sisiMove — Journey Demand API
// -----------------------------------------------------------------------------
//
// Feature-level API barrel.
//
// This module provides one stable import boundary for the Journey Demand
// frontend feature:
//
//   - public marketplace queries;
//   - authenticated "my demands" queries;
//   - Journey Demand lifecycle commands;
//   - Journey Demand component mutations.
//
// The API adapters themselves remain responsible only for HTTP transport.
// Query invalidation, UI state, and orchestration belong to the hooks and
// components that consume these APIs.
//
// IMPORTANT:
// - Do not add backend domain entities or aggregates here.
// - Do not add query/mutation logic here.
// - Do not duplicate exports already provided by child barrels.
// -----------------------------------------------------------------------------

export * from './journey-demands';
export * from './corridor';
export * from './waypoints';
export * from './schedule';
export * from './capacity';
export * from './pricing';
export * from './participants';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand API
// -----------------------------------------------------------------------------
//
// Feature-level API barrel.
//
// Public marketplace discovery and authenticated owner operations are exposed
// through separate API modules.
//
// Consumers should normally import Journey Demand API operations through this
// feature boundary rather than importing implementation files directly.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public Marketplace
// -----------------------------------------------------------------------------

export {
  getPublicJourneyDemands,
  getPublicJourneyDemandByPublicId,
} from '../../journey-demand/api/public-journey-demands.api';

// -----------------------------------------------------------------------------
// Authenticated Owner
// -----------------------------------------------------------------------------

export {
  getMyJourneyDemands,
} from './my-journey-demands.api';

export type {
  MyJourneyDemandQuery,
} from './my-journey-demands.api';

export {
  getMyJourneyDemand,
} from './my-journey-demand.api';


