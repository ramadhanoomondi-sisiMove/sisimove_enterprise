// -----------------------------------------------------------------------------
// Financial Payment — Count Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for counting all Financial Payment records.
//
// The handler delegates the count operation to the Financial Payment
// repository. It does not load or rehydrate payment aggregates.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application — Query
// -----------------------------------------------------------------------------

import { CountFinancialPaymentsQuery } from '../queries/count-financial-payments.query';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_PAYMENT_TOKENS } from '../financial-payment.tokens';

// -----------------------------------------------------------------------------
// Domain — Repository
// -----------------------------------------------------------------------------

import type { FinancialPaymentRepository } from '../../domain/repositories/financial-payment.repository';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

/**
 * Handles requests to count all Financial Payment records.
 */
@Injectable()
export class CountFinancialPaymentsQueryHandler implements QueryHandler<
  CountFinancialPaymentsQuery,
  number
> {
  public constructor(
    @Inject(FINANCIAL_PAYMENT_TOKENS.REPOSITORY)
    private readonly repository: FinancialPaymentRepository,
  ) {}

  public async execute(): Promise<number> {
    return this.repository.count();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CountFinancialPaymentsQueryHandler;
