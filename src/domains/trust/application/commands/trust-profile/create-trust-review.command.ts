// src/domains/trust/application/commands/trust-profile/create-trust-review.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

export class CreateTrustReviewCommand extends Command {
  constructor(
    public readonly trustProfileId: string,
    public readonly reviewId: string,
    public readonly ratingId: string,
    public readonly content: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
