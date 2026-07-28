// src/domains/identity/domain/exceptions/invalid-device-fingerprint.exception.ts

import { DomainException } from '../../../../foundation/kernel/domain/domain-exception';

export class InvalidDeviceFingerprintException extends DomainException {
  constructor(reason?: string) {
    super(
      'INVALID_DEVICE_FINGERPRINT',
      reason ?? 'The device fingerprint is invalid.',
    );

    Object.setPrototypeOf(this, InvalidDeviceFingerprintException.prototype);
  }
}
