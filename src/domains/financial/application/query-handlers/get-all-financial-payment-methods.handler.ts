// -----------------------------------------------------------------------------
// Financial Payment Method — Get All Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving all Financial Payment
// Method aggregates.
//
// Aggregate:
//
// FinancialPaymentMethodAggregate
// └── FinancialPaymentMethodEntity
//
// Responsibilities:
//
// 1. Load all Financial Payment Method aggregates.
// 2. Return the aggregates.
//
// The handler does NOT:
//
// - modify aggregates;
// - modify FinancialPaymentMethodEntity;
// - create domain events;
// - change default methods;
// - activate or deactivate payment methods;
// - communicate with external providers;
// - execute payments;
// - modify Financial Account balances;
// - move money.
//
// Query behavior belongs to the application layer.
// Aggregate rehydration belongs to the repository.
// Domain behavior remains inside FinancialPaymentMethodAggregate.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_PAYMENT_METHOD_TOKENS } from '../financial-payment-method.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetAllFinancialPaymentMethodsQuery } from '../queries/get-all-financial-payment-methods.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialPaymentMethodAggregate } from '../../domain/aggregates/financial-payment-method.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodRepository } from '../../domain/repositories/financial-payment-method.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of all Financial Payment Method aggregates.
 *
 * The repository is responsible for rehydrating each complete aggregate:
 *
 * FinancialPaymentMethodAggregate
 * └── FinancialPaymentMethodEntity
 *
 * The handler performs no domain mutation.
 */
@Injectable()
export class GetAllFinancialPaymentMethodsHandler implements QueryHandler<
  GetAllFinancialPaymentMethodsQuery,
  FinancialPaymentMethodAggregate[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_PAYMENT_METHOD_TOKENS.REPOSITORY)
    private readonly repository: FinancialPaymentMethodRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetAllFinancialPaymentMethodsQuery,
  ): Promise<FinancialPaymentMethodAggregate[]> {
    void query;

    return this.repository.findAll();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAllFinancialPaymentMethodsHandler;
