// src/domains/journey/application/handlers/journey/publish-journey.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Publish Journey Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler responsible for publishing a Journey
// aggregate.
//
// Responsibilities:
// - convert the primitive Journey public identifier into its domain Value
//   Object;
// - resolve the Journey aggregate;
// - delegate publication to the Journey aggregate;
// - persist the resulting aggregate state.
//
// Architectural rules:
// - Commands remain primitive application messages.
// - Domain Value Objects are created inside the application handler at the
//   application-to-domain boundary.
// - Publication is a Journey aggregate lifecycle operation.
// - Domain invariants remain inside Journey.publish(...).
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

import type { PublishJourneyCommand } from '../../commands/journey/publish-journey.command';

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
export class PublishJourneyHandler implements CommandHandler<
  PublishJourneyCommand,
  void
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly repository: JourneyRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  public async execute(command: PublishJourneyCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Public ID
    //
    // Commands intentionally remain primitive.
    //
    // The application handler is therefore responsible for converting the
    // primitive command value into the domain Value Object before crossing
    // into the domain layer.
    // -------------------------------------------------------------------------

    const journeyPublicId = new JourneyPublicId(command.journeyPublicId);

    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(journeyPublicId);

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Domain Mutation
    //
    // The Journey aggregate owns the publication transition and all associated
    // business invariants.
    // -------------------------------------------------------------------------

    aggregate.publish(
      command.correlationId,
      command.causationId,
      command.publishedAt ?? new Date(),
    );

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
