// src/domains/journey-demand/application/commands/add-journey-demand-participant.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class AddJourneyDemandParticipantCommand extends Command {
  constructor(
    public readonly journeyDemandPublicId: string,
    public readonly participantPublicId: string,
    public readonly memberPublicId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
