// src/domains/journey/application/handlers/journey/attach-journey-corridor.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Corridor Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler for attaching an existing Journey Corridor
// to a Journey aggregate.
//
// Responsibilities:
// - resolve the Journey aggregate;
// - resolve the Journey Corridor within the Journey aggregate boundary;
// - delegate the attachment mutation to the Journey aggregate;
// - persist the mutated aggregate.
//
// The command already contains JourneyPublicId and JourneyCorridorPublicId as
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

import type { AttachJourneyCorridorCommand } from '../../commands/journey/attach-journey-corridor.command';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import {
  JourneyInvalidCorridorException,
  JourneyNotFoundException,
} from '../../../domain/exceptions';

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
export class AttachJourneyCorridorHandler implements CommandHandler<
  AttachJourneyCorridorCommand,
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

  public async execute(command: AttachJourneyCorridorCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    //
    // The command already contains JourneyPublicId as a Value Object.
    // Do not reconstruct it here.
    // -------------------------------------------------------------------------

    const aggregate = await this.journeyRepository.findByPublicId(
      command.journeyPublicId,
    );

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Resolve Corridor
    //
    // Corridor lookup is scoped to the Journey aggregate. The command already
    // contains JourneyCorridorPublicId as a Value Object.
    // -------------------------------------------------------------------------

    const corridor = await this.journeyRepository.findCorridorByPublicId(
      aggregate.journeyId,
      command.corridorPublicId,
    );

    if (corridor === null) {
      throw new JourneyInvalidCorridorException(
        `Journey corridor '${command.corridorPublicId.value}' ` +
          `was not found for Journey '${command.journeyPublicId.value}'.`,
      );
    }

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    // -------------------------------------------------------------------------
    //
    // The Journey aggregate owns the business rules governing corridor
    // attachment.
    //

    aggregate.attachCorridor(corridor);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(aggregate);
  }
}
