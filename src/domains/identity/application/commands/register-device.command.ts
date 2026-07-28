// src/domains/identity/application/commands/register-device.command.ts

import type { DeviceType } from '../../domain/value-objects/device-type.enum';

export interface DeviceMetadata {
  readonly name?: string;
  readonly platform?: string;
  readonly operatingSystem?: string;
  readonly operatingSystemVersion?: string;
  readonly browser?: string;
  readonly browserVersion?: string;
}

export class RegisterDeviceCommand {
  constructor(
    public readonly identityPublicId: string,
    public readonly fingerprint: string,
    public readonly deviceType: DeviceType,
    public readonly correlationId: string,
    public readonly metadata?: DeviceMetadata,
  ) {}
}
