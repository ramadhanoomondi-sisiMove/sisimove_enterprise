// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Components Barrel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Provide the public component export surface for the Journey Boarding
//   feature.
// - Keep consumers independent from internal component directory structure.
//
// Architectural rules:
// - No business logic belongs in this barrel.
// - No component implementation belongs here.
// - Feature consumers should import reusable Journey Boarding components from
//   this public surface rather than reaching into individual implementation
//   files.
// -----------------------------------------------------------------------------

export {
  JourneyBoardingStatusBadge,
  type JourneyBoardingStatusBadgeProps,
} from "./boarding-status";

export {
  JourneyBoardingSummary,
  type JourneyBoardingSummaryProps,
} from "./boarding-summary";

export {
  JourneyBoardingProvider,
  type JourneyBoardingProviderProps,
} from "./boarding-provider";

export {
  JourneyBoardingActions,
  type JourneyBoardingActionsProps,
  OpenJourneyBoardingAction,
  type OpenJourneyBoardingActionProps,
  BoardProviderAction,
  type BoardProviderActionProps,
  BoardPassengerAction,
  type BoardPassengerActionProps,
  MarkPassengerNoShowAction,
  type MarkPassengerNoShowActionProps,
  WithdrawParticipantAction,
  type WithdrawParticipantActionProps,
  RemoveParticipantAction,
  type RemoveParticipantActionProps,
  StartJourneyAction,
  type StartJourneyActionProps,
  CancelJourneyBoardingAction,
  type CancelJourneyBoardingActionProps,
} from "./boarding-actions";

export {
  JourneyBoardingActivity,
  type JourneyBoardingActivityProps,
  JourneyBoardingEventItem,
  type JourneyBoardingEventItemProps,
} from "./boarding-activity";

export {
  JourneyBoardingCard,
  type JourneyBoardingCardProps,
} from "./boarding-card";

export {
  JourneyBoardingProgress,
  type JourneyBoardingProgressProps,
} from "./boarding-progress";

export {
  JourneyBoardingParticipant,
  type JourneyBoardingParticipantProps,
} from "./boarding-participants";


