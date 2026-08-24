// -----------------------------------------------------------------------------
// Financial Payment — Succeed Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for completing a Financial Payment
// successfully.
//
// Aggregate:
//
// FinancialPaymentAggregate
// ├── FinancialPaymentEntity
// └── FinancialPaymentAttemptEntity[]
//
// Responsibilities:
//
// 1. Load the existing Financial Payment aggregate.
// 2. Ensure the aggregate exists.
// 3. Validate that a successful payment attempt exists through the aggregate.
// 4. Mark the Financial Payment as SUCCEEDED through the aggregate.
// 5. Persist the updated aggregate.
// 6. Return the updated aggregate.
//
// The handler does NOT:
//
// - create a Financial Payment Attempt;
// - execute a payment provider;
// - communicate with external providers;
// - create a Financial Transaction;
// - post a Financial Transaction;
// - modify Financial Account balances;
// - perform settlement;
// - perform accounting.
//
// A successful payment attempt must already exist before the aggregate can
// transition to SUCCEEDED.
//
// The aggregate owns the payment lifecycle invariant and emits the
// FinancialPaymentSucceededEvent.
//
// Provider execution belongs to the integration/application boundary.
// Financial Transaction creation belongs to the transaction boundary.
// Persistence belongs to the repository.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_PAYMENT_TOKENS } from '../financial-payment.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { SucceedFinancialPaymentCommand } from '../commands/succeed-financial-payment.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialPaymentAggregate } from '../../domain/aggregates/financial-payment.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialPaymentRepository } from '../../domain/repositories/financial-payment.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialPaymentNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class SucceedFinancialPaymentHandler implements CommandHandler<
  SucceedFinancialPaymentCommand,
  FinancialPaymentAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_PAYMENT_TOKENS.REPOSITORY)
    private readonly repository: FinancialPaymentRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: SucceedFinancialPaymentCommand,
  ): Promise<FinancialPaymentAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load Financial Payment aggregate
    // -------------------------------------------------------------------------
    //
    // The repository is responsible for rehydrating the complete aggregate:
    //
    // FinancialPaymentAggregate
    // ├── FinancialPaymentEntity
    // └── FinancialPaymentAttemptEntity[]
    //
    // The handler intentionally works with the aggregate root.
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.paymentPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new FinancialPaymentNotFoundException(
        command.paymentPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Complete Financial Payment
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the success invariant.
    //
    // aggregate.succeed() verifies that:
    //
    // - a successful Financial Payment Attempt exists;
    // - the payment lifecycle transition is valid.
    //
    // The aggregate then:
    //
    // - transitions the payment to SUCCEEDED;
    // - records completedAt;
    // - emits FinancialPaymentSucceededEvent.
    //
    // The aggregate does NOT create or post the resulting Financial
    // Transaction.
    // -------------------------------------------------------------------------

    aggregate.succeed(new Date(), command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 4. Persist updated aggregate
    // -------------------------------------------------------------------------
    //
    // The repository persists the complete aggregate:
    //
    // FinancialPaymentAggregate
    // ├── FinancialPaymentEntity
    // └── FinancialPaymentAttemptEntity[]
    //
    // The payment attempt that caused the successful payment remains owned
    // by the Financial Payment aggregate.
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

export default SucceedFinancialPaymentHandler;
