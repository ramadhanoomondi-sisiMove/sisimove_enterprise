/**
 * sisiMove — Expire Verification Command Handler
 *
 * Expires an existing Verification aggregate, persists the transition,
 * reloads the saved aggregate, and returns it for the REST response.
 *
 * VerificationAggregate remains responsible for lifecycle validation.
 */

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { IDENTITY_TOKENS } from '../identity.tokens';

import type { ExpireVerificationCommand } from '../commands/expire-verification.command';

import type { VerificationAggregate } from '../../domain/aggregates/verification.aggregate';

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

import { VerificationInvariantException } from '../../domain/exceptions/verification-invariant.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class ExpireVerificationHandler implements CommandHandler<
  ExpireVerificationCommand,
  VerificationAggregate
> {
  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.VERIFICATION)
    private readonly verificationRepository: VerificationRepository,
  ) {}

  /**
   * Expires an existing verified aggregate.
   *
   * The aggregate determines whether expiration is allowed.
   */
  public async execute(
    command: ExpireVerificationCommand,
  ): Promise<VerificationAggregate> {
    // 1. Validate command.
    if (command === undefined || command === null) {
      throw new VerificationInvariantException(
        'Expire verification command is required.',
      );
    }

    // 2. Validate target identity.
    if (command.identityPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification identity public ID is required.',
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

    // 4. Load the aggregate through its owning identity.
    const aggregate = await this.verificationRepository.findByIdentityPublicId(
      command.identityPublicId,
    );

    if (aggregate === null) {
      throw new VerificationInvariantException(
        `Verification was not found for identity ${command.identityPublicId.value}.`,
      );
    }

    // Preserve the aggregate identity for the post-save integrity check.
    const verificationPublicId = aggregate.publicId;

    // 5. Apply expiration through the aggregate.
    // Domain rules validate status, expiry configuration and timestamp.
    aggregate.expire(command.correlationId, command.expiredAt);

    // 6. Persist the complete aggregate.
    await this.verificationRepository.save(aggregate);

    // 7. Reload the persisted aggregate for the REST response.
    const savedAggregate =
      await this.verificationRepository.findByIdentityPublicId(
        command.identityPublicId,
      );

    if (savedAggregate === null) {
      throw new VerificationInvariantException(
        'Verification could not be reloaded after expiration.',
      );
    }

    // 8. Ensure the reloaded aggregate is the expected verification.
    if (!savedAggregate.publicId.equals(verificationPublicId)) {
      throw new VerificationInvariantException(
        'The reloaded verification does not match the expired verification.',
      );
    }

    // 9. Return the aggregate expected by VerificationResponseMapper.
    return savedAggregate;
  }
}

export default ExpireVerificationHandler;
