// -----------------------------------------------------------------------------
// Identity — Approve Verification Request Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for approving a VerificationRequest within an existing
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
// Approving a VerificationRequest is NOT granting Verification.
//
//     VerificationRequest approval
//         = submitted evidence is accepted.
//
//     Verification approval
//         = the Identity is granted MEMBER or DRIVER verification.
//
// This handler therefore performs request approval only.
//
// The handler:
//
// - validates the command;
// - resolves the Verification aggregate;
// - invokes VerificationAggregate.approveRequest();
// - persists the complete aggregate.
//
// The handler does NOT:
//
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - mutate either entity directly;
// - grant MEMBER verification explicitly;
// - grant DRIVER verification explicitly;
// - reject Verification;
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
// VerificationAggregate.approveRequest() is responsible for:
//
// - resolving the requested VerificationRequest;
// - validating the reviewer;
// - validating the review timestamp;
// - preventing approval of an expired request;
// - transitioning the request to APPROVED;
// - applying the accepted evidence to Verification;
// - recording VerificationRequestApprovedEvent;
// - maintaining aggregate consistency.
//
// IMPORTANT:
//
// Approving the request updates the aggregate's evidence state, but does NOT
// itself transition Verification to VERIFIED.
//
// Explicit Verification granting is performed through:
//
//     grantMemberVerification()
//     grantDriverVerification()
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     ApproveVerificationRequestCommand
//              │
//              ▼
// verificationRepository.findByIdentityPublicId()
//              │
//              ▼
//      VerificationAggregate
//              │
//              ▼
//      aggregate.approveRequest()
//              │
//              ├── VerificationRequestEntity -> APPROVED
//              │
//              └── accepted evidence recorded
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
// PENDING ───────► APPROVED
//
// APPROVED is terminal.
//
// A request that has already expired cannot be approved.
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

import type { ApproveVerificationRequestCommand } from '../commands/approve-verification-request.command';

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
 * Approves a VerificationRequest belonging to a Verification aggregate.
 *
 * The handler performs application-level orchestration only:
 *
 *     command
 *       ↓
 *     aggregate lookup by Identity
 *       ↓
 *     aggregate.approveRequest()
 *       ↓
 *     aggregate persistence
 *
 * All request lifecycle and aggregate evidence rules remain inside
 * VerificationAggregate.
 */
@Injectable()
export class ApproveVerificationRequestHandler implements CommandHandler<ApproveVerificationRequestCommand> {
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
   * Executes the ApproveVerificationRequestCommand.
   *
   * A successful execution:
   *
   * - marks the requested VerificationRequest as APPROVED;
   * - records accepted verification evidence on the parent aggregate;
   * - records VerificationRequestApprovedEvent;
   * - persists the updated Verification aggregate.
   *
   * It does not explicitly grant a Verification level.
   */
  public async execute(
    command: ApproveVerificationRequestCommand,
  ): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new VerificationInvariantException(
        'Approve verification request command is required.',
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
    // 5. Load Verification aggregate
    // -------------------------------------------------------------------------
    //
    // The Verification aggregate is identified through its owning Identity.
    //
    // The repository returns the complete aggregate so that the aggregate can
    // resolve and validate ownership of the requested VerificationRequest.
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
    // 6. Approve VerificationRequest through the aggregate
    // -------------------------------------------------------------------------
    //
    // VerificationAggregate.approveRequest() owns:
    //
    // - request ownership resolution;
    // - reviewer validation;
    // - review timestamp validation;
    // - request expiration validation;
    // - request lifecycle transition;
    // - accepted evidence mapping;
    // - VerificationRequestApprovedEvent recording;
    // - aggregate audit synchronization;
    // - aggregate consistency validation.
    //
    // Approval of the request does NOT itself grant MEMBER or DRIVER
    // verification.
    // -------------------------------------------------------------------------

    aggregate.approveRequest(
      command.requestPublicId,
      command.reviewedByPublicId,
      command.correlationId,
      command.reviewedAt,
    );

    // -------------------------------------------------------------------------
    // 7. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // VerificationAggregate remains the unit of persistence.
    //
    // The approved VerificationRequest and resulting accepted evidence are
    // persisted together with the parent aggregate.
    // -------------------------------------------------------------------------

    await this.verificationRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ApproveVerificationRequestHandler;
