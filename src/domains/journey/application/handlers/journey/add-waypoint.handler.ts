// src/domains/journey/application/handlers/journey/add-waypoint.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Add Journey Waypoint Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler for adding an existing Journey Waypoint
// to a Journey aggregate.
//
// Responsibilities:
// - convert command primitives into Journey domain value objects;
// - resolve the Journey aggregate through its public ID;
// - resolve the existing waypoint within the Journey aggregate boundary;
// - delegate the mutation to the Journey aggregate;
// - persist the mutated aggregate.
//
// This handler does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - mutate persistence models;
// - implement Journey business rules.
//
// Business invariants remain inside the Journey aggregate.
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
// Application Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class AddWaypointHandler implements CommandHandler<AddJourneyWaypointCommand> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly repository: JourneyRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(command: AddJourneyWaypointCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Value Objects
    // -------------------------------------------------------------------------
    //
    // Commands carry primitive values at the application boundary.
    // Domain operations receive validated domain value objects instead.
    //

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
    // Resolve Waypoint Within Aggregate Boundary
    // -------------------------------------------------------------------------
    //
    // JourneyWaypoint is a child entity of Journey. It is therefore resolved
    // through the Journey repository using the owning aggregate's identity.
    //

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
    //
    // The aggregate owns the business rules governing waypoint addition.
    //

    aggregate.addWaypoint(waypoint);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
