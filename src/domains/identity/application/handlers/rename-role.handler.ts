// src/domains/authorization/application/handlers/rename-role.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import {
  AUTHORIZATION_EVENT_PUBLISHER,
  AUTHORIZATION_ROLE_REPOSITORY,
} from '../authorization.tokens';

import { RenameRoleCommand } from '../commands/rename-role.command';

import type { RoleRepository } from '../../domain/repositories/role.repository';

import { RoleNotFoundException } from '../../domain/exceptions/role-not-found.exception';

import { RoleId } from '../../domain/value-objects/role-id.vo';
import { RoleName } from '../../domain/value-objects/role-name.vo';

@Injectable()
export class RenameRoleHandler implements CommandHandler<RenameRoleCommand> {
  constructor(
    @Inject(AUTHORIZATION_ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,

    @Inject(AUTHORIZATION_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: RenameRoleCommand): Promise<void> {
    const roleId = new RoleId(command.roleId);

    const aggregate = await this.roleRepository.findById(roleId);

    if (!aggregate) {
      throw new RoleNotFoundException(command.roleId);
    }

    const roleName = new RoleName(command.name);

    aggregate.rename(
      roleName,
      new Date(),
      command.correlationId,
      command.causationId,
    );

    await this.roleRepository.update(aggregate);

    await this.eventPublisher.publishAll(aggregate.pullDomainEvents());
  }
}
