// -----------------------------------------------------------------------------
// Journey Demand — Remove Waypoint Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { RemoveJourneyDemandWaypointCommand } from '../commands/remove-journey-demand-waypoint.command';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { JourneyDemandNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain Repository
// -----------------------------------------------------------------------------

import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyDemandPublicId,
  JourneyDemandWaypointPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class RemoveJourneyDemandWaypointHandler implements CommandHandler<RemoveJourneyDemandWaypointCommand> {
  constructor(private readonly repository: JourneyDemandRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  async execute(command: RemoveJourneyDemandWaypointCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Journey Demand Identity
    // -------------------------------------------------------------------------

    const journeyDemandPublicId = new JourneyDemandPublicId(
      command.journeyDemandPublicId,
    );

    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      journeyDemandPublicId,
    );

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException(command.journeyDemandPublicId);
    }

    // -------------------------------------------------------------------------
    // Waypoint Identity
    // -------------------------------------------------------------------------

    const waypointPublicId = new JourneyDemandWaypointPublicId(
      command.waypointPublicId,
    );

    // -------------------------------------------------------------------------
    // Find Waypoint Inside Aggregate
    // -------------------------------------------------------------------------

    const waypoint = aggregate.getWaypointByPublicId(waypointPublicId);

    if (waypoint === undefined) {
      return;
    }

    // -------------------------------------------------------------------------
    // Remove Waypoint
    // -------------------------------------------------------------------------

    aggregate.removeWaypoint(waypointPublicId);

    // -------------------------------------------------------------------------
    // Record Domain Event
    // -------------------------------------------------------------------------

    aggregate.recordWaypointRemoved(
      waypointPublicId,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
