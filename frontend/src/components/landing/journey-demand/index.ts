// -----------------------------------------------------------------------------
// sisiMove — Landing Journey Demand Components
// -----------------------------------------------------------------------------
//
// Public barrel for Journey Demand presentation components.
//
// This file:
// - exposes Journey Demand cards and sections;
// - exposes supporting route, schedule, capacity, and price components;
// - exposes the empty-search travel-demand action.
//
// It does NOT contain business logic.
// -----------------------------------------------------------------------------

export {
  JourneyDemandCard,
} from './journey-demand-card';

export type {
  JourneyDemandCardProps,
  PublicJourneyDemandCardData,
} from './journey-demand-card';

export {
  JourneyDemandSection,
} from './journey-demand-section';

export type {
  JourneyDemandSectionProps,
  JourneyDemandSearchContext,
} from './journey-demand-section';

export {
  JourneyDemandRoute,
} from './journey-demand-route';

export type {
  JourneyDemandRouteProps,
} from './journey-demand-route';

export {
  JourneyDemandSchedule,
} from './journey-demand-schedule';

export type {
  JourneyDemandScheduleProps,
} from './journey-demand-schedule';

export {
  JourneyDemandCapacity,
} from './journey-demand-capacity';

export type {
  JourneyDemandCapacityProps,
} from './journey-demand-capacity';

export {
  JourneyDemandPrice,
} from './journey-demand-price';

export type {
  JourneyDemandPriceProps,
} from './journey-demand-price';

export {
  CreateTravelDemandAction,
} from './create-travel-demand-action';

export type {
  CreateTravelDemandActionProps,
} from './create-travel-demand-action';