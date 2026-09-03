// -----------------------------------------------------------------------------
// Authentication — Expire Session Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for evaluating and expiring an existing
// Session aggregate.
//
// Aggregate boundary:
//
// SessionAggregate
// └── SessionEntity
//
// -----------------------------------------------------------------------------
//
// Application responsibilities:
//
// - validate command input;
// - retrieve the Session aggregate;
// - supply the correlation metadata;
// - supply the current reference timestamp;
// - invoke SessionAggregate.expire();
// - persist the aggregate.
//
// -----------------------------------------------------------------------------
//
// Domain responsibilities:
//
// - determine whether the Session has reached its expiry timestamp;
// - enforce Session lifecycle invariants;
// - transition ACTIVE → EXPIRED when appropriate;
// - construct SessionExpiredEvent.
//
// -----------------------------------------------------------------------------
//
// This handler does NOT:
//
// - calculate Session expiration policy;
// - determine expiration independently;
// - modify Session status directly;
// - construct SessionEntity with `new`;
// - construct SessionAggregate with `new`;
// - construct domain events directly;
// - access Prisma;
// - validate Identity domain state;
// - validate Device domain state;
// - revoke Sessions;
// - revoke token families;
// - generate refresh tokens;
// - hash refresh tokens;
// - compare refresh tokens;
// - send notifications;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Expiration flow:
//
//     ExpireSessionCommand
//              │
//              ▼
//     ExpireSessionHandler
//              │
//              ▼
//     SessionRepository.findByPublicId()
//              │
//              ▼
//     SessionAggregate.expire()
//              │
//              ├── not expired
//              │
//              └── expired
//                     │
//                     ▼
//              Session → EXPIRED
//                     │
//                     ▼
//             SessionExpiredEvent
//                     │
//                     ▼
//            SessionRepository.save()
//
// -----------------------------------------------------------------------------
//
// Important:
//
// SessionAggregate.expire() currently has the following signature:
//
//     expire(
//       correlationId: string,
//       referenceDate: Date = new Date(),
//       causationId?: string,
//     )
//
// Therefore the handler MUST pass `correlationId` first and `referenceDate`
// second.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
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

import type { ExpireSessionCommand } from '../commands/expire-session.command';

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
 * Evaluates and expires a Session aggregate.
 *
 * The handler coordinates the application workflow.
 *
 * Expiration semantics, lifecycle transitions, and domain-event construction
 * remain owned by the Session aggregate/entity.
 */
@Injectable()
export class ExpireSessionHandler implements CommandHandler<ExpireSessionCommand> {
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
   * Executes the ExpireSessionCommand.
   *
   * The reference date is supplied to the aggregate, which determines whether
   * the Session has actually expired.
   */
  public async execute(command: ExpireSessionCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Validate command
    // -------------------------------------------------------------------------

    this.ensureCommand(command);

    this.ensureRequiredCommandFields(command);

    // -------------------------------------------------------------------------
    // 2. Retrieve aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.sessionRepository.findByPublicId(
      command.sessionPublicId,
    );

    if (aggregate === null) {
      throw new SessionException('Session could not be found.');
    }

    // -------------------------------------------------------------------------
    // 3. Expire Session
    // -------------------------------------------------------------------------
    //
    // The aggregate owns:
    //
    // - expiration evaluation;
    // - lifecycle validation;
    // - ACTIVE → EXPIRED transition;
    // - SessionExpiredEvent construction.
    //
    // IMPORTANT:
    //
    // SessionAggregate.expire() expects:
    //
    //     correlationId,
    //     referenceDate,
    //     causationId
    //
    // Do not reverse the first two arguments.
    // -------------------------------------------------------------------------

    aggregate.expire(
      command.correlationId,
      command.referenceDate,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 4. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate is the unit of persistence.
    //
    // The repository decides how the changed aggregate is persisted.
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
  private ensureCommand(command: ExpireSessionCommand): void {
    if (command === undefined || command === null) {
      throw new SessionException('Expire Session command is required.');
    }
  }

  /**
   * Validates required command properties.
   *
   * Validation here is structural only.
   *
   * Session expiration semantics remain owned by the domain aggregate/entity.
   */
  private ensureRequiredCommandFields(command: ExpireSessionCommand): void {
    // -------------------------------------------------------------------------
    // Session public identity
    // -------------------------------------------------------------------------

    if (command.sessionPublicId === undefined) {
      throw new SessionException('Session public ID is required.');
    }

    // -------------------------------------------------------------------------
    // Reference date
    // -------------------------------------------------------------------------

    if (
      !(command.referenceDate instanceof Date) ||
      !Number.isFinite(command.referenceDate.getTime())
    ) {
      throw new SessionException(
        'Session expiration reference date must be a valid date.',
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

export default ExpireSessionHandler;
