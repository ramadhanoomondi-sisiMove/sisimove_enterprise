// src/domains/identity/domain/events/device-trusted.event.ts

import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

export class DeviceTrustedEvent extends DomainEvent {
  constructor(
    public readonly deviceId: string,
    public readonly publicId: string,
    public readonly identityId: string,
    correlationId: string,
    causationId?: string,
  ) {
    super(
      deviceId,
      'Device',
      'DeviceTrusted',
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
    };
  }
}
