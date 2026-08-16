// src/domains/trust/application/commands/trust-profile/suspend-trust-profile.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

export class SuspendTrustProfileCommand extends Command {
  constructor(
    public readonly trustProfileId: string,
    public readonly reason: string | undefined,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
