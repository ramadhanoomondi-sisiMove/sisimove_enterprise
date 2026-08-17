// src/domains/journey-demand/application/commands/update-journey-demand-waypoint.command.ts

// -----------------------------------------------------------------------------
// Update Journey Demand Waypoint Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class UpdateJourneyDemandWaypointCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Aggregate Identity
    // -------------------------------------------------------------------------

    public readonly journeyDemandPublicId: string,

    // -------------------------------------------------------------------------
    // Waypoint Identity
    // -------------------------------------------------------------------------

    public readonly waypointPublicId: string,

    // -------------------------------------------------------------------------
    // Event Correlation
    // -------------------------------------------------------------------------

    public readonly correlationId: string,

    public readonly causationId?: string,

    // -------------------------------------------------------------------------
    // Optional Waypoint Changes
    // -------------------------------------------------------------------------

    public readonly name?: string,

    public readonly latitude?: number,

    public readonly longitude?: number,

    public readonly sequence?: number,
  ) {
    super();
  }
}
