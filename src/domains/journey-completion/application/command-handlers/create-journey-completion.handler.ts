// -----------------------------------------------------------------------------
// Journey Completion — Create Command Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_COMPLETION_TOKENS } from '../journey-completion.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CreateJourneyCompletionCommand } from '../commands/create-journey-completion.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { JourneyCompletionAggregate } from '../../domain/aggregates/journey-completion.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { JourneyCompletionEntity } from '../../domain/entities/journey-completion.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyCompletionRepository } from '../../domain/repositories/journey-completion.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyCompletionPublicId,
  JourneyCompletionStatus,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles creation of a Journey Completion aggregate.
 *
 * The command is expected to contain already validated domain value objects
 * for:
 *
 * - Journey reference;
 * - Provider reference.
 *
 * The handler is responsible for application-level orchestration:
 *
 * 1. Generate the Journey Completion public identity.
 * 2. Ensure the generated identity does not already exist.
 * 3. Ensure the Journey does not already have a Journey Completion.
 * 4. Validate the required confirmation count.
 * 5. Create the Journey Completion entity in PENDING state.
 * 6. Create the Journey Completion aggregate.
 * 7. Persist the aggregate.
 * 8. Return the created aggregate.
 *
 * JourneyCompletionAggregate.create() is responsible for:
 *
 * - creation invariant enforcement;
 * - recording JourneyCompletionCreatedEvent.
 *
 * Confirmations and disputes are intentionally not created by this command.
 */
@Injectable()
export class CreateJourneyCompletionHandler implements CommandHandler<
  CreateJourneyCompletionCommand,
  JourneyCompletionAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_COMPLETION_TOKENS.REPOSITORY)
    private readonly repository: JourneyCompletionRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: CreateJourneyCompletionCommand,
  ): Promise<JourneyCompletionAggregate> {
    // -------------------------------------------------------------------------
    // Journey Completion Public Identity
    // -------------------------------------------------------------------------

    const journeyCompletionPublicId = new JourneyCompletionPublicId();

    // -------------------------------------------------------------------------
    // Public Identity Uniqueness
    // -------------------------------------------------------------------------

    const alreadyExists = await this.repository.existsByPublicId(
      journeyCompletionPublicId,
    );

    if (alreadyExists) {
      throw new Error(
        `Journey completion '${journeyCompletionPublicId.value}' already exists.`,
      );
    }

    // -------------------------------------------------------------------------
    // Journey Completion Uniqueness
    // -------------------------------------------------------------------------

    /**
     * A Journey may have at most one Journey Completion.
     */
    const journeyAlreadyHasCompletion =
      await this.repository.existsByJourneyPublicId(command.journeyPublicId);

    if (journeyAlreadyHasCompletion) {
      throw new Error(
        `Journey completion already exists for Journey '${command.journeyPublicId.value}'.`,
      );
    }

    // -------------------------------------------------------------------------
    // Required Confirmation Validation
    // -------------------------------------------------------------------------

    if (
      !Number.isInteger(command.requiredConfirmations) ||
      command.requiredConfirmations <= 0
    ) {
      throw new Error(
        'Journey Completion required confirmations must be a positive integer.',
      );
    }

    // -------------------------------------------------------------------------
    // Journey Completion Entity
    // -------------------------------------------------------------------------

    /**
     * A newly created Journey Completion always starts in PENDING state.
     *
     * The lifecycle transition to CONFIRMATION_REQUIRED is performed by the
     * RequestJourneyCompletion command.
     *
     * Confirmations and disputes remain empty at creation time.
     */
    const journeyCompletion = JourneyCompletionEntity.create({
      publicId: journeyCompletionPublicId,

      journeyPublicId: command.journeyPublicId,

      providerPublicId: command.providerPublicId,

      status: JourneyCompletionStatus.pending(),

      requiredConfirmations: command.requiredConfirmations,

      confirmedCount: 0,

      confirmations: [],

      disputes: [],
    });

    // -------------------------------------------------------------------------
    // Journey Completion Aggregate
    // -------------------------------------------------------------------------

    /**
     * JourneyCompletionAggregate.create() records the
     * JourneyCompletionCreatedEvent internally.
     *
     * Correlation and causation identifiers are passed through so the
     * resulting domain event participates in the application's distributed
     * tracing and causation chain.
     */
    const aggregate = JourneyCompletionAggregate.create(
      journeyCompletion,
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

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateJourneyCompletionHandler;
