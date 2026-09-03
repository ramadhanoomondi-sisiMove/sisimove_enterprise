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
// - validate command input;
// - retrieve the Session aggregate;
// - invoke SessionAggregate.revoke();
// - persist the changed aggregate.
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
// SessionRevokedEvent is created exclusively by the Session aggregate.
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
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Authentication Tokens
// -----------------------------------------------------------------------------

import { AUTH_TOKENS } from '../auth.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { RevokeSessionCommand } from '../commands/revoke-session.command';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { SessionRepository } from '../../domain/repositories/session.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SessionException } from '../../domain/exceptions/session.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Revokes an existing Session aggregate.
 *
 * The handler coordinates the application workflow while Session lifecycle
 * semantics remain owned by the Session aggregate/entity.
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
 */
@Injectable()
export class RevokeSessionHandler implements CommandHandler<RevokeSessionCommand> {
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
   * The Session aggregate owns the revocation transition, lifecycle
   * invariants, revoked state, and domain-event construction.
   */
  public async execute(command: RevokeSessionCommand): Promise<void> {
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
    // - ACTIVE → REVOKED transition;
    // - revokedAt;
    // - revokedReason;
    // - SessionRevokedEvent construction.
    //
    // The handler deliberately does not reproduce these rules.
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
  }

  // ===========================================================================
  // Command Validation
  // ===========================================================================

  /**
   * Ensures that the command exists.
   */
  private ensureCommand(command: RevokeSessionCommand): void {
    if (command === undefined || command === null) {
      throw new SessionException('Revoke Session command is required.');
    }
  }

  /**
   * Validates required command properties.
   *
   * Validation here is structural only.
   *
   * Session revocation semantics remain owned by the domain aggregate/entity.
   */
  private ensureRequiredCommandFields(command: RevokeSessionCommand): void {
    // -------------------------------------------------------------------------
    // Session public identity
    // -------------------------------------------------------------------------

    if (command.sessionPublicId === undefined) {
      throw new SessionException('Session public ID is required.');
    }

    // -------------------------------------------------------------------------
    // Revocation timestamp
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
