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
// 2. Return the complete aggregate.
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

import { FinancialPaymentMethodAggregate } from '../../domain/aggregates/financial-payment-method.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodRepository } from '../../domain/repositories/financial-payment-method.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialPaymentMethodNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of the default Financial Payment Method for a
 * Financial Account.
 *
 * The repository rehydrates the complete Financial Payment Method aggregate.
 *
 * The handler does not load the Financial Account aggregate because the
 * account is represented only by its opaque public identity.
 */
@Injectable()
export class GetDefaultFinancialPaymentMethodHandler implements QueryHandler<
  GetDefaultFinancialPaymentMethodQuery,
  FinancialPaymentMethodAggregate
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
  ): Promise<FinancialPaymentMethodAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load default payment method
    // -------------------------------------------------------------------------
    //
    // The repository is responsible for:
    //
    // - resolving the Financial Account public identity;
    // - locating its default payment method;
    // - rehydrating the complete aggregate.
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findDefaultByAccountPublicId(
      query.accountPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure default payment method exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new FinancialPaymentMethodNotFoundException(
        `No default Financial Payment Method exists for Financial Account "${query.accountPublicId.value}"`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetDefaultFinancialPaymentMethodHandler;
