// -----------------------------------------------------------------------------
// sisiMove — Journey Creation Components
// -----------------------------------------------------------------------------
//
// Public barrel for the complete Journey creation component surface.
//
// Architecture:
//
// - Presentation components remain reusable and workflow-agnostic.
// - JourneyReviewPage is the authenticated workflow container for the review
//   screen and owns query/mutation orchestration at the feature level.
// - API calls, mutation execution, route navigation, and workflow state do not
//   belong inside the individual presentation steps.
//
// Individual creation steps are responsible for rendering their UI and
// emitting user intent through props.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Shared creation workflow
// -----------------------------------------------------------------------------

export {
  JOURNEY_CREATION_STEPS,
  JourneyCreationProgress,
  type JourneyCreationProgressProps,
  type JourneyCreationStep,
} from './journey-creation-progress';

export {
  JourneyCreationNavigation,
  type JourneyCreationNavigationProps,
} from './journey-creation-navigation';

export {
  JourneyCreationShell,
  type JourneyCreationShellProps,
} from './journey-creation-shell';

// -----------------------------------------------------------------------------
// Route
// -----------------------------------------------------------------------------

export {
  JourneyCorridorForm,
  type JourneyCorridorFormProps,
  type JourneyCorridorFormSubmitValue,
  JourneyRouteStep,
  type JourneyRouteStepProps,
  JourneyWaypointsForm,
  type JourneyWaypointsFormProps,
  type JourneyWaypointsFormSubmitValue,
} from './route';

// -----------------------------------------------------------------------------
// Schedule
// -----------------------------------------------------------------------------

export {
  JourneyScheduleStep,
  type JourneyScheduleStepProps,
} from './schedule';

// -----------------------------------------------------------------------------
// Vehicle
// -----------------------------------------------------------------------------

export {
  JourneyVehicleStep,
  type JourneyVehicleStepProps,
} from './vehicle';

// -----------------------------------------------------------------------------
// Seats
// -----------------------------------------------------------------------------

export {
  JourneySeatsStep,
  type JourneySeatsStepProps,
} from './seats';

// -----------------------------------------------------------------------------
// Pricing
// -----------------------------------------------------------------------------

export {
  JourneyPricingStep,
  type JourneyPricingStepProps,
} from './pricing';

// -----------------------------------------------------------------------------
// Preferences
// -----------------------------------------------------------------------------

export {
  JourneyPreferencesStep,
  type JourneyPreferencesStepProps,
} from './preferences';

// -----------------------------------------------------------------------------
// Photos
// -----------------------------------------------------------------------------

export {
  JourneyPhotosStep,
  type JourneyPhotosStepProps,
} from './photos';

// -----------------------------------------------------------------------------
// Review — presentation
// -----------------------------------------------------------------------------
//
// JourneyReviewStep:
// - presentation-only review form shell;
// - renders supplied review content;
// - emits final publish intent.
//
// JourneyReviewSummary:
// - presentation-only Journey configuration summary;
// - receives already-loaded Journey data;
// - performs no API calls or mutations.
//
// -----------------------------------------------------------------------------

export {
  JourneyReviewStep,
  type JourneyReviewStepProps,
  JourneyReviewSummary,
  type JourneyReviewSummaryProps,
} from './review';

// -----------------------------------------------------------------------------
// Review — authenticated workflow container
// -----------------------------------------------------------------------------
//
// JourneyReviewPage owns:
//
// - loading the management Journey representation;
// - composing the review presentation;
// - invoking the publish mutation;
// - workflow-level mutation state.
//
// The underlying JourneyReviewStep and JourneyReviewSummary remain
// presentation-only.
//
// -----------------------------------------------------------------------------

export {
  JourneyReviewPage,
  type JourneyReviewPageProps,
} from './journey-review-page';