
/**
 * sisiMove — Journey Completion Model
 *
 * Frontend types for journey completion, participant confirmations,
 * and disputes.
 *
 * This file defines data contracts only. Completion eligibility,
 * confirmation rules, dispute resolution, and lifecycle transitions
 * remain governed by the backend.
 */

// -----------------------------------------------------------------------------
// Completion status and confirmation types
// -----------------------------------------------------------------------------

export type JourneyCompletionStatus = string;

export type JourneyCompletionConfirmationRole = string;

export type JourneyCompletionConfirmationStatus = string;

export type JourneyCompletionDisputeStatus = string;

// -----------------------------------------------------------------------------
// Completion confirmation
// -----------------------------------------------------------------------------

export interface JourneyCompletionConfirmation {
  publicId: string;
  completionId: string;
  memberPublicId: string;
  bookingPublicId?: string | null;

  role: JourneyCompletionConfirmationRole;
  status: JourneyCompletionConfirmationStatus;

  confirmedAt: string | null;
  withdrawnAt: string | null;

  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Completion dispute
// -----------------------------------------------------------------------------

export interface JourneyCompletionDispute {
  publicId: string;
  completionId: string;
  raisedByPublicId: string;

  reason: string;
  description?: string | null;

  status: JourneyCompletionDisputeStatus;

  resolvedByPublicId?: string | null;
  resolutionSummary?: string | null;

  openedAt: string;
  resolvedAt: string | null;
  rejectedAt: string | null;
  withdrawnAt: string | null;

  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Journey completion
// -----------------------------------------------------------------------------

export interface JourneyCompletion {
  publicId: string;
  journeyPublicId: string;
  providerPublicId: string;

  status: JourneyCompletionStatus;

  completionRequestedAt: string | null;
  confirmedAt: string | null;
  disputedAt: string | null;
  cancelledAt: string | null;

  requiredConfirmations: number;
  confirmedCount: number;
  version: number;

  confirmations: JourneyCompletionConfirmation[];
  disputes: JourneyCompletionDispute[];

  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// API response alias
// -----------------------------------------------------------------------------

export type JourneyCompletionResponseModel = JourneyCompletion;
