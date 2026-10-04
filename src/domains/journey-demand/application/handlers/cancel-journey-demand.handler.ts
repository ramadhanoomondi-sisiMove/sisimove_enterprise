// src/domains/journey-demand/application/handlers/cancel-journey-demand.handler.ts

// -----------------------------------------------------------------------------
// Journey Demand — Cancel Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Dependency Injection
// -----------------------------------------------------------------------------

import { Inject } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CancelJourneyDemandCommand } from '../commands/cancel-journey-demand.command';

// -----------------------------------------------------------------------------
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_DEMAND_TOKENS } from '../journey-demand.tokens';

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

import { JourneyDemandPublicId } from '../../domain/value-objects/journey-demand-public-id.vo';

// =============================================================================
// Handler
// =============================================================================

export class CancelJourneyDemandHandler implements CommandHandler<CancelJourneyDemandCommand> {
  constructor(
    @Inject(JOURNEY_DEMAND_TOKENS.REPOSITORY)
    private readonly repository: JourneyDemandRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  async execute(command: CancelJourneyDemandCommand): Promise<void> {
    // =========================================================================
    // Journey Demand Identity
    // =========================================================================

    const journeyDemandPublicId = new JourneyDemandPublicId(
      command.journeyDemandPublicId,
    );

    // =========================================================================
    // Load Aggregate
    // =========================================================================

    const aggregate = await this.repository.findByPublicId(
      journeyDemandPublicId,
    );

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException(command.journeyDemandPublicId);
    }

    // =========================================================================
    // Cancel Aggregate
    //
    // The aggregate owns lifecycle transition rules and domain-event
    // recording. The handler only supplies the command context.
    // =========================================================================

    aggregate.cancel(
      command.correlationId,
      command.causationId,
      command.reason,
    );

    // =========================================================================
    // Persist Aggregate
    // =========================================================================

    await this.repository.save(aggregate);
  }
}
