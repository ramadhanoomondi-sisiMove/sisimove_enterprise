// src/domains/identity/domain/exceptions/device-not-found.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class DeviceNotFoundException extends DomainException {
  constructor(publicId: string) {
    super('DEVICE_NOT_FOUND', `Device '${publicId}' was not found.`);
  }
}
