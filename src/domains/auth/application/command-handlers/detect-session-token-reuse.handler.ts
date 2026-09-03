// -----------------------------------------------------------------------------
// Authentication — Detect Session Token Reuse Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for recording detection of refresh-token
// reuse against an existing Session aggregate.
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
// - supply the token-reuse detection timestamp;
// - supply correlation/causation metadata;
// - invoke SessionAggregate.recordTokenReuseDetected();
// - persist the aggregate.
//
// -----------------------------------------------------------------------------
//
// Domain responsibilities:
//
// - record the token-reuse detection event;
// - enforce aggregate-level event invariants;
// - validate the detection timestamp;
// - construct SessionTokenReuseDetectedEvent.
//
// -----------------------------------------------------------------------------
//
// Security/application responsibilities:
//
// Refresh-token reuse detection itself belongs to the surrounding
// authentication/security workflow.
//
// The workflow is responsible for:
//
// - receiving the raw refresh token;
// - locating the Session;
// - comparing the supplied token against the persisted credential;
// - determining that token reuse has occurred;
// - deciding the appropriate security response.
//
// Once reuse has been detected, this command records that fact against the
// Session aggregate.
//
// -----------------------------------------------------------------------------
//
// This handler does NOT:
//
// - receive the raw refresh token;
// - hash refresh tokens;
// - compare refresh tokens;
// - generate refresh tokens;
// - verify JWTs;
// - revoke the Session;
// - revoke a token family;
// - revoke other Sessions;
// - determine token-reuse policy;
// - validate Identity domain state;
// - validate Device domain state;
// - construct SessionEntity with `new`;
// - construct SessionAggregate with `new`;
// - construct domain events directly;
// - access Prisma;
// - send notifications;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Token-reuse detection flow:
//
//     Authentication / Security Workflow
//                 │
//                 │ token reuse detected
//                 ▼
//     DetectSessionTokenReuseCommand
//                 │
//                 ▼
//     DetectSessionTokenReuseHandler
//                 │
//                 ▼
//     SessionRepository.findByPublicId()
//                 │
//                 ▼
//     SessionAggregate.recordTokenReuseDetected()
//                 │
//                 ▼
//     SessionTokenReuseDetectedEvent
//                 │
//                 ▼
//     SessionRepository.save()
//
// -----------------------------------------------------------------------------
//
// Important:
//
// SessionAggregate.recordTokenReuseDetected() currently expects:
//
//     recordTokenReuseDetected(
//       detectedAt: Date,
//       correlationId: string,
//       causationId?: string,
//     )
//
// The handler therefore passes the command properties in exactly that order.
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

import type { DetectSessionTokenReuseCommand } from '../commands/detect-session-token-reuse.command';

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
 * Records detection of refresh-token reuse against a Session aggregate.
 *
 * The handler coordinates the application workflow.
 *
 * Token-reuse detection policy remains outside the Session aggregate.
 *
 * The aggregate is responsible only for recording the fact that reuse was
 * detected and constructing the corresponding domain event.
 */
@Injectable()
export class DetectSessionTokenReuseHandler implements CommandHandler<DetectSessionTokenReuseCommand> {
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
   * Executes the DetectSessionTokenReuseCommand.
   *
   * The handler does not perform token comparison. The surrounding
   * authentication/security workflow must already have determined that
   * refresh-token reuse occurred.
   */
  public async execute(command: DetectSessionTokenReuseCommand): Promise<void> {
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
    // 3. Record token-reuse detection
    // -------------------------------------------------------------------------
    //
    // The aggregate owns:
    //
    // - detection timestamp validation;
    // - domain-event construction;
    // - event metadata;
    // - aggregate-level invariants.
    //
    // The handler does not construct SessionTokenReuseDetectedEvent directly.
    // -------------------------------------------------------------------------

    aggregate.recordTokenReuseDetected(
      command.detectedAt,
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
  private ensureCommand(command: DetectSessionTokenReuseCommand): void {
    if (command === undefined || command === null) {
      throw new SessionException(
        'Detect Session token reuse command is required.',
      );
    }
  }

  /**
   * Validates required command properties.
   *
   * Validation here is structural only.
   *
   * Token-reuse semantics remain outside this handler and are represented by
   * the command having reached this application boundary.
   */
  private ensureRequiredCommandFields(
    command: DetectSessionTokenReuseCommand,
  ): void {
    // -------------------------------------------------------------------------
    // Session public identity
    // -------------------------------------------------------------------------

    if (command.sessionPublicId === undefined) {
      throw new SessionException('Session public ID is required.');
    }

    // -------------------------------------------------------------------------
    // Detection timestamp
    // -------------------------------------------------------------------------

    if (
      !(command.detectedAt instanceof Date) ||
      !Number.isFinite(command.detectedAt.getTime())
    ) {
      throw new SessionException(
        'Session token-reuse detection timestamp must be a valid date.',
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

export default DetectSessionTokenReuseHandler;
