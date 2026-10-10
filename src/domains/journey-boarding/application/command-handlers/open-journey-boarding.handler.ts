// src/domains/journey-boarding/application/command-handlers/open-journey-boarding.handler.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Open Command Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Resolve the Journey Boarding aggregate by public identifier.
// - Delegate the opening operation to the aggregate.
// - Persist the updated aggregate.
// - Return the updated aggregate.
//
// Architectural rules:
// - Inject the repository through the centralized dependency-injection token.
// - Keep lifecycle invariants inside the aggregate.
// - Use a domain-specific exception when the aggregate cannot be found.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOARDING_TOKENS } from '../journey-boarding.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { OpenJourneyBoardingCommand } from '../commands/open-journey-boarding.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { JourneyBoardingAggregate } from '../../domain/aggregates/journey-boarding.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyBoardingRepository } from '../../domain/repositories/journey-boarding.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { JourneyBoardingPublicId } from '../../domain/value-objects/journey-boarding-public-id.vo';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyBoardingNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class OpenJourneyBoardingHandler implements CommandHandler<
  OpenJourneyBoardingCommand,
  JourneyBoardingAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_BOARDING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBoardingRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: OpenJourneyBoardingCommand,
  ): Promise<JourneyBoardingAggregate> {
    // -------------------------------------------------------------------------
    // Journey Boarding Public Identity
    // -------------------------------------------------------------------------

    const journeyBoardingPublicId = new JourneyBoardingPublicId(
      command.journeyBoardingPublicId,
    );

    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      journeyBoardingPublicId,
    );

    // -------------------------------------------------------------------------
    // Existence
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new JourneyBoardingNotFoundException(journeyBoardingPublicId.value);
    }

    // -------------------------------------------------------------------------
    // Open Boarding
    // -------------------------------------------------------------------------
    //
    // The aggregate owns lifecycle validation, rejects invalid transitions,
    // updates its state and version, and records the boarding-opened event.
    //
    // Valid lifecycle transition:
    // NOT_STARTED → BOARDING
    // -------------------------------------------------------------------------

    aggregate.open(
      command.correlationId,
      command.causationId,
      command.boardingStartedAt,
    );

    // -------------------------------------------------------------------------
    // Persistence
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return aggregate;
  }
}
