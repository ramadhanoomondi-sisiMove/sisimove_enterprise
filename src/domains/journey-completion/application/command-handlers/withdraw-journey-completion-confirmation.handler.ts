// -----------------------------------------------------------------------------
// Journey Completion — Withdraw Confirmation Command Handler
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

import type { WithdrawJourneyCompletionConfirmationCommand } from '../commands/withdraw-journey-completion-confirmation.command';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { JourneyCompletionNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain Repository
// -----------------------------------------------------------------------------

import type { JourneyCompletionRepository } from '../../domain/repositories/journey-completion.repository';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyCompletionPublicId,
  JourneyCompletionConfirmationPublicId,
  JourneyCompletionMemberPublicId,
} from '../../domain/value-objects';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles withdrawal of a Journey Completion confirmation.
 *
 * Application responsibilities:
 *
 * 1. Convert command identifiers into strongly typed domain value objects.
 * 2. Load the Journey Completion aggregate.
 * 3. Fail when the aggregate does not exist.
 * 4. Delegate confirmation withdrawal to the aggregate.
 * 5. Persist the modified aggregate.
 *
 * Authorization and all Journey Completion confirmation invariants remain
 * inside JourneyCompletionAggregate.withdrawConfirmation().
 */
@Injectable()
export class WithdrawJourneyCompletionConfirmationHandler implements CommandHandler<
  WithdrawJourneyCompletionConfirmationCommand,
  void
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
    command: WithdrawJourneyCompletionConfirmationCommand,
  ): Promise<void> {
    // -------------------------------------------------------------------------
    // Journey Completion Identity
    // -------------------------------------------------------------------------

    const journeyCompletionPublicId = new JourneyCompletionPublicId(
      command.journeyCompletionPublicId,
    );

    // -------------------------------------------------------------------------
    // Load Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      journeyCompletionPublicId,
    );

    if (aggregate === null) {
      throw new JourneyCompletionNotFoundException(
        command.journeyCompletionPublicId,
      );
    }

    // -------------------------------------------------------------------------
    // Confirmation Identity
    // -------------------------------------------------------------------------

    const confirmationPublicId = new JourneyCompletionConfirmationPublicId(
      command.confirmationPublicId,
    );

    // -------------------------------------------------------------------------
    // Member Identity
    // -------------------------------------------------------------------------

    const memberPublicId = new JourneyCompletionMemberPublicId(
      command.memberPublicId,
    );

    // -------------------------------------------------------------------------
    // Withdraw Confirmation
    // -------------------------------------------------------------------------

    aggregate.withdrawConfirmation(
      confirmationPublicId,
      memberPublicId,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persistence
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default WithdrawJourneyCompletionConfirmationHandler;
