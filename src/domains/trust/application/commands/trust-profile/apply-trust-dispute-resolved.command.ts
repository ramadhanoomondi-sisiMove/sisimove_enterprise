// src/domains/trust/application/commands/trust-profile/apply-trust-dispute-resolved.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

export class ApplyTrustDisputeResolvedCommand extends Command {
  constructor(
    public readonly trustProfileId: string,
    public readonly disputePublicId: string,
    public readonly journeyPublicId: string | undefined,
    public readonly bookingPublicId: string | undefined,
    public readonly actorPublicId: string | undefined,
    public readonly resolution: string | undefined,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
