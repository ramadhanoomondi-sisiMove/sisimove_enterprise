// -----------------------------------------------------------------------------
// Financial Payments — Get My Payments Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving all Financial Payment
// aggregates associated with a Financial Account.
//
// Aggregate:
//
// FinancialPaymentAggregate[]
// ├── FinancialPaymentAggregate
// │   ├── FinancialPaymentEntity
// │   └── FinancialPaymentAttemptEntity[]
// └── ...
//
// Responsibilities:
//
// 1. Load all Financial Payment aggregates associated with the account.
// 2. Return the complete aggregates.
//
// The handler does NOT:
//
// - modify payment aggregates;
// - modify FinancialPaymentEntity;
// - modify FinancialPaymentAttemptEntity;
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
// Aggregate rehydration belongs to the repository.
// Domain behavior remains inside FinancialPaymentAggregate.
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

import type { GetMyFinancialPaymentsQuery } from '../queries/get-my-financial-payments.query';

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
 * Handles retrieval of all Financial Payment aggregates associated with
 * a Financial Account.
 *
 * The repository rehydrates every complete aggregate, including its
 * Payment Attempts.
 *
 * The handler performs no domain mutation.
 */
@Injectable()
export class GetMyFinancialPaymentsHandler implements QueryHandler<
  GetMyFinancialPaymentsQuery,
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
    query: GetMyFinancialPaymentsQuery,
  ): Promise<FinancialPaymentAggregate[]> {
    // -------------------------------------------------------------------------
    // 1. Load complete payment aggregates for the account
    // -------------------------------------------------------------------------
    //
    // The repository resolves the FinancialAccountPublicId and retrieves:
    //
    // - all associated Financial Payments;
    // - all lifecycle statuses;
    // - all associated Payment Attempts.
    //
    // Payments are returned newest first.
    //
    // -------------------------------------------------------------------------

    const aggregates = await this.repository.findByAccountId(query.accountId);

    // -------------------------------------------------------------------------
    // 2. Return complete aggregates
    // -------------------------------------------------------------------------

    return aggregates;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetMyFinancialPaymentsHandler;
