// -----------------------------------------------------------------------------
// Commercial Commission Rule — Get Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import { COMMERCIAL_COMMISSION_RULE_TOKENS } from '../commercial-commission-rule.tokens';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetCommercialCommissionRuleQuery } from '../queries/get-commercial-commission-rule.query';

import { CommercialCommissionRuleAggregate } from '../../domain/aggregates/commercial-commission-rule.aggregate';

import type { CommercialCommissionRuleRepository } from '../../domain/repositories/commercial-commission-rule.repository';

import { CommercialCommissionRuleNotFoundException } from '../../domain/exceptions';

@Injectable()
export class GetCommercialCommissionRuleHandler implements QueryHandler<
  GetCommercialCommissionRuleQuery,
  CommercialCommissionRuleAggregate
> {
  public constructor(
    @Inject(COMMERCIAL_COMMISSION_RULE_TOKENS.REPOSITORY)
    private readonly repository: CommercialCommissionRuleRepository,
  ) {}

  public async execute(
    query: GetCommercialCommissionRuleQuery,
  ): Promise<CommercialCommissionRuleAggregate> {
    const aggregate = await this.repository.findByPublicId(query.publicId);

    if (!aggregate) {
      throw new CommercialCommissionRuleNotFoundException(query.publicId.value);
    }

    return aggregate;
  }
}

export default GetCommercialCommissionRuleHandler;
