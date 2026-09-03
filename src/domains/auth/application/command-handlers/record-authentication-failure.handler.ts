// -----------------------------------------------------------------------------
// Authentication — Record Authentication Failure Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for recording a failed authentication attempt.
//
// Aggregate:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - load the Authentication aggregate;
// - invoke aggregate.recordAuthenticationFailure();
// - persist the updated aggregate.
//
// -----------------------------------------------------------------------------
//
// The handler does NOT:
//
// - hash passwords;
// - compare passwords;
// - verify credentials;
// - calculate credential validity;
// - mutate AuthenticationEntity directly;
// - construct AuthenticationFailedEvent directly;
// - automatically lock Authentication;
// - unlock Authentication;
// - load Identity;
// - validate Identity state;
// - create Sessions;
// - revoke Sessions;
// - create Devices;
// - create Recovery;
// - create OtpChallenges;
// - access Prisma;
// - communicate with external systems.
//
// -----------------------------------------------------------------------------
//
// Failure count:
//
// The command carries the resulting AuthenticationFailureCount.
//
// The handler does not calculate or silently increment the count.
//
// The authentication workflow/policy determines the appropriate count before
// dispatching this command.
//
// -----------------------------------------------------------------------------
//
// Locking:
//
// Recording a failure does not automatically lock Authentication.
//
// If the configured authentication policy determines that the failure
// threshold has been reached, the appropriate application workflow should
// execute LockAuthenticationCommand separately.
//
// -----------------------------------------------------------------------------
//
// Domain event:
//
// AuthenticationAggregate.recordAuthenticationFailure() is responsible for
// recording AuthenticationFailedEvent.
//
// The handler does not construct the event directly.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     RecordAuthenticationFailureCommand
//                  │
//                  ▼
//     authenticationRepository.findByPublicId()
//                  │
//                  ├── null → AuthenticationNotFoundException
//                  │
//                  ▼
//     aggregate.recordAuthenticationFailure()
//                  │
//                  ├── update failure count
//                  ├── update lastFailedAuthenticationAt
//                  ├── update lock/failure reason
//                  └── record AuthenticationFailedEvent
//                  │
//                  ▼
//     authenticationRepository.save()
//                  │
//                  ▼
//        AuthenticationAggregate
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

import type { RecordAuthenticationFailureCommand } from '../commands/record-authentication-failure.command';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { AuthenticationRepository } from '../../domain/repositories/authentication.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { AuthenticationNotFoundException } from '../../domain/exceptions/authentication-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles RecordAuthenticationFailureCommand.
 *
 * Application orchestration:
 *
 *     command
 *       ↓
 *     load AuthenticationAggregate
 *       ↓
 *     aggregate.recordAuthenticationFailure()
 *       ↓
 *     repository.save()
 *
 * The Authentication aggregate owns the failure-state transition and
 * AuthenticationFailedEvent recording.
 */
@Injectable()
export class RecordAuthenticationFailureHandler implements CommandHandler<RecordAuthenticationFailureCommand> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(AUTH_TOKENS.REPOSITORIES.AUTHENTICATION)
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Records a failed authentication attempt.
   *
   * A successful execution updates the Authentication failure state and
   * persists the aggregate.
   */
  public async execute(
    command: RecordAuthenticationFailureCommand,
  ): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Load Authentication aggregate
    // -------------------------------------------------------------------------
    //
    // AuthenticationPublicId identifies the aggregate to which the failure
    // belongs.
    //
    // Identity is intentionally not loaded or validated here.
    // -------------------------------------------------------------------------

    const aggregate = await this.authenticationRepository.findByPublicId(
      command.authenticationPublicId,
    );

    if (aggregate === null) {
      throw new AuthenticationNotFoundException(
        `Authentication ${command.authenticationPublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 2. Record authentication failure
    // -------------------------------------------------------------------------
    //
    // The aggregate delegates the state mutation to AuthenticationEntity and
    // records AuthenticationFailedEvent.
    //
    // The handler does not:
    //
    // - mutate the entity directly;
    // - construct AuthenticationFailedEvent;
    // - decide whether the account should be locked.
    // -------------------------------------------------------------------------

    aggregate.recordAuthenticationFailure(
      command.count,
      command.failedAt,
      command.reason,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 3. Persist Authentication aggregate
    // -------------------------------------------------------------------------
    //
    // AuthenticationAggregate remains the persistence boundary.
    // -------------------------------------------------------------------------

    await this.authenticationRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RecordAuthenticationFailureHandler;
