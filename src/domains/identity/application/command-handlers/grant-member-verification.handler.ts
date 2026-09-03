// -----------------------------------------------------------------------------
// Identity — Grant Member Verification Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for granting MEMBER verification.
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
// - invokes the aggregate MEMBER-verification operation;
// - persists the aggregate.
//
// The handler does NOT:
//
// - construct VerificationEntity;
// - construct VerificationRequestEntity;
// - mutate domain entities directly;
// - approve VerificationRequestEntity directly;
// - modify verification evidence flags directly;
// - modify Verification status directly;
// - modify Verification level directly;
// - modify Identity;
// - emit domain events directly;
// - perform external verification-provider operations;
// - send notifications;
// - perform external side effects.
//
// The VerificationAggregate is responsible for:
//
// - validating the Verification lifecycle state;
// - validating MEMBER-verification eligibility;
// - ensuring the required verification evidence exists;
// - validating the supplied VerificationRequest;
// - recording reviewer information;
// - applying MEMBER verification state;
// - applying verification expiration;
// - recording VerificationApprovedEvent.
//
// -----------------------------------------------------------------------------
//
// Domain distinction:
//
// Granting MEMBER verification is an aggregate-level decision.
//
// It is distinct from:
//
//     ApproveVerificationRequest
//
// which means:
//
//     "The submitted evidence in this request is accepted."
//
// Grant MEMBER verification means:
//
//     "The Verification aggregate is now recognized as MEMBER verified."
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     GrantMemberVerificationCommand
//              │
//              ▼
// verificationRepository.findByIdentityPublicId()
//              │
//              ▼
//      VerificationAggregate
//              │
//              ▼
//   aggregate.grantMemberVerification()
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

import type { GrantMemberVerificationCommand } from '../commands/grant-member-verification.command';

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
 * Grants MEMBER verification to an existing Verification aggregate.
 *
 * The handler performs application-level orchestration only:
 *
 *     command
 *       │
 *       ▼
 *     aggregate lookup
 *       │
 *       ▼
 *     aggregate.grantMemberVerification()
 *       │
 *       ▼
 *     aggregate persistence
 *
 * All MEMBER-verification rules remain inside VerificationAggregate.
 */
@Injectable()
export class GrantMemberVerificationHandler implements CommandHandler<
  GrantMemberVerificationCommand,
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
   * Executes the GrantMemberVerificationCommand.
   *
   * The Verification aggregate is responsible for determining whether MEMBER
   * verification is currently legal.
   */
  public async execute(command: GrantMemberVerificationCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new VerificationInvariantException(
        'Grant member verification command is required.',
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
    // MEMBER verification requires an approved MEMBER-eligible request.
    //
    // The handler does not inspect the request. It only forwards its public
    // identifier to the aggregate.
    // -------------------------------------------------------------------------

    if (command.verificationRequestPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification request public ID is required for MEMBER verification.',
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
    // The command identifies the aggregate through its owning Identity.
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
    // The command carries both the owning IdentityPublicId and the specific
    // VerificationPublicId.
    //
    // Since the repository lookup is performed by IdentityPublicId, ensure
    // that the resolved aggregate is the exact aggregate identified by the
    // command.
    // -------------------------------------------------------------------------

    if (!aggregate.publicId.equals(command.verificationPublicId)) {
      throw new VerificationInvariantException(
        `Verification ${command.verificationPublicId.value} does not belong to identity ${command.identityPublicId.value}.`,
      );
    }

    // -------------------------------------------------------------------------
    // 10. Grant MEMBER verification through the aggregate
    // -------------------------------------------------------------------------
    //
    // IMPORTANT:
    //
    // VerificationAggregate.grantMemberVerification() expects:
    //
    //     requestPublicId
    //     reviewedByPublicId
    //     correlationId
    //     verifiedAt
    //     expiresAt
    //
    // The command values must therefore be passed in exactly that order.
    //
    // The aggregate remains responsible for:
    //
    // - lifecycle validation;
    // - MEMBER eligibility;
    // - request ownership;
    // - request approval state;
    // - request type;
    // - verification state transition;
    // - verification level;
    // - reviewer;
    // - expiration;
    // - domain event recording.
    // -------------------------------------------------------------------------

    aggregate.grantMemberVerification(
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
    // VerificationAggregate remains the unit of persistence.
    // -------------------------------------------------------------------------

    await this.verificationRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GrantMemberVerificationHandler;
