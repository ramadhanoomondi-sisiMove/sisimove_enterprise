// -----------------------------------------------------------------------------
// sisiMove — Journey Settlement State Presentation
// -----------------------------------------------------------------------------
//
// Presentation helpers for Journey Settlement lifecycle state.
//
// Responsibilities:
// - classify settlement statuses for UI rendering;
// - expose stable semantic flags for components;
// - centralize settlement-state interpretation.
//
// Non-responsibilities:
// - submitting settlements;
// - processing settlements;
// - changing settlement state;
// - financial orchestration;
// - replacing backend settlement lifecycle rules.
//
// Journey Settlement is backend-owned. The frontend observes and presents
// its state; it does not use these helpers to orchestrate settlement.
// -----------------------------------------------------------------------------

import type { JourneySettlementStatus } from '../models/journey-settlement-status';

/**
 * Semantic presentation state for a Journey Settlement.
 */
export interface JourneySettlementState {
  /**
   * Settlement exists but has not yet been submitted for processing.
   */
  isPending: boolean;

  /**
   * Settlement has been submitted.
   */
  isSubmitted: boolean;

  /**
   * Settlement is currently being processed.
   */
  isProcessing: boolean;

  /**
   * Settlement completed successfully.
   */
  isCompleted: boolean;

  /**
   * Settlement processing failed.
   */
  isFailed: boolean;

  /**
   * Settlement is being held.
   */
  isHeld: boolean;

  /**
   * Settlement has been cancelled.
   */
  isCancelled: boolean;

  /**
   * Settlement has reached a terminal state.
   */
  isTerminal: boolean;
}

/**
 * Resolve the presentation state for a Journey Settlement status.
 *
 * This is descriptive only. It does not determine whether a settlement
 * transition is valid or permitted.
 */
export function getJourneySettlementState(
  status: JourneySettlementStatus,
): JourneySettlementState {
  return {
    isPending: status === 'PENDING',

    isSubmitted: status === 'SUBMITTED',

    isProcessing: status === 'PROCESSING',

    isCompleted: status === 'COMPLETED',

    isFailed: status === 'FAILED',

    isHeld: status === 'HELD',

    isCancelled: status === 'CANCELLED',

    isTerminal:
      status === 'COMPLETED' ||
      status === 'FAILED' ||
      status === 'CANCELLED',
  };
}