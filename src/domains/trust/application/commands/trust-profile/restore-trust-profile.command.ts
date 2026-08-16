// src/domains/trust/application/commands/trust-profile/restore-trust-profile.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

export class RestoreTrustProfileCommand extends Command {
  constructor(
    public readonly trustProfileId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
