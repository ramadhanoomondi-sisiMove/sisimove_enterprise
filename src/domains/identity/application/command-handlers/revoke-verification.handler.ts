// -----------------------------------------------------------------------------
// Identity — Revoke Verification Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for revoking a Verification aggregate.
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
// - invokes VerificationAggregate.revoke();
// - persists the complete aggregate.
//
// The handler does NOT:
//
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - mutate domain entities directly;
// - reject VerificationRequestEntity;
// - expire VerificationRequestEntity;
// - modify verification evidence directly;
// - modify Identity state;
// - modify Identity roles;
// - revoke authentication credentials;
// - terminate sessions;
// - emit domain events directly;
// - perform external verification-provider operations;
// - send notifications;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Important distinction:
//
// Revoking Verification is NOT rejecting a VerificationRequest.
//
// VerificationRequest rejection:
//
//     aggregate.rejectRequest()
//
// means:
//
//     "This submitted verification evidence was rejected."
//
// Verification revocation:
//
//     aggregate.revoke()
//
// means:
//
//     "An already VERIFIED Verification is no longer valid and is revoked."
//
// REVOKED is terminal.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     RevokeVerificationCommand
//              │
//              ▼
// verificationRepository.findByIdentityPublicId()
//              │
//              ▼
//      VerificationAggregate
//              │
//              ▼
//      aggregate.revoke()
//              │
//              ▼
// verificationRepository.save()
//              │
//              ▼
//      VerificationAggregate
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
// VERIFIED ───────► REVOKED
//
// REVOKED ───────── terminal
//
// The aggregate owns lifecycle validation and determines whether the current
// Verification may be revoked.
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

import type { RevokeVerificationCommand } from '../commands/revoke-verification.command';

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
 * Revokes an existing Verification aggregate.
 *
 * The handler performs application-level orchestration only:
 *
 *     command
 *       ↓
 *     aggregate lookup by Identity
 *       ↓
 *     aggregate.revoke()
 *       ↓
 *     aggregate persistence
 *
 * All Verification revocation rules remain inside VerificationAggregate.
 */
@Injectable()
export class RevokeVerificationHandler implements CommandHandler<RevokeVerificationCommand> {
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
   * Executes the RevokeVerificationCommand.
   *
   * A successful execution transitions a currently VERIFIED Verification to
   * terminal REVOKED state.
   */
  public async execute(command: RevokeVerificationCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new VerificationInvariantException(
        'Revoke verification command is required.',
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
    // 3. Revoker guard
    // -------------------------------------------------------------------------

    if (command.revokedByPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification revoking identity public ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 4. Reason guard
    // -------------------------------------------------------------------------

    if (
      typeof command.reason !== 'string' ||
      command.reason.trim().length === 0
    ) {
      throw new VerificationInvariantException(
        'Verification revocation reason is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 5. Load Verification aggregate
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
    // 6. Revoke Verification through the aggregate
    // -------------------------------------------------------------------------
    //
    // VerificationAggregate.revoke() owns:
    //
    // - correlation validation;
    // - revoker validation;
    // - reason validation and normalization;
    // - timestamp validation;
    // - VERIFIED-state validation;
    // - transition to REVOKED;
    // - aggregate consistency validation.
    //
    // The handler performs no direct domain mutation.
    // -------------------------------------------------------------------------

    aggregate.revoke(
      command.revokedByPublicId,
      command.reason,
      command.correlationId,
      command.revokedAt,
    );

    // -------------------------------------------------------------------------
    // 7. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // VerificationAggregate remains the unit of persistence.
    //
    // No VerificationRequest lifecycle operation occurs here.
    // -------------------------------------------------------------------------

    await this.verificationRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RevokeVerificationHandler;
