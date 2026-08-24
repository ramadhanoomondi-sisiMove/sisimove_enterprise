// -----------------------------------------------------------------------------
// Financial Payment — Fail Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for marking an existing Financial
// Payment as failed.
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
// 3. Mark the Financial Payment as FAILED through the aggregate.
// 4. Persist the updated aggregate.
// 5. Return the updated aggregate.
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
// The aggregate owns the failure lifecycle transition and its invariants.
// The latest payment attempt, when available, is used by the aggregate to
// provide failure information in the FinancialPaymentFailedEvent.
//
// Provider execution belongs to the integration/application boundary.
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

import type { FailFinancialPaymentCommand } from '../commands/fail-financial-payment.command';

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
export class FailFinancialPaymentHandler implements CommandHandler<
  FailFinancialPaymentCommand,
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
    command: FailFinancialPaymentCommand,
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
    // 3. Fail Financial Payment
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the failure lifecycle invariant.
    //
    // aggregate.fail() verifies that an active payment attempt does not
    // remain in progress before transitioning the payment to FAILED.
    //
    // The aggregate then:
    //
    // - transitions the payment to FAILED;
    // - records failedAt;
    // - clears completedAt/cancelledAt;
    // - obtains failure information from the latest attempt when available;
    // - emits FinancialPaymentFailedEvent.
    // -------------------------------------------------------------------------

    aggregate.fail(new Date(), command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 4. Persist updated aggregate
    // -------------------------------------------------------------------------
    //
    // The repository persists the complete Financial Payment aggregate.
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

export default FailFinancialPaymentHandler;
