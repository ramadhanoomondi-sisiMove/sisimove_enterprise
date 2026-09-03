// -----------------------------------------------------------------------------
// Identity — Reopen Verification Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for reopening a Verification aggregate.
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
// - loads the existing Verification aggregate;
// - invokes VerificationAggregate.reopen();
// - persists the complete aggregate.
//
// The handler does NOT:
//
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - mutate domain entities directly;
// - create a new Verification aggregate;
// - create a VerificationRequest;
// - submit verification evidence;
// - approve a VerificationRequest;
// - grant MEMBER verification;
// - grant DRIVER verification;
// - reject Verification;
// - expire Verification;
// - revoke Verification;
// - delete historical requests;
// - modify Identity;
// - emit domain events directly;
// - perform external verification-provider operations;
// - send notifications;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Important distinction:
//
// Reopening a Verification is NOT creating a new Verification.
//
//     REJECTED ───────► PENDING
//     EXPIRED  ───────► PENDING
//
// The existing Verification aggregate remains the same aggregate identity.
//
// Historical VerificationRequest entities remain owned by the aggregate.
//
// New evidence is submitted separately through:
//
//     CreateVerificationRequestCommand
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     ReopenVerificationCommand
//              │
//              ▼
// verificationRepository.findByPublicId()
//              │
//              ▼
//      VerificationAggregate
//              │
//              ▼
//      aggregate.reopen()
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
// REJECTED ───────► PENDING
//
// EXPIRED ────────► PENDING
//
// PENDING ─────────X
//
// VERIFIED ────────X
//
// REVOKED ─────────X
//
// The aggregate owns lifecycle validation.
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

import type { ReopenVerificationCommand } from '../commands/reopen-verification.command';

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
 * Reopens an existing Verification aggregate.
 *
 * The handler performs application-level orchestration only:
 *
 *     command
 *       ↓
 *     aggregate lookup
 *       ↓
 *     aggregate.reopen()
 *       ↓
 *     aggregate persistence
 *
 * All Verification lifecycle rules remain inside VerificationAggregate.
 */
@Injectable()
export class ReopenVerificationHandler implements CommandHandler<ReopenVerificationCommand> {
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
   * Executes the ReopenVerificationCommand.
   *
   * A successful execution transitions an existing REJECTED or EXPIRED
   * Verification back to PENDING.
   *
   * Historical VerificationRequest entities are preserved.
   */
  public async execute(command: ReopenVerificationCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new VerificationInvariantException(
        'Reopen verification command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Verification public ID guard
    // -------------------------------------------------------------------------

    if (command.verificationPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification public ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Load Verification aggregate
    // -------------------------------------------------------------------------
    //
    // Reopening operates on an existing Verification aggregate.
    //
    // The aggregate is loaded by its public identity.
    // -------------------------------------------------------------------------

    const aggregate = await this.verificationRepository.findByPublicId(
      command.verificationPublicId,
    );

    if (aggregate === null) {
      throw new VerificationInvariantException(
        `Verification ${command.verificationPublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 4. Reopen Verification through the aggregate
    // -------------------------------------------------------------------------
    //
    // VerificationAggregate.reopen() owns:
    //
    // - correlation validation;
    // - timestamp validation;
    // - REJECTED / EXPIRED eligibility;
    // - transition to PENDING;
    // - resetting Verification level to NONE;
    // - clearing current verification timestamps;
    // - clearing current review state;
    // - preserving historical VerificationRequest entities;
    // - aggregate consistency validation.
    // -------------------------------------------------------------------------

    aggregate.reopen(command.correlationId, command.reopenedAt);

    // -------------------------------------------------------------------------
    // 5. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // VerificationAggregate remains the unit of persistence.
    //
    // No VerificationRequest is created or deleted during reopening.
    // -------------------------------------------------------------------------

    await this.verificationRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ReopenVerificationHandler;
