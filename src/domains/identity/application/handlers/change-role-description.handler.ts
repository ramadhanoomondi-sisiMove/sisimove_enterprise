// src/domains/authorization/application/handlers/change-role-description.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import {
  AUTHORIZATION_EVENT_PUBLISHER,
  AUTHORIZATION_ROLE_REPOSITORY,
} from '../../application/authorization.tokens';

import { ChangeRoleDescriptionCommand } from '../commands/change-role-description.command';

import type { RoleRepository } from '../../domain/repositories/role.repository';

import { RoleId } from '../../domain/value-objects/role-id.vo';

import { RoleNotFoundException } from '../../domain/exceptions/role-not-found.exception';

@Injectable()
export class ChangeRoleDescriptionHandler implements CommandHandler<ChangeRoleDescriptionCommand> {
  constructor(
    @Inject(AUTHORIZATION_ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,

    @Inject(AUTHORIZATION_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ChangeRoleDescriptionCommand): Promise<void> {
    const role = await this.roleRepository.findById(new RoleId(command.roleId));

    if (!role) {
      throw new RoleNotFoundException(command.roleId);
    }

    role.changeDescription(
      command.description,
      new Date(),
      command.correlationId,
      command.causationId,
    );

    await this.roleRepository.update(role);

    await this.eventPublisher.publishAll(role.pullDomainEvents());
  }
}
