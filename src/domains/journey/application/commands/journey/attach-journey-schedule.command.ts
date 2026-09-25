// src/domains/journey/application/commands/journey/attach-journey-schedule.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Configures the schedule of an existing Journey.
 *
 * JourneySchedule is a Journey-owned child entity. The command therefore
 * carries primitive configuration values. The handler is responsible for
 * constructing the corresponding domain value objects.
 */
export class AttachJourneyScheduleCommand extends Command {
  public constructor(
    public readonly journeyPublicId: JourneyPublicId,
    public readonly departureAt: Date,
    public readonly arrivalAt: Date | undefined,
    public readonly timezone: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
