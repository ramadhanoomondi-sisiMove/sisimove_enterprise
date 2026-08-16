// src/domains/journey/application/commands/journey/attach-journey-schedule.command.ts

import { Command } from '../../../../../foundation/kernel/application/command';

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';
import type { JourneySchedulePublicId } from '../../../domain/value-objects/journey-schedule-public-id.vo';

export class AttachJourneyScheduleCommand extends Command {
  constructor(
    public readonly journeyPublicId: JourneyPublicId,
    public readonly schedulePublicId: JourneySchedulePublicId,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
