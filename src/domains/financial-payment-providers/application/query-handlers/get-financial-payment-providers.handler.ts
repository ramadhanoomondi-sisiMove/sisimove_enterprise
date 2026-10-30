// -----------------------------------------------------------------------------
// Financial Payment Provider — Get All Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../financial-payment-providers.tokens';
import type { FinancialPaymentProviderRepository } from '../../domain/repositories/financial-payment-provider.repository';
import type { GetFinancialPaymentProvidersQuery } from '../queries/get-financial-payment-providers.query';
import type { FinancialPaymentProviderAggregate } from '../../domain/aggregates/financial-payment-provider.aggregate';
import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

/**
 * Retrieves all Financial Payment Provider aggregates.
 *
 * The repository returns providers newest first, including their capabilities.
 */
@Injectable()
export class GetFinancialPaymentProvidersHandler implements QueryHandler<
  GetFinancialPaymentProvidersQuery,
  FinancialPaymentProviderAggregate[]
> {
  public constructor(
    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly repository: FinancialPaymentProviderRepository,
  ) {}

  public async execute(
    query: GetFinancialPaymentProvidersQuery,
  ): Promise<FinancialPaymentProviderAggregate[]> {
    void query;
    return this.repository.findAll();
  }
}

export default GetFinancialPaymentProvidersHandler;
