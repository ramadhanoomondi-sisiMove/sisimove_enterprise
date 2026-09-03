// -----------------------------------------------------------------------------
// Identity — Cancel Verification Request Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for cancelling a VerificationRequest within an existing
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
// Cancelling a VerificationRequest is NOT cancelling or rejecting the parent
// Verification aggregate.
//
//     VerificationRequest cancellation
//         = the individual pending evidence submission is withdrawn.
//
//     Verification rejection
//         = the overall Verification aggregate is rejected.
//
// This handler therefore performs request-level cancellation only.
//
// -----------------------------------------------------------------------------
//
// The handler:
//
// - validates the command;
// - resolves the Verification aggregate through its owning Identity;
// - invokes VerificationAggregate.cancelRequest();
// - persists the complete Verification aggregate.
//
// The handler does NOT:
//
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - mutate domain entities directly;
// - reject the Verification aggregate;
// - approve the VerificationRequest;
// - reject the VerificationRequest;
// - expire the VerificationRequest;
// - grant MEMBER verification;
// - grant DRIVER verification;
// - reopen Verification;
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
// VerificationAggregate.cancelRequest() is responsible for:
//
// - resolving the requested VerificationRequest;
// - validating the cancellation timestamp;
// - validating the request lifecycle state;
// - transitioning the request from PENDING to CANCELLED;
// - recording VerificationRequestCancelledEvent;
// - maintaining aggregate audit state;
// - maintaining aggregate consistency.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     CancelVerificationRequestCommand
//              │
//              ▼
// verificationRepository.findByIdentityPublicId()
//              │
//              ▼
//      VerificationAggregate
//              │
//              ▼
//      aggregate.cancelRequest()
//              │
//              └── VerificationRequest -> CANCELLED
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
// PENDING ───────► CANCELLED
//
// CANCELLED is terminal.
//
// Cancellation is intentionally different from expiration:
//
//     explicit cancellation
//         -> cancelRequest()
//
//     deadline reached
//         -> expireRequest()
//
// Both ultimately result in:
//
//     PENDING -> CANCELLED
//
// but they represent different business causes and produce different domain
// events.
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

import type { CancelVerificationRequestCommand } from '../commands/cancel-verification-request.command';

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
 * Cancels a VerificationRequest belonging to a Verification aggregate.
 *
 * The handler performs application-level orchestration only:
 *
 *     command
 *       ↓
 *     aggregate lookup by Identity
 *       ↓
 *     aggregate.cancelRequest()
 *       ↓
 *     aggregate persistence
 *
 * All request lifecycle rules remain inside VerificationAggregate and
 * VerificationRequestEntity.
 */
@Injectable()
export class CancelVerificationRequestHandler implements CommandHandler<CancelVerificationRequestCommand> {
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
   * Executes the CancelVerificationRequestCommand.
   *
   * A successful execution:
   *
   * - transitions the requested VerificationRequest to CANCELLED;
   * - records VerificationRequestCancelledEvent;
   * - persists the updated Verification aggregate.
   *
   * No reviewer or rejection reason is recorded because cancellation is not
   * a review outcome.
   */
  public async execute(
    command: CancelVerificationRequestCommand,
  ): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new VerificationInvariantException(
        'Cancel verification request command is required.',
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
    // 4. Load Verification aggregate
    // -------------------------------------------------------------------------
    //
    // VerificationRequestEntity is owned by VerificationAggregate.
    //
    // Therefore the complete aggregate is loaded before the request is
    // cancelled.
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
    // 5. Cancel VerificationRequest through the aggregate
    // -------------------------------------------------------------------------
    //
    // VerificationAggregate.cancelRequest() owns:
    //
    // - request ownership resolution;
    // - cancellation timestamp validation;
    // - request lifecycle validation;
    // - PENDING -> CANCELLED transition;
    // - VerificationRequestCancelledEvent recording;
    // - aggregate audit synchronization;
    // - aggregate consistency validation.
    //
    // No Verification-level lifecycle transition occurs here.
    // -------------------------------------------------------------------------

    aggregate.cancelRequest(
      command.requestPublicId,
      command.correlationId,
      command.cancelledAt,
    );

    // -------------------------------------------------------------------------
    // 6. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // VerificationAggregate remains the unit of persistence.
    //
    // The cancelled VerificationRequest is persisted as part of its owning
    // aggregate.
    // -------------------------------------------------------------------------

    await this.verificationRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CancelVerificationRequestHandler;
