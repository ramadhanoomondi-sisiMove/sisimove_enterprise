// -----------------------------------------------------------------------------
// Verification — Reject Command
// -----------------------------------------------------------------------------
//
// Application command for rejecting a Verification aggregate.
//
// The command represents the intent to transition a Verification into the
// REJECTED lifecycle state.
//
// The command does NOT:
//
// - load the Verification aggregate;
// - mutate VerificationEntity directly;
// - mutate VerificationRequestEntity directly;
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - perform persistence;
// - emit VerificationRejectedEvent directly;
// - reject a VerificationRequest directly;
// - delete verification evidence;
// - revoke authentication sessions;
// - modify Identity;
// - send notifications;
// - perform external side effects.
//
// The application handler loads the VerificationAggregate and invokes:
//
//     verificationAggregate.reject(...)
//
// and persists the aggregate.
//
// The aggregate is responsible for:
//
// - validating the lifecycle transition;
// - validating the reviewer;
// - validating the rejection reason;
// - resolving the supplied VerificationRequestEntity;
// - enforcing aggregate invariants;
// - changing the Verification lifecycle state;
// - recording VerificationRejectedEvent.
//
// -----------------------------------------------------------------------------
//
// Important distinction:
//
// Rejecting a VerificationRequest is NOT the same as rejecting the
// Verification aggregate.
//
// Request rejection uses:
//
//     verificationAggregate.rejectRequest(...)
//
// and records:
//
//     VerificationRequestRejectedEvent
//
// Aggregate rejection uses:
//
//     verificationAggregate.reject(...)
//
// and records:
//
//     VerificationRejectedEvent
//
// This command therefore targets the Verification aggregate lifecycle and
// requires the public identifier of the request associated with the
// aggregate-level rejection decision.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// PENDING ───────► REJECTED
//
// REJECTED ──────► PENDING
//
// The aggregate itself enforces whether the requested transition is valid.
//
// -----------------------------------------------------------------------------
//
// Request association:
//
// `requestPublicId` identifies the VerificationRequest that provides the
// domain context for the aggregate-level rejection.
//
// The command does not construct or load the request itself.
//
// The VerificationAggregate resolves the request through:
//
//     verificationAggregate.getRequest(requestPublicId)
//
// -----------------------------------------------------------------------------
//
// Reviewer:
//
// `reviewedByPublicId` identifies the Identity that performed the rejection
// review.
//
// The command carries this opaque public identifier across the application
// boundary. It does not resolve or mutate the reviewer Identity.
//
// -----------------------------------------------------------------------------
//
// Rejection reason:
//
// `reason` describes why the Verification aggregate was rejected.
//
// The aggregate normalizes and validates the reason before applying the
// lifecycle transition and recording the domain event.
//
// -----------------------------------------------------------------------------
//
// Correlation:
//
// `correlationId` identifies the command execution and is propagated to the
// VerificationRejectedEvent recorded by the aggregate.
//
// `causationId`, when supplied, identifies the command/event/operation that
// caused this rejection request.
//
// -----------------------------------------------------------------------------
//
// Timestamp:
//
// `reviewedAt` is optional.
//
// When omitted, the application handler/aggregate uses the current time.
//
// The aggregate validates the resulting timestamp.
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
 * Command for rejecting a Verification aggregate.
 *
 * The command carries the public identifiers and review information required
 * to perform an aggregate-level verification rejection.
 */
export class RejectVerificationCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identifier of the Verification aggregate's Identity.
     *
     * This identifies the Verification aggregate through its owning Identity
     * and is used by the application layer to resolve the aggregate.
     */
    public readonly identityPublicId: IdentityPublicId,

    /**
     * Public identifier of the VerificationRequest associated with the
     * aggregate-level rejection decision.
     *
     * The VerificationAggregate resolves and validates ownership of this
     * request.
     */
    public readonly requestPublicId: VerificationRequestPublicId,

    /**
     * Identity that performed the verification review and rejection.
     *
     * This is an opaque public identifier and is not resolved by the command.
     */
    public readonly reviewedByPublicId: IdentityPublicId,

    /**
     * Reason for rejecting the Verification aggregate.
     *
     * The aggregate validates and normalizes this value.
     */
    public readonly reason: string,

    /**
     * Correlation identifier for the command and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * rejection request.
     */
    public readonly causationId?: string,

    /**
     * Optional timestamp at which the rejection review is considered to have
     * occurred.
     *
     * When omitted, the application handler/aggregate uses the current time.
     */
    public readonly reviewedAt?: Date,
  ) {}
}
