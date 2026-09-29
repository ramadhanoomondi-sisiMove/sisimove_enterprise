// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Shared Components
// -----------------------------------------------------------------------------
//
// Shared presentational components used across Journey Demand marketplace,
// detail, creation, and management surfaces.
//
// These components:
// - render frontend models;
// - do not own data fetching;
// - do not perform mutations;
// - do not contain route-specific behavior;
// - do not recreate backend domain logic.
//
// Keep this barrel explicit so feature dependencies remain easy to trace.
//
// -----------------------------------------------------------------------------

export {
  JourneyDemandStatusBadge,
} from './journey-demand-status-badge';

export type {
  JourneyDemandStatusBadgeProps,
} from './journey-demand-status-badge';

export {
  JourneyDemandRoute,
} from './journey-demand-route';

export type {
  JourneyDemandRouteProps,
} from './journey-demand-route';

export {
  JourneyDemandDate,
} from './journey-demand-date';

export type {
  JourneyDemandDateProps,
} from './journey-demand-date';

export {
  JourneyDemandPrice,
} from './journey-demand-price';

export type {
  JourneyDemandPriceProps,
} from './journey-demand-price';

export {
  JourneyDemandDemandSummary,
} from './journey-demand-demand-summary';

export type {
  JourneyDemandDemandSummaryProps,
} from './journey-demand-demand-summary';

export {
  JourneyDemandScheduleSummary,
} from './journey-demand-schedule-summary';

export type {
  JourneyDemandScheduleSummaryProps,
} from './journey-demand-schedule-summary';

export {
  JourneyDemandRequesterSummary,
} from './journey-demand-requester-summary';

export type {
  JourneyDemandRequesterSummaryProps,
} from './journey-demand-requester-summary';

export {
  JourneyDemandActions,
} from './journey-demand-actions';

export type {
  JourneyDemandActionsProps,
} from './journey-demand-actions';

