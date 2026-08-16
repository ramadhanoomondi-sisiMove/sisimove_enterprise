// src/domains/journey/application/handlers/journey/create-journey.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CreateJourneyCommand } from '../../commands/journey/create-journey.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { JourneyAggregate } from '../../../domain/aggregates/journey.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { JourneyEntity } from '../../../domain/entities/journey.entity';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyAlreadyExistsException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyPublicId,
  JourneyProviderPublicId,
  JourneyStatusValueObject,
  JourneyStatus,
} from '../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class CreateJourneyHandler implements CommandHandler<
  CreateJourneyCommand,
  JourneyAggregate
> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(command: CreateJourneyCommand): Promise<JourneyAggregate> {
    // -------------------------------------------------------------------------
    // Provider Identity
    // -------------------------------------------------------------------------

    const providerPublicId = new JourneyProviderPublicId(
      command.providerPublicId,
    );

    // -------------------------------------------------------------------------
    // Journey Public Identity
    // -------------------------------------------------------------------------

    const journeyPublicId = new JourneyPublicId();

    // -------------------------------------------------------------------------
    // Uniqueness
    // -------------------------------------------------------------------------

    if (await this.repository.existsByPublicId(journeyPublicId)) {
      throw new JourneyAlreadyExistsException();
    }

    // -------------------------------------------------------------------------
    // Journey Entity
    // -------------------------------------------------------------------------

    const journey = JourneyEntity.create({
      publicId: journeyPublicId,
      providerPublicId,
      status: new JourneyStatusValueObject(JourneyStatus.DRAFT),
    });

    // -------------------------------------------------------------------------
    // Journey Aggregate
    // -------------------------------------------------------------------------

    const aggregate = JourneyAggregate.create(journey);

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
