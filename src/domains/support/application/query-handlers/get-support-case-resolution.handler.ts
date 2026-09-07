// -----------------------------------------------------------------------------
// Support — Get Support Case Resolution Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetSupportCaseResolutionQuery } from '../queries/get-support-case-resolution.query';

import { SUPPORT_TOKENS } from '../support.tokens';

import { SupportCaseException } from '../../domain/exceptions/support-case.exception';

import type { SupportCaseResolutionEntity } from '../../domain/entities/support-case-resolution.entity';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

@Injectable()
export class GetSupportCaseResolutionHandler implements QueryHandler<
  GetSupportCaseResolutionQuery,
  SupportCaseResolutionEntity | null
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    query: GetSupportCaseResolutionQuery,
  ): Promise<SupportCaseResolutionEntity | null> {
    const aggregate = await this.supportCaseRepository.findByPublicId(
      query.supportCasePublicId,
    );

    if (aggregate === null) {
      throw new SupportCaseException(
        `Support Case '${query.supportCasePublicId.value}' was not found.`,
      );
    }

    return aggregate.resolution ?? null;
  }
}

export default GetSupportCaseResolutionHandler;
