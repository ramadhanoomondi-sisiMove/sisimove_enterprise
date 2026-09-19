// src/domains/journey/application/handlers/journey/attach-journey-vehicle.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Vehicle Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler for attaching an existing Journey Vehicle
// to a Journey aggregate.
//
// Responsibilities:
// - resolve the Journey aggregate;
// - resolve the Journey Vehicle within the Journey aggregate boundary;
// - delegate the attachment mutation to the Journey aggregate;
// - persist the mutated aggregate.
//
// The command already contains JourneyPublicId and JourneyVehiclePublicId as
// domain value objects. The handler therefore does not reconstruct them.
//
// The handler does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - mutate persistence models;
// - implement Journey business rules.
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
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

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
    // Do not construct another JourneyPublicId here.
    // -------------------------------------------------------------------------

    const aggregate = await this.journeyRepository.findByPublicId(
      command.journeyPublicId,
    );

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Resolve Journey Vehicle
    //
    // command.vehiclePublicId is already a JourneyVehiclePublicId Value Object.
    // The lookup is scoped to the owning Journey aggregate.
    // -------------------------------------------------------------------------

    const vehicle = await this.journeyRepository.findVehicleByPublicId(
      aggregate.journeyId,
      command.vehiclePublicId,
    );

    if (vehicle === null) {
      throw new Error(
        `Journey vehicle '${command.vehiclePublicId.value}' ` +
          `was not found for Journey '${command.journeyPublicId.value}'.`,
      );
    }

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    // -------------------------------------------------------------------------
    //
    // The Journey aggregate owns the business rules governing vehicle
    // attachment.
    //

    aggregate.attachVehicle(vehicle);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(aggregate);
  }
}
