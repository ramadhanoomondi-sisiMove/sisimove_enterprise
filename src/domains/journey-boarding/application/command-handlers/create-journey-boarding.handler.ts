// src/domains/journey-boarding/application/command-handlers/create-journey-boarding.handler.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Create Command Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Generate a Journey Boarding public identifier.
// - Check whether the generated identifier already exists.
// - Create the Journey Boarding entity in NOT_STARTED state.
// - Create the Journey Boarding aggregate.
// - Persist and return the aggregate.
//
// Architectural rules:
// - Inject the repository through JOURNEY_BOARDING_TOKENS.REPOSITORY.
// - Keep aggregate invariants and domain-event creation inside the aggregate.
// - Keep persistence implementation details outside the handler.
// - Do not create participants as part of this command.
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

import type { CreateJourneyBoardingCommand } from '../commands/create-journey-boarding.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { JourneyBoardingAggregate } from '../../domain/aggregates/journey-boarding.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { JourneyBoardingEntity } from '../../domain/entities/journey-boarding.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyBoardingRepository } from '../../domain/repositories/journey-boarding.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyBoardingPublicId,
  JourneyBoardingStatus,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class CreateJourneyBoardingHandler implements CommandHandler<
  CreateJourneyBoardingCommand,
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
    command: CreateJourneyBoardingCommand,
  ): Promise<JourneyBoardingAggregate> {
    // -------------------------------------------------------------------------
    // Journey Boarding Public Identity
    // -------------------------------------------------------------------------

    const journeyBoardingPublicId = new JourneyBoardingPublicId();

    // -------------------------------------------------------------------------
    // Public Identity Uniqueness
    // -------------------------------------------------------------------------

    const alreadyExists = await this.repository.existsByPublicId(
      journeyBoardingPublicId,
    );

    if (alreadyExists) {
      // -----------------------------------------------------------------------
      // Duplicate Identity
      // -----------------------------------------------------------------------
      //
      // This should be exceptionally rare when identifiers are generated
      // correctly. Use a generic Error until a dedicated duplicate-identity
      // domain exception is available in the domain exception contract.
      // -----------------------------------------------------------------------

      throw new Error(
        `Journey boarding '${journeyBoardingPublicId.value}' already exists.`,
      );
    }

    // -------------------------------------------------------------------------
    // Journey Boarding Entity
    // -------------------------------------------------------------------------
    //
    // A newly created Journey Boarding starts in NOT_STARTED state.
    // Opening the boarding lifecycle is a separate domain operation.
    // -------------------------------------------------------------------------

    const journeyBoarding = JourneyBoardingEntity.create({
      publicId: journeyBoardingPublicId,
      journeyId: command.journeyId,
      providerPublicId: command.providerPublicId,
      status: JourneyBoardingStatus.notStarted(),
    });

    // -------------------------------------------------------------------------
    // Journey Boarding Aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate creates its JourneyBoardingCreatedEvent and associates
    // it with the supplied correlation and causation identifiers.
    // -------------------------------------------------------------------------

    const aggregate = JourneyBoardingAggregate.create(
      journeyBoarding,
      command.correlationId,
      command.causationId,
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
