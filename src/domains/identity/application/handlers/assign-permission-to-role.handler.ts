// src/domains/authorization/application/handlers/assign-permission-to-role.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import {
  AUTHORIZATION_EVENT_PUBLISHER,
  AUTHORIZATION_PERMISSION_REPOSITORY,
  AUTHORIZATION_ROLE_REPOSITORY,
} from '../authorization.tokens';

import { AssignPermissionToRoleCommand } from '../commands/assign-permission-to-role.command';

import { PermissionNotFoundException } from '../../domain/exceptions/permission-not-found.exception';
import { RoleNotFoundException } from '../../domain/exceptions/role-not-found.exception';

import type { PermissionRepository } from '../../domain/repositories/permission.repository';
import type { RoleRepository } from '../../domain/repositories/role.repository';

import { PermissionId } from '../../domain/value-objects/permission-id.vo';
import { RoleId } from '../../domain/value-objects/role-id.vo';

@Injectable()
export class AssignPermissionToRoleHandler implements CommandHandler<AssignPermissionToRoleCommand> {
  constructor(
    @Inject(AUTHORIZATION_ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,

    @Inject(AUTHORIZATION_PERMISSION_REPOSITORY)
    private readonly permissionRepository: PermissionRepository,

    @Inject(AUTHORIZATION_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: AssignPermissionToRoleCommand): Promise<void> {
    const roleId = new RoleId(command.rolePublicId);
    const permissionId = new PermissionId(command.permissionPublicId);

    const role = await this.roleRepository.findByPublicId(roleId);

    if (!role) {
      throw new RoleNotFoundException(command.rolePublicId);
    }

    const permission =
      await this.permissionRepository.findByPublicId(permissionId);

    if (!permission) {
      throw new PermissionNotFoundException(command.permissionPublicId);
    }

    role.assignPermission(
      permission.permissionId,
      new Date(),
      command.correlationId,
      command.causationId,
    );

    await this.roleRepository.update(role);

    await this.eventPublisher.publishAll(role.pullDomainEvents());
  }
}
