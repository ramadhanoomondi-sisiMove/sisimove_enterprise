// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Participant API Barrel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Re-export Journey Boarding participant operations.
// - Re-export their request, parameter, and response contracts.
// - Provide a stable import boundary for participant-specific API operations.
//
// Architectural rules:
// - This file contains exports only.
// - No HTTP logic belongs here.
// - No domain/business rules belong here.
// - Keep `.api` suffixes explicit to match the feature API structure.
// -----------------------------------------------------------------------------

export {
  boardPassenger,
} from './board-passenger.api';

export type {
  BoardPassengerParams,
  BoardPassengerRequest,
  BoardPassengerResponse,
  BoardPassengerParticipantResponse,
  BoardPassengerEventResponse,
} from './board-passenger.api';

export {
  markPassengerNoShow,
} from './mark-passenger-no-show.api';

export type {
  MarkPassengerNoShowParams,
  MarkPassengerNoShowRequest,
  MarkPassengerNoShowResponse,
  MarkPassengerNoShowParticipantResponse,
  MarkPassengerNoShowEventResponse,
} from './mark-passenger-no-show.api';

export {
  withdrawParticipant,
} from './withdraw-participant.api';

export type {
  WithdrawParticipantParams,
  WithdrawParticipantRequest,
  WithdrawParticipantResponse,
  WithdrawParticipantParticipantResponse,
  WithdrawParticipantEventResponse,
} from './withdraw-participant.api';

export {
  removeParticipant,
} from './remove-participant.api';

export type {
  RemoveParticipantParams,
  RemoveParticipantRequest,
  RemoveParticipantResponse,
  RemoveParticipantParticipantResponse,
  RemoveParticipantEventResponse,
} from './remove-participant.api';