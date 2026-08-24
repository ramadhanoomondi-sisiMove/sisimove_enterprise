// -----------------------------------------------------------------------------
// Financial Payment — Link Transaction Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for linking a Financial Payment
// aggregate to an existing Financial Transaction.
//
// Aggregate:
//
// FinancialPaymentAggregate
// ├── FinancialPaymentEntity
// └── FinancialPaymentAttemptEntity[]
//
// Responsibilities:
//
// 1. Load the complete Financial Payment aggregate.
// 2. Ensure the Financial Payment exists.
// 3. Link the opaque Financial Transaction public identity.
// 4. Persist the updated Financial Payment aggregate.
// 5. Return the updated aggregate.
//
// The handler does NOT:
//
// - create a Financial Transaction;
// - modify a Financial Transaction;
// - post a Financial Transaction;
// - modify Financial Account balances;
// - perform accounting;
// - perform settlement;
// - communicate with external providers.
//
// The Financial Transaction remains a separate aggregate.
//
// The Financial Payment aggregate stores only the opaque public identity
// of the resulting Financial Transaction.
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

import type { LinkFinancialPaymentTransactionCommand } from '../commands/link-financial-payment-transaction.command';

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

/**
 * Handles linking a Financial Payment to its resulting Financial Transaction.
 *
 * The handler:
 *
 * - retrieves the Financial Payment aggregate;
 * - delegates the linking invariant to the aggregate;
 * - persists the updated aggregate;
 * - returns the aggregate.
 *
 * The Financial Transaction itself remains completely outside this aggregate.
 */
@Injectable()
export class LinkFinancialPaymentTransactionHandler implements CommandHandler<
  LinkFinancialPaymentTransactionCommand,
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
    command: LinkFinancialPaymentTransactionCommand,
  ): Promise<FinancialPaymentAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load Financial Payment aggregate
    // -------------------------------------------------------------------------
    //
    // The repository rehydrates the complete aggregate:
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
    // 3. Link Financial Transaction
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the business invariant.
    //
    // FinancialPaymentAggregate.linkTransaction() delegates to the entity,
    // which ensures:
    //
    // - the transaction public ID is not empty;
    // - an existing transaction reference cannot be replaced;
    // - only a successful payment can receive a transaction reference.
    //
    // transactionPublicId is intentionally a string because the current
    // command contract and aggregate API both represent this opaque reference
    // as a string.
    // -------------------------------------------------------------------------

    aggregate.linkTransaction(
      command.transactionPublicId,
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 4. Persist aggregate
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

export default LinkFinancialPaymentTransactionHandler;
