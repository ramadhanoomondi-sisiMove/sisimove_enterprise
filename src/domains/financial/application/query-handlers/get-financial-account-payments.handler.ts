// -----------------------------------------------------------------------------
// Financial Account — Get Payments Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving Financial Payments
// associated with a Financial Account.
//
// Aggregates:
//
// FinancialAccountAggregate
//
// FinancialPaymentAggregate
// ├── FinancialPaymentEntity
// └── FinancialPaymentAttemptEntity[]
//
// Financial Account and Financial Payment remain separate aggregate roots.
//
// The handler uses the Financial Account public identity only as an opaque
// cross-aggregate reference.
//
// Responsibilities:
//
// 1. Retrieve Financial Payment aggregates belonging to the Financial Account.
// 2. Return the matching aggregates.
//
// The handler does NOT:
//
// - load the Financial Account aggregate;
// - modify the Financial Account aggregate;
// - modify Financial Payment aggregates;
// - create domain events;
// - perform payment lifecycle transitions;
// - execute provider operations;
// - communicate with external providers;
// - create or post Financial Transactions;
// - modify Financial Account balances;
// - perform settlement;
// - perform accounting.
//
// Query behavior belongs to the application layer.
// Repository access belongs to the repository boundary.
// Aggregate rehydration belongs to the repository.
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

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetFinancialAccountPaymentsQuery } from '../queries/get-financial-account-payments.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialPaymentAggregate } from '../../domain/aggregates/financial-payment.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialPaymentRepository } from '../../domain/repositories/financial-payment.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of Financial Payments belonging to a Financial Account.
 *
 * The Financial Account is a separate aggregate root.
 *
 * The repository resolves the opaque FinancialAccountPublicId and
 * rehydrates each complete FinancialPaymentAggregate:
 *
 * FinancialPaymentAggregate
 * ├── FinancialPaymentEntity
 * └── FinancialPaymentAttemptEntity[]
 *
 * The handler performs no domain mutation.
 */
@Injectable()
export class GetFinancialAccountPaymentsHandler implements QueryHandler<
  GetFinancialAccountPaymentsQuery,
  FinancialPaymentAggregate[]
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
    query: GetFinancialAccountPaymentsQuery,
  ): Promise<FinancialPaymentAggregate[]> {
    // -------------------------------------------------------------------------
    // 1. Load Financial Payments
    // -------------------------------------------------------------------------
    //
    // The repository is responsible for:
    //
    // - resolving the Financial Account public identity;
    // - locating associated Financial Payments;
    // - rehydrating each complete Financial Payment aggregate;
    // - rehydrating owned Financial Payment Attempts.
    //
    // The handler intentionally does not load the Financial Account aggregate.
    // -------------------------------------------------------------------------

    const aggregates = await this.repository.findByAccountId(
      query.accountPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Return aggregates
    // -------------------------------------------------------------------------
    //
    // An account with no Financial Payments is a valid result.
    //
    // Therefore, an empty collection is returned rather than throwing a
    // FinancialPaymentNotFoundException.
    // -------------------------------------------------------------------------

    return aggregates;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialAccountPaymentsHandler;
