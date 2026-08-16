// src/domains/journey/application/commands/journey/attach-journey-capacity.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';
import type { JourneyCapacityPublicId } from '../../../domain/value-objects/journey-capacity-public-id.vo';

export class AttachJourneyCapacityCommand extends Command {
  constructor(
    public readonly journeyPublicId: JourneyPublicId,
    public readonly capacityPublicId: JourneyCapacityPublicId,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
