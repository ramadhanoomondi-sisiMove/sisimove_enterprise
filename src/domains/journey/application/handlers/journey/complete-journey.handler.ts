// src/domains/journey/application/handlers/journey/complete-journey.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Complete Journey Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler responsible for completing a Journey
// aggregate.
//
// Responsibilities:
// - resolve the Journey aggregate by its public identifier;
// - delegate completion to the Journey aggregate;
// - persist the resulting aggregate state.
//
// Architectural rules:
// - The command is frozen and contains primitive transport data. The handler
//   converts the Journey public identifier into its domain Value Object.
// - Completion is a Journey aggregate operation. Domain invariants therefore
//   remain inside Journey.complete(...).
// - The handler performs orchestration only.
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

import type { CompleteJourneyCommand } from '../../commands/journey/complete-journey.command';

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
export class CompleteJourneyHandler implements CommandHandler<
  CompleteJourneyCommand,
  void
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------
  //
  // Resolve the Journey repository through the application-level token rather
  // than relying on concrete-class/type-based dependency injection.
  // ---------------------------------------------------------------------------

  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly repository: JourneyRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  public async execute(command: CompleteJourneyCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    //
    // The frozen command exposes journeyPublicId as a primitive string.
    // Convert it into the domain Value Object at the application boundary.
    // -------------------------------------------------------------------------

    const journeyPublicId = new JourneyPublicId(command.journeyPublicId);

    const aggregate = await this.repository.findByPublicId(journeyPublicId);

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Domain Mutation
    //
    // Completion is owned by the Journey aggregate.
    //
    // The aggregate is responsible for enforcing all state-transition
    // invariants and recording the resulting domain state/events.
    // -------------------------------------------------------------------------

    aggregate.complete(
      command.correlationId,
      command.causationId,
      command.completedAt ?? new Date(),
    );

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
