// src/domains/journey/application/handlers/journey/expire-journey.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Expire Journey Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler responsible for expiring a Journey
// aggregate.
//
// Responsibilities:
// - convert the primitive Journey public identifier into its domain Value
//   Object;
// - resolve the Journey aggregate;
// - delegate expiration to the Journey aggregate;
// - persist the resulting aggregate state.
//
// Architectural rules:
// - Commands remain primitive application messages.
// - The application handler converts primitive command values into domain
//   Value Objects at the application-to-domain boundary.
// - Expiration is a Journey aggregate operation. Domain lifecycle invariants
//   therefore remain inside Journey.expire(...).
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

import type { ExpireJourneyCommand } from '../../commands/journey/expire-journey.command';

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
export class ExpireJourneyHandler implements CommandHandler<
  ExpireJourneyCommand,
  void
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------
  //
  // Resolve the Journey repository through the application-level token.
  // ---------------------------------------------------------------------------

  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly repository: JourneyRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  public async execute(command: ExpireJourneyCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Public ID
    //
    // Commands intentionally remain primitive.
    //
    // Convert the primitive command value into the domain Value Object before
    // passing it to the domain repository boundary.
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
    // Expiration is owned by the Journey aggregate.
    //
    // The aggregate is responsible for validating whether the current Journey
    // state permits expiration and for recording the resulting state and
    // domain events.
    // -------------------------------------------------------------------------

    aggregate.expire(
      command.correlationId,
      command.causationId,
      command.expiredAt ?? new Date(),
    );

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
