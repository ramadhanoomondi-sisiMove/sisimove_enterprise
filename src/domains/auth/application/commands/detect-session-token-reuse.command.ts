// -----------------------------------------------------------------------------
// Session — Detect Token Reuse Command
// -----------------------------------------------------------------------------
//
// Application command for recording refresh-token reuse detection.
//
// The command represents the application-level intent:
//
//     Detect Session Token Reuse
//
// Token comparison and reuse detection are security-infrastructure concerns.
// Once the security boundary has determined that a refresh token has been
// reused, this command records that security observation against the
// appropriate Session aggregate.
//
// The command handler is responsible for:
//
// - locating the Session aggregate;
// - invoking SessionAggregate.recordTokenReuseDetected();
// - persisting the aggregate;
// - dispatching SessionTokenReuseDetectedEvent;
// - coordinating any subsequent token-family/session revocation policy.
//
// The aggregate records the security fact but does NOT decide what other
// Sessions should be revoked.
//
// Aggregate affected:
//
// SessionAggregate
// └── SessionEntity
//
// This command does NOT:
//
// - receive or expose the raw refresh token;
// - compare raw tokens;
// - hash tokens;
// - determine whether a token is valid;
// - revoke the entire token family;
// - revoke other Sessions;
// - generate tokens;
// - validate Identity state;
// - validate Device state;
// - send notifications.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { SessionPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class DetectSessionTokenReuseCommand implements Command {
  constructor(
    /**
     * Public identifier of the Session associated with the detected token
     * reuse.
     */
    public readonly sessionPublicId: SessionPublicId,

    /**
     * Timestamp at which refresh-token reuse was detected.
     */
    public readonly detectedAt: Date,

    /**
     * Correlation identifier for the token-reuse detection operation.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or event that caused this command.
     */
    public readonly causationId?: string,
  ) {}
}
