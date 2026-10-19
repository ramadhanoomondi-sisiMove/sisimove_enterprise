// -----------------------------------------------------------------------------
// Identity — Approve Verification Request Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { IDENTITY_TOKENS } from '../identity.tokens';

import type { ApproveVerificationRequestCommand } from '../commands/approve-verification-request.command';

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

import type { VerificationRequestEntity } from '../../domain/entities/verification-request.entity';

import { VerificationInvariantException } from '../../domain/exceptions/verification-invariant.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Approves a VerificationRequest belonging to a specific Verification
 * aggregate.
 *
 * The handler resolves the exact aggregate, delegates approval to the
 * aggregate, persists the complete aggregate, and returns the approved
 * request entity for REST response mapping.
 */
@Injectable()
export class ApproveVerificationRequestHandler implements CommandHandler<
  ApproveVerificationRequestCommand,
  VerificationRequestEntity
> {
  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.VERIFICATION)
    private readonly verificationRepository: VerificationRepository,
  ) {}

  public async execute(
    command: ApproveVerificationRequestCommand,
  ): Promise<VerificationRequestEntity> {
    // -------------------------------------------------------------------------
    // 1. Validate command
    // -------------------------------------------------------------------------

    if (command === undefined || command === null) {
      throw new VerificationInvariantException(
        'Approve verification request command is required.',
      );
    }

    if (
      command.verificationPublicId === undefined ||
      command.verificationPublicId === null
    ) {
      throw new VerificationInvariantException(
        'Verification public ID is required.',
      );
    }

    if (
      command.requestPublicId === undefined ||
      command.requestPublicId === null
    ) {
      throw new VerificationInvariantException(
        'Verification request public ID is required.',
      );
    }

    if (
      command.reviewedByPublicId === undefined ||
      command.reviewedByPublicId === null
    ) {
      throw new VerificationInvariantException(
        'Verification request reviewer public ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Load the exact Verification aggregate
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
    // 3. Approve through the aggregate boundary
    // -------------------------------------------------------------------------

    aggregate.approveRequest(
      command.requestPublicId,
      command.reviewedByPublicId,
      command.correlationId,
      command.reviewedAt,
    );

    // -------------------------------------------------------------------------
    // 4. Resolve the approved request from the aggregate
    // -------------------------------------------------------------------------

    const request = aggregate.getRequest(command.requestPublicId);

    // -------------------------------------------------------------------------
    // 5. Persist the aggregate before returning the response entity
    // -------------------------------------------------------------------------

    await this.verificationRepository.save(aggregate);

    return request;
  }
}

export default ApproveVerificationRequestHandler;
