// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Complete Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for completing an existing
// Financial Account Withdrawal.
//
// Responsibilities:
//
// - Resolve the Financial Account Withdrawal aggregate.
// - Ensure the withdrawal exists.
// - Request the aggregate to complete the withdrawal.
// - Persist the updated aggregate.
//
// Lifecycle transition:
//
//     PROCESSING -> COMPLETED
//
// The FinancialAccountWithdrawalAggregate owns the lifecycle invariant and
// state mutation.
//
// This handler does NOT:
//
// - Create a Financial Account Withdrawal.
// - Create a Financial Disbursement.
// - Execute an external provider.
// - Move funds.
// - Modify Financial Account balances.
// - Create a Financial Transaction.
// - Perform settlement.
// - Perform accounting.
// - Publish domain events.
//
// Successful external disbursement execution belongs to the Financial
// Disbursement workflow. The completion command records successful resolution
// of the withdrawal workflow after that condition has been established.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS } from '../financial-account-withdrawal.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CompleteFinancialAccountWithdrawalCommand } from '../commands/complete-financial-account-withdrawal.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalAggregate } from '../../domain/aggregates/financial-account-withdrawal.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalRepository } from '../../domain/repositories/financial-account-withdrawal.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Completes an existing Financial Account Withdrawal.
 *
 * Lifecycle transition:
 *
 *     PROCESSING -> COMPLETED
 *
 * The aggregate owns:
 *
 * - lifecycle validation;
 * - lifecycle mutation;
 * - FinancialAccountWithdrawalCompletedEvent creation.
 *
 * The handler owns application orchestration:
 *
 *     Command
 *        │
 *        ▼
 *     Repository
 *        │
 *        ▼
 *     FinancialAccountWithdrawalAggregate
 *        │
 *        ├── complete()
 *        │
 *        └── domain event
 *        │
 *        ▼
 *     Repository.save()
 *
 * Domain events remain collected by the aggregate and are not published
 * directly by this handler.
 */
@Injectable()
export class CompleteFinancialAccountWithdrawalHandler implements CommandHandler<
  CompleteFinancialAccountWithdrawalCommand,
  FinancialAccountWithdrawalAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_ACCOUNT_WITHDRAWAL_TOKENS.REPOSITORY)
    private readonly repository: FinancialAccountWithdrawalRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: CompleteFinancialAccountWithdrawalCommand,
  ): Promise<FinancialAccountWithdrawalAggregate> {
    // -------------------------------------------------------------------------
    // 1. Resolve Financial Account Withdrawal
    // -------------------------------------------------------------------------
    //
    // The command carries the public withdrawal identity.
    //
    // The repository rehydrates the complete aggregate.
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.withdrawalId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure withdrawal exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new FinancialAccountWithdrawalNotFoundException(
        command.withdrawalId.value,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Complete withdrawal
    // -------------------------------------------------------------------------
    //
    // Expected transition:
    //
    //     PROCESSING -> COMPLETED
    //
    // The aggregate delegates lifecycle validation and mutation to the
    // FinancialAccountWithdrawalEntity.
    //
    // The aggregate then records:
    //
    //     FinancialAccountWithdrawalCompletedEvent
    //
    // If the withdrawal is not PROCESSING, the domain layer raises the
    // appropriate lifecycle exception.
    // -------------------------------------------------------------------------

    aggregate.complete(
      command.completedAt,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 4. Persist aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // 5. Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CompleteFinancialAccountWithdrawalHandler;
