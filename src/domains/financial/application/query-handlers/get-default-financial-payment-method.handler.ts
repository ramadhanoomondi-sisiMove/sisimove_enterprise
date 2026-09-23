// -----------------------------------------------------------------------------
// Financial Payment Method — Get Default Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving the default
// Financial Payment Method belonging to a Financial Account.
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
// 1. Find the default Financial Payment Method for the Financial Account.
// 2. Return the complete aggregate when one exists.
// 3. Return null when the account has no default payment method.
//
// IMPORTANT:
//
// A Financial Account is NOT required to have a Financial Payment Method.
//
// Therefore:
//
// - no payment methods        → valid;
// - no default payment method → valid;
// - repository returns null    → valid query result.
//
// The handler MUST NOT convert the absence of a default payment method
// into a FinancialPaymentMethodNotFoundException.
//
// A missing default is an expected state, not an exceptional state.
//
// The handler does NOT:
//
// - load the Financial Account aggregate;
// - modify the Financial Account aggregate;
// - modify the Financial Payment Method aggregate;
// - change the default method;
// - deactivate another payment method;
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

import type { GetDefaultFinancialPaymentMethodQuery } from '../queries/get-default-financial-payment-method.query';

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
 * Handles retrieval of the default Financial Payment Method for a
 * Financial Account.
 *
 * The repository rehydrates the complete Financial Payment Method aggregate
 * when a default exists.
 *
 * When the Financial Account has no default payment method, the handler
 * returns null because that is a valid Financial Account state.
 *
 * The handler does not load the Financial Account aggregate because the
 * account is represented only by its opaque public identity.
 */
@Injectable()
export class GetDefaultFinancialPaymentMethodHandler implements QueryHandler<
  GetDefaultFinancialPaymentMethodQuery,
  FinancialPaymentMethodAggregate | null
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
    query: GetDefaultFinancialPaymentMethodQuery,
  ): Promise<FinancialPaymentMethodAggregate | null> {
    // -------------------------------------------------------------------------
    // Load default payment method
    // -------------------------------------------------------------------------
    //
    // The repository is responsible for:
    //
    // - resolving the Financial Account using its public identity;
    // - locating an active default payment method;
    // - rehydrating the complete aggregate when one exists;
    // - returning null when no default exists.
    //
    // No default is a valid result.
    // -------------------------------------------------------------------------

    return this.repository.findDefaultByAccountPublicId(query.accountPublicId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetDefaultFinancialPaymentMethodHandler;
