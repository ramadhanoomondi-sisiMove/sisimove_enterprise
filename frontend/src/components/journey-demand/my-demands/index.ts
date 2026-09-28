// -----------------------------------------------------------------------------
// sisiMove — My Journey Demands Components
// -----------------------------------------------------------------------------
//
// Barrel exports for the authenticated Journey Demand collection feature.
//
// Components in this barrel:
// - individual Journey Demand card;
// - empty state;
// - error state;
// - collection list;
// - collection coordinator.
//
// The barrel contains presentation exports only. API, hooks, and domain
// models remain owned by their respective feature boundaries.
// -----------------------------------------------------------------------------

export {
  MyJourneyDemandCard,
  type MyJourneyDemandCardProps,
} from './my-journey-demand-card';

export {
  MyJourneyDemandEmptyState,
  type MyJourneyDemandEmptyStateProps,
} from './my-journey-demand-empty-state';

export {
  MyJourneyDemandErrorState,
  type MyJourneyDemandErrorStateProps,
} from './my-journey-demand-error-state';

export {
  MyJourneyDemandsList,
  type MyJourneyDemandsListProps,
} from './my-journey-demands-list';

export {
  MyJourneyDemands,
  type MyJourneyDemandsProps,
} from './my-journey-demands';

