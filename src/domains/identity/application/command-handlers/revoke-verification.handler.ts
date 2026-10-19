/**
 * sisiMove — Revoke Verification Command Handler
 *
 * Revokes a verified Verification aggregate, persists the transition,
 * reloads the aggregate, and returns it for the REST response.
 *
 * VerificationAggregate remains responsible for lifecycle rules.
 */

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { IDENTITY_TOKENS } from '../identity.tokens';

import type { RevokeVerificationCommand } from '../commands/revoke-verification.command';

import type { VerificationAggregate } from '../../domain/aggregates/verification.aggregate';

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

import { VerificationInvariantException } from '../../domain/exceptions/verification-invariant.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class RevokeVerificationHandler implements CommandHandler<
  RevokeVerificationCommand,
  VerificationAggregate
> {
  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.VERIFICATION)
    private readonly verificationRepository: VerificationRepository,
  ) {}

  /**
   * Executes the RevokeVerificationCommand.
   *
   * Transitions a valid VERIFIED aggregate to REVOKED, persists it,
   * reloads the saved aggregate, and returns the updated aggregate.
   */
  public async execute(
    command: RevokeVerificationCommand,
  ): Promise<VerificationAggregate> {
    // 1. Validate command.
    if (command === undefined || command === null) {
      throw new VerificationInvariantException(
        'Revoke verification command is required.',
      );
    }

    // 2. Validate target identity.
    if (command.identityPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification identity public ID is required.',
      );
    }

    // 3. Validate revoking identity.
    if (command.revokedByPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification revoking identity public ID is required.',
      );
    }

    // 4. Validate revocation reason.
    if (
      typeof command.reason !== 'string' ||
      command.reason.trim().length === 0
    ) {
      throw new VerificationInvariantException(
        'Verification revocation reason is required.',
      );
    }

    // 5. Validate correlation ID.
    if (
      typeof command.correlationId !== 'string' ||
      command.correlationId.trim().length === 0
    ) {
      throw new VerificationInvariantException(
        'Verification correlation ID is required.',
      );
    }

    // 6. Load the aggregate by its owning identity.
    const aggregate = await this.verificationRepository.findByIdentityPublicId(
      command.identityPublicId,
    );

    if (aggregate === null) {
      throw new VerificationInvariantException(
        `Verification was not found for identity ${command.identityPublicId.value}.`,
      );
    }

    // Preserve the aggregate's public ID to verify the reloaded record.
    const verificationPublicId = aggregate.publicId;

    // 7. Apply the domain transition.
    // The aggregate enforces whether revocation is permitted.
    aggregate.revoke(
      command.revokedByPublicId,
      command.reason,
      command.correlationId,
      command.revokedAt,
    );

    // 8. Persist the updated aggregate.
    await this.verificationRepository.save(aggregate);

    // 9. Reload the persisted aggregate for the controller response.
    const savedAggregate =
      await this.verificationRepository.findByIdentityPublicId(
        command.identityPublicId,
      );

    if (savedAggregate === null) {
      throw new VerificationInvariantException(
        'Verification could not be reloaded after revocation.',
      );
    }

    // 10. Ensure the reloaded aggregate is the same verification.
    if (!savedAggregate.publicId.equals(verificationPublicId)) {
      throw new VerificationInvariantException(
        'The reloaded verification does not match the revoked verification.',
      );
    }

    // 11. Return the aggregate expected by VerificationResponseMapper.
    return savedAggregate;
  }
}

export default RevokeVerificationHandler;
