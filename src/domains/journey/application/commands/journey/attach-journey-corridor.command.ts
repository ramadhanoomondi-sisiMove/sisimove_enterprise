// src/domains/journey/application/commands/journey/attach-journey-corridor.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';
import type { JourneyCorridorPublicId } from '../../../domain/value-objects/journey-corridor-public-id.vo';

export class AttachJourneyCorridorCommand extends Command {
  constructor(
    public readonly journeyPublicId: JourneyPublicId,
    public readonly corridorPublicId: JourneyCorridorPublicId,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
