// -----------------------------------------------------------------------------
// Financial Account — Close Command Handler
// -----------------------------------------------------------------------------
//
// Application handler responsible for permanently closing an existing
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
// 2. Delegate closure to the aggregate.
// 3. Allow the aggregate to enforce lifecycle invariants.
// 4. Allow the aggregate to record FinancialAccountClosedEvent.
// 5. Persist the modified aggregate atomically.
// 6. Return the updated aggregate.
//
// The handler does NOT:
//
// - modify FinancialAccountEntity directly;
// - modify FinancialAccountBalanceEntity directly;
// - create domain events;
// - move remaining funds;
// - perform balance operations;
// - manage transactions;
// - manage payments;
// - manage holds;
// - manage settlements;
// - manage withdrawals;
// - manage disbursements;
// - perform accounting.
//
// Remaining funds are intentionally outside this command's responsibility.
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

import type { CloseFinancialAccountCommand } from '../commands/close-financial-account.command';

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
 * Handles permanent closure of a Financial Account aggregate.
 *
 * The handler works exclusively with the aggregate root.
 *
 * The complete Financial Account aggregate is loaded before any state
 * mutation occurs.
 *
 * Closure is delegated entirely to FinancialAccountAggregate.close().
 *
 * The aggregate owns:
 *
 * - lifecycle rules;
 * - closure invariants;
 * - terminal-state enforcement;
 * - account status mutation;
 * - updatedAt mutation;
 * - domain event creation.
 *
 * The handler therefore never changes either aggregate-owned entity directly.
 */
@Injectable()
export class CloseFinancialAccountHandler implements CommandHandler<
  CloseFinancialAccountCommand,
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
    command: CloseFinancialAccountCommand,
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
    // 3. Delegate closure to aggregate
    // -------------------------------------------------------------------------
    //
    // FinancialAccountAggregate.close() owns:
    //
    // - CLOSED idempotency;
    // - terminal lifecycle semantics;
    // - account status mutation;
    // - updatedAt mutation;
    // - FinancialAccountClosedEvent creation.
    //
    // Remaining account funds are deliberately NOT moved by this operation.
    // Any required movement must be handled by the appropriate financial
    // workflow or aggregate.
    // -------------------------------------------------------------------------

    aggregate.close(command.closedAt, command.correlationId);

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

export default CloseFinancialAccountHandler;
