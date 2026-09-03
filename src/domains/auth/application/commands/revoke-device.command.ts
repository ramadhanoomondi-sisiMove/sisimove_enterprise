// -----------------------------------------------------------------------------
// Device — Revoke Command
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type {
  DevicePublicId,
  DeviceRevokedAt,
} from '../../domain/value-objects';

export class RevokeDeviceCommand implements Command {
  constructor(
    public readonly devicePublicId: DevicePublicId,
    public readonly revokedAt: DeviceRevokedAt,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {}
}
