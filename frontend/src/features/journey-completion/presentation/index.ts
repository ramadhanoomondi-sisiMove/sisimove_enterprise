// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Presentation Barrel
// -----------------------------------------------------------------------------
//
// Public exports for Journey Completion presentation helpers.
//
// This barrel intentionally exports presentation concerns only.
// API clients, query hooks, mutation hooks, and domain models remain in their
// respective layers.
// -----------------------------------------------------------------------------

export {
  getJourneyCompletionState,
} from './journey-completion-state';

export type {
  JourneyCompletionState,
} from './journey-completion-state';

export {
  JOURNEY_COMPLETION_STATUS_LABELS,
  getJourneyCompletionStatusLabel,
} from './journey-completion-labels';

export {
  getJourneySettlementState,
} from './journey-settlement-state';

export type {
  JourneySettlementState,
} from './journey-settlement-state';

export {
  JOURNEY_SETTLEMENT_STATUS_LABELS,
  getJourneySettlementStatusLabel,
} from './journey-settlement-labels';