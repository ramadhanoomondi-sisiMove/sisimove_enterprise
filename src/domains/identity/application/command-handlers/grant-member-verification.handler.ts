//-----------------------------------------------------------------------------
// Identity — Grant Member Verification Command Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { IDENTITY_TOKENS } from '../identity.tokens';

import type { GrantMemberVerificationCommand } from '../commands/grant-member-verification.command';

import type { VerificationAggregate } from '../../domain/aggregates/verification.aggregate';

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

import type { IdentityRepository } from '../../domain/repositories/identity.repository';

import type { RoleRepository } from '../../domain/repositories/role.repository';

import { IdentityRoleRolePublicId, RoleCode } from '../../domain/value-objects';

import { VerificationInvariantException } from '../../domain/exceptions/verification-invariant.exception';

import { PrismaUnitOfWork } from '../../../../infrastructure/persistence/prisma-unit-of-work';

// =============================================================================
// Handler
// =============================================================================

/**
 * Grants MEMBER verification to an existing Verification aggregate and ensures
 * that the target Identity has the corresponding active MEMBER role.
 *
 * Transaction boundary:
 *
 * UnitOfWork
 * ├── VerificationAggregate.grantMemberVerification()
 * ├── VerificationRepository.save()
 * ├── IdentityAggregate.assignRole() when required
 * └── IdentityRepository.save() when the role was newly assigned
 *
 * Both aggregate changes commit together or roll back together.
 *
 * Domain rules remain inside their respective aggregates. This handler
 * coordinates the cross-aggregate application workflow.
 */
@Injectable()
export class GrantMemberVerificationHandler implements CommandHandler<
  GrantMemberVerificationCommand,
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

  /**
   * Executes the GrantMemberVerificationCommand.
   */
  public async execute(
    command: GrantMemberVerificationCommand,
  ): Promise<VerificationAggregate> {
    // 1. Validate command.
    if (command === undefined || command === null) {
      throw new VerificationInvariantException(
        'Grant member verification command is required.',
      );
    }

    // 2. Validate identity.
    if (command.identityPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification identity public ID is required.',
      );
    }

    // 3. Validate verification ID.
    if (command.verificationPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification public ID is required.',
      );
    }

    // 4. Validate verification request ID.
    if (command.verificationRequestPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification request public ID is required for MEMBER verification.',
      );
    }

    // 5. Validate reviewer.
    if (command.reviewedByPublicId === undefined) {
      throw new VerificationInvariantException(
        'Verification reviewer public ID is required.',
      );
    }

    // 6. Validate correlation ID.
    if (
      typeof command.correlationId !== 'string' ||
      command.correlationId.trim().length === 0
    ) {
      throw new VerificationInvariantException(
        'Verification correlation ID is required.',
      );
    }

    // 7. Perform all aggregate reads and writes inside one transaction.
    return this.unitOfWork.execute(async () => {
      // -----------------------------------------------------------------------
      // Load and validate the Verification aggregate.
      // -----------------------------------------------------------------------

      const verification =
        await this.verificationRepository.findByIdentityPublicId(
          command.identityPublicId,
        );

      if (verification === null) {
        throw new VerificationInvariantException(
          `Verification was not found for identity ${command.identityPublicId.value}.`,
        );
      }

      if (!verification.publicId.equals(command.verificationPublicId)) {
        throw new VerificationInvariantException(
          `Verification ${command.verificationPublicId.value} does not belong to identity ${command.identityPublicId.value}.`,
        );
      }

      // -----------------------------------------------------------------------
      // Resolve the existing MEMBER role.
      // -----------------------------------------------------------------------

      const memberRole = await this.roleRepository.findByCode(
        RoleCode.create('MEMBER'),
      );

      if (memberRole === null) {
        throw new VerificationInvariantException(
          'The MEMBER role does not exist and must be provisioned before granting MEMBER verification.',
        );
      }

      if (!memberRole.canBeAssigned()) {
        throw new VerificationInvariantException(
          'The MEMBER role is inactive or cannot currently be assigned.',
        );
      }

      // Convert the Role public ID into the Identity domain's typed reference.
      // PublicEntityId preserves the supplied value; it does not rewrite it.
      const memberRolePublicId = new IdentityRoleRolePublicId(
        memberRole.publicId.value,
      );

      // -----------------------------------------------------------------------
      // Load the Identity aggregate.
      // -----------------------------------------------------------------------

      const identity = await this.identityRepository.findByPublicId(
        command.identityPublicId,
      );

      if (identity === null) {
        throw new VerificationInvariantException(
          `Identity ${command.identityPublicId.value} was not found while granting MEMBER verification.`,
        );
      }

      // Defend against inconsistent repository results.
      if (!identity.publicId.equals(command.identityPublicId)) {
        throw new VerificationInvariantException(
          'The loaded Identity does not match the requested identity.',
        );
      }

      // -----------------------------------------------------------------------
      // Grant verification through the Verification aggregate.
      // -----------------------------------------------------------------------

      verification.grantMemberVerification(
        command.verificationRequestPublicId,
        command.reviewedByPublicId,
        command.correlationId,
        command.verifiedAt,
        command.expiresAt,
      );

      await this.verificationRepository.save(verification);

      // -----------------------------------------------------------------------
      // Ensure the target Identity has an active MEMBER role.
      // -----------------------------------------------------------------------

      const alreadyHasMemberRole = identity.hasRole(memberRolePublicId);

      if (!alreadyHasMemberRole) {
        identity.assignRole(
          memberRolePublicId,
          command.correlationId,
          command.reviewedByPublicId,
        );

        await this.identityRepository.save(identity);
      }

      // -----------------------------------------------------------------------
      // Reload the persisted Verification for the existing response contract.
      // -----------------------------------------------------------------------

      const savedVerification =
        await this.verificationRepository.findByIdentityPublicId(
          command.identityPublicId,
        );

      if (savedVerification === null) {
        throw new VerificationInvariantException(
          'Verification could not be reloaded after granting MEMBER verification.',
        );
      }

      if (!savedVerification.publicId.equals(command.verificationPublicId)) {
        throw new VerificationInvariantException(
          'The reloaded verification does not match the requested verification.',
        );
      }

      return savedVerification;
    });
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GrantMemberVerificationHandler;
