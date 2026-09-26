// -----------------------------------------------------------------------------
// sisiMove — Journey Completion State Presentation
// -----------------------------------------------------------------------------
//
// Presentation helpers for Journey Completion lifecycle state.
//
// Responsibilities:
// - classify backend completion statuses for UI rendering;
// - expose stable semantic flags for components;
// - keep status interpretation in one place.
//
// Non-responsibilities:
// - changing completion state;
// - performing API calls;
// - deciding authorization;
// - deciding whether a transition is allowed;
// - replacing backend/domain lifecycle rules.
//
// The backend remains authoritative for the actual lifecycle.
// These helpers only describe how an already-received state should be
// presented by the frontend.
// -----------------------------------------------------------------------------

import type { JourneyCompletionStatus } from '../models/journey-completion-status';

/**
 * Semantic presentation state for a Journey Completion.
 */
export interface JourneyCompletionState {
  /**
   * Completion has been created but completion processing has not yet
   * reached the confirmation stage.
   */
  isPending: boolean;

  /**
   * The completion is waiting for the required confirmations.
   */
  isConfirmationRequired: boolean;

  /**
   * Required confirmations have been satisfied.
   */
  isConfirmed: boolean;

  /**
   * A dispute currently affects the completion.
   */
  isDisputed: boolean;

  /**
   * Completion has been cancelled.
   */
  isCancelled: boolean;

  /**
   * The completion is in a terminal state.
   */
  isTerminal: boolean;
}

/**
 * Resolve the presentation state for a Journey Completion status.
 *
 * This function deliberately performs no lifecycle validation.
 * It is only a deterministic mapping from backend status to UI semantics.
 */
export function getJourneyCompletionState(
  status: JourneyCompletionStatus,
): JourneyCompletionState {
  return {
    isPending: status === 'PENDING',

    isConfirmationRequired:
      status === 'CONFIRMATION_REQUIRED',

    isConfirmed:
      status === 'CONFIRMED',

    isDisputed:
      status === 'DISPUTED',

    isCancelled:
      status === 'CANCELLED',

    isTerminal:
      status === 'CONFIRMED' ||
      status === 'CANCELLED',
  };
}