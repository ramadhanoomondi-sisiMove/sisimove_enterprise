// -----------------------------------------------------------------------------
// Support — Get Support Cases By Reference Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { GetSupportCasesByReferenceQuery } from '../queries/get-support-cases-by-reference.query';

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

import { SUPPORT_TOKENS } from '../support.tokens';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetSupportCasesByReferenceHandler implements QueryHandler<
  GetSupportCasesByReferenceQuery,
  SupportCaseAggregate[]
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    query: GetSupportCasesByReferenceQuery,
  ): Promise<SupportCaseAggregate[]> {
    return this.supportCaseRepository.findByReferenceTypeAndReferencePublicId(
      query.referenceType,
      query.referencePublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSupportCasesByReferenceHandler;
