// -----------------------------------------------------------------------------
// Identity — Reject Verification Request Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { IDENTITY_TOKENS } from '../identity.tokens';

import type { RejectVerificationRequestCommand } from '../commands/reject-verification-request.command';

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

import type { VerificationRequestEntity } from '../../domain/entities';

import { VerificationInvariantException } from '../../domain/exceptions/verification-invariant.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Rejects a VerificationRequest belonging to a specific Verification
 * aggregate, persists the transition, reloads the aggregate, and returns
 * the updated VerificationRequestEntity for the REST response.
 *
 * VerificationAggregate remains responsible for request ownership,
 * lifecycle rules, reviewer validation, and domain events.
 */
@Injectable()
export class RejectVerificationRequestHandler implements CommandHandler<
  RejectVerificationRequestCommand,
  VerificationRequestEntity
> {
  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.VERIFICATION)
    private readonly verificationRepository: VerificationRepository,
  ) {}

  /**
   * Executes the request rejection command.
   *
   * Loads the exact aggregate, rejects and persists the request, reloads
   * the saved aggregate, verifies its identity, and returns the updated
   * request entity.
   */
  public async execute(
    command: RejectVerificationRequestCommand,
  ): Promise<VerificationRequestEntity> {
    // -----------------------------------------------------------------------
    // 1. Validate command
    // -----------------------------------------------------------------------

    if (command === undefined || command === null) {
      throw new VerificationInvariantException(
        'Reject verification request command is required.',
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

    if (
      typeof command.reason !== 'string' ||
      command.reason.trim().length === 0
    ) {
      throw new VerificationInvariantException(
        'Verification request rejection reason is required.',
      );
    }

    if (
      typeof command.correlationId !== 'string' ||
      command.correlationId.trim().length === 0
    ) {
      throw new VerificationInvariantException(
        'Verification request rejection correlation ID is required.',
      );
    }

    // -----------------------------------------------------------------------
    // 2. Load the exact Verification aggregate
    // -----------------------------------------------------------------------

    const aggregate = await this.verificationRepository.findByPublicId(
      command.verificationPublicId,
    );

    if (aggregate === null) {
      throw new VerificationInvariantException(
        `Verification ${command.verificationPublicId.value} was not found.`,
      );
    }

    // Preserve identifiers to validate the reloaded aggregate and request.
    const verificationPublicId = aggregate.publicId;
    const requestPublicId = command.requestPublicId;

    // Confirm the target request exists before changing its lifecycle.
    const existingRequest = aggregate.getRequest(requestPublicId);

    if (existingRequest === null || existingRequest === undefined) {
      throw new VerificationInvariantException(
        `Verification request ${requestPublicId.value} was not found in verification ${verificationPublicId.value}.`,
      );
    }

    // -----------------------------------------------------------------------
    // 3. Apply request rejection through the aggregate
    // -----------------------------------------------------------------------

    aggregate.rejectRequest(
      requestPublicId,
      command.reviewedByPublicId,
      command.reason,
      command.correlationId,
      command.reviewedAt,
    );

    // -----------------------------------------------------------------------
    // 4. Persist the complete aggregate
    // -----------------------------------------------------------------------

    await this.verificationRepository.save(aggregate);

    // -----------------------------------------------------------------------
    // 5. Reload the persisted aggregate
    // -----------------------------------------------------------------------

    const savedAggregate =
      await this.verificationRepository.findByPublicId(verificationPublicId);

    if (savedAggregate === null) {
      throw new VerificationInvariantException(
        'Verification could not be reloaded after request rejection.',
      );
    }

    // -----------------------------------------------------------------------
    // 6. Verify the reloaded aggregate is the same aggregate
    // -----------------------------------------------------------------------

    if (!savedAggregate.publicId.equals(verificationPublicId)) {
      throw new VerificationInvariantException(
        'The reloaded verification does not match the rejected request verification.',
      );
    }

    // -----------------------------------------------------------------------
    // 7. Resolve the updated request from the saved aggregate
    // -----------------------------------------------------------------------

    const savedRequest = savedAggregate.getRequest(requestPublicId);

    if (savedRequest === null || savedRequest === undefined) {
      throw new VerificationInvariantException(
        'The rejected verification request could not be reloaded.',
      );
    }

    // -----------------------------------------------------------------------
    // 8. Return the persisted request for response mapping
    // -----------------------------------------------------------------------

    return savedRequest;
  }
}

export default RejectVerificationRequestHandler;
