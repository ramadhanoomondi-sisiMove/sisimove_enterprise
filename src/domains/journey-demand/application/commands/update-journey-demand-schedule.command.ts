// -----------------------------------------------------------------------------
// Update Journey Demand Schedule Command
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

export class UpdateJourneyDemandScheduleCommand extends Command {
  constructor(
    public readonly journeyDemandPublicId: string,

    // -------------------------------------------------------------------------
    // Departure Window
    // -------------------------------------------------------------------------

    public readonly earliestDeparture: Date,

    public readonly latestDeparture: Date,

    public readonly correlationId: string,

    // -------------------------------------------------------------------------
    // Arrival Constraints
    // -------------------------------------------------------------------------

    public readonly targetArrival?: Date,

    public readonly maximumArrival?: Date,

    // -------------------------------------------------------------------------
    // Timezone
    // -------------------------------------------------------------------------

    public readonly timezone?: string,

    // -------------------------------------------------------------------------
    // Command Metadata
    // -------------------------------------------------------------------------

    public readonly causationId?: string,
  ) {
    super();
  }
}
