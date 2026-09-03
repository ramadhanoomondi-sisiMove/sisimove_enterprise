// -----------------------------------------------------------------------------
// Verification Request — Cancel Command
// -----------------------------------------------------------------------------
//
// Application command for cancelling a VerificationRequestEntity owned by a
// Verification aggregate.
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity
//
// Responsibilities:
//
// The command represents the intent to cancel one pending VerificationRequest.
//
// The command does NOT:
//
// - load the Verification aggregate;
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - mutate either entity directly;
// - cancel the VerificationRequestEntity directly;
// - cancel or change the Verification aggregate lifecycle;
// - perform persistence;
// - emit domain events directly;
// - modify Identity;
// - modify Identity roles;
// - perform asset-storage operations;
// - perform external verification-provider operations;
// - send notifications;
// - perform external side effects.
//
// The application handler loads the VerificationAggregate and invokes:
//
//     verificationAggregate.cancelRequest(...)
//
// The aggregate is responsible for:
//
// - resolving the VerificationRequestEntity;
// - validating request ownership;
// - validating the request lifecycle transition;
// - cancelling the pending VerificationRequestEntity;
// - recording VerificationRequestCancelledEvent.
//
// -----------------------------------------------------------------------------
//
// Request lifecycle:
//
// PENDING ───────► CANCELLED
//
// CANCELLED is terminal.
//
// Only a PENDING VerificationRequest may be cancelled.
//
// The VerificationRequestEntity enforces the request-level lifecycle rule.
//
// A VerificationRequest does NOT expire.
//
// Cancellation is a terminal outcome of the request itself and does not
// alter the lifecycle of the parent Verification aggregate.
//
// -----------------------------------------------------------------------------
//
// Aggregate lifecycle:
//
// Cancelling a VerificationRequest does NOT:
//
// - cancel the Verification aggregate;
// - reject the Verification aggregate;
// - expire the Verification aggregate;
// - revoke the Verification aggregate;
// - transition the Verification aggregate.
//
// The Verification aggregate remains governed exclusively by its own
// lifecycle and domain rules.
//
// -----------------------------------------------------------------------------
//
// Correlation / causation:
//
// - correlationId identifies the complete request-cancellation operation;
// - causationId optionally identifies the command, event, or operation that
//   caused this cancellation request.
//
// Both values are application-level metadata propagated to the resulting
// domain event.
//
// -----------------------------------------------------------------------------
//
// Timestamp:
//
// `cancelledAt` is optional.
//
// When omitted, the application handler/aggregate uses the current time.
//
// The aggregate validates the resulting cancellation timestamp.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  IdentityPublicId,
  VerificationRequestPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for cancelling a VerificationRequestEntity.
 *
 * The command carries the public identifiers and cancellation metadata
 * required by VerificationAggregate.cancelRequest().
 *
 * Required inputs:
 *
 * - identityPublicId;
 * - requestPublicId;
 * - correlationId.
 *
 * Optional inputs:
 *
 * - causationId;
 * - cancelledAt.
 *
 * The application layer is responsible for resolving the VerificationAggregate
 * using `identityPublicId`.
 *
 * The command does not contain business rules or directly mutate the
 * VerificationRequestEntity.
 */
export class CancelVerificationRequestCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Identity that owns the Verification aggregate.
     *
     * This is an opaque cross-aggregate public identifier and not a
     * persistence/database identifier.
     */
    public readonly identityPublicId: IdentityPublicId,

    /**
     * Public identity of the VerificationRequest to cancel.
     *
     * The VerificationAggregate resolves this request and verifies that it
     * belongs to the target Verification aggregate.
     */
    public readonly requestPublicId: VerificationRequestPublicId,

    /**
     * Correlation identifier for the request-cancellation operation and
     * resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command, event, or operation that caused this
     * cancellation request.
     */
    public readonly causationId?: string,

    /**
     * Optional timestamp at which the VerificationRequest cancellation is
     * considered to have occurred.
     *
     * When omitted, the application handler/aggregate uses the current time.
     */
    public readonly cancelledAt?: Date,
  ) {}
}
