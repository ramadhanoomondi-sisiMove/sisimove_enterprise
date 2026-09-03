// -----------------------------------------------------------------------------
// Identity — Create Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for creating a new Identity
// aggregate.
//
// Aggregate:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// Responsibilities:
//
// - Ensure the supplied email is not already associated with an Identity.
// - Ensure the supplied phone number is not already associated with an Identity.
// - Create the Identity aggregate through IdentityAggregate.create().
// - Persist the complete aggregate.
//
// The command already contains domain-ready value objects.
//
// This handler performs application orchestration only.
//
// It does NOT:
//
// - reconstruct IdentityEmail;
// - reconstruct IdentityPhoneNumber;
// - perform DTO mapping;
// - construct IdentityEntity directly;
// - create authentication credentials;
// - create sessions;
// - create devices;
// - create recovery records;
// - create OTP challenges;
// - create verification records;
// - assign roles;
// - create permissions;
// - send notifications;
// - execute external side effects.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { IDENTITY_TOKENS } from '../identity.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CreateIdentityCommand } from '../commands/create-identity.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { IdentityAggregate } from '../../domain/aggregates/identity.aggregate';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { IdentityAlreadyExistsException } from '../../domain/exceptions/identity-already-exists.exception';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { IdentityRepository } from '../../domain/repositories/identity.repository';

// =============================================================================
// Handler
// =============================================================================

/**
 * Creates a new Identity aggregate.
 *
 * Application flow:
 *
 *     CreateIdentityCommand
 *             │
 *             ▼
 *       Check email uniqueness
 *             │
 *             ▼
 *    Check phone-number uniqueness
 *             │
 *             ▼
 *     IdentityAggregate.create()
 *             │
 *             ▼
 *     IdentityRepository.create()
 *             │
 *             ▼
 *       IdentityAggregate
 *
 * Repository existence checks provide an early application-level guard.
 *
 * Database-level unique constraints remain the final protection against
 * concurrent create operations.
 */
@Injectable()
export class CreateIdentityHandler implements CommandHandler<
  CreateIdentityCommand,
  IdentityAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.IDENTITY)
    private readonly repository: IdentityRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the Create Identity application command.
   *
   * Application flow:
   *
   *     1. Ensure email is available.
   *     2. Ensure phone number is available.
   *     3. Create IdentityAggregate.
   *     4. Persist IdentityAggregate.
   *     5. Return IdentityAggregate.
   */
  public async execute(
    command: CreateIdentityCommand,
  ): Promise<IdentityAggregate> {
    // -------------------------------------------------------------------------
    // 1. Ensure email is available
    // -------------------------------------------------------------------------

    const emailExists = await this.repository.existsByEmail(command.email);

    if (emailExists) {
      throw new IdentityAlreadyExistsException(
        `An Identity already exists with email "${command.email.toString()}".`,
      );
    }

    // -------------------------------------------------------------------------
    // 2. Ensure phone number is available
    // -------------------------------------------------------------------------

    const phoneNumberExists = await this.repository.existsByPhoneNumber(
      command.phoneNumber,
    );

    if (phoneNumberExists) {
      throw new IdentityAlreadyExistsException(
        `An Identity already exists with phone number "${command.phoneNumber.toString()}".`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Create Identity aggregate
    // -------------------------------------------------------------------------
    //
    // IdentityAggregate.create() owns:
    //
    // - IdentityPublicId generation;
    // - IdentityEntity creation;
    // - initial PENDING status;
    // - empty IdentityRoleEntity collection;
    // - aggregate invariant validation;
    // - IdentityCreatedEvent recording.
    // -------------------------------------------------------------------------

    const aggregate = IdentityAggregate.create(
      {
        email: command.email,
        phoneNumber: command.phoneNumber,
      },
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 4. Persist aggregate
    // -------------------------------------------------------------------------

    await this.repository.create(aggregate);

    // -------------------------------------------------------------------------
    // 5. Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateIdentityHandler;
