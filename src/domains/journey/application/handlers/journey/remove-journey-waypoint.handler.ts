// src/domains/journey/application/handlers/journey/remove-journey-waypoint.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { RemoveJourneyWaypointCommand } from '../../commands/journey/remove-journey-waypoint.command';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyPublicId,
  JourneyWaypointPublicId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class RemoveJourneyWaypointHandler implements CommandHandler<RemoveJourneyWaypointCommand> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(command: RemoveJourneyWaypointCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Public ID
    // -------------------------------------------------------------------------

    const journeyPublicId = new JourneyPublicId(command.journeyPublicId);

    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(journeyPublicId);

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Resolve Journey Waypoint
    //
    // Waypoints belong to the Journey corridor, therefore the lookup must be
    // scoped to the owning Journey aggregate.
    // -------------------------------------------------------------------------

    const waypointPublicId = new JourneyWaypointPublicId(
      command.waypointPublicId,
    );

    const waypoint = await this.repository.findWaypointByPublicId(
      aggregate.journeyId,
      waypointPublicId,
    );

    if (waypoint === null) {
      throw new Error(
        `Journey waypoint '${command.waypointPublicId}' was not found ` +
          `for Journey '${command.journeyPublicId}'.`,
      );
    }

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    // -------------------------------------------------------------------------

    aggregate.removeWaypoint(waypoint.id);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
