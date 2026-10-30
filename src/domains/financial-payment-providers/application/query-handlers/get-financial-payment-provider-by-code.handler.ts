// -----------------------------------------------------------------------------
// Financial Payment Provider — Get By Code Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../financial-payment-providers.tokens';
import type { FinancialPaymentProviderRepository } from '../../domain/repositories/financial-payment-provider.repository';
import type { GetFinancialPaymentProviderByCodeQuery } from '../queries/get-financial-payment-provider-by-code.query';
import type { FinancialPaymentProviderAggregate } from '../../domain/aggregates/financial-payment-provider.aggregate';
import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';
import { FinancialPaymentProviderNotFoundException } from '../../domain/exceptions/financial-payment-provider-not-found.exception';

/**
 * Retrieves a Financial Payment Provider by its business code.
 *
 * The handler delegates lookup to the repository and does not mutate state.
 */
@Injectable()
export class GetFinancialPaymentProviderByCodeHandler implements QueryHandler<
  GetFinancialPaymentProviderByCodeQuery,
  FinancialPaymentProviderAggregate
> {
  public constructor(
    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly repository: FinancialPaymentProviderRepository,
  ) {}

  public async execute(
    query: GetFinancialPaymentProviderByCodeQuery,
  ): Promise<FinancialPaymentProviderAggregate> {
    const aggregate = await this.repository.findByCode(query.code);

    if (aggregate === null) {
      throw new FinancialPaymentProviderNotFoundException(
        query.code.toString(),
      );
    }

    return aggregate;
  }
}

export default GetFinancialPaymentProviderByCodeHandler;
