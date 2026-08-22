// -----------------------------------------------------------------------------
// Commercial Commission Rule — Get By Type Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import { COMMERCIAL_COMMISSION_RULE_TOKENS } from '../commercial-commission-rule.tokens';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetCommercialCommissionRuleByTypeQuery } from '../queries/get-commercial-commission-rule-by-type.query';

import { CommercialCommissionRuleAggregate } from '../../domain/aggregates/commercial-commission-rule.aggregate';

import type { CommercialCommissionRuleRepository } from '../../domain/repositories/commercial-commission-rule.repository';

@Injectable()
export class GetCommercialCommissionRuleByTypeHandler implements QueryHandler<
  GetCommercialCommissionRuleByTypeQuery,
  CommercialCommissionRuleAggregate[]
> {
  public constructor(
    @Inject(COMMERCIAL_COMMISSION_RULE_TOKENS.REPOSITORY)
    private readonly repository: CommercialCommissionRuleRepository,
  ) {}

  public async execute(
    query: GetCommercialCommissionRuleByTypeQuery,
  ): Promise<CommercialCommissionRuleAggregate[]> {
    return this.repository.findByType(query.type);
  }
}

export default GetCommercialCommissionRuleByTypeHandler;
