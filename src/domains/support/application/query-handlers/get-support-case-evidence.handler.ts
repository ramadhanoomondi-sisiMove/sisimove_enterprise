// -----------------------------------------------------------------------------
// Support — Get Support Case Evidence Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetSupportCaseEvidenceQuery } from '../queries/get-support-case-evidence.query';

import { SUPPORT_TOKENS } from '../support.tokens';

import { SupportCaseException } from '../../domain/exceptions/support-case.exception';

import type { SupportCaseEvidenceEntity } from '../../domain/entities/support-case-evidence.entity';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

@Injectable()
export class GetSupportCaseEvidenceHandler implements QueryHandler<
  GetSupportCaseEvidenceQuery,
  readonly SupportCaseEvidenceEntity[]
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    query: GetSupportCaseEvidenceQuery,
  ): Promise<readonly SupportCaseEvidenceEntity[]> {
    const aggregate = await this.supportCaseRepository.findByPublicId(
      query.supportCasePublicId,
    );

    if (aggregate === null) {
      throw new SupportCaseException(
        `Support Case '${query.supportCasePublicId.value}' was not found.`,
      );
    }

    return aggregate.evidence;
  }
}

export default GetSupportCaseEvidenceHandler;
