// src/domains/trust/application/commands/trust-profile/change-trust-profile-status.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

import type { TrustProfileStatus } from '../../../domain/value-objects/trust-profile-status.vo';

export class ChangeTrustProfileStatusCommand extends Command {
  constructor(
    public readonly trustProfileId: string,
    public readonly status: TrustProfileStatus,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
