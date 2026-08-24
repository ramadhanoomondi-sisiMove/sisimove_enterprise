// -----------------------------------------------------------------------------
// Financial Payment Method — Get Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for retrieving an existing
// Financial Payment Method aggregate.
//
// Aggregate:
//
// FinancialPaymentMethodAggregate
// └── FinancialPaymentMethodEntity
//
// Responsibilities:
//
// 1. Load the complete Financial Payment Method aggregate.
// 2. Return the aggregate.
//
// The handler does NOT:
//
// - modify the aggregate;
// - modify FinancialPaymentMethodEntity;
// - create domain events;
// - change the default method;
// - activate or deactivate the payment method;
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

import type { GetFinancialPaymentMethodQuery } from '../queries/get-financial-payment-method.query';

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
 * Handles retrieval of a Financial Payment Method aggregate.
 *
 * The repository rehydrates the complete aggregate:
 *
 * FinancialPaymentMethodAggregate
 * └── FinancialPaymentMethodEntity
 *
 * The handler performs no domain mutation.
 */
@Injectable()
export class GetFinancialPaymentMethodHandler implements QueryHandler<
  GetFinancialPaymentMethodQuery,
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
    query: GetFinancialPaymentMethodQuery,
  ): Promise<FinancialPaymentMethodAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load complete aggregate
    // -------------------------------------------------------------------------
    //
    // The repository is responsible for rehydrating the complete
    // FinancialPaymentMethodAggregate.
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      query.paymentMethodPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new FinancialPaymentMethodNotFoundException(
        query.paymentMethodPublicId.value,
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

export default GetFinancialPaymentMethodHandler;
