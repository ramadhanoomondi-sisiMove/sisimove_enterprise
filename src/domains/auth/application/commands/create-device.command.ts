// -----------------------------------------------------------------------------
// Device — Create Command
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type {
  DeviceIdentityPublicId,
  DeviceFingerprint,
  DeviceName,
  DevicePlatform,
  DeviceOperatingSystem,
  DeviceOperatingSystemVersion,
  DeviceBrowser,
  DeviceBrowserVersion,
  DeviceType,
} from '../../domain/value-objects';

export class CreateDeviceCommand implements Command {
  constructor(
    public readonly identityPublicId: DeviceIdentityPublicId,
    public readonly fingerprint: DeviceFingerprint,
    public readonly name: DeviceName | undefined,
    public readonly platform: DevicePlatform | undefined,
    public readonly operatingSystem: DeviceOperatingSystem | undefined,
    public readonly operatingSystemVersion:
      DeviceOperatingSystemVersion | undefined,
    public readonly browser: DeviceBrowser | undefined,
    public readonly browserVersion: DeviceBrowserVersion | undefined,
    public readonly deviceType: DeviceType,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {}
}
