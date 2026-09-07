// -----------------------------------------------------------------------------
// Support — Get Support Cases By Category Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { GetSupportCasesByCategoryQuery } from '../queries/get-support-cases-by-category.query';

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

import { SUPPORT_TOKENS } from '../support.tokens';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetSupportCasesByCategoryHandler implements QueryHandler<
  GetSupportCasesByCategoryQuery,
  SupportCaseAggregate[]
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    query: GetSupportCasesByCategoryQuery,
  ): Promise<SupportCaseAggregate[]> {
    return this.supportCaseRepository.findByCategory(query.category);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSupportCasesByCategoryHandler;
