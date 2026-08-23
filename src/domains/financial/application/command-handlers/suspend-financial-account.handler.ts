// -----------------------------------------------------------------------------
// Financial Account — Suspend Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for suspending an existing
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
// 2. Delegate suspension to the aggregate.
// 3. Allow the aggregate to enforce lifecycle invariants.
// 4. Allow the aggregate to record FinancialAccountSuspendedEvent.
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

import type { SuspendFinancialAccountCommand } from '../commands/suspend-financial-account.command';

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
 * Handles suspension of a Financial Account aggregate.
 *
 * The handler works exclusively with the aggregate root.
 *
 * The complete Financial Account aggregate is loaded before any state
 * mutation occurs.
 *
 * Suspension is delegated entirely to
 * FinancialAccountAggregate.suspend().
 *
 * The aggregate owns:
 *
 * - lifecycle rules;
 * - suspension invariants;
 * - status transitions;
 * - account state mutation;
 * - domain event creation.
 *
 * The handler therefore never changes either aggregate-owned entity directly.
 */
@Injectable()
export class SuspendFinancialAccountHandler implements CommandHandler<
  SuspendFinancialAccountCommand,
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
    command: SuspendFinancialAccountCommand,
  ): Promise<FinancialAccountAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load complete aggregate
    // -------------------------------------------------------------------------
    //
    // The repository is responsible for rehydrating:
    //
    // FinancialAccountAggregate
    // ├── FinancialAccountEntity
    // └── FinancialAccountBalanceEntity
    //
    // The handler never loads or mutates either entity independently.
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.accountPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new FinancialAccountNotFoundException(
        command.accountPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Delegate suspension to aggregate
    // -------------------------------------------------------------------------
    //
    // FinancialAccountAggregate.suspend() owns:
    //
    // - CLOSED protection;
    // - ACTIVE -> SUSPENDED transition;
    // - SUSPENDED idempotency;
    // - account status mutation;
    // - updatedAt mutation;
    // - FinancialAccountSuspendedEvent creation.
    //
    // The handler does not perform any of these operations itself.
    // -------------------------------------------------------------------------

    aggregate.suspend(command.suspendedAt, command.correlationId);

    // -------------------------------------------------------------------------
    // 4. Persist complete aggregate
    // -------------------------------------------------------------------------
    //
    // The repository is responsible for atomically persisting the aggregate
    // and its aggregate-owned state.
    //
    // Domain events remain attached to the aggregate and are dispatched by
    // the appropriate application/infrastructure mechanism after successful
    // persistence.
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

export default SuspendFinancialAccountHandler;
