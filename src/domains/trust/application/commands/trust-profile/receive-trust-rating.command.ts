// src/domains/trust/application/commands/trust-profile/receive-trust-rating.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

import type { TrustRatingRole } from '../../../domain/value-objects/trust-rating-role.vo';
import { TrustRatingStatus } from '../../../domain/value-objects/trust-rating-status.vo';

export class ReceiveTrustRatingCommand extends Command {
  constructor(
    public readonly trustProfileId: string,
    public readonly ratingId: string,
    public readonly reviewerPublicId: string,
    public readonly revieweePublicId: string,
    public readonly journeyPublicId: string,
    public readonly bookingPublicId: string | undefined,
    public readonly role: TrustRatingRole,
    public readonly score: number,
    public readonly status: TrustRatingStatus = TrustRatingStatus.ACTIVE,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
