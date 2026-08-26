// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Fail Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for failing an existing Financial
// Account Withdrawal.
//
// Responsibilities:
//
// - Resolve the Financial Account Withdrawal aggregate.
// - Ensure the withdrawal exists.
// - Request the aggregate to fail the withdrawal.
// - Persist the updated aggregate.
//
// Lifecycle transition:
//
//     PROCESSING -> FAILED
//
// The FinancialAccountWithdrawalAggregate owns the lifecycle invariant and
// state mutation.
//
// The failure reason is application/workflow context. It is passed to the
// aggregate so that the corresponding domain event can carry the failure
// context. The reason is intentionally not persisted on the withdrawal entity.
//
// This handler does NOT:
//
// - Create a Financial Account Withdrawal.
// - Create or execute a Financial Disbursement.
// - Call an external provider.
// - Move funds.
// - Modify Financial Account balances.
// - Create a Financial Transaction.
// - Perform settlement.
// - Perform accounting.
// - Publish domain events.
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

import type { FailFinancialAccountWithdrawalCommand } from '../commands/fail-financial-account-withdrawal.command';

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
 * Fails an existing Financial Account Withdrawal.
 *
 * Lifecycle transition:
 *
 *     PROCESSING -> FAILED
 *
 * The aggregate owns:
 *
 * - lifecycle validation;
 * - lifecycle mutation;
 * - FinancialAccountWithdrawalFailedEvent creation.
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
 *        ├── fail()
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
export class FailFinancialAccountWithdrawalHandler implements CommandHandler<
  FailFinancialAccountWithdrawalCommand,
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
    command: FailFinancialAccountWithdrawalCommand,
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
      command.withdrawalPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure withdrawal exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new FinancialAccountWithdrawalNotFoundException(
        command.withdrawalPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Fail withdrawal
    // -------------------------------------------------------------------------
    //
    // Expected transition:
    //
    //     PROCESSING -> FAILED
    //
    // The aggregate delegates lifecycle validation and mutation to the
    // FinancialAccountWithdrawalEntity.
    //
    // The aggregate then records:
    //
    //     FinancialAccountWithdrawalFailedEvent
    //
    // The failure reason is carried by the event and is intentionally not
    // persisted on the withdrawal entity.
    //
    // If the withdrawal is not PROCESSING, the domain layer raises the
    // appropriate lifecycle exception.
    // -------------------------------------------------------------------------

    aggregate.fail(
      command.reason,
      command.failedAt,
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

export default FailFinancialAccountWithdrawalHandler;
