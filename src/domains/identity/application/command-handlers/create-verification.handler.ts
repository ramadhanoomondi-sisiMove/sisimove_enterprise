// -----------------------------------------------------------------------------
// Identity — Create Verification Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for creating a Verification aggregate.
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// The handler:
//
// - validates the command;
// - enforces Identity → Verification uniqueness;
// - creates the VerificationAggregate;
// - persists the complete aggregate.
//
// The handler does NOT:
//
// - construct VerificationEntity directly;
// - construct VerificationRequestEntity;
// - mutate domain entities directly;
// - create or submit Verification Requests;
// - approve Verification Requests;
// - grant MEMBER verification;
// - grant DRIVER verification;
// - reject Verification;
// - reopen Verification;
// - expire Verification;
// - revoke Verification;
// - modify Identity;
// - emit domain events directly;
// - perform external verification-provider operations;
// - send notifications;
// - perform external side effects.
//
// VerificationAggregate.create() owns:
//
// - VerificationEntity creation;
// - VerificationPublicId generation;
// - initial status = PENDING;
// - initial level = NONE;
// - initial verification evidence state;
// - initial requests = [];
// - aggregate invariant validation;
// - VerificationCreatedEvent recording.
//
// Verification Request creation is a separate application operation.
// Creating a Verification aggregate does not submit verification evidence.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     CreateVerificationCommand
//              │
//              ▼
// verificationRepository.existsByIdentityPublicId()
//              │
//              ├── already exists → throw
//              │
//              ▼
// VerificationAggregate.create()
//              │
//              ▼
// verificationRepository.create()
//              │
//              ▼
//       VerificationAggregate
//
// -----------------------------------------------------------------------------
//
// Persistence boundary:
//
// The VerificationAggregate is the unit of persistence.
//
// Therefore the handler never persists:
//
// - VerificationEntity directly;
// - VerificationRequestEntity directly.
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
// Identity Tokens
// -----------------------------------------------------------------------------

import { IDENTITY_TOKENS } from '../identity.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CreateVerificationCommand } from '../commands/create-verification.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { VerificationAggregate } from '../../domain/aggregates/verification.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { VerificationInvariantException } from '../../domain/exceptions/verification-invariant.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Creates a new Verification aggregate for an Identity.
 *
 * Identity → Verification is a one-to-one relationship.
 *
 * The handler performs application-level orchestration only:
 *
 *     command
 *       ↓
 *     uniqueness check
 *       ↓
 *     aggregate creation
 *       ↓
 *     aggregate persistence
 *
 * All Verification state and lifecycle rules remain inside the aggregate.
 */
@Injectable()
export class CreateVerificationHandler implements CommandHandler<CreateVerificationCommand> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.VERIFICATION)
    private readonly verificationRepository: VerificationRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the CreateVerificationCommand.
   *
   * A successful execution creates one empty Verification aggregate in the
   * initial PENDING / NONE state.
   *
   * No verification request is created by this handler.
   */
  public async execute(command: CreateVerificationCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new VerificationInvariantException(
        'Create verification command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Identity guard
    // -------------------------------------------------------------------------

    if (command.identityPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification identity public ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Identity → Verification uniqueness
    // -------------------------------------------------------------------------
    //
    // The domain model defines a one-to-one relationship:
    //
    // Identity
    //   └── Verification
    //
    // The repository provides the application-level existence check.
    //
    // Persistence must additionally enforce the corresponding unique
    // constraint to protect against concurrent creation attempts.
    // -------------------------------------------------------------------------

    const exists = await this.verificationRepository.existsByIdentityPublicId(
      command.identityPublicId,
    );

    if (exists) {
      throw new VerificationInvariantException(
        `Verification already exists for identity ${command.identityPublicId.value}.`,
      );
    }

    // -------------------------------------------------------------------------
    // 4. Create Verification aggregate
    // -------------------------------------------------------------------------
    //
    // VerificationAggregate.create() owns all aggregate initialization.
    //
    // Result:
    //
    // VerificationAggregate
    // └── VerificationEntity
    //     └── VerificationRequestEntity[] = []
    //
    // Initial state:
    //
    // - status = PENDING
    // - level = NONE
    // - profilePhotoVerified = false
    // - governmentIdVerified = false
    // - driverLicenseVerified = false
    //
    // The aggregate also records VerificationCreatedEvent.
    // -------------------------------------------------------------------------

    const aggregate = VerificationAggregate.create(
      {
        identityPublicId: command.identityPublicId,
      },
      command.correlationId,
      command.createdAt,
    );

    // -------------------------------------------------------------------------
    // 5. Persist Verification aggregate
    // -------------------------------------------------------------------------
    //
    // VerificationRepository.create() persists the complete aggregate as the
    // unit of persistence.
    //
    // At creation time there are no VerificationRequestEntity children.
    //
    // This operation does not:
    //
    // - submit evidence;
    // - review evidence;
    // - grant verification;
    // - modify Identity;
    // - perform external provider operations.
    // -------------------------------------------------------------------------

    await this.verificationRepository.create(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateVerificationHandler;
