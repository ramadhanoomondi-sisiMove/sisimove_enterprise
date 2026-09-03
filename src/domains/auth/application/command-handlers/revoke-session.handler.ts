// -----------------------------------------------------------------------------
// Authentication — Revoke Session Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for revoking an existing Session aggregate.
//
// Aggregate boundary:
//
// SessionAggregate
// └── SessionEntity
//
// -----------------------------------------------------------------------------
//
// APPLICATION RESPONSIBILITIES
//
// - validate command structure;
// - retrieve the Session aggregate;
// - invoke SessionAggregate.revoke();
// - persist the changed aggregate;
// - return the resulting aggregate to the caller.
//
// -----------------------------------------------------------------------------
//
// DOMAIN RESPONSIBILITIES
//
// SessionAggregate / SessionEntity own:
//
// - determining whether the Session can be revoked;
// - enforcing Session lifecycle invariants;
// - transitioning SessionStatus to REVOKED;
// - storing revokedAt;
// - storing revokedReason;
// - constructing SessionRevokedEvent.
//
// -----------------------------------------------------------------------------
//
// REVOCATION FLOW
//
//     RevokeSessionCommand
//              │
//              ▼
//     RevokeSessionHandler
//              │
//              ▼
//     SessionRepository.findByPublicId()
//              │
//              ▼
//     SessionAggregate.revoke()
//              │
//              ├── Session → REVOKED
//              │
//              └── SessionRevokedEvent
//                       │
//                       ▼
//              SessionRepository.save()
//                       │
//                       ▼
//               SessionAggregate
//
// -----------------------------------------------------------------------------
//
// IMPORTANT — RETURN CONTRACT
//
// The handler returns the persisted SessionAggregate.
//
// This is intentional because the HTTP controller may need to map the
// resulting aggregate into a SessionResponse:
//
//     const aggregate = await handler.execute(command);
//
//     return SessionResponseMapper.toResponse(aggregate);
//
// The handler therefore implements:
//
//     CommandHandler<
//       RevokeSessionCommand,
//       SessionAggregate
//     >
//
// -----------------------------------------------------------------------------
//
// THIS HANDLER DOES NOT
//
// - modify Session status directly;
// - modify SessionEntity properties directly;
// - construct SessionEntity with `new`;
// - construct SessionAggregate with `new`;
// - construct SessionRevokedEvent directly;
// - revoke other Sessions;
// - revoke an entire token family;
// - validate Identity domain state;
// - validate Device domain state;
// - generate refresh tokens;
// - compare refresh tokens;
// - perform token-reuse detection;
// - send notifications;
// - access Prisma;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// CROSS-SESSION REVOCATION
//
// If revoking this Session must also cause:
//
// - other Sessions to be revoked;
// - a token family to be revoked;
// - a Device to be revoked;
// - Identity authentication state to change;
//
// those operations belong to an application-level orchestration workflow.
//
// This handler is responsible only for the lifecycle transition of the
// specified Session aggregate.
//
// -----------------------------------------------------------------------------
//
// EVENT RULE
//
// SessionRevokedEvent is created exclusively by SessionAggregate.revoke().
//
// The handler supplies the correlation and causation context but does not
// construct the event itself.
//
// -----------------------------------------------------------------------------
//
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Authentication — Application Tokens
// -----------------------------------------------------------------------------

import { AUTH_TOKENS } from '../auth.tokens';

// -----------------------------------------------------------------------------
// Authentication — Application Command
// -----------------------------------------------------------------------------

import type { RevokeSessionCommand } from '../commands/revoke-session.command';

// -----------------------------------------------------------------------------
// Authentication — Domain Aggregate
// -----------------------------------------------------------------------------

import type { SessionAggregate } from '../../domain/aggregates/session.aggregate';

// -----------------------------------------------------------------------------
// Authentication — Domain Repository
// -----------------------------------------------------------------------------

import type { SessionRepository } from '../../domain/repositories/session.repository';

// -----------------------------------------------------------------------------
// Authentication — Domain Exception
// -----------------------------------------------------------------------------

import { SessionException } from '../../domain/exceptions/session.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Revokes an existing Session aggregate.
 *
 * The handler coordinates the application workflow while Session lifecycle
 * semantics remain owned by SessionAggregate / SessionEntity.
 *
 * Application flow:
 *
 *     RevokeSessionCommand
 *              │
 *              ▼
 *       command validation
 *              │
 *              ▼
 *     SessionRepository
 *              │
 *              ▼
 *     SessionAggregate.revoke()
 *              │
 *              ▼
 *       SessionRevokedEvent
 *              │
 *              ▼
 *     SessionRepository.save()
 *              │
 *              ▼
 *       SessionAggregate
 */
@Injectable()
export class RevokeSessionHandler implements CommandHandler<
  RevokeSessionCommand,
  SessionAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(AUTH_TOKENS.REPOSITORIES.SESSION)
    private readonly sessionRepository: SessionRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the RevokeSessionCommand.
   *
   * The handler performs application orchestration only.
   *
   * SessionAggregate.revoke() owns:
   *
   * - Session lifecycle semantics;
   * - revocation state transition;
   * - revokedAt;
   * - revokedReason;
   * - SessionRevokedEvent construction.
   *
   * The persisted aggregate is returned to the caller.
   */
  public async execute(
    command: RevokeSessionCommand,
  ): Promise<SessionAggregate> {
    // -------------------------------------------------------------------------
    // 1. Validate command
    // -------------------------------------------------------------------------

    this.ensureCommand(command);

    this.ensureRequiredCommandFields(command);

    // -------------------------------------------------------------------------
    // 2. Retrieve Session aggregate
    // -------------------------------------------------------------------------
    //
    // The repository returns the complete aggregate.
    //
    // The handler never retrieves or modifies the underlying entity directly.
    // -------------------------------------------------------------------------

    const aggregate = await this.sessionRepository.findByPublicId(
      command.sessionPublicId,
    );

    if (aggregate === null) {
      throw new SessionException('Session could not be found.');
    }

    // -------------------------------------------------------------------------
    // 3. Revoke Session
    // -------------------------------------------------------------------------
    //
    // SessionAggregate.revoke() owns:
    //
    // - lifecycle validation;
    // - Session state transition;
    // - revokedAt;
    // - revokedReason;
    // - SessionRevokedEvent construction.
    //
    // The handler deliberately does not reproduce those rules.
    // -------------------------------------------------------------------------

    aggregate.revoke(
      command.revokedAt,
      command.reason,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 4. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate is the unit of persistence.
    //
    // The repository is responsible for translating the aggregate into the
    // persistence model.
    //
    // The handler never accesses Prisma directly.
    // -------------------------------------------------------------------------

    await this.sessionRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // 5. Return aggregate
    // -------------------------------------------------------------------------
    //
    // Returning the aggregate allows application consumers such as the HTTP
    // controller to map the resulting state into their response model.
    // -------------------------------------------------------------------------

    return aggregate;
  }

  // ===========================================================================
  // Command Validation
  // ===========================================================================

  // ---------------------------------------------------------------------------
  // Command
  // ---------------------------------------------------------------------------

  /**
   * Ensures that a command instance was supplied.
   */
  private ensureCommand(command: RevokeSessionCommand): void {
    if (command === undefined || command === null) {
      throw new SessionException('Revoke Session command is required.');
    }
  }

  // ---------------------------------------------------------------------------
  // Required Fields
  // ---------------------------------------------------------------------------

  /**
   * Validates the structural requirements of the command.
   *
   * This method intentionally does not reproduce Session lifecycle rules.
   *
   * Domain semantics remain inside SessionAggregate / SessionEntity.
   */
  private ensureRequiredCommandFields(command: RevokeSessionCommand): void {
    // -------------------------------------------------------------------------
    // Session public identity
    // -------------------------------------------------------------------------

    if (command.sessionPublicId === undefined) {
      throw new SessionException('Session public ID is required.');
    }

    // -------------------------------------------------------------------------
    // Revoked-at timestamp
    // -------------------------------------------------------------------------

    if (command.revokedAt === undefined) {
      throw new SessionException('Session revoked-at timestamp is required.');
    }

    if (
      !(command.revokedAt.value instanceof Date) ||
      !Number.isFinite(command.revokedAt.value.getTime())
    ) {
      throw new SessionException(
        'Session revoked-at timestamp must be a valid date.',
      );
    }

    // -------------------------------------------------------------------------
    // Revocation reason
    // -------------------------------------------------------------------------

    if (command.reason === undefined) {
      throw new SessionException('Session revocation reason is required.');
    }

    if (
      typeof command.reason.value !== 'string' ||
      command.reason.value.trim().length === 0
    ) {
      throw new SessionException(
        'Session revocation reason must be a non-empty value.',
      );
    }

    // -------------------------------------------------------------------------
    // Correlation ID
    // -------------------------------------------------------------------------

    if (
      typeof command.correlationId !== 'string' ||
      command.correlationId.trim().length === 0
    ) {
      throw new SessionException('Session correlation ID is required.');
    }

    // -------------------------------------------------------------------------
    // Causation ID
    // -------------------------------------------------------------------------

    if (
      command.causationId !== undefined &&
      (typeof command.causationId !== 'string' ||
        command.causationId.trim().length === 0)
    ) {
      throw new SessionException(
        'Session causation ID must be a non-empty string when provided.',
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RevokeSessionHandler;
