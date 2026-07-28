// src/domains/authorization/application/handlers/revoke-role.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import {
  AUTHORIZATION_IDENTITY_ROLE_REPOSITORY,
  AUTHORIZATION_ROLE_REPOSITORY,
} from '../authorization.tokens';

import { RevokeRoleCommand } from '../commands/revoke-role.command';

import type { IdentityRoleRepository } from '../../domain/repositories/identity-role.repository';
import type { RoleRepository } from '../../domain/repositories/role.repository';

import { RoleCode } from '../../domain/value-objects/role-code.vo';

import { IdentityId } from '../../../identity/domain/value-objects/identity-id.vo';

import { InvalidCredentialsException } from '../../../identity/domain/exceptions/invalid-credentials.exception';

@Injectable()
export class RevokeRoleHandler implements CommandHandler<RevokeRoleCommand> {
  constructor(
    @Inject(AUTHORIZATION_ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,

    @Inject(AUTHORIZATION_IDENTITY_ROLE_REPOSITORY)
    private readonly identityRoleRepository: IdentityRoleRepository,
  ) {}

  async execute(command: RevokeRoleCommand): Promise<void> {
    const identityId = new IdentityId(command.identityPublicId);
    const revokedBy = new IdentityId(command.revokedByPublicId);
    const roleCode = new RoleCode(command.roleCode);

    const role = await this.roleRepository.findByCode(roleCode);

    if (!role) {
      throw new InvalidCredentialsException();
    }

    const assignment = await this.identityRoleRepository.findByIdentityAndRole(
      identityId,
      role.publicId,
    );

    if (!assignment || !assignment.isActive()) {
      throw new InvalidCredentialsException();
    }

    const now = new Date();

    assignment.setRevocation(revokedBy, now);
    assignment.setUpdatedAt(now);

    await this.identityRoleRepository.update(assignment);
  }
}
