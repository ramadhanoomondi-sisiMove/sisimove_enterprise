// src/domains/authorization/application/handlers/create-role.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import {
  AUTHORIZATION_EVENT_PUBLISHER,
  AUTHORIZATION_ROLE_REPOSITORY,
} from '../../application/authorization.tokens';

import { CreateRoleCommand } from '../commands/create-role.command';

import { RoleAggregate } from '../../domain/aggregates/role.aggregate';
import { RoleEntity } from '../../domain/entities/role.entity';

import { RoleAlreadyExistsException } from '../../domain/exceptions/role-already-exists.exception';
import { RoleCodeAlreadyExistsException } from '../../domain/exceptions/role-code-already-exists.exception';

import type { RoleRepository } from '../../domain/repositories/role.repository';

import { RoleCode } from '../../domain/value-objects/role-code.vo';
import { RoleId } from '../../domain/value-objects/role-id.vo';
import { RoleName } from '../../domain/value-objects/role-name.vo';

@Injectable()
export class CreateRoleHandler implements CommandHandler<CreateRoleCommand> {
  constructor(
    @Inject(AUTHORIZATION_ROLE_REPOSITORY)
    private readonly roleRepository: RoleRepository,

    @Inject(AUTHORIZATION_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateRoleCommand): Promise<void> {
    const roleName = new RoleName(command.name);
    const roleCode = new RoleCode(command.code);

    if (await this.roleRepository.existsByName(roleName)) {
      throw new RoleAlreadyExistsException(roleName.value);
    }

    if (await this.roleRepository.existsByCode(roleCode)) {
      throw new RoleCodeAlreadyExistsException(roleCode.value);
    }

    const now = new Date();

    const role = RoleEntity.create({
      publicId: new RoleId(),

      name: roleName.value,
      code: roleCode.value,

      description: command.description,
      displayOrder: command.displayOrder,

      isSystem: false,
      isActive: true,

      createdAt: now,
      updatedAt: now,
    });

    const aggregate = RoleAggregate.create(
      role,
      command.correlationId,
      command.causationId,
    );

    await this.roleRepository.create(aggregate);

    await this.eventPublisher.publishAll(aggregate.pullDomainEvents());
  }
}
