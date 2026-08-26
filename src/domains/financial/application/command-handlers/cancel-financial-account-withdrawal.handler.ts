// -----------------------------------------------------------------------------
// Financial Account Withdrawal — Cancel Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for cancelling an existing
// Financial Account Withdrawal.
//
// Responsibilities:
//
// - Resolve the Financial Account Withdrawal aggregate.
// - Ensure the withdrawal exists.
// - Request the aggregate to cancel the withdrawal.
// - Persist the updated aggregate.
//
// Valid lifecycle transitions:
//
//     PENDING    -> CANCELLED
//     PROCESSING -> CANCELLED
//
// The FinancialAccountWithdrawalAggregate owns the lifecycle invariant and
// state mutation.
//
// The cancellation reason is application/workflow context. It is passed to
// the aggregate so that the corresponding domain event can carry the
// cancellation context. The reason is intentionally not persisted on the
// withdrawal entity.
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

import type { CancelFinancialAccountWithdrawalCommand } from '../commands/cancel-financial-account-withdrawal.command';

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
 * Cancels an existing Financial Account Withdrawal.
 *
 * Valid lifecycle transitions:
 *
 *     PENDING    -> CANCELLED
 *     PROCESSING -> CANCELLED
 *
 * The aggregate owns:
 *
 * - lifecycle validation;
 * - lifecycle mutation;
 * - FinancialAccountWithdrawalCancelledEvent creation.
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
 *        ├── cancel()
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
export class CancelFinancialAccountWithdrawalHandler implements CommandHandler<
  CancelFinancialAccountWithdrawalCommand,
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
    command: CancelFinancialAccountWithdrawalCommand,
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
    // 3. Cancel withdrawal
    // -------------------------------------------------------------------------
    //
    // Valid transitions:
    //
    //     PENDING    -> CANCELLED
    //     PROCESSING -> CANCELLED
    //
    // The aggregate delegates lifecycle validation and mutation to the
    // FinancialAccountWithdrawalEntity.
    //
    // The aggregate then records:
    //
    //     FinancialAccountWithdrawalCancelledEvent
    //
    // The cancellation reason is carried by the event and is intentionally
    // not persisted on the withdrawal entity.
    //
    // If the withdrawal is already in a terminal state, the domain layer
    // raises the appropriate lifecycle exception.
    // -------------------------------------------------------------------------

    aggregate.cancel(
      command.reason,
      command.cancelledAt,
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

export default CancelFinancialAccountWithdrawalHandler;
