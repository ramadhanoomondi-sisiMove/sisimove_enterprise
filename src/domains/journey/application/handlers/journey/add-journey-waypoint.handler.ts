// src/domains/journey/application/handlers/journey/add-journey-waypoint.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Add Journey Waypoint Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler responsible for creating a new Journey
// Waypoint and attaching it to the Journey aggregate.
//
// Responsibilities:
// - resolve the Journey aggregate through its public ID;
// - construct the Journey Waypoint domain Value Objects;
// - create the JourneyWaypointEntity;
// - delegate attachment to the Journey aggregate;
// - persist the mutated aggregate.
//
// The handler does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - construct infrastructure repositories;
// - implement Journey business rules;
// - mutate persistence models directly.
//
// The Journey aggregate remains responsible for:
// - corridor existence;
// - waypoint ownership;
// - waypoint attachment;
// - aggregate invariants.
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
// Domain — Entity
// -----------------------------------------------------------------------------

import { JourneyWaypointEntity } from '../../../domain/entities/journey-waypoint.entity';

// -----------------------------------------------------------------------------
// Domain — Repository
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Domain — Value Objects
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
    //
    // The command currently carries JourneyPublicId as a primitive, so the
    // application boundary converts it into the Journey domain Value Object.
    // -------------------------------------------------------------------------

    const journeyPublicId = new JourneyPublicId(command.journeyPublicId);

    const journey =
      await this.journeyRepository.findByPublicId(journeyPublicId);

    if (journey === null) {
      throw new Error(`Journey '${command.journeyPublicId}' was not found.`);
    }

    // -------------------------------------------------------------------------
    // Construct Waypoint Value Objects
    //
    // The handler translates primitive command input into domain types.
    // Domain validation therefore remains inside the respective Value Objects.
    // -------------------------------------------------------------------------

    const waypointPublicId = new JourneyWaypointPublicId();

    const type = new JourneyWaypointTypeValueObject(command.type);

    const sequence = new JourneyWaypointSequence(command.sequence);

    const name = new JourneyLocationName(command.name);

    const latitude = new JourneyLatitude(command.latitude);

    const longitude = new JourneyLongitude(command.longitude);

    // -------------------------------------------------------------------------
    // Create Journey Waypoint Entity
    // -------------------------------------------------------------------------
    //
    // The waypoint is a child entity of Journey.
    //
    // Its public identity is generated here because this operation creates a
    // new waypoint rather than attaching an existing one.
    // -------------------------------------------------------------------------

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
    // Aggregate Mutation
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the business rules governing waypoint attachment.
    //
    // In particular, JourneyAggregate.addWaypoint() ensures that a Journey
    // corridor exists before the waypoint can be attached.
    //

    journey.addWaypoint(waypoint);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(journey);
  }
}
