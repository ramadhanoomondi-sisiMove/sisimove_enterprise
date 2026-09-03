// -----------------------------------------------------------------------------
// Verification — Revoke Command
// -----------------------------------------------------------------------------
//
// Application command for revoking a Verification aggregate.
//
// The command represents the intent to transition a Verification into the
// terminal REVOKED lifecycle state.
//
// The command does NOT:
//
// - load the Verification aggregate;
// - mutate VerificationEntity directly;
// - mutate VerificationRequestEntity directly;
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - perform persistence;
// - emit VerificationRevokedEvent directly;
// - reject a VerificationRequest;
// - expire a VerificationRequest;
// - modify Identity state;
// - modify Identity roles;
// - revoke authentication credentials;
// - terminate sessions;
// - send notifications;
// - perform external side effects.
//
// The application handler loads the VerificationAggregate and invokes:
//
//     verificationAggregate.revoke(...)
//
// and persists the aggregate.
//
// The aggregate is responsible for:
//
// - validating the revoking Identity;
// - validating the revocation reason;
// - validating the revocation timestamp;
// - enforcing the Verification lifecycle rules;
// - transitioning the Verification to REVOKED.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// VERIFIED ───────► REVOKED
//
// REVOKED is terminal.
//
// The aggregate determines whether the current Verification state is eligible
// for revocation.
//
// -----------------------------------------------------------------------------
//
// Reviewer / Revoker:
//
// `revokedByPublicId` identifies the Identity that performed the revocation.
//
// This is an opaque public identifier. The command does not load or mutate the
// referenced Identity aggregate.
//
// -----------------------------------------------------------------------------
//
// Revocation reason:
//
// `reason` describes why the Verification was revoked.
//
// The aggregate validates and normalizes this value before applying the
// lifecycle transition.
//
// -----------------------------------------------------------------------------
//
// Correlation:
//
// `correlationId` identifies the revocation operation.
//
// `causationId`, when supplied, identifies the command, event, or operation
// that caused this revocation request.
//
// -----------------------------------------------------------------------------
//
// Timestamp:
//
// `revokedAt` is optional.
//
// When omitted, the application handler/aggregate uses the current time.
//
// The aggregate validates the resulting timestamp.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { IdentityPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for revoking a Verification aggregate.
 *
 * The command carries the public identity of the Identity that owns the
 * Verification together with the reviewer/revoker, reason, and correlation
 * metadata required for the lifecycle operation.
 *
 * Required domain inputs:
 *
 * - identityPublicId;
 * - revokedByPublicId;
 * - reason;
 * - correlationId.
 *
 * Optional inputs:
 *
 * - causationId;
 * - revokedAt.
 *
 * The application layer is responsible for resolving the VerificationAggregate
 * using `identityPublicId`.
 */
export class RevokeVerificationCommand implements Command {
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
     * Public identity of the Identity that performed the revocation.
     *
     * This identifies the actor responsible for the verification revocation.
     * It does not establish an ownership relationship with that Identity.
     */
    public readonly revokedByPublicId: IdentityPublicId,

    /**
     * Business reason for revoking the Verification.
     *
     * The aggregate validates and normalizes the reason.
     */
    public readonly reason: string,

    /**
     * Correlation identifier for the revocation operation.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command, event, or operation that caused this
     * revocation request.
     */
    public readonly causationId?: string,

    /**
     * Optional timestamp at which the Verification revocation is considered
     * to occur.
     *
     * When omitted, the aggregate uses the current time.
     */
    public readonly revokedAt?: Date,
  ) {}
}
