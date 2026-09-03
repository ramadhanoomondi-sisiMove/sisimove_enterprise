// -----------------------------------------------------------------------------
// Verification — Expire Command
// -----------------------------------------------------------------------------
//
// Application command for expiring a Verification aggregate.
//
// The command represents the intent to transition a VERIFIED Verification
// into the EXPIRED lifecycle state.
//
// The command does NOT:
//
// - load the Verification aggregate;
// - mutate VerificationEntity directly;
// - mutate VerificationRequestEntity directly;
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - perform persistence;
// - emit VerificationExpiredEvent directly;
// - modify verification evidence directly;
// - reject or cancel verification requests;
// - revoke authentication sessions;
// - modify Identity;
// - send notifications;
// - perform external side effects.
//
// The application handler loads the VerificationAggregate and invokes:
//
//     verificationAggregate.expire(...)
//
// and persists the aggregate.
//
// The aggregate is responsible for:
//
// - validating the supplied timestamp;
// - validating that the Verification is currently VERIFIED;
// - validating that an expiration timestamp exists;
// - transitioning the Verification lifecycle to EXPIRED;
// - recording VerificationExpiredEvent.
//
// -----------------------------------------------------------------------------
//
// Expected lifecycle:
//
// VERIFIED ───────► EXPIRED
//
// EXPIRED is not directly terminal.
//
// An EXPIRED Verification may subsequently be renewed:
//
// EXPIRED ────────► PENDING
//
// through:
//
//     verificationAggregate.renew(...)
//
// -----------------------------------------------------------------------------
//
// Expiration semantics:
//
// The Verification aggregate owns the expiration lifecycle.
//
// `expiresAt` represents the expiration timestamp established when the
// Verification was approved.
//
// `expiredAt` represents the timestamp at which the expiration transition is
// actually applied.
//
// The aggregate validates that the Verification is VERIFIED and that its
// existing `expiresAt` value is present before performing the transition.
//
// The command therefore does not calculate or modify `expiresAt`.
//
// -----------------------------------------------------------------------------
//
// Correlation:
//
// `correlationId` identifies the command execution and is propagated to the
// VerificationExpiredEvent recorded by the aggregate.
//
// `causationId`, when supplied, identifies the command/event/operation that
// caused this expiration request.
//
// -----------------------------------------------------------------------------
//
// Timestamp:
//
// `expiredAt` is optional.
//
// When omitted, the application handler/aggregate uses the current time.
//
// The aggregate validates the resulting timestamp.
//
// -----------------------------------------------------------------------------
//
// Important:
//
// Expiring a Verification does not directly:
//
// - expire or cancel VerificationRequestEntity records;
// - revoke Identity access;
// - modify authentication state;
// - change roles;
// - send notifications;
// - perform external provider operations.
//
// Other bounded contexts or application processes may react to
// VerificationExpiredEvent independently.
//
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
 * Command for expiring a Verification aggregate.
 *
 * The command carries the public identity of the owning Identity together
 * with the correlation metadata required for the lifecycle operation.
 */
export class ExpireVerificationCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Identity that owns the Verification aggregate.
     *
     * This is an opaque public identifier and not a persistence identifier.
     *
     * The application layer uses this identifier to resolve the
     * VerificationAggregate.
     */
    public readonly identityPublicId: IdentityPublicId,

    /**
     * Correlation identifier for the command and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * expiration request.
     */
    public readonly causationId?: string,

    /**
     * Optional timestamp at which the Verification expiration is applied.
     *
     * When omitted, the application handler/aggregate uses the current time.
     */
    public readonly expiredAt?: Date,
  ) {}
}
