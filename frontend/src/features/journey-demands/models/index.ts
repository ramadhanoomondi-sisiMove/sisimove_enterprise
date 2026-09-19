// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Models
// -----------------------------------------------------------------------------
//
// Public and authenticated Journey Demand frontend models.
//
// Consumers should normally import these models through the Journey Demand
// feature boundary.
//
// Example:
//
// import type {
//   PublicJourneyDemand,
//   MyJourneyDemand,
// } from '@/features/journey-demands';
//
// Public models represent anonymous marketplace discovery.
//
// My Journey Demand models represent the authenticated requester's own
// Journey Demand management projection.
//
// These two representations remain intentionally separate because they serve
// different application boundaries.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Public Journey Demand
// -----------------------------------------------------------------------------

export type {
  PublicJourneyDemand,
  PublicJourneyDemandStatus,
} from './public-journey-demand';

export type {
  PublicJourneyDemandRequester,
} from './public-journey-demand-requester';

export type {
  PublicJourneyDemandRoute,
  PublicJourneyDemandLocation,
  PublicJourneyDemandWaypoint,
  PublicJourneyDemandWaypointType,
} from './public-journey-demand-route';

export type {
  PublicJourneyDemandSchedule,
} from './public-journey-demand-schedule';

export type {
  PublicJourneyDemandCapacity,
} from './public-journey-demand-capacity';

export type {
  PublicJourneyDemandPricing,
} from './public-journey-demand-pricing';

export type {
  PublicJourneyDemandParticipant,
  PublicJourneyDemandParticipantStatus,
} from './public-journey-demand-participant';

export type {
  PublicJourneyDemandQuery,
} from './public-journey-demand-query';

// -----------------------------------------------------------------------------
// My Journey Demand
// -----------------------------------------------------------------------------
//
// Authenticated owner projection.
//
// All My Journey Demand nested models currently live in:
//
//     ./my-journey-demand
//
// They are therefore exported from the single model module rather than being
// artificially split into separate files.
// -----------------------------------------------------------------------------

export type {
  MyJourneyDemand,
  MyJourneyDemandWaypoint,
  MyJourneyDemandCorridor,
  MyJourneyDemandSchedule,
  MyJourneyDemandCapacity,
  MyJourneyDemandPricing,
  MyJourneyDemandParticipant,
} from './my-journey-demand';

