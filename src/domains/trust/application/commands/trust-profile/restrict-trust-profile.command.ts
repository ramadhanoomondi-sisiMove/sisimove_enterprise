// src/domains/trust/application/commands/trust-profile/restrict-trust-profile.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

export class RestrictTrustProfileCommand extends Command {
  constructor(
    public readonly trustProfileId: string,
    public readonly reason: string | undefined,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
