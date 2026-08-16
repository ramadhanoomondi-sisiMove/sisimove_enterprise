// src/domains/trust/application/commands/trust-profile/hide-trust-rating.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

export class HideTrustRatingCommand extends Command {
  constructor(
    public readonly trustProfileId: string,
    public readonly ratingId: string,
    public readonly reason: string | undefined,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
