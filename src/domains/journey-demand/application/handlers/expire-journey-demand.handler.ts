// -----------------------------------------------------------------------------
// Journey Demand — Expire Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { ExpireJourneyDemandCommand } from '../commands/expire-journey-demand.command';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { JourneyDemandNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain Repository
// -----------------------------------------------------------------------------

import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { JourneyDemandPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class ExpireJourneyDemandHandler implements CommandHandler<ExpireJourneyDemandCommand> {
  constructor(private readonly repository: JourneyDemandRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  async execute(command: ExpireJourneyDemandCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Journey Demand Identity
    // -------------------------------------------------------------------------

    const journeyDemandPublicId = new JourneyDemandPublicId(
      command.journeyDemandPublicId,
    );

    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      journeyDemandPublicId,
    );

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException(command.journeyDemandPublicId);
    }

    // -------------------------------------------------------------------------
    // Expire Journey Demand
    // -------------------------------------------------------------------------

    aggregate.expire(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
