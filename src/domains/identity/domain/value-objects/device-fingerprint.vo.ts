// src/domains/identity/domain/value-objects/device-fingerprint.vo.ts

import { ValueObject } from '../../../../foundation/kernel/domain/value-object';

import { InvalidDeviceFingerprintException } from '../exceptions/invalid-device-fingerprint.exception';

interface DeviceFingerprintProps {
  value: string;
}

export class DeviceFingerprint extends ValueObject<DeviceFingerprintProps> {
  constructor(value: string) {
    const normalized = DeviceFingerprint.normalize(value);

    DeviceFingerprint.validate(normalized);

    super({
      value: normalized,
    });
  }

  get value(): string {
    return this.props.value;
  }

  override equals(other: DeviceFingerprint): boolean {
    return this.value === other.value;
  }

  private static normalize(value: string): string {
    return value.trim();
  }

  private static validate(value: string): void {
    if (!value) {
      throw new InvalidDeviceFingerprintException(
        'Device fingerprint cannot be empty.',
      );
    }

    if (value.length > 512) {
      throw new InvalidDeviceFingerprintException(
        'Device fingerprint exceeds the maximum length.',
      );
    }
  }
}
