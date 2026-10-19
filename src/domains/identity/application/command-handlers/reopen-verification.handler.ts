/**
 * sisiMove — Reopen Verification Command Handler
 *
 * Reopens an existing Verification aggregate, persists the transition,
 * reloads the saved aggregate, and returns it for the REST response.
 *
 * Historical VerificationRequest entities remain owned by the aggregate.
 * Lifecycle rules remain inside VerificationAggregate.
 */

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { IDENTITY_TOKENS } from '../identity.tokens';

import type { ReopenVerificationCommand } from '../commands/reopen-verification.command';

import type { VerificationAggregate } from '../../domain/aggregates/verification.aggregate';

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

import { VerificationInvariantException } from '../../domain/exceptions/verification-invariant.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class ReopenVerificationHandler implements CommandHandler<
  ReopenVerificationCommand,
  VerificationAggregate
> {
  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.VERIFICATION)
    private readonly verificationRepository: VerificationRepository,
  ) {}

  /**
   * Reopens an existing REJECTED or EXPIRED verification.
   *
   * The aggregate enforces lifecycle eligibility and preserves its
   * historical verification requests.
   */
  public async execute(
    command: ReopenVerificationCommand,
  ): Promise<VerificationAggregate> {
    // 1. Validate command.
    if (command === undefined || command === null) {
      throw new VerificationInvariantException(
        'Reopen verification command is required.',
      );
    }

    // 2. Validate verification public ID.
    if (command.verificationPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification public ID is required.',
      );
    }

    // 3. Validate correlation ID.
    if (
      typeof command.correlationId !== 'string' ||
      command.correlationId.trim().length === 0
    ) {
      throw new VerificationInvariantException(
        'Verification correlation ID is required.',
      );
    }

    // 4. Load the existing aggregate.
    const aggregate = await this.verificationRepository.findByPublicId(
      command.verificationPublicId,
    );

    if (aggregate === null) {
      throw new VerificationInvariantException(
        `Verification ${command.verificationPublicId.value} was not found.`,
      );
    }

    // Keep the aggregate identity for the post-save integrity check.
    const verificationPublicId = aggregate.publicId;

    // 5. Apply the lifecycle transition through the aggregate.
    // The domain decides whether the current status can be reopened.
    aggregate.reopen(command.correlationId, command.reopenedAt);

    // 6. Persist the complete aggregate.
    await this.verificationRepository.save(aggregate);

    // 7. Reload the persisted aggregate for the REST response.
    const savedAggregate =
      await this.verificationRepository.findByPublicId(verificationPublicId);

    if (savedAggregate === null) {
      throw new VerificationInvariantException(
        'Verification could not be reloaded after reopening.',
      );
    }

    // 8. Ensure the reloaded aggregate is the expected verification.
    if (!savedAggregate.publicId.equals(verificationPublicId)) {
      throw new VerificationInvariantException(
        'The reloaded verification does not match the reopened verification.',
      );
    }

    // 9. Return the aggregate expected by VerificationResponseMapper.
    return savedAggregate;
  }
}

export default ReopenVerificationHandler;
