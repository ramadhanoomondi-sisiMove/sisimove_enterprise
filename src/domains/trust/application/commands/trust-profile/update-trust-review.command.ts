// src/domains/trust/application/commands/trust-profile/update-trust-review.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

export class UpdateTrustReviewCommand extends Command {
  constructor(
    public readonly trustProfileId: string,
    public readonly reviewId: string,
    public readonly content: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
