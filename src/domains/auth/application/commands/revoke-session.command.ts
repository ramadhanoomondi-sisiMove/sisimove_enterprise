// -----------------------------------------------------------------------------
// Session — Revoke Command
// -----------------------------------------------------------------------------
//
// Application command for revoking a Session aggregate.
//
// The command represents the application-level intent:
//
//     Revoke Session
//
// Revocation is a terminal Session lifecycle transition:
//
//     ACTIVE → REVOKED
//
// The command handler is responsible for:
//
// - loading the Session aggregate;
// - supplying the revocation timestamp and reason;
// - invoking SessionAggregate.revoke();
// - persisting the aggregate;
// - dispatching SessionRevokedEvent.
//
// Aggregate affected:
//
// SessionAggregate
// └── SessionEntity
//
// The aggregate is responsible for:
//
// - transitioning SessionStatus to REVOKED;
// - storing revokedAt;
// - storing revokedReason;
// - enforcing Session invariants;
// - recording SessionRevokedEvent.
//
// This command does NOT:
//
// - revoke other Sessions;
// - revoke an entire token family;
// - validate Identity state;
// - validate Device state;
// - generate or compare refresh tokens;
// - detect token reuse;
// - send notifications;
// - perform external side effects.
//
// Cross-session and token-family orchestration belongs to the application
// layer.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  SessionPublicId,
  SessionRevokedAt,
  SessionRevocationReason,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class RevokeSessionCommand implements Command {
  constructor(
    /**
     * Public identifier of the Session aggregate to revoke.
     */
    public readonly sessionPublicId: SessionPublicId,

    /**
     * Timestamp at which the Session is revoked.
     */
    public readonly revokedAt: SessionRevokedAt,

    /**
     * Reason for Session revocation.
     */
    public readonly reason: SessionRevocationReason,

    /**
     * Correlation identifier for the Session-revocation operation.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or event that caused this command.
     */
    public readonly causationId?: string,
  ) {}
}
