// src/domains/identity/application/commands/update-device-trust-level.command.ts

import type { DeviceEntity } from '../../domain/entities/device.entity';

export class UpdateDeviceTrustLevelCommand {
  constructor(
    public readonly devicePublicId: string,
    public readonly trustLevel: DeviceEntity,
    public readonly updatedByPublicId: string,
    public readonly correlationId: string,
  ) {}
}
