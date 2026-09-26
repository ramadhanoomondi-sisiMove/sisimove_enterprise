// -----------------------------------------------------------------------------
// sisiMove — Journey Completion API
// -----------------------------------------------------------------------------
//
// Root API barrel for the Journey Completion feature.
//
// Why this barrel uses explicit exports:
//
// The individual API adapters intentionally keep their own transport response
// contracts close to the endpoint that consumes them. Several adapters
// therefore contain similarly named response interfaces, for example:
//
//     GetJourneyCompletionConfirmationResponse
//     GetJourneyCompletionDisputeResponse
//
// Re-exporting every symbol from every child barrel with:
//
//     export * from './discovery';
//     export * from './confirmations';
//     ...
//
// creates ambiguous exports when two API modules expose the same TypeScript
// symbol name.
//
// The root barrel therefore exposes the public API functions explicitly,
// while keeping endpoint-specific transport contracts local to their API
// modules.
//
// This gives consumers a stable feature-level import boundary without forcing
// us to rename or unnecessarily centralize transport contracts.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Discovery
// -----------------------------------------------------------------------------

export {
  getJourneyCompletion,
} from './discovery/get-journey-completion.api';

export {
  getJourneyCompletionByJourney,
} from './discovery/get-journey-completion-by-journey.api';

export {
  listJourneyCompletions,
} from './discovery/list-journey-completions.api';

export {
  getJourneyCompletionsByProvider,
} from './discovery/get-journey-completions-by-provider.api';

export {
  getJourneyCompletionsByStatus,
} from './discovery/get-journey-completions-by-status.api';

// -----------------------------------------------------------------------------
// Confirmations
// -----------------------------------------------------------------------------

export {
  getJourneyCompletionConfirmations,
} from './confirmations/get-journey-completion-confirmations.api';

export {
  getJourneyCompletionConfirmation,
} from './confirmations/get-journey-completion-confirmation.api';

// -----------------------------------------------------------------------------
// Disputes — Discovery
// -----------------------------------------------------------------------------

export {
  getJourneyCompletionDisputes,
} from './disputes/get-journey-completion-disputes.api';

export {
  getJourneyCompletionDispute,
} from './disputes/get-journey-completion-dispute.api';

// -----------------------------------------------------------------------------
// Disputes — Lifecycle
// -----------------------------------------------------------------------------

export {
  openJourneyCompletionDispute,
} from './disputes/open-journey-completion-dispute.api';

export {
  withdrawJourneyCompletionDispute,
} from './disputes/withdraw-journey-completion-dispute.api';

// -----------------------------------------------------------------------------
// Journey Completion Lifecycle
// -----------------------------------------------------------------------------

export {
  createJourneyCompletion,
} from './lifecycle/create-journey-completion.api';

export {
  requestJourneyCompletion,
} from './lifecycle/request-journey-completion.api';

export {
  confirmJourneyCompletion,
} from './lifecycle/confirm-journey-completion.api';

export {
  withdrawJourneyCompletionConfirmation,
} from './lifecycle/withdraw-journey-completion-confirmation.api';

export {
  cancelJourneyCompletion,
} from './lifecycle/cancel-journey-completion.api';

// -----------------------------------------------------------------------------
// Settlement Discovery
// -----------------------------------------------------------------------------

export {
  getJourneySettlementByCompletion,
} from './settlement/get-journey-settlement-by-completion.api';

export {
  getJourneySettlement,
} from './settlement/get-journey-settlement.api';

export {
  listJourneySettlements,
} from './settlement/list-journey-settlements.api';