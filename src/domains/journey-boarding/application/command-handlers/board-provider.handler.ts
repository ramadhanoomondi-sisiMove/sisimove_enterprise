// src/domains/journey-boarding/application/command-handlers/board-provider.handler.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Board Provider Command Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Resolve the Journey Boarding aggregate by public identifier.
// - Delegate provider boarding to the aggregate.
// - Persist the updated aggregate.
// - Return the updated aggregate.
//
// Architectural rules:
// - Inject the repository through the centralized dependency-injection token.
// - Keep provider-boarding invariants inside the aggregate.
// - Keep persistence implementation details outside the application handler.
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

import type { BoardProviderCommand } from '../commands/board-provider.command';

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
export class BoardProviderHandler implements CommandHandler<
  BoardProviderCommand,
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
    command: BoardProviderCommand,
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
    // Board Provider
    // -------------------------------------------------------------------------
    //
    // The aggregate owns provider-boarding invariants and is responsible for:
    //
    // - validating the boarding lifecycle;
    // - resolving and validating the provider participant;
    // - validating the participant's current status;
    // - transitioning EXPECTED → BOARDED;
    // - updating aggregate state and version;
    // - recording the provider-boarded domain event.
    // -------------------------------------------------------------------------

    aggregate.boardProvider(
      command.correlationId,
      command.causationId,
      command.boardedAt,
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
