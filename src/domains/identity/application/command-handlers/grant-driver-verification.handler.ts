// -----------------------------------------------------------------------------
// Identity — Grant Driver Verification Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { IDENTITY_TOKENS } from '../identity.tokens';

import type { GrantDriverVerificationCommand } from '../commands/grant-driver-verification.command';

import type { VerificationAggregate } from '../../domain/aggregates/verification.aggregate';

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

import type { IdentityRepository } from '../../domain/repositories/identity.repository';

import type { RoleRepository } from '../../domain/repositories/role.repository';

import { VerificationInvariantException } from '../../domain/exceptions/verification-invariant.exception';

import { RoleCode } from '../../domain/value-objects/role-code.vo';

import { PrismaUnitOfWork } from '../../../../infrastructure/persistence/prisma-unit-of-work';
import { IdentityRoleRolePublicId } from '../../domain/value-objects';

// =============================================================================
// Handler
// =============================================================================

/**
 * Grants DRIVER verification to an existing identity.
 *
 * Application orchestration:
 *   1. Validate the command.
 *   2. Load and validate the Verification aggregate.
 *   3. Resolve the existing DRIVER role.
 *   4. Grant DRIVER verification through VerificationAggregate.
 *   5. Assign the DRIVER role through IdentityAggregate when not already active.
 *   6. Persist both aggregates atomically.
 *   7. Reload and return the persisted Verification aggregate.
 *
 * Verification and Identity retain their own aggregate boundaries.
 */
@Injectable()
export class GrantDriverVerificationHandler implements CommandHandler<
  GrantDriverVerificationCommand,
  VerificationAggregate
> {
  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.VERIFICATION)
    private readonly verificationRepository: VerificationRepository,

    @Inject(IDENTITY_TOKENS.REPOSITORIES.IDENTITY)
    private readonly identityRepository: IdentityRepository,

    @Inject(IDENTITY_TOKENS.REPOSITORIES.ROLE)
    private readonly roleRepository: RoleRepository,

    private readonly unitOfWork: PrismaUnitOfWork,
  ) {}

  public async execute(
    command: GrantDriverVerificationCommand,
  ): Promise<VerificationAggregate> {
    if (command === undefined || command === null) {
      throw new VerificationInvariantException(
        'Grant driver verification command is required.',
      );
    }

    if (
      command.identityPublicId === undefined ||
      command.identityPublicId === null
    ) {
      throw new VerificationInvariantException(
        'Verification identity public ID is required.',
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
      command.verificationRequestPublicId === undefined ||
      command.verificationRequestPublicId === null
    ) {
      throw new VerificationInvariantException(
        'Verification request public ID is required for DRIVER verification.',
      );
    }

    if (
      command.reviewedByPublicId === undefined ||
      command.reviewedByPublicId === null
    ) {
      throw new VerificationInvariantException(
        'Verification reviewer public ID is required.',
      );
    }

    if (
      typeof command.correlationId !== 'string' ||
      command.correlationId.trim().length === 0
    ) {
      throw new VerificationInvariantException(
        'Verification correlation ID is required.',
      );
    }

    return this.unitOfWork.execute(async () => {
      const aggregate =
        await this.verificationRepository.findByIdentityPublicId(
          command.identityPublicId,
        );

      if (aggregate === null) {
        throw new VerificationInvariantException(
          `Verification was not found for identity ${command.identityPublicId.value}.`,
        );
      }

      if (!aggregate.publicId.equals(command.verificationPublicId)) {
        throw new VerificationInvariantException(
          `Verification ${command.verificationPublicId.value} does not belong to identity ${command.identityPublicId.value}.`,
        );
      }

      const identity = await this.identityRepository.findByPublicId(
        command.identityPublicId,
      );

      if (identity === null) {
        throw new VerificationInvariantException(
          `Identity ${command.identityPublicId.value} was not found.`,
        );
      }

      const driverRole = await this.roleRepository.findByCode(
        RoleCode.create('DRIVER'),
      );

      if (driverRole === null) {
        throw new VerificationInvariantException(
          'The DRIVER role has not been configured.',
        );
      }

      if (!driverRole.isActive) {
        throw new VerificationInvariantException(
          'The DRIVER role is inactive and cannot be assigned.',
        );
      }

      const driverRolePublicId = new IdentityRoleRolePublicId(
        driverRole.publicId.value,
      );

      // Domain rules determine whether DRIVER verification can be granted.
      aggregate.grantDriverVerification(
        command.verificationRequestPublicId,
        command.reviewedByPublicId,
        command.correlationId,
        command.verifiedAt,
        command.expiresAt,
      );

      // IdentityAggregate owns role assignment and duplicate-role protection.
      if (!identity.hasRole(driverRolePublicId)) {
        identity.assignRole(
          driverRolePublicId,
          command.correlationId,
          command.reviewedByPublicId,
        );

        await this.identityRepository.save(identity);
      }

      await this.verificationRepository.save(aggregate);

      const savedAggregate =
        await this.verificationRepository.findByIdentityPublicId(
          command.identityPublicId,
        );

      if (savedAggregate === null) {
        throw new VerificationInvariantException(
          'Verification could not be reloaded after granting DRIVER verification.',
        );
      }

      if (!savedAggregate.publicId.equals(command.verificationPublicId)) {
        throw new VerificationInvariantException(
          'The reloaded verification does not match the requested verification.',
        );
      }

      return savedAggregate;
    });
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GrantDriverVerificationHandler;
