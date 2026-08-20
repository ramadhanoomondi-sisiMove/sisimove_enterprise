// -----------------------------------------------------------------------------
// Journey Completion — Withdraw Dispute Command Handler
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
// Application — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_COMPLETION_TOKENS } from '../journey-completion.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import { WithdrawJourneyCompletionDisputeCommand } from '../commands/withdraw-journey-completion-dispute.command';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyCompletionRepository } from '../../domain/repositories/journey-completion.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyCompletionNotFoundException } from '../../domain/exceptions';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles withdrawal of a Journey Completion dispute.
 *
 * Application responsibilities:
 *
 * - resolve the Journey Completion aggregate;
 * - invoke the aggregate behavior;
 * - persist the aggregate.
 *
 * Domain responsibilities:
 *
 * - determine whether the dispute exists;
 * - determine whether the actor may withdraw the dispute;
 * - enforce the dispute lifecycle invariants;
 * - record the appropriate domain event.
 */
@Injectable()
export class WithdrawJourneyCompletionDisputeHandler implements CommandHandler<
  WithdrawJourneyCompletionDisputeCommand,
  void
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_COMPLETION_TOKENS.REPOSITORY)
    private readonly journeyCompletionRepository: JourneyCompletionRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: WithdrawJourneyCompletionDisputeCommand,
  ): Promise<void> {
    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.journeyCompletionRepository.findByPublicId(
      command.journeyCompletionPublicId,
    );

    // -------------------------------------------------------------------------
    // Not Found
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new JourneyCompletionNotFoundException(
        command.journeyCompletionPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // Domain Operation
    // -------------------------------------------------------------------------

    aggregate.withdrawDispute(
      command.disputePublicId,
      command.withdrawnByPublicId,
      command.correlationId,
      command.causationId,
      command.withdrawnAt ?? new Date(),
    );

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyCompletionRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default WithdrawJourneyCompletionDisputeHandler;
