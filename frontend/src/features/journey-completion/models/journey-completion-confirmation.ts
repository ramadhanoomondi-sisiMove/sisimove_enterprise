// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Confirmation Model
// -----------------------------------------------------------------------------
//
// API-facing representation of an individual JourneyCompletion confirmation.
//
// Responsibilities:
// - represent serialized backend confirmation data;
// - keep API data independent from domain entities;
// - provide a stable frontend model for queries, mappers, and UI.
//
// This model intentionally contains no lifecycle methods or derived state.
// Confirmation lifecycle decisions remain backend-owned.
// -----------------------------------------------------------------------------

import type {
  JourneyCompletionConfirmationRole,
} from './journey-completion-confirmation-role';

import type {
  JourneyCompletionConfirmationStatus,
} from './journey-completion-confirmation-status';

export interface JourneyCompletionConfirmation {
  /**
   * Public identifier of this confirmation.
   */
  publicId: string;

  /**
   * Public identifier of the JourneyCompletion aggregate.
   */
  completionId: string;

  /**
   * Public identifier of the member who made the confirmation.
   */
  memberPublicId: string;

  /**
   * Optional public identifier of the related booking.
   */
  bookingPublicId?: string;

  /**
   * Participant role represented by this confirmation.
   */
  role: JourneyCompletionConfirmationRole;

  /**
   * Current confirmation lifecycle status.
   */
  status: JourneyCompletionConfirmationStatus;

  /**
   * When the confirmation was made.
   */
  confirmedAt: string;

  /**
   * When the confirmation was withdrawn, if applicable.
   */
  withdrawnAt?: string;

  /**
   * Persistence creation timestamp.
   */
  createdAt: string;

  /**
   * Persistence update timestamp.
   */
  updatedAt: string;
}