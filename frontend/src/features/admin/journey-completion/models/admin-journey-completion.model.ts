// -----------------------------------------------------------------------------
// Admin Journey Completion — Models
// -----------------------------------------------------------------------------

import type {
  AdminJourneyCompletionConfirmationRole,
  AdminJourneyCompletionConfirmationStatus,
  AdminJourneyCompletionDisputeReason,
  AdminJourneyCompletionDisputeStatus,
  AdminJourneyCompletionStatus,
} from './admin-journey-completion.enums';

// -----------------------------------------------------------------------------
// Date Type
// -----------------------------------------------------------------------------

/**
 * Date values received through JSON HTTP responses.
 *
 * Backend Date instances are serialized into ISO-8601 strings.
 */
export type AdminJourneyCompletionDate = string;

// -----------------------------------------------------------------------------
// Journey Completion Confirmation
// -----------------------------------------------------------------------------

export interface AdminJourneyCompletionConfirmation {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: string;

  completionId: string;

  memberPublicId: string;

  bookingPublicId?: string;

  // ---------------------------------------------------------------------------
  // Confirmation
  // ---------------------------------------------------------------------------

  role: AdminJourneyCompletionConfirmationRole;

  status: AdminJourneyCompletionConfirmationStatus;

  confirmedAt: AdminJourneyCompletionDate;

  withdrawnAt?: AdminJourneyCompletionDate;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: AdminJourneyCompletionDate;

  updatedAt: AdminJourneyCompletionDate;
}

// -----------------------------------------------------------------------------
// Journey Completion Dispute
// -----------------------------------------------------------------------------

export interface AdminJourneyCompletionDispute {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: string;

  completionId: string;

  raisedByPublicId: string;

  // ---------------------------------------------------------------------------
  // Dispute
  // ---------------------------------------------------------------------------

  reason: AdminJourneyCompletionDisputeReason;

  description?: string;

  status: AdminJourneyCompletionDisputeStatus;

  // ---------------------------------------------------------------------------
  // Resolution
  // ---------------------------------------------------------------------------

  resolvedByPublicId?: string;

  resolutionSummary?: string;

  openedAt: AdminJourneyCompletionDate;

  resolvedAt?: AdminJourneyCompletionDate;

  rejectedAt?: AdminJourneyCompletionDate;

  withdrawnAt?: AdminJourneyCompletionDate;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: AdminJourneyCompletionDate;

  updatedAt: AdminJourneyCompletionDate;
}

// -----------------------------------------------------------------------------
// Journey Completion
// -----------------------------------------------------------------------------

export interface AdminJourneyCompletion {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: string;

  journeyPublicId: string;

  providerPublicId: string;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  status: AdminJourneyCompletionStatus;

  completionRequestedAt?: AdminJourneyCompletionDate;

  confirmedAt?: AdminJourneyCompletionDate;

  disputedAt?: AdminJourneyCompletionDate;

  cancelledAt?: AdminJourneyCompletionDate;

  requiredConfirmations: number;

  confirmedCount: number;

  version: number;

  // ---------------------------------------------------------------------------
  // Confirmations
  // ---------------------------------------------------------------------------

  confirmations: AdminJourneyCompletionConfirmation[];

  // ---------------------------------------------------------------------------
  // Disputes
  // ---------------------------------------------------------------------------

  disputes: AdminJourneyCompletionDispute[];

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: AdminJourneyCompletionDate;

  updatedAt: AdminJourneyCompletionDate;
}

// -----------------------------------------------------------------------------
// Collections
// -----------------------------------------------------------------------------

export type AdminJourneyCompletionCollection =
  AdminJourneyCompletion[];

export type AdminJourneyCompletionConfirmationCollection =
  AdminJourneyCompletionConfirmation[];

export type AdminJourneyCompletionDisputeCollection =
  AdminJourneyCompletionDispute[];

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AdminJourneyCompletion;