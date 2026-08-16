// src/domains/trust/application/commands/trust-profile/apply-trust-manual-adjustment.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

export class ApplyTrustManualAdjustmentCommand extends Command {
  constructor(
    public readonly trustProfileId: string,
    public readonly actorPublicId: string,
    public readonly reason: string,
    public readonly adjustment: string,
    public readonly metadata: Record<string, unknown> | undefined,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
