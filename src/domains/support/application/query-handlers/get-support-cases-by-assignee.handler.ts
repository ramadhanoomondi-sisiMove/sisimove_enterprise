// -----------------------------------------------------------------------------
// Support — Get Support Cases By Assignee Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { GetSupportCasesByAssigneeQuery } from '../queries/get-support-cases-by-assignee.query';

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

import { SUPPORT_TOKENS } from '../support.tokens';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetSupportCasesByAssigneeHandler implements QueryHandler<
  GetSupportCasesByAssigneeQuery,
  SupportCaseAggregate[]
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    query: GetSupportCasesByAssigneeQuery,
  ): Promise<SupportCaseAggregate[]> {
    return this.supportCaseRepository.findByAssignedToPublicId(
      query.assignedToPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSupportCasesByAssigneeHandler;
