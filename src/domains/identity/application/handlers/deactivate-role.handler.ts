// src/domains/authorization/application/handlers/deactivate-role.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import {
  AUTHORIZATION_EVENT_PUBLISHER,
  AUTHORIZATION_ROLE_REPOSITORY,
} from '../../application/authorization.tokens';

import { DeactivateRoleCommand } from '../commands/deactivate-role.command';

import type { RoleRepository } from '../../domain/repositories/role.repository';

import { RoleId } from '../../domain/value-objects/role-id.vo';

import { RoleNotFoundException } from '../../domain/exceptions/role-not-found.exception';

@Injectable()
export class DeactivateRoleHandler implements CommandHandler<DeactivateRoleCommand> {
  constructor(
    @Inject(AUTHORIZATION_ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,

    @Inject(AUTHORIZATION_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: DeactivateRoleCommand): Promise<void> {
    const role = await this.roleRepository.findById(new RoleId(command.roleId));

    if (!role) {
      throw new RoleNotFoundException(command.roleId);
    }

    role.deactivate(new Date(), command.correlationId, command.causationId);

    await this.roleRepository.update(role);

    await this.eventPublisher.publishAll(role.pullDomainEvents());
  }
}
