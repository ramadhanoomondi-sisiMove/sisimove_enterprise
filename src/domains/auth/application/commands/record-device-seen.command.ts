// -----------------------------------------------------------------------------
// Device — Record Seen Command
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type {
  DevicePublicId,
  DeviceLastSeenAt,
} from '../../domain/value-objects';

export class RecordDeviceSeenCommand implements Command {
  constructor(
    public readonly devicePublicId: DevicePublicId,
    public readonly lastSeenAt: DeviceLastSeenAt,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {}
}
