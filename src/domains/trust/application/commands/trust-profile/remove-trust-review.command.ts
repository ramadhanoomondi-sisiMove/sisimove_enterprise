// src/domains/trust/application/commands/trust-profile/remove-trust-review.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

export class RemoveTrustReviewCommand extends Command {
  constructor(
    public readonly trustProfileId: string,
    public readonly reviewId: string,
    public readonly reason: string | undefined,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
