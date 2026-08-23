// -----------------------------------------------------------------------------
// Financial Account — Activate Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for activating an existing
// Financial Account aggregate.
//
// Aggregate:
//
// FinancialAccountAggregate
// ├── FinancialAccountEntity
// └── FinancialAccountBalanceEntity
//
// Responsibilities:
//
// 1. Load the complete Financial Account aggregate.
// 2. Delegate activation to the aggregate.
// 3. Allow the aggregate to enforce lifecycle invariants.
// 4. Allow the aggregate to record FinancialAccountActivatedEvent.
// 5. Persist the modified aggregate atomically.
// 6. Return the updated aggregate.
//
// The handler does NOT:
//
// - modify FinancialAccountEntity directly;
// - modify FinancialAccountBalanceEntity directly;
// - create domain events;
// - perform balance operations;
// - manage transactions;
// - manage payments;
// - manage holds;
// - manage settlements;
// - manage withdrawals;
// - manage disbursements;
// - perform accounting.
//
// Domain behavior belongs to FinancialAccountAggregate.
// Persistence belongs to FinancialAccountRepository.
// Orchestration belongs to this handler.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_TOKENS } from '../financial-account.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { ActivateFinancialAccountCommand } from '../commands/activate-financial-account.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialAccountAggregate } from '../../domain/aggregates/financial-account.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialAccountRepository } from '../../domain/repositories/financial-account.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialAccountNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles activation of a Financial Account aggregate.
 *
 * The handler works with the FinancialAccountAggregate rather than directly
 * manipulating its internal entities.
 *
 * The aggregate remains responsible for:
 *
 * - lifecycle invariants;
 * - state transitions;
 * - account mutation;
 * - domain event creation.
 *
 * The repository remains responsible for:
 *
 * - aggregate loading;
 * - aggregate persistence;
 * - atomic persistence of aggregate-owned state.
 */
@Injectable()
export class ActivateFinancialAccountHandler implements CommandHandler<
  ActivateFinancialAccountCommand,
  FinancialAccountAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_ACCOUNT_TOKENS.REPOSITORY)
    private readonly repository: FinancialAccountRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: ActivateFinancialAccountCommand,
  ): Promise<FinancialAccountAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load the complete aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.accountPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure the aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new FinancialAccountNotFoundException(
        command.accountPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Delegate activation to the aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate owns:
    //
    // - CLOSED protection;
    // - SUSPENDED -> ACTIVE transition;
    // - ACTIVE idempotency;
    // - account status mutation;
    // - updatedAt mutation;
    // - FinancialAccountActivatedEvent creation.
    //
    // The handler deliberately does not touch either child entity.
    // -------------------------------------------------------------------------

    aggregate.activate(command.activatedAt, command.correlationId);

    // -------------------------------------------------------------------------
    // 4. Persist the aggregate
    // -------------------------------------------------------------------------
    //
    // Repository infrastructure is responsible for persisting the complete
    // aggregate atomically.
    //
    // Any domain events created by the aggregate remain attached to the
    // aggregate for the application's event-dispatching mechanism.
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // 5. Return updated aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ActivateFinancialAccountHandler;
