// -----------------------------------------------------------------------------
// Journey Demand — Remove Participant Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class RemoveJourneyDemandParticipantCommand extends Command {
  constructor(
    /**
     * Public identifier of the Journey Demand.
     */
    public readonly journeyDemandPublicId: string,

    /**
     * Public identifier of the participant being removed.
     */
    public readonly participantPublicId: string,

    /**
     * Correlation identifier for distributed tracing.
     */
    public readonly correlationId: string,

    /**
     * Causation identifier for distributed tracing.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
