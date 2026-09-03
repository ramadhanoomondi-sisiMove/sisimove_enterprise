// -----------------------------------------------------------------------------
// Authentication — Lock Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for locking an Authentication aggregate.
//
// Aggregate boundary:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// Responsibilities:
//
// - validate the command;
// - load the Authentication aggregate;
// - delegate the lock transition to AuthenticationAggregate;
// - persist the updated aggregate.
//
// The handler does NOT:
//
// - calculate authentication-failure thresholds;
// - determine lock duration;
// - decide whether Authentication should be locked;
// - increment failure counters;
// - validate credentials;
// - hash or compare passwords;
// - create Sessions;
// - revoke Sessions;
// - create Devices;
// - validate Identity state;
// - construct domain events directly;
// - access Prisma;
// - communicate with external systems.
//
// Lock policy belongs to the appropriate authentication policy/application
// boundary.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
// LockAuthenticationCommand
//          │
//          ▼
// authenticationRepository.findByPublicId()
//          │
//          ├── not found → throw
//          │
//          ▼
// aggregate.lock()
//          │
//          ├── AuthenticationEntity.lock()
//          │
//          └── AuthenticationLockedEvent
//          │
//          ▼
// authenticationRepository.save()
//          │
//          ▼
// AuthenticationAggregate
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

import type { LockAuthenticationCommand } from '../commands/lock-authentication.command';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { AuthenticationRepository } from '../../domain/repositories/authentication.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { AuthenticationException } from '../../domain/exceptions/authentication.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles the LockAuthenticationCommand.
 *
 * The handler performs application-level orchestration only:
 *
 *     command
 *       ↓
 *     load aggregate
 *       ↓
 *     aggregate.lock()
 *       ↓
 *     repository.save()
 *
 * The Authentication aggregate remains responsible for the actual
 * authentication lifecycle transition and domain-event recording.
 */
@Injectable()
export class LockAuthenticationHandler implements CommandHandler<LockAuthenticationCommand> {
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
   * Executes the LockAuthenticationCommand.
   *
   * A successful execution loads an existing Authentication aggregate,
   * delegates the lock transition to the aggregate, and persists the
   * resulting aggregate.
   */
  public async execute(command: LockAuthenticationCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new AuthenticationException(
        'Lock authentication command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Load Authentication aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.authenticationRepository.findByPublicId(
      command.authenticationPublicId,
    );

    if (aggregate === null) {
      throw new AuthenticationException(
        `Authentication with public ID ${command.authenticationPublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Lock Authentication
    // -------------------------------------------------------------------------
    //
    // The aggregate owns:
    //
    // - AuthenticationStatus transition;
    // - lock-state validation;
    // - lock timestamp state;
    // - lock expiration state;
    // - lock reason;
    // - AuthenticationLockedEvent.
    //
    // The handler only supplies the values carried by the command.
    // -------------------------------------------------------------------------

    aggregate.lock(
      command.lockedAt,
      command.lockedUntil,
      command.reason,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 4. Persist Authentication aggregate
    // -------------------------------------------------------------------------

    await this.authenticationRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default LockAuthenticationHandler;
