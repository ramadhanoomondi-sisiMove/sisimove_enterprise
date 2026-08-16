// src/domains/journey/application/commands/journey/attach-pricing.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';
import type { JourneyPricingPublicId } from '../../../domain/value-objects/journey-pricing-public-id.vo';

export class AttachPricingCommand extends Command {
  constructor(
    public readonly journeyPublicId: JourneyPublicId,
    public readonly pricingPublicId: JourneyPricingPublicId,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
