// src/domains/identity/application/handlers/revoke-device.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import { RevokeDeviceCommand } from '../commands/revoke-device.command';
import { DeviceNotFoundException } from '../../domain/exceptions/device-not-found.exception';
import type { DeviceRepository } from '../../domain/repositories/device.repository';
import { DeviceId } from '../../domain/value-objects/device-id.vo';

@Injectable()
export class RevokeDeviceHandler implements CommandHandler<
  RevokeDeviceCommand,
  void
> {
  constructor(
    @Inject('DeviceRepository')
    private readonly repository: DeviceRepository,

    @Inject('EventPublisher')
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: RevokeDeviceCommand): Promise<void> {
    const publicId = new DeviceId(command.publicId);

    const device = await this.repository.findByPublicId(publicId);

    if (!device) {
      throw new DeviceNotFoundException(command.publicId);
    }

    device.revoke(command.correlationId);

    await this.repository.save(device);

    await this.eventPublisher.publishAll(device.pullDomainEvents());
  }
}
