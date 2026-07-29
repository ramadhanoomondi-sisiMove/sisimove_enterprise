// src/domains/identity/application/handlers/query-handlers/list-identity-devices.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import {
  IDENTITY_DEVICE_REPOSITORY,
  IDENTITY_REPOSITORY,
} from '../../identity.tokens';

import { ListIdentityDevicesQuery } from '../../queries/list-identity-devices.query';

import type { DeviceEntity } from '../../../domain/entities/device.entity';
import { IdentityNotFoundException } from '../../../domain/exceptions/identity-not-found.exception';

import type { DeviceRepository } from '../../../domain/repositories/device.repository';
import type { IdentityRepository } from '../../../domain/repositories/identity.repository';

import { IdentityId } from '../../../domain/value-objects/identity-id.vo';

@Injectable()
export class ListIdentityDevicesHandler implements QueryHandler<
  ListIdentityDevicesQuery,
  DeviceEntity[]
> {
  public constructor(
    @Inject(IDENTITY_DEVICE_REPOSITORY)
    private readonly deviceRepository: DeviceRepository,

    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,
  ) {}

  public async execute(
    query: ListIdentityDevicesQuery,
  ): Promise<DeviceEntity[]> {
    const identity = await this.identityRepository.findByPublicId(
      new IdentityId(query.identityPublicId),
    );

    if (identity === null) {
      throw new IdentityNotFoundException(query.identityPublicId);
    }

    return this.deviceRepository.findByIdentityId(identity.id.value);
  }
}
