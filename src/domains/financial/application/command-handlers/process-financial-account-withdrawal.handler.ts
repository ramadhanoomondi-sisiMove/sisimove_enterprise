// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Process Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for processing an existing
// Financial Account Withdrawal.
//
// Responsibilities:
//
// - Resolve the Financial Account Withdrawal aggregate.
// - Ensure the withdrawal exists.
// - Request the aggregate to process the withdrawal.
// - Persist the updated aggregate.
//
// Lifecycle transition:
//
//     PENDING -> PROCESSING
//
// The FinancialAccountWithdrawalAggregate owns the lifecycle invariant and
// state mutation.
//
// This handler does NOT:
//
// - Create a Financial Account Withdrawal.
// - Create a Financial Disbursement.
// - Execute a disbursement provider.
// - Confirm external payout.
// - Complete the withdrawal.
// - Move funds.
// - Modify Financial Account balances.
// - Create a Financial Transaction.
// - Perform settlement.
// - Perform accounting.
// - Publish domain events.
//
// Financial Disbursement creation and external execution belong to the
// appropriate subsequent workflow.
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

import type { ProcessFinancialAccountWithdrawalCommand } from '../commands/process-financial-account-withdrawal.command';

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
 * Processes an existing Financial Account Withdrawal.
 *
 * Lifecycle transition:
 *
 *     PENDING -> PROCESSING
 *
 * The aggregate owns:
 *
 * - lifecycle validation;
 * - lifecycle mutation;
 * - FinancialAccountWithdrawalProcessingEvent creation.
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
 *        ├── process()
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
export class ProcessFinancialAccountWithdrawalHandler implements CommandHandler<
  ProcessFinancialAccountWithdrawalCommand,
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
    command: ProcessFinancialAccountWithdrawalCommand,
  ): Promise<FinancialAccountWithdrawalAggregate> {
    // -------------------------------------------------------------------------
    // 1. Resolve Financial Account Withdrawal
    // -------------------------------------------------------------------------
    //
    // The command carries the public withdrawal identity.
    //
    // The repository resolves the complete aggregate from persistence.
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
    // 3. Process withdrawal
    // -------------------------------------------------------------------------
    //
    // The aggregate delegates lifecycle validation and mutation to the
    // FinancialAccountWithdrawalEntity.
    //
    // Expected transition:
    //
    //     PENDING -> PROCESSING
    //
    // The aggregate records:
    //
    //     FinancialAccountWithdrawalProcessingEvent
    //
    // If the withdrawal is not PENDING, the domain layer raises the
    // appropriate FinancialAccountWithdrawalException.
    // -------------------------------------------------------------------------

    aggregate.process(command.correlationId, command.causationId);

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

export default ProcessFinancialAccountWithdrawalHandler;
