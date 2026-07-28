// src/domains/identity/domain/exceptions/device-already-exists.exception.ts

import { ConflictException } from '@nestjs/common';

export class DeviceAlreadyExistsException extends ConflictException {
  constructor(fingerprint: string) {
    super(`A device with fingerprint '${fingerprint}' is already registered.`);
  }
}
