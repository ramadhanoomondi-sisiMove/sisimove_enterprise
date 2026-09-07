// -----------------------------------------------------------------------------
// Support — Get Support Case Participants Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetSupportCaseParticipantsQuery } from '../queries/get-support-case-participants.query';

import { SUPPORT_TOKENS } from '../support.tokens';

import { SupportCaseException } from '../../domain/exceptions/support-case.exception';

import type { SupportCaseParticipantEntity } from '../../domain/entities/support-case-participant.entity';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

@Injectable()
export class GetSupportCaseParticipantsHandler implements QueryHandler<
  GetSupportCaseParticipantsQuery,
  readonly SupportCaseParticipantEntity[]
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    query: GetSupportCaseParticipantsQuery,
  ): Promise<readonly SupportCaseParticipantEntity[]> {
    const aggregate = await this.supportCaseRepository.findByPublicId(
      query.supportCasePublicId,
    );

    if (aggregate === null) {
      throw new SupportCaseException(
        `Support Case '${query.supportCasePublicId.value}' was not found.`,
      );
    }

    return aggregate.participants;
  }
}

export default GetSupportCaseParticipantsHandler;
