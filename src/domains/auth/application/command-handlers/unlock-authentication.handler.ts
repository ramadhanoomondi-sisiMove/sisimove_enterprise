// -----------------------------------------------------------------------------
// Authentication — Unlock Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for unlocking an Authentication aggregate.
//
// Aggregate boundary:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// The handler:
//
// - validates the command;
// - loads the Authentication aggregate;
// - delegates the unlock transition to AuthenticationAggregate;
// - persists the updated aggregate.
//
// The aggregate:
//
// - validates the unlock transition;
// - transitions AuthenticationStatus from LOCKED to ACTIVE;
// - clears lockedAt;
// - clears lockedUntil;
// - clears lockReason;
// - resets authentication failure tracking;
// - records AuthenticationUnlockedEvent.
//
// The handler does NOT:
//
// - validate credentials;
// - hash or compare passwords;
// - determine lock thresholds;
// - determine lock duration;
// - modify failure policy;
// - create Sessions;
// - create Devices;
// - validate Identity domain state;
// - create Recovery records;
// - construct domain events directly;
// - access Prisma;
// - communicate with external systems.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
// UnlockAuthenticationCommand
//          │
//          ▼
// authenticationRepository.findByPublicId()
//          │
//          ├── not found → throw
//          │
//          ▼
// aggregate.unlock()
//          │
//          ├── AuthenticationEntity.unlock()
//          │
//          └── AuthenticationUnlockedEvent
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

import type { UnlockAuthenticationCommand } from '../commands/unlock-authentication.command';

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
 * Handles the UnlockAuthenticationCommand.
 *
 * Application responsibility:
 *
 *     command
 *       ↓
 *     validate command
 *       ↓
 *     load aggregate
 *       ↓
 *     aggregate.unlock()
 *       ↓
 *     repository.save()
 *
 * Domain responsibility remains inside AuthenticationAggregate and
 * AuthenticationEntity.
 */
@Injectable()
export class UnlockAuthenticationHandler implements CommandHandler<UnlockAuthenticationCommand> {
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
   * Executes the UnlockAuthenticationCommand.
   *
   * The handler does not implement unlock business rules.
   *
   * AuthenticationAggregate.unlock() remains responsible for:
   *
   * - determining whether Authentication is locked;
   * - transitioning LOCKED → ACTIVE;
   * - clearing lock state;
   * - resetting authentication failure tracking;
   * - recording AuthenticationUnlockedEvent.
   */
  public async execute(command: UnlockAuthenticationCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined || command === null) {
      throw new AuthenticationException(
        'Unlock authentication command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Load Authentication aggregate
    // -------------------------------------------------------------------------
    //
    // AuthenticationPublicId is the public identity of the aggregate.
    //
    // The repository is responsible only for retrieval.
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
    // 3. Unlock Authentication
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the complete domain transition.
    //
    // AuthenticationAggregate.unlock() is responsible for:
    //
    // - validating the correlation ID;
    // - determining whether the Authentication is locked;
    // - delegating to AuthenticationEntity.unlock();
    // - clearing lock state;
    // - resetting authentication failures;
    // - recording AuthenticationUnlockedEvent.
    //
    // The handler does not construct the domain event.
    // -------------------------------------------------------------------------

    aggregate.unlock(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 4. Persist Authentication aggregate
    // -------------------------------------------------------------------------
    //
    // The repository translates the aggregate into the persistence model.
    //
    // Domain events recorded by the aggregate remain available to the
    // application's event-dispatch/persistence infrastructure.
    // -------------------------------------------------------------------------

    await this.authenticationRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default UnlockAuthenticationHandler;
