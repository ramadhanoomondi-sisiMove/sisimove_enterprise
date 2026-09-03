// -----------------------------------------------------------------------------
// Identity — Grant Driver Verification Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for granting DRIVER verification.
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// Responsibilities:
//
// - validate the application command;
// - load the Verification aggregate;
// - invoke the aggregate DRIVER-verification behavior;
// - persist the aggregate.
//
// The handler does NOT:
//
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - mutate domain entities directly;
// - approve VerificationRequestEntity directly;
// - modify verification evidence directly;
// - modify Verification status directly;
// - modify Verification level directly;
// - modify Identity;
// - emit domain events directly;
// - perform external verification operations;
// - send notifications;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     GrantDriverVerificationCommand
//              │
//              ▼
// verificationRepository.findByIdentityPublicId()
//              │
//              ▼
//      VerificationAggregate
//              │
//              ▼
//   aggregate.grantDriverVerification()
//              │
//              ▼
// verificationRepository.save()
//              │
//              ▼
//      VerificationAggregate
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

import type { GrantDriverVerificationCommand } from '../commands/grant-driver-verification.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

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
 * Grants DRIVER verification to an existing Verification aggregate.
 *
 * The handler performs application-level orchestration only:
 *
 *     command
 *       │
 *       ▼
 *     aggregate lookup
 *       │
 *       ▼
 *     aggregate.grantDriverVerification()
 *       │
 *       ▼
 *     aggregate persistence
 *
 * All DRIVER-verification business rules remain inside VerificationAggregate.
 */
@Injectable()
export class GrantDriverVerificationHandler implements CommandHandler<
  GrantDriverVerificationCommand,
  void
> {
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
   * Executes the GrantDriverVerificationCommand.
   */
  public async execute(command: GrantDriverVerificationCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new VerificationInvariantException(
        'Grant driver verification command is required.',
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
    // 3. Verification guard
    // -------------------------------------------------------------------------

    if (command.verificationPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification public ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 4. Verification request guard
    // -------------------------------------------------------------------------
    //
    // DRIVER verification requires an approved DRIVER_LICENSE request.
    //
    // The handler does not inspect the request. It only forwards its public
    // identifier to the aggregate.
    // -------------------------------------------------------------------------

    if (command.verificationRequestPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification request public ID is required for DRIVER verification.',
      );
    }

    // -------------------------------------------------------------------------
    // 5. Reviewer guard
    // -------------------------------------------------------------------------

    if (command.reviewedByPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification reviewer public ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 6. Correlation guard
    // -------------------------------------------------------------------------

    if (
      typeof command.correlationId !== 'string' ||
      command.correlationId.trim().length === 0
    ) {
      throw new VerificationInvariantException(
        'Verification correlation ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 7. Load Verification aggregate
    // -------------------------------------------------------------------------
    //
    // Identity → Verification is a one-to-one relationship.
    //
    // The identity public ID resolves the aggregate.
    // -------------------------------------------------------------------------

    const aggregate = await this.verificationRepository.findByIdentityPublicId(
      command.identityPublicId,
    );

    // -------------------------------------------------------------------------
    // 8. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new VerificationInvariantException(
        `Verification was not found for identity ${command.identityPublicId.value}.`,
      );
    }

    // -------------------------------------------------------------------------
    // 9. Verify aggregate identity
    // -------------------------------------------------------------------------
    //
    // The command carries both IdentityPublicId and VerificationPublicId.
    //
    // Since the repository lookup is performed by IdentityPublicId, ensure
    // that the resolved aggregate is the exact Verification aggregate named
    // by the command.
    // -------------------------------------------------------------------------

    if (!aggregate.publicId.equals(command.verificationPublicId)) {
      throw new VerificationInvariantException(
        `Verification ${command.verificationPublicId.value} does not belong to identity ${command.identityPublicId.value}.`,
      );
    }

    // -------------------------------------------------------------------------
    // 10. Grant DRIVER verification through the aggregate
    // -------------------------------------------------------------------------
    //
    // IMPORTANT:
    //
    // VerificationAggregate.grantDriverVerification() expects:
    //
    //     requestPublicId
    //     reviewedByPublicId
    //     correlationId
    //     verifiedAt
    //     expiresAt
    //
    // The handler therefore forwards the command values in that exact order.
    //
    // The aggregate remains responsible for:
    //
    // - lifecycle validation;
    // - DRIVER eligibility;
    // - request ownership;
    // - request approval state;
    // - DRIVER_LICENSE request type;
    // - verification state transition;
    // - verification level;
    // - reviewer;
    // - expiration;
    // - domain event recording.
    // -------------------------------------------------------------------------

    aggregate.grantDriverVerification(
      command.verificationRequestPublicId,
      command.reviewedByPublicId,
      command.correlationId,
      command.verifiedAt,
      command.expiresAt,
    );

    // -------------------------------------------------------------------------
    // 11. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // The Verification aggregate is the unit of persistence.
    // -------------------------------------------------------------------------

    await this.verificationRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GrantDriverVerificationHandler;
