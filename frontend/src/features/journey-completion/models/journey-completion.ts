// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Model
// -----------------------------------------------------------------------------
//
// API-facing representation of a JourneyCompletion aggregate.
//
// Responsibilities:
// - represent serialized backend completion data;
// - provide the frontend's canonical completion read model;
// - compose the aggregate's confirmation and dispute collections.
//
// This model intentionally contains no lifecycle methods, authorization logic,
// settlement orchestration, or locally derived lifecycle state.
//
// The backend owns completion lifecycle transitions and authoritative counts.
// The frontend should render the returned status and counts as provided.
// -----------------------------------------------------------------------------

import type {
  JourneyCompletionStatus,
} from './journey-completion-status';

import type {
  JourneyCompletionConfirmation,
} from './journey-completion-confirmation';

import type {
  JourneyCompletionDispute,
} from './journey-completion-dispute';

export interface JourneyCompletion {
  /**
   * Public identifier of this JourneyCompletion aggregate.
   */
  publicId: string;

  /**
   * Public identifier of the Journey being completed.
   */
  journeyPublicId: string;

  /**
   * Public identifier of the Journey provider.
   */
  providerPublicId: string;

  /**
   * Current completion lifecycle status.
   */
  status: JourneyCompletionStatus;

  /**
   * Confirmations owned by this completion aggregate.
   */
  confirmations: JourneyCompletionConfirmation[];

  /**
   * Disputes owned by this completion aggregate.
   */
  disputes: JourneyCompletionDispute[];

  /**
   * Number of confirmations required before completion can be confirmed.
   */
  requiredConfirmations: number;

  /**
   * Backend-maintained count of confirmations currently contributing
   * to completion.
   */
  confirmedCount: number;

  /**
   * When completion was requested, if applicable.
   */
  completionRequestedAt?: string;

  /**
   * When the completion was confirmed, if applicable.
   */
  confirmedAt?: string;

  /**
   * When the completion entered the disputed state, if applicable.
   */
  disputedAt?: string;

  /**
   * When the completion was cancelled, if applicable.
   */
  cancelledAt?: string;

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