// src/domains/identity/application/handlers/query-handlers/get-device.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import { GetDeviceQuery } from '../../queries/get-device.query';

import type { DeviceEntity } from '../../../domain/entities/device.entity';
import { DeviceNotFoundException } from '../../../domain/exceptions/device-not-found.exception';
import type { DeviceRepository } from '../../../domain/repositories/device.repository';
import { DeviceId } from '../../../domain/value-objects/device-id.vo';

@Injectable()
export class GetDeviceHandler implements QueryHandler<
  GetDeviceQuery,
  DeviceEntity
> {
  constructor(
    @Inject('DeviceRepository')
    private readonly repository: DeviceRepository,
  ) {}

  async execute(query: GetDeviceQuery): Promise<DeviceEntity> {
    const publicId = new DeviceId(query.publicId);

    const device = await this.repository.findEntityByPublicId(publicId);

    if (device === null) {
      throw new DeviceNotFoundException(publicId.value);
    }

    return device;
  }
}
