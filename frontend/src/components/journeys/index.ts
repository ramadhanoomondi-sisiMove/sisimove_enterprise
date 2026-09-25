// -----------------------------------------------------------------------------
// sisiMove — Journey Presentation API
// -----------------------------------------------------------------------------
//
// Public barrel for Journey presentation components.
//
// Consumers should import Journey presentation components through this barrel
// rather than depending directly on individual implementation files.
// -----------------------------------------------------------------------------

export { PublicJourneyContent } from './public-journey-content';

// -----------------------------------------------------------------------------
// sisiMove — Journey Components
// -----------------------------------------------------------------------------
//
// Public barrel export for journey presentation components.
//
// The journeys component boundary exposes the creation workflow and its
// individual presentation surfaces without coupling consumers to internal
// file paths.
//
// API calls, application orchestration, persistence, and journey lifecycle
// transitions remain outside the component layer.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// sisiMove — Journey Components
// -----------------------------------------------------------------------------
//
// Public barrel for all Journey presentation components.
//
// Component responsibilities are separated by Journey surface:
//
//     management/
//         Journey listing and management cards
//
//     creation/
//         Multi-step Journey creation experience
//
//     detail/
//         Journey detail presentation
//
// Data retrieval, mapping, routing, authorization, and mutations remain
// outside the presentation component layer.
// -----------------------------------------------------------------------------

export {
  JourneyCard,
  type JourneyCardProps,
} from './management/journey-card';

export {
  JourneyList,
  type JourneyListProps,
} from './management/journey-list';

export {
  JourneyCreationProgress,
  type JourneyCreationProgressProps,
} from './creation/journey-creation-progress';

export {
  JourneyCreationNavigation,
  type JourneyCreationNavigationProps,
} from './creation/journey-creation-navigation';

export {
  JourneyCreationShell,
  type JourneyCreationShellProps,
} from './creation/journey-creation-shell';

export {
  JourneyCorridorForm,
  type JourneyCorridorFormProps,
} from './creation/route/journey-corridor-form';

export {
  JourneyWaypointsForm,
  type JourneyWaypointsFormProps,
} from './creation/route/journey-waypoints-form';

export {
  JourneyRouteStep,
  type JourneyRouteStepProps,
} from './creation/route/journey-route-step';

export {
  JourneyScheduleStep,
  type JourneyScheduleStepProps,
} from './creation/schedule/journey-schedule-step';

export {
  JourneyVehicleStep,
  type JourneyVehicleStepProps,
} from './creation/vehicle/journey-vehicle-step';

export {
  JourneySeatsStep,
  type JourneySeatsStepProps,
} from './creation/seats/journey-seats-step';

export {
  JourneyPricingStep,
  type JourneyPricingStepProps,
} from './creation/pricing/journey-pricing-step';

export {
  JourneyPreferencesStep,
  type JourneyPreferencesStepProps,
} from './creation/preferences/journey-preferences-step';

export {
  JourneyPhotosStep,
  type JourneyPhotosStepProps,
} from './creation/photos/journey-photos-step';

export {
  JourneyReviewStep,
  type JourneyReviewStepProps,
} from './creation/review/journey-review-step';

export {
  JourneyDetailRoute,
  type JourneyDetailRouteProps,
} from './detail/journey-detail-route';

export {
  JourneyDetailSchedule,
  type JourneyDetailScheduleProps,
} from './detail/journey-detail-schedule';

export {
  JourneyDetailVehicle,
  type JourneyDetailVehicleProps,
} from './detail/journey-detail-vehicle';

export {
  JourneyDetailCapacity,
  type JourneyDetailCapacityProps,
} from './detail/journey-detail-capacity';

export {
  JourneyDetailPricing,
  type JourneyDetailPricingProps,
} from './detail/journey-detail-pricing';

export {
  JourneyDetailPreferences,
  type JourneyDetailPreferencesProps,
} from './detail/journey-detail-preferences';

export {
  JourneyDetailAssets,
  type JourneyDetailAssetsProps,
} from './detail/journey-detail-assets';

export {
  JourneyDetailHeader,
  type JourneyDetailHeaderProps,
} from './detail/journey-detail-header';

export {
  JourneyDetailContainer,
  type JourneyDetailContainerProps,
} from './detail/journey-detail-container';