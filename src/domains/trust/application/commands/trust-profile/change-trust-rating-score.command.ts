// src/domains/trust/application/commands/trust-profile/change-trust-rating-score.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { TrustRatingScore } from '../../../domain/value-objects/trust-rating-score.vo';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class ChangeTrustRatingScoreCommand extends Command {
  constructor(
    public readonly trustProfileId: string,
    public readonly ratingId: string,
    public readonly score: TrustRatingScore,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
