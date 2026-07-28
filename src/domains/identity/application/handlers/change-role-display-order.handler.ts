// src/domains/authorization/application/handlers/change-role-display-order.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import {
  AUTHORIZATION_EVENT_PUBLISHER,
  AUTHORIZATION_ROLE_REPOSITORY,
} from '../../application/authorization.tokens';

import { ChangeRoleDisplayOrderCommand } from '../commands/change-role-display-order.command';

import type { RoleRepository } from '../../domain/repositories/role.repository';

import { RoleId } from '../../domain/value-objects/role-id.vo';

import { RoleNotFoundException } from '../../domain/exceptions/role-not-found.exception';

@Injectable()
export class ChangeRoleDisplayOrderHandler implements CommandHandler<ChangeRoleDisplayOrderCommand> {
  constructor(
    @Inject(AUTHORIZATION_ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,

    @Inject(AUTHORIZATION_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: ChangeRoleDisplayOrderCommand): Promise<void> {
    const role = await this.roleRepository.findById(new RoleId(command.roleId));

    if (!role) {
      throw new RoleNotFoundException(command.roleId);
    }

    role.changeDisplayOrder(
      command.displayOrder,
      new Date(),
      command.correlationId,
      command.causationId,
    );

    await this.roleRepository.update(role);

    await this.eventPublisher.publishAll(role.pullDomainEvents());
  }
}
