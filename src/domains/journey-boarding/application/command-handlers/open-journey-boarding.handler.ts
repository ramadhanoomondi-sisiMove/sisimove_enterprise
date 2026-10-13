// src/domains/journey-boarding/application/command-handlers/open-journey-boarding.handler.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Open Command Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Resolve the Journey Boarding aggregate by public identifier.
// - Delegate the opening operation to the aggregate.
// - Record a historical event after a successful opening operation.
// - Persist the updated aggregate and its historical event.
// - Return the updated aggregate.
//
// Architectural rules:
// - Inject the repository through the centralized dependency-injection token.
// - Keep lifecycle invariants inside the aggregate.
// - Use a domain-specific exception when the aggregate cannot be found.
// - Do not record duplicate history events when boarding is already open.
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
import { JourneyBoardingEventType } from '../../domain/value-objects/journey-boarding-event-type.vo';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import { JourneyBoardingEventEntity } from '../../domain/entities/journey-boarding-event.entity';

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
    // Capture Initial State
    // -------------------------------------------------------------------------
    //
    // Opening an already-open boarding is a no-op in the aggregate. Capture
    // this state so the handler does not create a duplicate history event.
    // -------------------------------------------------------------------------

    const wasAlreadyBoarding = aggregate.isBoarding();

    // -------------------------------------------------------------------------
    // Open Boarding
    // -------------------------------------------------------------------------
    //
    // The aggregate owns lifecycle validation and state mutation.
    //
    // Valid lifecycle transition:
    // NOT_STARTED → BOARDING
    //
    // If opening fails, execution stops and no historical event is added.
    // -------------------------------------------------------------------------

    aggregate.open(
      command.correlationId,
      command.causationId,
      command.boardingStartedAt,
    );

    // -------------------------------------------------------------------------
    // Record Historical Event
    // -------------------------------------------------------------------------

    if (!wasAlreadyBoarding) {
      const event = JourneyBoardingEventEntity.create({
        boardingId: aggregate.publicId,
        type: JourneyBoardingEventType.boardingOpened(),
        occurredAt: aggregate.boardingStartedAt ?? new Date(),
      });

      aggregate.addBoardingEvent(event);
    }

    // -------------------------------------------------------------------------
    // Persistence
    // -------------------------------------------------------------------------
    //
    // Persist the aggregate and historical event together through the
    // repository's existing save operation.
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return aggregate;
  }
}
