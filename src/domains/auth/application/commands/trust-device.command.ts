// -----------------------------------------------------------------------------
// Device — Trust Command
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type {
  DevicePublicId,
  DeviceTrustedAt,
} from '../../domain/value-objects';

export class TrustDeviceCommand implements Command {
  constructor(
    public readonly devicePublicId: DevicePublicId,
    public readonly trustedAt: DeviceTrustedAt,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {}
}
