// -----------------------------------------------------------------------------
// Financial Payment Method — Get Account Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving all Financial Payment
// Method aggregates belonging to a specific Financial Account.
//
// Aggregate:
//
// FinancialPaymentMethodAggregate
// └── FinancialPaymentMethodEntity
//
// The Financial Account remains a separate aggregate root.
//
// The handler uses the Financial Account public identity as an opaque
// cross-aggregate reference.
//
// Responsibilities:
//
// 1. Retrieve all Financial Payment Methods belonging to the account.
// 2. Return complete aggregates.
// 3. Return an empty array when the account has no payment methods.
//
// The handler does NOT:
//
// - load the Financial Account aggregate;
// - modify the Financial Account aggregate;
// - modify Financial Payment Method aggregates;
// - change the default method;
// - activate or deactivate payment methods;
// - create domain events;
// - communicate with external providers;
// - execute payments;
// - modify Financial Account balances;
// - move money.
//
// Query behavior belongs to the application layer.
// Repository access and aggregate rehydration belong to the repository.
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

import type { GetAccountFinancialPaymentMethodsQuery } from '../queries/get-account-financial-payment-methods.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodAggregate } from '../../domain/aggregates/financial-payment-method.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodRepository } from '../../domain/repositories/financial-payment-method.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of all Financial Payment Method aggregates belonging
 * to a Financial Account.
 *
 * The repository rehydrates each complete Financial Payment Method
 * aggregate.
 *
 * An account with no payment methods returns an empty array. This is a
 * valid Financial Account state.
 *
 * The handler does not load the Financial Account aggregate because the
 * account is represented only by its opaque public identity.
 */
@Injectable()
export class GetAccountFinancialPaymentMethodsHandler implements QueryHandler<
  GetAccountFinancialPaymentMethodsQuery,
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
    query: GetAccountFinancialPaymentMethodsQuery,
  ): Promise<FinancialPaymentMethodAggregate[]> {
    // -------------------------------------------------------------------------
    // Load account payment methods
    // -------------------------------------------------------------------------
    //
    // The repository is responsible for:
    //
    // - resolving payment methods using the Financial Account public identity;
    // - retrieving active and inactive payment methods;
    // - rehydrating each complete aggregate;
    // - returning an empty array when no methods exist.
    //
    // -------------------------------------------------------------------------

    return this.repository.findByAccountPublicId(query.accountPublicId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAccountFinancialPaymentMethodsHandler;
