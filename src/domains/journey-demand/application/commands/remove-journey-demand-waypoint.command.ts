// -----------------------------------------------------------------------------
// Journey Demand — Remove Waypoint Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class RemoveJourneyDemandWaypointCommand extends Command {
  constructor(
    /**
     * Public identifier of the Journey Demand containing the waypoint.
     */
    public readonly journeyDemandPublicId: string,

    /**
     * Public identifier of the waypoint being removed.
     */
    public readonly waypointPublicId: string,

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
