// -----------------------------------------------------------------------------
// Identity — Reject Verification Request Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for rejecting a VerificationRequest within an existing
// Verification aggregate.
//
// Aggregate boundary:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// IMPORTANT DOMAIN DISTINCTION
//
// Rejecting a VerificationRequest is NOT rejecting the Verification.
//
//     VerificationRequest rejection
//         = the submitted evidence for this request was not accepted.
//
//     Verification rejection
//         = the overall Verification aggregate was rejected.
//
// This handler therefore performs request-level rejection only.
//
// -----------------------------------------------------------------------------
//
// The handler:
//
// - validates the command;
// - resolves the Verification aggregate through its owning Identity;
// - invokes VerificationAggregate.rejectRequest();
// - persists the complete Verification aggregate.
//
// The handler does NOT:
//
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - mutate domain entities directly;
// - reject the parent Verification;
// - grant MEMBER verification;
// - grant DRIVER verification;
// - reopen Verification;
// - expire Verification;
// - revoke Verification;
// - modify Identity;
// - modify Identity roles;
// - access Asset storage;
// - perform external verification-provider operations;
// - emit domain events directly;
// - send notifications;
// - perform external side effects.
//
// -----------------------------------------------------------------------------
//
// Aggregate behavior:
//
// VerificationAggregate.rejectRequest() is responsible for:
//
// - resolving the requested VerificationRequest;
// - validating the reviewer;
// - validating the rejection reason;
// - validating the review timestamp;
// - preventing rejection of an expired request;
// - transitioning the request to REJECTED;
// - recording VerificationRequestRejectedEvent;
// - maintaining aggregate consistency.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     RejectVerificationRequestCommand
//              │
//              ▼
// verificationRepository.findByIdentityPublicId()
//              │
//              ▼
//      VerificationAggregate
//              │
//              ▼
//      aggregate.rejectRequest()
//              │
//              └── VerificationRequest -> REJECTED
//              │
//              ▼
// verificationRepository.save()
//              │
//              ▼
//      VerificationAggregate
//
// -----------------------------------------------------------------------------
//
// Request lifecycle:
//
// PENDING ───────► REJECTED
//
// REJECTED is terminal.
//
// An expired PENDING request cannot be rejected through this operation.
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

import type { RejectVerificationRequestCommand } from '../commands/reject-verification-request.command';

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
 * Rejects a VerificationRequest belonging to a Verification aggregate.
 *
 * The handler performs application-level orchestration only:
 *
 *     command
 *       ↓
 *     aggregate lookup by Identity
 *       ↓
 *     aggregate.rejectRequest()
 *       ↓
 *     aggregate persistence
 *
 * All request lifecycle rules remain inside VerificationAggregate and
 * VerificationRequestEntity.
 */
@Injectable()
export class RejectVerificationRequestHandler implements CommandHandler<RejectVerificationRequestCommand> {
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
   * Executes the RejectVerificationRequestCommand.
   *
   * A successful execution:
   *
   * - transitions the requested VerificationRequest to REJECTED;
   * - records the reviewer;
   * - records the rejection reason;
   * - records VerificationRequestRejectedEvent;
   * - persists the updated Verification aggregate.
   *
   * It does not reject the parent Verification aggregate.
   */
  public async execute(
    command: RejectVerificationRequestCommand,
  ): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new VerificationInvariantException(
        'Reject verification request command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Identity guard
    // -------------------------------------------------------------------------

    if (command.identityPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification request identity public ID is required.',
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
        'Verification request reviewer public ID is required.',
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
        'Verification request rejection reason is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 6. Load Verification aggregate
    // -------------------------------------------------------------------------
    //
    // VerificationRequestEntity is owned by VerificationAggregate.
    //
    // Therefore the handler loads the complete Verification aggregate rather
    // than attempting to retrieve or mutate the request independently.
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
    // 7. Reject VerificationRequest through the aggregate
    // -------------------------------------------------------------------------
    //
    // VerificationAggregate.rejectRequest() owns:
    //
    // - request ownership resolution;
    // - reviewer validation;
    // - rejection reason validation and normalization;
    // - review timestamp validation;
    // - request expiration validation;
    // - request lifecycle transition;
    // - VerificationRequestRejectedEvent recording;
    // - aggregate audit synchronization;
    // - aggregate consistency validation.
    //
    // The parent Verification remains unchanged at the lifecycle level.
    // -------------------------------------------------------------------------

    aggregate.rejectRequest(
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
    // VerificationAggregate remains the unit of persistence.
    //
    // The rejected VerificationRequest is persisted as part of its owning
    // aggregate.
    // -------------------------------------------------------------------------

    await this.verificationRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RejectVerificationRequestHandler;
