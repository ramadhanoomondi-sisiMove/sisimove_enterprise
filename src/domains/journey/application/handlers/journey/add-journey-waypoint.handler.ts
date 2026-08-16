import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

import type { AddJourneyWaypointCommand } from '../../commands/journey/add-journey-waypoint.command';

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

import { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';
import { JourneyWaypointPublicId } from '../../../domain/value-objects/journey-waypoint-public-id.vo';

export class AddJourneyWaypointHandler implements CommandHandler<AddJourneyWaypointCommand> {
  constructor(private readonly journeyRepository: JourneyRepository) {}

  async execute(command: AddJourneyWaypointCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    // -------------------------------------------------------------------------

    const journeyPublicId = new JourneyPublicId(command.journeyPublicId);

    const journey =
      await this.journeyRepository.findByPublicId(journeyPublicId);

    if (journey === null) {
      throw new Error(`Journey '${command.journeyPublicId}' was not found.`);
    }

    // -------------------------------------------------------------------------
    // Resolve Waypoint within Journey Aggregate Boundary
    // -------------------------------------------------------------------------

    const waypointPublicId = new JourneyWaypointPublicId(
      command.waypointPublicId,
    );

    const waypoint = await this.journeyRepository.findWaypointByPublicId(
      journey.journeyId,
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

    journey.addWaypoint(waypoint);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(journey);
  }
}
