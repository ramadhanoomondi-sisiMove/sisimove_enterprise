// src/domains/identity/application/handlers/query-handlers/list-identity-devices.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { ListIdentityDevicesQuery } from '../../queries/list-identity-devices.query';

import type { DeviceEntity } from '../../../domain/entities/device.entity';
import type { DeviceRepository } from '../../../domain/repositories/device.repository';
import type { IdentityRepository } from '../../../domain/repositories/identity.repository';

import { IdentityId } from '../../../domain/value-objects/identity-id.vo';
import { IdentityNotFoundException } from '../../../domain/exceptions/identity-not-found.exception';

@Injectable()
export class ListIdentityDevicesHandler implements QueryHandler<
  ListIdentityDevicesQuery,
  DeviceEntity[]
> {
  constructor(
    @Inject('DeviceRepository')
    private readonly deviceRepository: DeviceRepository,

    @Inject('IdentityRepository')
    private readonly identityRepository: IdentityRepository,
  ) {}

  async execute(query: ListIdentityDevicesQuery): Promise<DeviceEntity[]> {
    const identity = await this.identityRepository.findByPublicId(
      new IdentityId(query.identityPublicId),
    );

    if (!identity) {
      throw new IdentityNotFoundException(query.identityPublicId);
    }

    return this.deviceRepository.findByIdentityId(identity.id.value);
  }
}
