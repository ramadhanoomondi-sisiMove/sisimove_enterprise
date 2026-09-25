// src/domains/journey/application/handlers/journey/add-waypoint.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Add Journey Waypoint Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler for creating and adding a Journey Waypoint
// to a Journey aggregate.
//
// Responsibilities:
// - convert command primitives into Journey domain value objects;
// - resolve the Journey aggregate through its public ID;
// - create a new JourneyWaypoint entity from the supplied configuration;
// - delegate the mutation to the Journey aggregate;
// - persist the mutated aggregate.
//
// This handler does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - mutate persistence models;
// - resolve a pre-existing JourneyWaypoint;
// - implement Journey business rules.
//
// Business invariants remain inside the Journey aggregate.
//
// JourneyWaypoint is a Journey-owned child entity. Its lifecycle therefore
// belongs to the Journey aggregate and is created as part of the aggregate
// configuration workflow.
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
// Entities
// -----------------------------------------------------------------------------

import { JourneyWaypointEntity } from '../../../domain/entities/journey-waypoint.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyLatitude,
  JourneyLocationName,
  JourneyLongitude,
  JourneyPublicId,
  JourneyWaypointPublicId,
  JourneyWaypointSequence,
  JourneyWaypointTypeValueObject,
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
    // Journey Public ID
    // -------------------------------------------------------------------------
    //
    // Commands carry primitives at the application boundary. Convert the
    // Journey identity into its domain value object before resolving the
    // aggregate.
    //

    const journeyPublicId = new JourneyPublicId(command.journeyPublicId);

    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(journeyPublicId);

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Create Journey Waypoint Identity
    // -------------------------------------------------------------------------
    //
    // JourneyWaypoint is a Journey-owned child entity. There is therefore no
    // existing waypoint public ID to resolve.
    //
    // The handler creates the identity as part of the configuration workflow.
    //

    const waypointPublicId = new JourneyWaypointPublicId();

    // -------------------------------------------------------------------------
    // Convert Command Data Into Domain Value Objects
    // -------------------------------------------------------------------------

    const type = new JourneyWaypointTypeValueObject(command.type);

    const sequence = new JourneyWaypointSequence(command.sequence);

    const name = new JourneyLocationName(command.name);

    const latitude = new JourneyLatitude(command.latitude);

    const longitude = new JourneyLongitude(command.longitude);

    // -------------------------------------------------------------------------
    // Create Journey Waypoint Entity
    // -------------------------------------------------------------------------
    //
    // The entity is created without persistence ownership identifiers such as
    // journeyId or corridorId. Those relationships are established by the
    // aggregate/repository persistence boundary.
    //

    const now = new Date();

    const waypoint = JourneyWaypointEntity.create({
      publicId: waypointPublicId,
      type,
      sequence,
      name,
      latitude,
      longitude,
      pickupAllowed: command.pickupAllowed,
      dropoffAllowed: command.dropoffAllowed,
      createdAt: now,
      updatedAt: now,
    });

    // -------------------------------------------------------------------------
    // Domain Mutation
    // -------------------------------------------------------------------------
    //
    // The Journey aggregate owns the invariant that a corridor must exist
    // before a waypoint can be added, as well as the rules for adding the
    // waypoint to the aggregate.
    //

    aggregate.addWaypoint(waypoint);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------
    //
    // The repository persists the complete aggregate state, including the
    // newly-created JourneyWaypoint and its relationship to the Journey's
    // corridor.
    //

    await this.repository.save(aggregate);
  }
}
