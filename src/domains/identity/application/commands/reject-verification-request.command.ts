// -----------------------------------------------------------------------------
// Verification Request — Reject Command
// -----------------------------------------------------------------------------
//
// Application command for rejecting a VerificationRequestEntity owned by a
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
// The command represents the intent to reject one submitted verification
// request.
//
// The command does NOT:
//
// - load the Verification aggregate;
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - mutate either entity directly;
// - reject the VerificationRequestEntity directly;
// - reject the Verification aggregate;
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
//     verificationAggregate.rejectRequest(...)
//
// The aggregate is responsible for:
//
// - resolving the VerificationRequestEntity;
// - validating request ownership;
// - validating the reviewing Identity;
// - validating the rejection reason;
// - validating the review timestamp;
// - rejecting the VerificationRequestEntity;
// - recording VerificationRequestRejectedEvent.
//
// -----------------------------------------------------------------------------
//
// Important distinction:
//
// Rejecting a VerificationRequest is NOT the same as rejecting the
// Verification aggregate.
//
// Request rejection:
//
//     verificationAggregate.rejectRequest(...)
//
// produces:
//
//     VerificationRequestRejectedEvent
//
// Aggregate rejection:
//
//     verificationAggregate.reject(...)
//
// produces:
//
//     VerificationRejectedEvent
//
// This command therefore targets only the VerificationRequest lifecycle.
//
// -----------------------------------------------------------------------------
//
// Request lifecycle:
//
// PENDING
//   ├──> APPROVED
//   ├──> REJECTED
//   └──> CANCELLED
//
// REJECTED is terminal.
//
// Only a currently reviewable PENDING request may be rejected. The
// VerificationRequestEntity enforces its request-level lifecycle rules.
//
// A VerificationRequest does NOT expire.
//
// Expiration is not part of the VerificationRequest lifecycle and is not
// represented by VerificationRequestStatus.
//
// The request remains a historical record of the submitted evidence and its
// review outcome.
//
// -----------------------------------------------------------------------------
//
// Verification lifecycle:
//
// Rejecting a VerificationRequest does NOT automatically reject the parent
// Verification aggregate.
//
// The parent Verification aggregate remains governed by its own lifecycle
// and determines whether another request may subsequently be submitted.
//
// The request-level rejection is therefore independent from aggregate-level
// Verification rejection.
//
// -----------------------------------------------------------------------------
//
// Reviewer:
//
// `reviewedByPublicId` identifies the Identity that performed the review.
//
// This is an opaque public identifier. The command does not resolve or mutate
// the reviewer Identity.
//
// -----------------------------------------------------------------------------
//
// Rejection reason:
//
// `reason` describes why the VerificationRequest was rejected.
//
// The VerificationAggregate normalizes and validates this value before
// applying the lifecycle transition and recording the domain event.
//
// The command carries the reason as application input; it does not contain
// rejection business rules.
//
// -----------------------------------------------------------------------------
//
// Correlation / causation:
//
// - correlationId identifies the complete request-rejection operation;
// - causationId optionally identifies the command, event, or operation that
//   caused this rejection request.
//
// Both values are application-level metadata propagated to the resulting
// domain event.
//
// -----------------------------------------------------------------------------
//
// Timestamp:
//
// `reviewedAt` is optional.
//
// When omitted, the application handler/aggregate uses the current time.
//
// The aggregate validates the resulting review timestamp.
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
 * Command for rejecting a VerificationRequestEntity.
 *
 * The command carries the public identifiers and review information required
 * by VerificationAggregate.rejectRequest().
 *
 * Required domain inputs:
 *
 * - identityPublicId;
 * - requestPublicId;
 * - reviewedByPublicId;
 * - reason;
 * - correlationId.
 *
 * Optional inputs:
 *
 * - causationId;
 * - reviewedAt.
 *
 * The application layer is responsible for resolving the VerificationAggregate
 * using `identityPublicId`.
 */
export class RejectVerificationRequestCommand implements Command {
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
     * Public identity of the VerificationRequest to reject.
     *
     * The VerificationAggregate resolves this request and verifies that it
     * belongs to the target Verification aggregate.
     */
    public readonly requestPublicId: VerificationRequestPublicId,

    /**
     * Public identity of the Identity that performed the verification review.
     *
     * This identifies the reviewer and remains an opaque public reference.
     */
    public readonly reviewedByPublicId: IdentityPublicId,

    /**
     * Reason for rejecting the VerificationRequest.
     *
     * The aggregate validates and normalizes this value.
     */
    public readonly reason: string,

    /**
     * Correlation identifier for the request-rejection operation and resulting
     * domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command, event, or operation that caused this
     * rejection request.
     */
    public readonly causationId?: string,

    /**
     * Optional timestamp at which the VerificationRequest rejection review is
     * considered to have occurred.
     *
     * When omitted, the aggregate uses the current time.
     */
    public readonly reviewedAt?: Date,
  ) {}
}
