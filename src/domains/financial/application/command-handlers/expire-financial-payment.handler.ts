// -----------------------------------------------------------------------------
// Financial Payment — Expire Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for expiring an existing
// Financial Payment aggregate.
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
// 3. Expire the Financial Payment through the aggregate.
// 4. Persist the updated aggregate.
// 5. Return the updated aggregate.
//
// The handler does NOT:
//
// - execute provider-side expiration;
// - communicate with external providers;
// - create a Financial Payment Attempt;
// - create a Financial Transaction;
// - post a Financial Transaction;
// - modify Financial Account balances;
// - perform settlement;
// - perform accounting.
//
// Expiration is a Financial Payment lifecycle concern owned by the aggregate.
//
// Provider-side expiration or cancellation belongs to the
// integration/application boundary.
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

import type { ExpireFinancialPaymentCommand } from '../commands/expire-financial-payment.command';

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
export class ExpireFinancialPaymentHandler implements CommandHandler<
  ExpireFinancialPaymentCommand,
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
    command: ExpireFinancialPaymentCommand,
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
    // 3. Expire Financial Payment
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the expiration lifecycle invariant.
    //
    // aggregate.expire() verifies that an active payment attempt does not
    // remain in progress before transitioning the payment to EXPIRED.
    //
    // The aggregate then:
    //
    // - transitions the payment to EXPIRED;
    // - clears completedAt;
    // - clears failedAt;
    // - clears cancelledAt;
    // - emits FinancialPaymentExpiredEvent.
    //
    // Provider-side expiration remains outside the aggregate.
    // -------------------------------------------------------------------------

    aggregate.expire(new Date(), command.correlationId, command.causationId);

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

export default ExpireFinancialPaymentHandler;
