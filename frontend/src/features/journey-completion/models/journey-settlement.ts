// -----------------------------------------------------------------------------
// sisiMove — Journey Settlement Model
// -----------------------------------------------------------------------------
//
// API-facing representation of a JourneySettlement aggregate.
//
// Responsibilities:
// - represent serialized backend settlement data;
// - provide the frontend's canonical settlement read model;
// - keep settlement lifecycle state separate from JourneyCompletion.
//
// This model intentionally contains no lifecycle methods, financial logic,
// authorization logic, or locally derived settlement state.
//
// Settlement processing is backend-owned. The frontend should render the
// returned status and timestamps rather than recreating settlement transitions.
// -----------------------------------------------------------------------------

import type {
  JourneySettlementStatus,
} from './journey-settlement-status';

export interface JourneySettlement {
  /**
   * Public identifier of this JourneySettlement aggregate.
   */
  publicId: string;

  /**
   * Public identifier of the JourneyCompletion aggregate.
   *
   * This is the serialized value returned by the backend settlement mapper.
   */
  completionId: string;

  /**
   * Public identifier of the Journey associated with this settlement.
   */
  journeyPublicId: string;

  /**
   * Public identifier of the Journey provider receiving settlement.
   */
  providerPublicId: string;

  /**
   * Public identifier of the resulting Financial transaction, when one
   * has been created by the backend.
   *
   * This is intentionally not expanded into Financial-domain data here.
   */
  financialTransactionPublicId?: string;

  /**
   * Current settlement lifecycle status.
   */
  status: JourneySettlementStatus;

  /**
   * When settlement submission began, if applicable.
   */
  submittedAt?: string;

  /**
   * When settlement processing began, if applicable.
   */
  processingAt?: string;

  /**
   * When settlement completed successfully, if applicable.
   */
  completedAt?: string;

  /**
   * When settlement processing failed, if applicable.
   */
  failedAt?: string;

  /**
   * When settlement was placed on hold, if applicable.
   */
  heldAt?: string;

  /**
   * When settlement was cancelled, if applicable.
   */
  cancelledAt?: string;

  /**
   * Backend-provided failure reason, when settlement processing failed.
   *
   * Member-facing UI should not blindly expose this value without applying
   * the appropriate presentation/safety policy.
   */
  failureReason?: string;

  /**
   * Aggregate version used for concurrency control.
   */
  version: number;

  /**
   * Persistence creation timestamp.
   */
  createdAt: string;

  /**
   * Persistence update timestamp.
   */
  updatedAt: string;
}