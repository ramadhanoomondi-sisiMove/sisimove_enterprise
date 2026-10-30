// -----------------------------------------------------------------------------
// Financial Payment Provider — Get Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import { FINANCIAL_PAYMENT_PROVIDER_TOKENS } from '../financial-payment-providers.tokens';
import type { FinancialPaymentProviderRepository } from '../../domain/repositories/financial-payment-provider.repository';
import type { GetFinancialPaymentProviderQuery } from '../queries/get-financial-payment-provider.query';
import type { FinancialPaymentProviderAggregate } from '../../domain/aggregates/financial-payment-provider.aggregate';
import type { FinancialPaymentProviderPublicId } from '../../domain/value-objects/financial-payment-provider-public-id.vo';
import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';
import { FinancialPaymentProviderNotFoundException } from '../../domain/exceptions/financial-payment-provider-not-found.exception';

/**
 * Retrieves a Financial Payment Provider by its public ID.
 *
 * This handler does not mutate the aggregate.
 */
@Injectable()
export class GetFinancialPaymentProviderHandler implements QueryHandler<
  GetFinancialPaymentProviderQuery,
  FinancialPaymentProviderAggregate
> {
  public constructor(
    @Inject(FINANCIAL_PAYMENT_PROVIDER_TOKENS.REPOSITORY)
    private readonly repository: FinancialPaymentProviderRepository,
  ) {}

  public async execute(
    query: GetFinancialPaymentProviderQuery,
  ): Promise<FinancialPaymentProviderAggregate> {
    const publicId: FinancialPaymentProviderPublicId = query.providerPublicId;

    const aggregate = await this.repository.findByPublicId(publicId);

    if (aggregate === null) {
      throw new FinancialPaymentProviderNotFoundException(publicId.value);
    }

    return aggregate;
  }
}

export default GetFinancialPaymentProviderHandler;
