// src/domains/identity/application/handlers/assign-role.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { AssignRoleCommand } from '../commands/assign-role.command';

import { InvalidCredentialsException } from '../../domain/exceptions/invalid-credentials.exception';

import type { IdentityRepository } from '../../domain/repositories/identity.repository';
import type { IdentityRoleRepository } from '../../domain/repositories/identity-role.repository';
import type { RoleRepository } from '../../domain/repositories/role.repository';

import { IdentityRoleEntity } from '../../domain/entities/identity-role.entity';

import { IdentityId } from '../../domain/value-objects/identity-id.vo';
import { RoleCode } from '../../domain/value-objects/role-code.vo';

@Injectable()
export class AssignRoleHandler implements CommandHandler<
  AssignRoleCommand,
  void
> {
  constructor(
    @Inject('IdentityRepository')
    private readonly identityRepository: IdentityRepository,

    @Inject('RoleRepository')
    private readonly roleRepository: RoleRepository,

    @Inject('IdentityRoleRepository')
    private readonly identityRoleRepository: IdentityRoleRepository,
  ) {}

  async execute(command: AssignRoleCommand): Promise<void> {
    // ------------------------------------------------------------------
    // Target identity
    // ------------------------------------------------------------------

    const identity = await this.identityRepository.findByPublicId(
      new IdentityId(command.identityPublicId),
    );

    if (identity === null) {
      throw new InvalidCredentialsException();
    }

    // ------------------------------------------------------------------
    // Role
    // ------------------------------------------------------------------

    const role = await this.roleRepository.findByCode(
      new RoleCode(command.roleCode),
    );

    if (role === null || !role.role.isActive) {
      throw new InvalidCredentialsException();
    }

    // ------------------------------------------------------------------
    // Assigned by
    // ------------------------------------------------------------------

    let assignedBy: IdentityId | undefined;

    if (command.assignedByPublicId !== undefined) {
      const assignedByIdentity = await this.identityRepository.findByPublicId(
        new IdentityId(command.assignedByPublicId),
      );

      if (assignedByIdentity === null) {
        throw new InvalidCredentialsException();
      }

      assignedBy = assignedByIdentity.publicId;
    }

    // ------------------------------------------------------------------
    // Existing assignment
    // ------------------------------------------------------------------

    const existing = await this.identityRoleRepository.findByIdentityAndRole(
      identity.publicId,
      role.publicId,
    );

    if (existing !== null && existing.isActive()) {
      return;
    }

    // ------------------------------------------------------------------
    // Create assignment
    // ------------------------------------------------------------------

    const now = new Date();

    const identityRole = IdentityRoleEntity.create({
      identityId: identity.publicId,
      roleId: role.publicId,

      assignedBy,
      assignedAt: now,

      expiresAt: undefined,

      revokedAt: undefined,
      revokedBy: undefined,

      createdAt: now,
      updatedAt: now,
    });

    await this.identityRoleRepository.create(identityRole);
  }
}
