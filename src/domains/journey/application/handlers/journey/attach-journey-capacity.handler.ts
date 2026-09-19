// src/domains/journey/application/handlers/journey/attach-journey-capacity.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Capacity Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler for attaching an existing Journey Capacity
// to a Journey aggregate.
//
// Responsibilities:
// - resolve the Journey aggregate;
// - resolve the existing Journey Capacity within the Journey aggregate
//   boundary;
// - delegate the attachment mutation to the Journey aggregate;
// - persist the mutated aggregate.
//
// The handler does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - mutate persistence models;
// - implement Journey business rules.
//
// Journey owns the capacity attachment relationship and its invariants.
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

import type { AttachJourneyCapacityCommand } from '../../commands/journey/attach-journey-capacity.command';

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
export class AttachJourneyCapacityHandler implements CommandHandler<
  AttachJourneyCapacityCommand,
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

  public async execute(command: AttachJourneyCapacityCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    // -------------------------------------------------------------------------

    const journey = await this.journeyRepository.findByPublicId(
      command.journeyPublicId,
    );

    if (journey === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Resolve Capacity
    // -------------------------------------------------------------------------
    //
    // Capacity is a child entity of the Journey aggregate. Resolve it through
    // the repository using the owning Journey's internal aggregate identity.
    //

    const capacity = await this.journeyRepository.findCapacityByPublicId(
      journey.journeyId,
      command.capacityPublicId,
    );

    if (capacity === null) {
      throw new Error(
        `Journey capacity '${command.capacityPublicId.value}' was not found ` +
          `for Journey '${command.journeyPublicId.value}'.`,
      );
    }

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    // -------------------------------------------------------------------------
    //
    // The Journey aggregate owns the business rules governing capacity
    // attachment.
    //

    journey.attachCapacity(capacity);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(journey);
  }
}
