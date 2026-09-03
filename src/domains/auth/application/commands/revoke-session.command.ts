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
// Session lifecycle transition:
//
//     ACTIVE → REVOKED
//
// The command carries only the information required by the application
// handler and Session aggregate to perform the revocation.
//
// The command handler is responsible for:
//
// - validating the command;
// - loading the Session aggregate;
// - supplying the revocation timestamp;
// - supplying the revocation reason;
// - invoking SessionAggregate.revoke();
// - persisting the aggregate;
// - allowing recorded domain events to be dispatched by the application
//   infrastructure.
//
// Aggregate affected:
//
// SessionAggregate
// └── SessionEntity
//
// The Session aggregate is responsible for:
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
// - revoke a Device;
// - validate Identity state;
// - validate Device state;
// - generate refresh tokens;
// - compare refresh tokens;
// - hash refresh tokens;
// - detect token reuse;
// - decide token-reuse policy;
// - sign or verify JWTs;
// - send notifications;
// - perform external side effects.
//
// Cross-session, token-family, authentication, notification, and other
// orchestration concerns belong to the application layer.
//
// -----------------------------------------------------------------------------
//
// Command Input
//
//     sessionPublicId
//         Identifies the Session aggregate being revoked.
//
//     revokedAt
//         Domain value object containing the revocation timestamp.
//
//     reason
//         Domain value object identifying why the Session is being revoked.
//
//     correlationId
//         Correlates the complete Session-revocation operation.
//
//     causationId
//         Optionally identifies the command/event that caused this command.
//
// -----------------------------------------------------------------------------
//
// Lifecycle Ownership
//
// Application Layer
//     ↓
// RevokeSessionCommand
//     ↓
// RevokeSessionHandler
//     ↓
// SessionAggregate.revoke()
//     ↓
// SessionEntity
//     ↓
// SessionRevokedEvent
//
// The command does not perform the lifecycle transition itself.
//
// -----------------------------------------------------------------------------
//
// Architectural Boundary
//
// The command depends only on:
//
// - Foundation application contracts;
// - Session domain value objects.
//
// It must not depend on:
//
// - Prisma;
// - NestJS infrastructure;
// - HTTP request/response objects;
// - JWT libraries;
// - repositories;
// - external services.
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
  /**
   * Creates a command representing the intent to revoke one Session.
   *
   * No domain transition is performed by the constructor.
   *
   * The transition is performed by:
   *
   *     RevokeSessionHandler
   *         ↓
   *     SessionAggregate.revoke()
   */
  public constructor(
    /**
     * Public identifier of the Session aggregate to revoke.
     */
    public readonly sessionPublicId: SessionPublicId,

    /**
     * Timestamp at which the Session is revoked.
     */
    public readonly revokedAt: SessionRevokedAt,

    /**
     * Domain reason for revoking the Session.
     *
     * Examples:
     *
     * - USER_LOGOUT
     * - PASSWORD_CHANGED
     * - PASSWORD_RESET
     * - ACCOUNT_LOCKED
     * - ACCOUNT_DISABLED
     * - DEVICE_REVOKED
     * - TOKEN_REUSE
     * - SESSION_EXPIRED
     * - SYSTEM
     */
    public readonly reason: SessionRevocationReason,

    /**
     * Correlation identifier for the complete Session-revocation operation.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or domain event that caused this
     * revocation command.
     */
    public readonly causationId?: string,
  ) {}
}
