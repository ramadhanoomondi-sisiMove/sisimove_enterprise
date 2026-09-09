// -----------------------------------------------------------------------------
// sisiMove — Journey Demand API Barrel
// -----------------------------------------------------------------------------
//
// Public API surface for the Journey Demand HTTP client.
//
// Architectural boundary:
//
// - API operations are exposed as feature capabilities.
// - HTTP transport response contracts required by feature mappers are exposed
//   without leaking domain or persistence types.
// - Journey Demand feature models remain the canonical public feature models.
// - Transport types that collide with feature model names are intentionally
//   not re-exported.
//
// In particular:
//
// - JourneyDemandStatus
// - JourneyDemandWaypointType
//
// are owned by the feature model layer and therefore remain internal to the
// transport implementation.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// API Operations
// -----------------------------------------------------------------------------

export {
  getPublicJourneyDemand,
  getPublicJourneyDemands,
  getJourneyDemand,
  journeyDemandsApi,
} from './journey-demands.api';

// -----------------------------------------------------------------------------
// Transport Response Types
// -----------------------------------------------------------------------------
//
// These response contracts are consumed by JourneyDemandMapper.
//
// They do not collide with public feature-model names, so they can safely be
// exposed through the API barrel for mapper consumption.
//

export type {
  JourneyDemandResponse,
  JourneyDemandsResponse,
  JourneyDemandRouteResponse,
  JourneyDemandWaypointResponse,
  JourneyDemandScheduleResponse,
  JourneyDemandCapacityResponse,
  JourneyDemandPricingResponse,
} from './journey-demands.types';
