// src/domains/journey-demand/application/commands/cancel-journey-demand.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class CancelJourneyDemandCommand extends Command {
  constructor(
    public readonly journeyDemandPublicId: string,
    public readonly correlationId: string,
    public readonly causationId?: string,
    public readonly reason?: string,
  ) {
    super();
  }
}
