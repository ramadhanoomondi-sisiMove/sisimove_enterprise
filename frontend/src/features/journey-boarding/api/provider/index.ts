// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Provider API Barrel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Re-export Journey Boarding provider operations.
// - Re-export their request, parameter, and response contracts.
// - Provide a stable import boundary for provider-specific API operations.
//
// Architectural rules:
// - This file contains exports only.
// - No HTTP logic belongs here.
// - No domain/business rules belong here.
// - Keep `.api` suffixes explicit to match the feature API structure.
// -----------------------------------------------------------------------------

export {
  boardProvider,
} from './board-provider.api';

export type {
  BoardProviderParams,
  BoardProviderRequest,
  BoardProviderResponse,
  BoardProviderParticipantResponse,
  BoardProviderEventResponse,
} from './board-provider.api';