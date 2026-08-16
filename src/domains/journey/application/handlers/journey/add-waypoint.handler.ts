// src/domains/journey/application/handlers/journey/add-waypoint.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AddJourneyWaypointCommand } from '../../commands/journey/';

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

export class AddWaypointHandler implements CommandHandler<AddJourneyWaypointCommand> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(command: AddJourneyWaypointCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Value Objects
    // -------------------------------------------------------------------------

    const journeyPublicId = new JourneyPublicId(command.journeyPublicId);

    const waypointPublicId = new JourneyWaypointPublicId(
      command.waypointPublicId,
    );

    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(journeyPublicId);

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Resolve Waypoint within Aggregate Boundary
    // -------------------------------------------------------------------------

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
    // Domain Mutation
    // -------------------------------------------------------------------------

    aggregate.addWaypoint(waypoint);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
