// -----------------------------------------------------------------------------
// Financial Payment — Get All Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving all Financial Payment
// aggregates.
//
// Aggregate:
//
// FinancialPaymentAggregate
// ├── FinancialPaymentEntity
// └── FinancialPaymentAttemptEntity[]
//
// Responsibilities:
//
// 1. Load all Financial Payment aggregates.
// 2. Return the complete collection.
//
// The handler does NOT:
//
// - modify aggregates;
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

import type { GetAllFinancialPaymentsQuery } from '../queries/get-all-financial-payments.query';

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
 * Handles retrieval of all Financial Payment aggregates.
 *
 * The repository rehydrates each complete aggregate:
 *
 * FinancialPaymentAggregate
 * ├── FinancialPaymentEntity
 * └── FinancialPaymentAttemptEntity[]
 *
 * The handler performs no domain mutation.
 */
@Injectable()
export class GetAllFinancialPaymentsQueryHandler implements QueryHandler<
  GetAllFinancialPaymentsQuery,
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
    _query: GetAllFinancialPaymentsQuery,
  ): Promise<FinancialPaymentAggregate[]> {
    // -------------------------------------------------------------------------
    // 1. Load all complete aggregates
    // -------------------------------------------------------------------------
    //
    // The repository is responsible for rehydrating each aggregate, including:
    //
    // - FinancialPaymentEntity;
    // - FinancialPaymentAttemptEntity[].
    //
    // The repository also determines the collection ordering.
    // -------------------------------------------------------------------------

    const aggregates = await this.repository.findAll();

    // -------------------------------------------------------------------------
    // 2. Return aggregates
    // -------------------------------------------------------------------------

    return aggregates;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAllFinancialPaymentsQueryHandler;