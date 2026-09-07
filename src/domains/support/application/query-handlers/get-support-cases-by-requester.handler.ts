// -----------------------------------------------------------------------------
// Support — Get Support Cases By Requester Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { GetSupportCasesByRequesterQuery } from '../queries/get-support-cases-by-requester.query';

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

import { SUPPORT_TOKENS } from '../support.tokens';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetSupportCasesByRequesterHandler implements QueryHandler<
  GetSupportCasesByRequesterQuery,
  SupportCaseAggregate[]
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    query: GetSupportCasesByRequesterQuery,
  ): Promise<SupportCaseAggregate[]> {
    return this.supportCaseRepository.findByRequesterPublicId(
      query.requesterPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSupportCasesByRequesterHandler;
