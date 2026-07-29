// src/domains/identity/application/handlers/register-device.handler.ts

import { Inject, Injectable } from '@nestjs/common';

import { CommandHandler } from '../../../../foundation/kernel/application/command-handler';
import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

import {
  IDENTITY_DEVICE_REPOSITORY,
  IDENTITY_REPOSITORY,
  IDENTITY_EVENT_PUBLISHER,
} from '../identity.tokens';

import { RegisterDeviceCommand } from '../commands/register-device.command';

import { DeviceAggregate } from '../../domain/aggregates/device.aggregate';

import { DeviceAlreadyExistsException } from '../../domain/exceptions/device-already-exists.exception';
import { IdentityNotFoundException } from '../../domain/exceptions/identity-not-found.exception';

import type { DeviceRepository } from '../../domain/repositories/device.repository';
import type { IdentityRepository } from '../../domain/repositories/identity.repository';

import { DeviceFingerprint } from '../../domain/value-objects/device-fingerprint.vo';
import { IdentityId } from '../../domain/value-objects/identity-id.vo';

@Injectable()
export class RegisterDeviceHandler implements CommandHandler<
  RegisterDeviceCommand,
  string
> {
  constructor(
    @Inject(IDENTITY_DEVICE_REPOSITORY)
    private readonly repository: DeviceRepository,

    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,

    @Inject(IDENTITY_EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: RegisterDeviceCommand): Promise<string> {
    const fingerprint = new DeviceFingerprint(command.fingerprint);

    const existingDevice = await this.repository.findByFingerprint(fingerprint);

    if (existingDevice) {
      throw new DeviceAlreadyExistsException(fingerprint.value);
    }

    // Convert public ID -> internal Identity aggregate
    const identity = await this.identityRepository.findByPublicId(
      new IdentityId(command.identityPublicId),
    );

    if (!identity) {
      throw new IdentityNotFoundException(command.identityPublicId);
    }

    const device = DeviceAggregate.register(
      identity.id.value, // internal UUID
      fingerprint,
      command.deviceType,
      command.correlationId,
      command.metadata,
    );

    await this.repository.save(device);

    await this.eventPublisher.publishAll(device.pullDomainEvents());

    return device.publicId.value;
  }
}
