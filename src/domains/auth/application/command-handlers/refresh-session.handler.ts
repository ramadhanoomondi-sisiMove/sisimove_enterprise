// -----------------------------------------------------------------------------
// Authentication — Refresh Session Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for refreshing an existing Session
// aggregate.
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
// - invoke the aggregate refresh operation;
// - persist the refreshed aggregate.
//
// -----------------------------------------------------------------------------
//
// Domain responsibilities:
//
// - determine whether the Session may be refreshed;
// - enforce Session lifecycle invariants;
// - rotate the refresh-token hash;
// - update the latest Session activity;
// - maintain token-family and rotation lineage;
// - enforce replacement/revocation rules;
// - construct Session domain events.
//
// -----------------------------------------------------------------------------
//
// Security responsibilities:
//
// Refresh-token verification and new-token generation occur BEFORE this
// command reaches the Session application boundary.
//
// Expected security flow:
//
//     Client
//        │
//        │ raw refresh token
//        ▼
//     Authentication Workflow
//        │
//        ├── SessionRepository.findByPublicId()
//        │
//        ├── HashingService.verify(
//        │      rawRefreshToken,
//        │      persistedRefreshTokenHash,
//        │   )
//        │
//        ├── TokenService.generateRefreshToken()
//        │
//        ├── HashingService.hash(newRawRefreshToken)
//        │
//        ▼
//     RefreshSessionCommand
//        │
//        ▼
//     RefreshSessionHandler
//        │
//        ▼
//     SessionAggregate.refresh()
//        │
//        ▼
//     SessionRepository.save()
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// `command.refreshTokenHash` is the hash of the NEW refresh token.
//
// It is NOT the hash used to validate the incoming raw refresh token.
//
// Incoming-token verification must already have succeeded before this handler
// is executed.
//
// -----------------------------------------------------------------------------
//
// This handler does NOT:
//
// - receive the raw refresh token;
// - verify the raw refresh token;
// - hash refresh tokens;
// - generate refresh tokens;
// - sign JWTs;
// - verify JWTs;
// - compare refresh tokens;
// - validate Identity domain state;
// - validate Device domain state;
// - construct SessionEntity with `new`;
// - construct SessionAggregate with `new`;
// - modify SessionEntity properties directly;
// - construct domain events directly;
// - access Prisma;
// - revoke token families;
// - perform token-reuse detection;
// - create Devices;
// - send notifications.
//
// -----------------------------------------------------------------------------
//
// Refresh flow:
//
//     RefreshSessionCommand
//              │
//              ▼
//     RefreshSessionHandler
//              │
//              ▼
//     SessionRepository
//              │
//              ▼
//     SessionAggregate
//              │
//              ▼
//       aggregate.refresh()
//              │
//              ├── lifecycle validation
//              ├── refresh-token rotation
//              ├── activity update
//              └── domain event(s)
//              │
//              ▼
//     SessionRepository.save()
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

import type { RefreshSessionCommand } from '../commands/refresh-session.command';

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
 * Refreshes an existing Session aggregate.
 *
 * The handler coordinates the application workflow.
 *
 * Session lifecycle rules, refresh-token rotation, activity updates,
 * replacement/revocation semantics, and domain-event construction remain
 * owned by the Session aggregate/entity.
 *
 * Security-token verification and new-token generation occur outside this
 * handler.
 */
@Injectable()
export class RefreshSessionHandler implements CommandHandler<RefreshSessionCommand> {
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
   * Executes the RefreshSessionCommand.
   *
   * The command contains only the domain-ready hash of the newly generated
   * refresh token.
   *
   * The raw refresh token never enters this handler.
   */
  public async execute(command: RefreshSessionCommand): Promise<void> {
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
    // The handler does not access Prisma or persistence models directly.
    // -------------------------------------------------------------------------

    const aggregate = await this.sessionRepository.findByPublicId(
      command.sessionPublicId,
    );

    if (aggregate === null) {
      throw new SessionException('Session could not be found.');
    }

    // -------------------------------------------------------------------------
    // 3. Refresh Session
    // -------------------------------------------------------------------------
    //
    // The aggregate owns:
    //
    // - Session lifecycle validation;
    // - ACTIVE/expired/revoked state rules;
    // - refresh-token rotation;
    // - latest-activity update;
    // - token-family/rotation lineage;
    // - domain-event construction.
    //
    // The handler deliberately does not reproduce those rules.
    // -------------------------------------------------------------------------

    aggregate.refresh(
      command.refreshTokenHash,
      command.lastActivityAt,
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
    // -------------------------------------------------------------------------

    await this.sessionRepository.save(aggregate);
  }

  // ===========================================================================
  // Command Validation
  // ===========================================================================

  /**
   * Ensures that the command exists.
   */
  private ensureCommand(command: RefreshSessionCommand): void {
    if (command === undefined || command === null) {
      throw new SessionException('Refresh Session command is required.');
    }
  }

  /**
   * Validates required command properties.
   *
   * Validation here is structural only.
   *
   * Session lifecycle and refresh invariants remain owned by the domain.
   */
  private ensureRequiredCommandFields(command: RefreshSessionCommand): void {
    // -------------------------------------------------------------------------
    // Session public ID
    // -------------------------------------------------------------------------

    if (command.sessionPublicId === undefined) {
      throw new SessionException('Session public ID is required.');
    }

    // -------------------------------------------------------------------------
    // New refresh-token hash
    // -------------------------------------------------------------------------

    if (command.refreshTokenHash === undefined) {
      throw new SessionException('Session refresh-token hash is required.');
    }

    // -------------------------------------------------------------------------
    // Last activity timestamp
    // -------------------------------------------------------------------------

    if (command.lastActivityAt === undefined) {
      throw new SessionException(
        'Session last-activity timestamp is required.',
      );
    }

    if (
      !(command.lastActivityAt.value instanceof Date) ||
      !Number.isFinite(command.lastActivityAt.value.getTime())
    ) {
      throw new SessionException(
        'Session last-activity timestamp must be a valid date.',
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

export default RefreshSessionHandler;
