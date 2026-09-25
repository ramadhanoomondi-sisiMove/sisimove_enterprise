// src/domains/journey/application/handlers/journey/attach-journey-vehicle.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Vehicle Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler for configuring the vehicle of a Journey.
//
// Responsibilities:
// - resolve the Journey aggregate;
// - create a new Journey Vehicle child entity;
// - convert primitive command values into domain value objects;
// - attach the vehicle to the Journey aggregate;
// - persist the mutated aggregate.
//
// The handler does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - mutate persistence models;
// - implement Journey business rules.
//
// Journey owns the vehicle child and its attachment relationship.
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

import type { AttachJourneyVehicleCommand } from '../../commands/journey/attach-journey-vehicle.command';

// -----------------------------------------------------------------------------
// Domain — Entity
// -----------------------------------------------------------------------------

import { JourneyVehicleEntity } from '../../../domain/entities/journey-vehicle.entity';

// -----------------------------------------------------------------------------
// Domain — Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyVehiclePublicId,
  JourneyVehicleMake,
  JourneyVehicleModel,
  JourneyVehicleYear,
  JourneyVehicleColor,
  JourneyVehicleRegistration,
  JourneyVehicleAssetPublicId,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class AttachJourneyVehicleHandler implements CommandHandler<
  AttachJourneyVehicleCommand,
  void
> {
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

  public async execute(command: AttachJourneyVehicleCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    //
    // command.journeyPublicId is already a JourneyPublicId Value Object.
    // Do not reconstruct it here.
    // -------------------------------------------------------------------------

    const aggregate = await this.journeyRepository.findByPublicId(
      command.journeyPublicId,
    );

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Create Vehicle
    //
    // JourneyVehicle is a Journey-owned child entity.
    //
    // Its public identity is generated when the child is created.
    // -------------------------------------------------------------------------

    const now = new Date();

    const vehicle = JourneyVehicleEntity.create({
      publicId: new JourneyVehiclePublicId(),

      make: new JourneyVehicleMake(command.make),

      model: new JourneyVehicleModel(command.model),

      year:
        command.year !== undefined
          ? new JourneyVehicleYear(command.year)
          : undefined,

      color:
        command.color !== undefined
          ? new JourneyVehicleColor(command.color)
          : undefined,

      registration:
        command.registration !== undefined
          ? new JourneyVehicleRegistration(command.registration)
          : undefined,

      assetPublicId:
        command.assetPublicId !== undefined
          ? new JourneyVehicleAssetPublicId(command.assetPublicId)
          : undefined,

      createdAt: now,
      updatedAt: now,
    });

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    //
    // Journey owns the vehicle attachment relationship.
    // -------------------------------------------------------------------------

    aggregate.attachVehicle(vehicle);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(aggregate);
  }
}
