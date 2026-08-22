// -----------------------------------------------------------------------------
// Commercial Commission Rule — Get Active Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import { COMMERCIAL_COMMISSION_RULE_TOKENS } from '../commercial-commission-rule.tokens';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetActiveCommercialCommissionRuleQuery } from '../queries/get-active-commercial-commission-rule.query';

import { CommercialCommissionRuleAggregate } from '../../domain/aggregates/commercial-commission-rule.aggregate';

import type { CommercialCommissionRuleRepository } from '../../domain/repositories/commercial-commission-rule.repository';

import { CommercialCommissionRuleNotFoundException } from '../../domain/exceptions';

@Injectable()
export class GetActiveCommercialCommissionRuleHandler implements QueryHandler<
  GetActiveCommercialCommissionRuleQuery,
  CommercialCommissionRuleAggregate
> {
  public constructor(
    @Inject(COMMERCIAL_COMMISSION_RULE_TOKENS.REPOSITORY)
    private readonly repository: CommercialCommissionRuleRepository,
  ) {}

  public async execute(
    query: GetActiveCommercialCommissionRuleQuery,
  ): Promise<CommercialCommissionRuleAggregate> {
    const aggregate = await this.repository.findActiveRule(query.type);

    if (!aggregate) {
      throw new CommercialCommissionRuleNotFoundException(query.type.value);
    }

    return aggregate;
  }
}

export default GetActiveCommercialCommissionRuleHandler;
