// -----------------------------------------------------------------------------
// sisiMove — My Demands Component Barrel
// -----------------------------------------------------------------------------
//
// Public exports for the authenticated My Demands presentation boundary.
//
// This barrel keeps imports from `components/authenticated/my-demands`
// centralized and prevents consumers from depending on individual file paths.
// -----------------------------------------------------------------------------

export { MyDemandsPage } from './my-demands-page';
export { MyDemandsHeader } from './my-demands-header';
export { MyDemandsResults } from './my-demands-results';
export { MyDemandsEmptyState } from './my-demands-empty-state';
export { MyDemandsLoadingState } from './my-demands-loading-state';
export { MyDemandsErrorState } from './my-demands-error-state';
export { MyDemandCard } from './my-demand-card';

export type { MyDemandsHeaderProps } from './my-demands-header';
export type { MyDemandsResultsProps } from './my-demands-results';
export type { MyDemandsEmptyStateProps } from './my-demands-empty-state';
export type { MyDemandsErrorStateProps } from './my-demands-error-state';
export type { MyDemandCardProps } from './my-demand-card';

// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Components
// -----------------------------------------------------------------------------
//
// Public feature barrel for all Journey Demand presentation components.
//
// Application routes should import from this barrel rather than reaching into
// management, creation, or detail implementation directories.
// -----------------------------------------------------------------------------

export {
  JourneyDemandCard,
  type JourneyDemandCardProps,
  JourneyDemandList,
  type JourneyDemandListProps,
} from './management';

export {
  JourneyDemandCreationShell,
  type JourneyDemandCreationShellProps,
  JourneyDemandCreationProgress,
  type JourneyDemandCreationProgressProps,
  type JourneyDemandCreationStep,
  JourneyDemandCreationNavigation,
  type JourneyDemandCreationNavigationProps,
  JourneyDemandCorridorForm,
  type JourneyDemandCorridorFormProps,
  JourneyDemandWaypointsForm,
  type JourneyDemandWaypointsFormProps,
  JourneyDemandRouteStep,
  type JourneyDemandRouteStepProps,
  JourneyDemandScheduleStep,
  type JourneyDemandScheduleStepProps,
  JourneyDemandSeatsStep,
  type JourneyDemandSeatsStepProps,
  JourneyDemandPricingStep,
  type JourneyDemandPricingStepProps,
  JourneyDemandReviewStep,
  type JourneyDemandReviewStepProps,
} from './creation';

export {
  JourneyDemandDetailContainer,
  type JourneyDemandDetailContainerProps,
  JourneyDemandDetailHeader,
  type JourneyDemandDetailHeaderProps,
  JourneyDemandDetailRoute,
  type JourneyDemandDetailRouteProps,
  JourneyDemandDetailSchedule,
  type JourneyDemandDetailScheduleProps,
  JourneyDemandDetailCapacity,
  type JourneyDemandDetailCapacityProps,
  JourneyDemandDetailPricing,
  type JourneyDemandDetailPricingProps,
  JourneyDemandDetailParticipants,
  type JourneyDemandDetailParticipantsProps,
} from './detail';