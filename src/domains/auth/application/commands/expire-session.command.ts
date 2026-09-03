// -----------------------------------------------------------------------------
// Session — Expire Command
// -----------------------------------------------------------------------------
//
// Application command for expiring a Session aggregate.
//
// The command represents the application-level intent:
//
//     Expire Session
//
// Expiration is a lifecycle transition:
//
//     ACTIVE → EXPIRED
//
// The command handler is responsible for:
//
// - loading the Session aggregate;
// - supplying the current reference time;
// - invoking SessionAggregate.expire();
// - persisting the aggregate when its state changes;
// - dispatching SessionExpiredEvent.
//
// The aggregate determines whether the Session has actually reached its
// expiration timestamp.
//
// Aggregate affected:
//
// SessionAggregate
// └── SessionEntity
//
// This command does NOT:
//
// - calculate Session expiry policy;
// - extend Session lifetime;
// - revoke the Session;
// - revoke other Sessions;
// - revoke a token family;
// - validate Identity state;
// - generate or compare refresh tokens;
// - send notifications;
// - perform external side effects.
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

export class ExpireSessionCommand implements Command {
  constructor(
    /**
     * Public identifier of the Session aggregate to expire.
     */
    public readonly sessionPublicId: SessionPublicId,

    /**
     * Current timestamp used by the aggregate to determine whether the
     * Session has expired.
     */
    public readonly referenceDate: Date,

    /**
     * Correlation identifier for the Session-expiration operation.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or event that caused this command.
     */
    public readonly causationId?: string,
  ) {}
}
