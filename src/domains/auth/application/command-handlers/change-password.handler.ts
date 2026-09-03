// -----------------------------------------------------------------------------
// Authentication — Change Password Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for changing the password credential of an
// Authentication aggregate.
//
// Aggregate:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// Responsibilities:
//
// - load AuthenticationAggregate;
// - derive the next password version;
// - invoke aggregate.changePassword();
// - persist the aggregate.
//
// This handler does NOT:
//
// - hash plaintext passwords;
// - compare passwords;
// - receive plaintext passwords;
// - mutate AuthenticationEntity directly;
// - construct AuthenticationPasswordChangedEvent directly;
// - validate Identity state;
// - load Identity;
// - create or revoke Sessions;
// - create Devices;
// - create Recovery;
// - create OtpChallenges;
// - access Prisma;
// - communicate with external systems.
//
// -----------------------------------------------------------------------------
//
// Password security:
//
// Password hashing is performed before this command is dispatched.
//
//     plaintext password
//            │
//            ▼
//      PasswordHasher
//            │
//            ▼
// AuthenticationPasswordHash
//            │
//            ▼
// ChangePasswordCommand
//
// The handler treats AuthenticationPasswordHash as an opaque credential value.
//
// -----------------------------------------------------------------------------
//
// Password version:
//
// The command does not accept a password version.
//
// The handler derives the next version:
//
//     aggregate.passwordVersion.next()
//
// This prevents callers from supplying an arbitrary or stale password
// version.
//
// -----------------------------------------------------------------------------
//
// Domain event:
//
// AuthenticationAggregate.changePassword() is responsible for recording:
//
//     AuthenticationPasswordChangedEvent
//
// The handler does not construct or dispatch the event directly.
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

import type { ChangePasswordCommand } from '../commands/change-password.command';

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
 * Handles ChangePasswordCommand.
 *
 * Application flow:
 *
 *     ChangePasswordCommand
 *              │
 *              ▼
 *     findByPublicId()
 *              │
 *              ├── null → AuthenticationNotFoundException
 *              │
 *              ▼
 *     passwordVersion.next()
 *              │
 *              ▼
 *     aggregate.changePassword()
 *              │
 *              ├── update password hash
 *              ├── update password version
 *              ├── update passwordChangedAt
 *              ├── clear passwordMustChange
 *              └── record AuthenticationPasswordChangedEvent
 *              │
 *              ▼
 *     repository.save()
 */
@Injectable()
export class ChangePasswordHandler implements CommandHandler<ChangePasswordCommand> {
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
   * Changes the password of an existing Authentication aggregate.
   */
  public async execute(command: ChangePasswordCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Load Authentication aggregate
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
    // 2. Determine next password version
    // -------------------------------------------------------------------------
    //
    // Never accept passwordVersion from the external caller.
    //
    // The current aggregate state determines the next version.
    //
    // Example:
    //
    //     version 1 → version 2
    //     version 2 → version 3
    //     version 3 → version 4
    //
    // -------------------------------------------------------------------------

    const nextPasswordVersion = aggregate.passwordVersion.next();

    // -------------------------------------------------------------------------
    // 3. Change password through aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the password transition.
    //
    // This operation:
    //
    // - replaces passwordHash;
    // - updates passwordVersion;
    // - updates passwordChangedAt;
    // - clears passwordMustChange;
    // - records AuthenticationPasswordChangedEvent.
    //
    // The handler does not modify the entity directly.
    // -------------------------------------------------------------------------

    aggregate.changePassword(
      command.passwordHash,
      nextPasswordVersion,
      command.changedAt,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 4. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // AuthenticationAggregate is the persistence boundary.
    // -------------------------------------------------------------------------

    await this.authenticationRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ChangePasswordHandler;
