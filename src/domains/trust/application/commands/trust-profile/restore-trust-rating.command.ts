// src/domains/trust/application/commands/trust-profile/restore-trust-rating.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

export class RestoreTrustRatingCommand extends Command {
  constructor(
    public readonly trustProfileId: string,
    public readonly ratingId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
