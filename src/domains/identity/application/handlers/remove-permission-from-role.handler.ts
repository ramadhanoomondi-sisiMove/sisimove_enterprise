// src/domains/authorization/application/handlers/remove-permission-from-role.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import {
  AUTHORIZATION_EVENT_PUBLISHER,
  AUTHORIZATION_ROLE_REPOSITORY,
} from '../authorization.tokens';

import { RemovePermissionFromRoleCommand } from '../commands/remove-permission-from-role.command';

import type { RoleRepository } from '../../domain/repositories/role.repository';

import { RoleNotFoundException } from '../../domain/exceptions/role-not-found.exception';

import { PermissionId } from '../../domain/value-objects/permission-id.vo';
import { RoleId } from '../../domain/value-objects/role-id.vo';

@Injectable()
export class RemovePermissionFromRoleHandler implements CommandHandler<RemovePermissionFromRoleCommand> {
  constructor(
    @Inject(AUTHORIZATION_ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,

    @Inject(AUTHORIZATION_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: RemovePermissionFromRoleCommand): Promise<void> {
    const roleId = new RoleId(command.rolePublicId);

    const aggregate = await this.roleRepository.findByPublicId(roleId);

    if (!aggregate) {
      throw new RoleNotFoundException(roleId.value);
    }

    const permissionId = new PermissionId(command.permissionPublicId);

    aggregate.removePermission(
      permissionId,
      new Date(),
      command.correlationId,
      command.causationId,
    );

    await this.roleRepository.update(aggregate);

    await this.eventPublisher.publishAll(aggregate.pullDomainEvents());
  }
}
