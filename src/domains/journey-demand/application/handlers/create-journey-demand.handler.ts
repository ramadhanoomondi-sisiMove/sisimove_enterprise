// -----------------------------------------------------------------------------
// Journey Demand — Create Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CreateJourneyDemandCommand } from '../commands/create-journey-demand.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { JourneyDemandAggregate } from '../../domain/aggregates/journey-demand.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { JourneyDemandEntity } from '../../domain/entities/journey-demand.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyDemandPublicId,
  RequesterPublicId,
  JourneyDemandStatus,
  JourneyDemandStatusValueObject,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class CreateJourneyDemandHandler implements CommandHandler<
  CreateJourneyDemandCommand,
  JourneyDemandAggregate
> {
  constructor(private readonly repository: JourneyDemandRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  async execute(
    command: CreateJourneyDemandCommand,
  ): Promise<JourneyDemandAggregate> {
    // -------------------------------------------------------------------------
    // Requester Identity
    // -------------------------------------------------------------------------

    const requesterPublicId = new RequesterPublicId(command.requesterPublicId);

    // -------------------------------------------------------------------------
    // Journey Demand Public Identity
    // -------------------------------------------------------------------------

    const journeyDemandPublicId = new JourneyDemandPublicId();

    // -------------------------------------------------------------------------
    // Uniqueness
    // -------------------------------------------------------------------------

    const alreadyExists = await this.repository.existsByPublicId(
      journeyDemandPublicId,
    );

    if (alreadyExists) {
      throw new Error(
        `Journey demand '${journeyDemandPublicId.value}' already exists.`,
      );
    }

    // -------------------------------------------------------------------------
    // Journey Demand Entity
    // -------------------------------------------------------------------------

    const journeyDemand = JourneyDemandEntity.create({
      publicId: journeyDemandPublicId,

      requesterPublicId,

      status: new JourneyDemandStatusValueObject(JourneyDemandStatus.DRAFT),
    });

    // -------------------------------------------------------------------------
    // Journey Demand Aggregate
    // -------------------------------------------------------------------------

    const aggregate = JourneyDemandAggregate.create(journeyDemand);

    // -------------------------------------------------------------------------
    // Created Domain Event
    // -------------------------------------------------------------------------

    aggregate.recordCreated(command.correlationId, command.causationId);

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
