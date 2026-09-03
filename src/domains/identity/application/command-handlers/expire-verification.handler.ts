// -----------------------------------------------------------------------------
// Identity — Expire Verification Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for expiring a Verification aggregate.
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
// - loads the Verification aggregate through its owning Identity;
// - invokes VerificationAggregate.expire();
// - persists the complete aggregate.
//
// The handler does NOT:
//
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - mutate domain entities directly;
// - calculate expiresAt;
// - modify verification evidence directly;
// - expire VerificationRequest entities;
// - modify Identity;
// - revoke authentication or sessions;
// - emit domain events directly;
// - perform external verification-provider operations;
// - send notifications;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Important distinction:
//
// Verification expiration is NOT VerificationRequest expiration.
//
// Verification expiration:
//
//     aggregate.expire()
//
// represents:
//
//     VERIFIED -> EXPIRED
//
// VerificationRequest expiration:
//
//     aggregate.expireRequest()
//
// represents:
//
//     PENDING -> CANCELLED
//
// These are separate aggregate operations and separate application commands.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     ExpireVerificationCommand
//              │
//              ▼
// verificationRepository.findByIdentityPublicId()
//              │
//              ▼
//      VerificationAggregate
//              │
//              ▼
//      aggregate.expire()
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

import type { ExpireVerificationCommand } from '../commands/expire-verification.command';

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
 * Expires an existing Verification aggregate.
 *
 * The handler performs application-level orchestration only:
 *
 *     command
 *       ↓
 *     aggregate lookup by Identity
 *       ↓
 *     aggregate.expire()
 *       ↓
 *     aggregate persistence
 *
 * All Verification expiration rules remain inside VerificationAggregate.
 */
@Injectable()
export class ExpireVerificationHandler implements CommandHandler<ExpireVerificationCommand> {
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
   * Executes the ExpireVerificationCommand.
   *
   * A successful execution transitions a currently VERIFIED Verification to
   * EXPIRED.
   */
  public async execute(command: ExpireVerificationCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new VerificationInvariantException(
        'Expire verification command is required.',
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
    // 3. Load Verification aggregate
    // -------------------------------------------------------------------------
    //
    // Verification has a one-to-one relationship with Identity.
    //
    // The command therefore identifies the Verification through the owning
    // Identity public identifier.
    // -------------------------------------------------------------------------

    const aggregate = await this.verificationRepository.findByIdentityPublicId(
      command.identityPublicId,
    );

    if (aggregate === null) {
      throw new VerificationInvariantException(
        `Verification was not found for identity ${command.identityPublicId.value}.`,
      );
    }

    // -------------------------------------------------------------------------
    // 4. Expire Verification through the aggregate
    // -------------------------------------------------------------------------
    //
    // VerificationAggregate.expire() owns:
    //
    // - correlation validation;
    // - expiration timestamp validation;
    // - VERIFIED-state validation;
    // - expiresAt existence validation;
    // - expiration-deadline validation;
    // - transition to EXPIRED;
    // - VerificationExpiredEvent recording;
    // - aggregate consistency validation.
    //
    // The handler does not mutate VerificationEntity directly.
    // -------------------------------------------------------------------------

    aggregate.expire(command.correlationId, command.expiredAt);

    // -------------------------------------------------------------------------
    // 5. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // VerificationAggregate remains the unit of persistence.
    //
    // No VerificationRequest lifecycle transition occurs here.
    // -------------------------------------------------------------------------

    await this.verificationRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ExpireVerificationHandler;
