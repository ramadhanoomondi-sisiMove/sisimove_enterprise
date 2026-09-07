// -----------------------------------------------------------------------------
// Support — Get Support Cases By Priority Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { GetSupportCasesByPriorityQuery } from '../queries/get-support-cases-by-priority.query';

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

import { SUPPORT_TOKENS } from '../support.tokens';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetSupportCasesByPriorityHandler implements QueryHandler<
  GetSupportCasesByPriorityQuery,
  SupportCaseAggregate[]
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    query: GetSupportCasesByPriorityQuery,
  ): Promise<SupportCaseAggregate[]> {
    return this.supportCaseRepository.findByPriority(query.priority);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSupportCasesByPriorityHandler;
