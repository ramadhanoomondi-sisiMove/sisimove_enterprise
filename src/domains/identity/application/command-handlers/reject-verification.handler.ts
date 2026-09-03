// -----------------------------------------------------------------------------
// Identity — Reject Verification Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for rejecting a Verification aggregate.
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
// - loads the Verification aggregate;
// - invokes aggregate-level rejection;
// - persists the aggregate.
//
// The handler does NOT:
//
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - mutate domain entities directly;
// - reject VerificationRequestEntity directly;
// - modify verification evidence directly;
// - modify Verification status directly;
// - modify Verification level directly;
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
// Rejecting a VerificationRequest:
//
//     aggregate.rejectRequest(...)
//
// means:
//
//     "This submitted evidence was not accepted."
//
// Rejecting the Verification aggregate:
//
//     aggregate.reject(...)
//
// means:
//
//     "The current Verification process has been rejected."
//
// These are intentionally separate application commands and lifecycle
// operations.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     RejectVerificationCommand
//              │
//              ▼
// verificationRepository.findByIdentityPublicId()
//              │
//              ▼
//      VerificationAggregate
//              │
//              ▼
//   aggregate.reject(...)
//              │
//              ▼
// verificationRepository.save()
//              │
//              ▼
//      VerificationAggregate
//
// -----------------------------------------------------------------------------
//
// Request association:
//
// `requestPublicId` identifies the VerificationRequest that provides the
// contextual evidence/review associated with the aggregate-level rejection.
//
// The aggregate itself resolves the request and verifies ownership.
//
// -----------------------------------------------------------------------------
//
// Reviewer:
//
// `reviewedByPublicId` identifies the Identity that performed the review.
//
// The handler carries the opaque public identifier into the aggregate but does
// not load or modify the reviewer Identity.
//
// -----------------------------------------------------------------------------
//
// Rejection reason:
//
// The aggregate owns validation and normalization of the rejection reason.
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
// PENDING ───────► REJECTED
//
// REJECTED ──────► PENDING
//
// The aggregate determines whether the requested transition is valid.
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

import type { RejectVerificationCommand } from '../commands/reject-verification.command';

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
 * Rejects an existing Verification aggregate.
 *
 * The handler performs application-level orchestration only:
 *
 *     command
 *       ↓
 *     aggregate lookup
 *       ↓
 *     aggregate.reject()
 *       ↓
 *     aggregate persistence
 *
 * All aggregate-level rejection rules remain inside VerificationAggregate.
 */
@Injectable()
export class RejectVerificationHandler implements CommandHandler<RejectVerificationCommand> {
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
   * Executes the RejectVerificationCommand.
   */
  public async execute(command: RejectVerificationCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new VerificationInvariantException(
        'Reject verification command is required.',
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
    // 3. Request guard
    // -------------------------------------------------------------------------

    if (command.requestPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification request public ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 4. Reviewer guard
    // -------------------------------------------------------------------------

    if (command.reviewedByPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification reviewer public ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 5. Rejection reason guard
    // -------------------------------------------------------------------------

    if (
      typeof command.reason !== 'string' ||
      command.reason.trim().length === 0
    ) {
      throw new VerificationInvariantException(
        'Verification rejection reason is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 6. Load Verification aggregate
    // -------------------------------------------------------------------------
    //
    // Identity → Verification is a one-to-one relationship.
    //
    // The application layer resolves the Verification through the owning
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
    // 7. Reject Verification aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate owns:
    //
    // - request resolution;
    // - request ownership validation;
    // - lifecycle validation;
    // - reviewer validation;
    // - rejection-reason normalization;
    // - VerificationEntity state transition;
    // - VerificationRejectedEvent recording.
    //
    // The handler performs no direct domain mutation.
    // -------------------------------------------------------------------------

    aggregate.reject(
      command.requestPublicId,
      command.reviewedByPublicId,
      command.reason,
      command.correlationId,
      command.reviewedAt,
    );

    // -------------------------------------------------------------------------
    // 8. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // VerificationAggregate is the unit of persistence.
    // -------------------------------------------------------------------------

    await this.verificationRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RejectVerificationHandler;
