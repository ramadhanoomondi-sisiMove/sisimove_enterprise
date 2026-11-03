// -----------------------------------------------------------------------------
// Financial Payment Provider — Get Available Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../financial-payment-providers.tokens';

import type { FinancialPaymentProviderRepository } from '../../domain/repositories/financial-payment-provider.repository';

import type { GetAvailableFinancialPaymentProvidersQuery } from '../queries/get-available-financial-payment-providers.query';

import type { FinancialPaymentProviderAggregate } from '../../domain/aggregates/financial-payment-provider.aggregate';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

/**
 * Retrieves operational Financial Payment Providers available to users.
 *
 * Only enabled providers with READY integration status are returned.
 */
@Injectable()
export class GetAvailableFinancialPaymentProvidersHandler implements QueryHandler<
  GetAvailableFinancialPaymentProvidersQuery,
  FinancialPaymentProviderAggregate[]
> {
  public constructor(
    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly repository: FinancialPaymentProviderRepository,
  ) {}

  public async execute(
    query: GetAvailableFinancialPaymentProvidersQuery,
  ): Promise<FinancialPaymentProviderAggregate[]> {
    void query;

    return this.repository.findOperational();
  }
}

export default GetAvailableFinancialPaymentProvidersHandler;
