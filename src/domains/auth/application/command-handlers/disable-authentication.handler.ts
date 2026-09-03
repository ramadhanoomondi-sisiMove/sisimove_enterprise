// -----------------------------------------------------------------------------
// Authentication — Disable Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for disabling an Authentication aggregate.
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
// - delegates the disable transition to AuthenticationAggregate;
// - persists the updated aggregate.
//
// The aggregate:
//
// - validates the disable transition;
// - transitions AuthenticationStatus to DISABLED;
// - retains the optional failure/disable reason;
// - records AuthenticationDisabledEvent.
//
// The handler does NOT:
//
// - validate credentials;
// - hash or compare passwords;
// - determine authentication lock thresholds;
// - lock Authentication;
// - unlock Authentication;
// - create Sessions;
// - revoke Sessions;
// - create Devices;
// - validate Identity domain state;
// - create Recovery records;
// - create OTP challenges;
// - construct domain events directly;
// - access Prisma;
// - communicate with external systems.
//
// Authorization and the decision to initiate disabling belong to the
// appropriate application workflow, administrative workflow, security policy,
// or authorization boundary.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
// DisableAuthenticationCommand
//          │
//          ▼
// authenticationRepository.findByPublicId()
//          │
//          ├── not found → throw
//          │
//          ▼
// aggregate.disable(
//     reason,
//     correlationId,
//     causationId,
// )
//          │
//          ├── AuthenticationEntity.disable()
//          │
//          └── AuthenticationDisabledEvent
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

import type { DisableAuthenticationCommand } from '../commands/disable-authentication.command';

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
 * Handles the DisableAuthenticationCommand.
 *
 * Application responsibility:
 *
 *     command
 *       ↓
 *     validate command
 *       ↓
 *     load aggregate
 *       ↓
 *     aggregate.disable()
 *       ↓
 *     repository.save()
 *
 * The handler coordinates the use case but does not contain the domain
 * transition itself.
 */
@Injectable()
export class DisableAuthenticationHandler implements CommandHandler<DisableAuthenticationCommand> {
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
   * Executes the DisableAuthenticationCommand.
   *
   * AuthenticationAggregate.disable() remains responsible for:
   *
   * - validating the correlation ID;
   * - delegating the transition to AuthenticationEntity.disable();
   * - transitioning AuthenticationStatus to DISABLED;
   * - retaining the optional reason;
   * - recording AuthenticationDisabledEvent.
   */
  public async execute(command: DisableAuthenticationCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined || command === null) {
      throw new AuthenticationException(
        'Disable authentication command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Load Authentication aggregate
    // -------------------------------------------------------------------------
    //
    // AuthenticationPublicId is the public identity of the Authentication
    // aggregate.
    //
    // The repository retrieves the aggregate but does not perform the
    // lifecycle transition.
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
    // 3. Disable Authentication
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the domain transition.
    //
    // The optional reason is passed through unchanged because it is already a
    // domain value object.
    // -------------------------------------------------------------------------

    aggregate.disable(
      command.reason,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 4. Persist Authentication aggregate
    // -------------------------------------------------------------------------
    //
    // The repository is responsible for translating the aggregate into its
    // persistence representation.
    //
    // The handler does not directly persist entities or manipulate Prisma.
    // -------------------------------------------------------------------------

    await this.authenticationRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default DisableAuthenticationHandler;
