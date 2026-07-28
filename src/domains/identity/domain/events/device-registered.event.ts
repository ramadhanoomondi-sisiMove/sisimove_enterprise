// src/domains/identity/domain/events/device-registered.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class DeviceRegisteredEvent extends DomainEvent {
  constructor(
    public readonly deviceId: string,
    public readonly publicId: string,
    public readonly identityId: string,
    public readonly fingerprint: string,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      deviceId,
      'Device',
      'DeviceRegistered',
      correlationId,
      causationId,
      1,
      '1.0.0',
    );

    Object.freeze(this);
  }

  protected getPayload(): Record<string, unknown> {
    return {
      deviceId: this.deviceId,
      publicId: this.publicId,
      identityId: this.identityId,
      fingerprint: this.fingerprint,
    };
  }
}
