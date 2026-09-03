// -----------------------------------------------------------------------------
// Authentication — Create Authentication Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for creating a password-backed Authentication aggregate.
//
// Aggregate boundary:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// Responsibilities:
//
// - enforce Authentication uniqueness per Identity;
// - create AuthenticationEntity through the domain factory;
// - create AuthenticationAggregate;
// - record AuthenticationCreatedEvent through the aggregate;
// - persist the aggregate;
// - return the created aggregate.
//
// The handler does NOT:
//
// - validate Identity domain state;
// - load the Identity aggregate;
// - hash passwords;
// - compare plaintext passwords;
// - generate sessions;
// - create devices;
// - execute recovery;
// - generate OTP challenges;
// - mutate AuthenticationEntity after creation;
// - construct domain events directly;
// - access Prisma;
// - communicate with external systems.
//
// -----------------------------------------------------------------------------
//
// Authentication creation policy:
//
// The Authentication domain owns:
//
// - Authentication public identity generation;
// - initial Authentication status;
// - initial password version;
// - initial password-change state;
// - initial authentication-failure state;
// - initial lock state;
// - initial authentication audit state;
// - Authentication entity invariants;
// - Authentication aggregate invariants.
//
// The application layer owns:
//
// - command orchestration;
// - Authentication uniqueness coordination;
// - repository interaction;
// - correlation/causation propagation;
// - returning the created aggregate.
//
// -----------------------------------------------------------------------------
//
// Identity reference:
//
// Authentication contains an opaque cross-domain reference:
//
//     AuthenticationIdentityPublicId
//
// This handler does NOT:
//
// - load Identity;
// - validate Identity existence;
// - validate Identity status;
// - inspect Identity roles;
// - mutate Identity.
//
// Authentication creation therefore operates on the supplied public Identity
// reference.
//
// Any cross-aggregate validation required by a higher-level application
// workflow belongs outside this aggregate creation handler.
//
// -----------------------------------------------------------------------------
//
// Uniqueness:
//
// Authentication has a one-to-one relationship with Identity.
//
// The application layer performs an early existence check:
//
//     authenticationRepository.existsByIdentityPublicId(
//       command.identityPublicId,
//     )
//
// before aggregate creation.
//
// The persistence layer MUST additionally enforce:
//
//     UNIQUE(identityPublicId)
//
// The repository existence check alone cannot prevent concurrent creation
// attempts.
//
// A persistence-level unique constraint violation must be translated by the
// repository into the appropriate application/domain exception.
//
// -----------------------------------------------------------------------------
//
// Password:
//
// The command contains:
//
//     AuthenticationPasswordHash
//
// The supplied hash MUST already have been produced through the application's
// PasswordHasher abstraction.
//
// This handler NEVER:
//
// - receives plaintext passwords;
// - hashes passwords;
// - compares passwords;
// - selects a password hashing algorithm;
// - accesses BCrypt directly.
//
// Password hashing remains behind the Foundation Security abstraction and its
// infrastructure implementation.
//
// -----------------------------------------------------------------------------
//
// Initial domain state:
//
// AuthenticationEntity.create() establishes the complete initial state:
//
// - status = PENDING;
// - passwordVersion = 1;
// - passwordChangedAt = established by the domain;
// - passwordMustChange = false;
// - failedAuthenticationCount = 0;
// - lastFailedAuthenticationAt = undefined;
// - lockedAt = undefined;
// - lockedUntil = undefined;
// - lockReason = undefined;
// - lastAuthenticatedAt = undefined.
//
// The handler does not supply or override these values.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     CreateAuthenticationCommand
//              │
//              ▼
// authenticationRepository.existsByIdentityPublicId()
//              │
//              ├── exists → AuthenticationAlreadyExistsException
//              │
//              ▼
//     AuthenticationEntity.create()
//              │
//              ▼
//     AuthenticationAggregate.create()
//              │
//              ▼
//     aggregate.recordCreated()
//              │
//              ▼
//     authenticationRepository.save()
//              │
//              ▼
//       AuthenticationAggregate
//
// -----------------------------------------------------------------------------
//
// Return value:
//
// The created AuthenticationAggregate is returned after successful
// persistence.
//
// This allows the application/controller layer to map the authoritative
// created state into an API response without performing a second repository
// read.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
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
// Authentication — Command
// -----------------------------------------------------------------------------

import type { CreateAuthenticationCommand } from '../commands/create-authentication.command';

// -----------------------------------------------------------------------------
// Authentication — Domain Aggregate
// -----------------------------------------------------------------------------

import { AuthenticationAggregate } from '../../domain/aggregates/authentication.aggregate';

// -----------------------------------------------------------------------------
// Authentication — Domain Entity
// -----------------------------------------------------------------------------

import { AuthenticationEntity } from '../../domain/entities/authentication.entity';

// -----------------------------------------------------------------------------
// Authentication — Domain Repository
// -----------------------------------------------------------------------------

import type { AuthenticationRepository } from '../../domain/repositories/authentication.repository';

// -----------------------------------------------------------------------------
// Authentication — Domain Exception
// -----------------------------------------------------------------------------

import { AuthenticationAlreadyExistsException } from '../../domain/exceptions/authentication-already-exists.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Creates a new password-backed Authentication aggregate.
 *
 * Application orchestration:
 *
 *     command
 *       ↓
 *     uniqueness check
 *       ↓
 *     AuthenticationEntity.create()
 *       ↓
 *     AuthenticationAggregate.create()
 *       ↓
 *     aggregate.recordCreated()
 *       ↓
 *     repository.save()
 *       ↓
 *     return aggregate
 *
 * Domain behavior remains inside AuthenticationEntity and
 * AuthenticationAggregate.
 */
@Injectable()
export class CreateAuthenticationHandler implements CommandHandler<
  CreateAuthenticationCommand,
  AuthenticationAggregate
> {
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
   * Executes the CreateAuthenticationCommand.
   *
   * The command contains:
   *
   * - AuthenticationIdentityPublicId;
   * - correlation metadata;
   * - an already-hashed AuthenticationPasswordHash.
   *
   * Plaintext password handling and password hashing are intentionally outside
   * this handler.
   */
  public async execute(
    command: CreateAuthenticationCommand,
  ): Promise<AuthenticationAggregate> {
    // -------------------------------------------------------------------------
    // 1. Enforce Authentication uniqueness
    // -------------------------------------------------------------------------
    //
    // There must be at most one Authentication aggregate for an Identity.
    //
    // This check provides an early and meaningful application-level failure.
    //
    // The persistence layer MUST still enforce the unique constraint on
    // identityPublicId because this check alone is not concurrency-safe.
    // -------------------------------------------------------------------------

    const exists = await this.authenticationRepository.existsByIdentityPublicId(
      command.identityPublicId,
    );

    if (exists) {
      throw new AuthenticationAlreadyExistsException(
        `Authentication for identity ${command.identityPublicId.value} already exists.`,
      );
    }

    // -------------------------------------------------------------------------
    // 2. Create AuthenticationEntity
    // -------------------------------------------------------------------------
    //
    // AuthenticationEntity owns its initial domain state.
    //
    // Only the following values cross into the entity factory:
    //
    // - the opaque Identity public reference;
    // - the already-hashed password credential.
    //
    // The handler does not construct or override domain-managed state.
    // -------------------------------------------------------------------------

    const authentication = AuthenticationEntity.create(
      command.identityPublicId,
      command.passwordHash,
    );

    // -------------------------------------------------------------------------
    // 3. Create AuthenticationAggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate becomes the authoritative boundary for the new
    // Authentication.
    // -------------------------------------------------------------------------

    const aggregate = AuthenticationAggregate.create(authentication);

    // -------------------------------------------------------------------------
    // 4. Record AuthenticationCreatedEvent
    // -------------------------------------------------------------------------
    //
    // Domain-event construction remains inside the aggregate.
    //
    // The handler only supplies application-level correlation and causation
    // metadata.
    // -------------------------------------------------------------------------

    aggregate.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 5. Persist AuthenticationAggregate
    // -------------------------------------------------------------------------
    //
    // The Authentication aggregate is the unit of persistence.
    //
    // No Identity, Session, Device, Recovery, or OtpChallenge aggregate is
    // created or modified here.
    // -------------------------------------------------------------------------

    await this.authenticationRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // 6. Return AuthenticationAggregate
    // -------------------------------------------------------------------------
    //
    // The successfully persisted aggregate is returned to the caller.
    //
    // The presentation layer can therefore map the authoritative aggregate
    // state directly into the HTTP response.
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateAuthenticationHandler;
