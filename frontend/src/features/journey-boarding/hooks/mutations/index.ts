// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Mutation Hooks
// -----------------------------------------------------------------------------
//
// Public barrel for Journey Boarding mutation hooks.
//
// This file intentionally contains no implementation logic.
// -----------------------------------------------------------------------------

export {
  useCreateJourneyBoarding,
} from './use-create-journey-boarding';

export {
  useOpenJourneyBoarding,
} from './use-open-journey-boarding';

export {
  useStartJourney,
} from './use-start-journey';

export {
  useCancelJourneyBoarding,
} from './use-cancel-journey-boarding';

export {
  useBoardProvider,
} from './use-board-provider';

export {
  useBoardPassenger,
} from './use-board-passenger';

export {
  useMarkPassengerNoShow,
} from './use-mark-passenger-no-show';

export {
  useWithdrawParticipant,
} from './use-withdraw-participant';

export {
  useRemoveParticipant,
} from './use-remove-participant';

// -----------------------------------------------------------------------------
// Mutation variable contracts
// -----------------------------------------------------------------------------

export type {
  OpenJourneyBoardingVariables,
} from './use-open-journey-boarding';

export type {
  StartJourneyVariables,
} from './use-start-journey';

export type {
  CancelJourneyBoardingVariables,
} from './use-cancel-journey-boarding';

export type {
  BoardProviderVariables,
} from './use-board-provider';

export type {
  BoardPassengerVariables,
} from './use-board-passenger';

export type {
  MarkPassengerNoShowVariables,
} from './use-mark-passenger-no-show';

export type {
  WithdrawParticipantVariables,
} from './use-withdraw-participant';

export type {
  RemoveParticipantVariables,
} from './use-remove-participant';