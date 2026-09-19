// src/domains/journey/application/handlers/journey/cancel-journey.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Cancel Journey Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler responsible for cancelling a Journey
// aggregate.
//
// Responsibilities:
// - convert the primitive Journey public identifier into its domain Value
//   Object;
// - resolve the Journey aggregate;
// - delegate cancellation to the Journey aggregate;
// - persist the resulting aggregate state.
//
// Architectural rules:
// - Commands remain primitive application messages.
// - The application handler converts primitive command values into domain
//   Value Objects at the application-to-domain boundary.
// - Cancellation is a Journey aggregate operation and therefore all domain
//   invariants remain inside Journey.cancel(...).
// - The application handler performs orchestration only.
// - Repository dependencies are resolved through the application token.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CancelJourneyCommand } from '../../commands/journey/cancel-journey.command';

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

import { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class CancelJourneyHandler implements CommandHandler<
  CancelJourneyCommand,
  void
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------
  //
  // Resolve the Journey repository through the application-level token.
  // This keeps the handler dependent on the repository contract rather than
  // on a concrete infrastructure implementation.
  // ---------------------------------------------------------------------------

  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  public async execute(command: CancelJourneyCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Public ID
    //
    // Commands intentionally remain primitive.
    //
    // Convert the primitive command value into the domain Value Object before
    // crossing into the domain repository boundary.
    // -------------------------------------------------------------------------

    const journeyPublicId = new JourneyPublicId(command.journeyPublicId);

    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    // -------------------------------------------------------------------------

    const aggregate =
      await this.journeyRepository.findByPublicId(journeyPublicId);

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Domain Mutation
    //
    // Cancellation is owned by the Journey aggregate.
    //
    // The aggregate is responsible for validating whether the current Journey
    // state permits cancellation and for recording the resulting domain state
    // and domain events.
    //
    // The handler only supplies the contextual command data.
    // -------------------------------------------------------------------------

    aggregate.cancel(
      command.correlationId,
      command.causationId,
      command.cancelledAt ?? new Date(),
      command.reason,
    );

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(aggregate);
  }
}
