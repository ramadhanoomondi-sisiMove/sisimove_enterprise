// src/domains/journey/application/handlers/journey/add-journey-waypoint.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Add Journey Waypoint Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler for adding an existing Journey Waypoint
// to a Journey aggregate.
//
// Responsibilities:
// - resolve the Journey aggregate through its public ID;
// - resolve the existing Journey Waypoint within the Journey aggregate boundary;
// - delegate the mutation to the Journey aggregate;
// - persist the mutated aggregate.
//
// The handler does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - construct infrastructure repositories;
// - mutate persistence models directly.
//
// Dependency injection is resolved through the Journey application token
// registry.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AddJourneyWaypointCommand } from '../../commands/journey/add-journey-waypoint.command';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

import { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';
import { JourneyWaypointPublicId } from '../../../domain/value-objects/journey-waypoint-public-id.vo';

// -----------------------------------------------------------------------------
// Application
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Command Handler
// -----------------------------------------------------------------------------

@Injectable()
export class AddJourneyWaypointHandler implements CommandHandler<AddJourneyWaypointCommand> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(command: AddJourneyWaypointCommand): Promise<void> {
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
    // Resolve Waypoint Within Journey Aggregate Boundary
    // -------------------------------------------------------------------------
    //
    // The waypoint is resolved through the Journey repository using the
    // aggregate's internal identity. This keeps the waypoint subordinate to
    // the Journey aggregate rather than treating it as an independent
    // aggregate.
    //
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
    //
    // All business invariants for adding the waypoint remain inside the
    // Journey aggregate.
    //
    journey.addWaypoint(waypoint);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(journey);
  }
}
