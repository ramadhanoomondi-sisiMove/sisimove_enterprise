// src/domains/journey-boarding/application/command-handlers/create-journey-boarding.handler.ts

// -----------------------------------------------------------------------------
// Journey Boarding — Create Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

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
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles creation of a Journey Boarding aggregate.
 *
 * The command is expected to contain already validated domain value objects
 * for:
 *
 * - Journey reference
 * - Provider reference
 *
 * The handler is responsible for application-level orchestration:
 *
 * 1. Generate the Journey Boarding public identity.
 * 2. Ensure the generated identity does not already exist.
 * 3. Create the Journey Boarding entity in NOT_STARTED state.
 * 4. Create the Journey Boarding aggregate.
 * 5. Persist the aggregate.
 * 6. Return the created aggregate.
 *
 * JourneyBoardingAggregate.create() is responsible for recording the
 * JourneyBoardingCreatedEvent.
 *
 * Participants and boarding events are intentionally not created by this
 * command. They belong to their respective boarding workflows.
 */
export class CreateJourneyBoardingHandler implements CommandHandler<
  CreateJourneyBoardingCommand,
  JourneyBoardingAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyBoardingRepository) {}

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
      throw new Error(
        `Journey boarding '${journeyBoardingPublicId.value}' already exists.`,
      );
    }

    // -------------------------------------------------------------------------
    // Journey Boarding Entity
    // -------------------------------------------------------------------------

    /**
     * A newly created Journey Boarding always starts in NOT_STARTED state.
     *
     * The lifecycle transition to BOARDING is performed by the
     * OpenJourneyBoarding command.
     */
    const journeyBoarding = JourneyBoardingEntity.create({
      publicId: journeyBoardingPublicId,

      journeyId: command.journeyId,

      providerPublicId: command.providerPublicId,

      status: JourneyBoardingStatus.notStarted(),
    });

    // -------------------------------------------------------------------------
    // Journey Boarding Aggregate
    // -------------------------------------------------------------------------

    /**
     * JourneyBoardingAggregate.create() records the
     * JourneyBoardingCreatedEvent internally.
     *
     * Correlation and causation identifiers are passed through so the
     * resulting domain event participates in the application's distributed
     * tracing and causation chain.
     */
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
