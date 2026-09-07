// -----------------------------------------------------------------------------
// Support — Get Support Case Notes Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetSupportCaseNotesQuery } from '../queries/get-support-case-notes.query';

import { SUPPORT_TOKENS } from '../support.tokens';

import { SupportCaseException } from '../../domain/exceptions/support-case.exception';

import type { SupportCaseNoteEntity } from '../../domain/entities/support-case-note.entity';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

@Injectable()
export class GetSupportCaseNotesHandler implements QueryHandler<
  GetSupportCaseNotesQuery,
  readonly SupportCaseNoteEntity[]
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    query: GetSupportCaseNotesQuery,
  ): Promise<readonly SupportCaseNoteEntity[]> {
    const aggregate = await this.supportCaseRepository.findByPublicId(
      query.supportCasePublicId,
    );

    if (aggregate === null) {
      throw new SupportCaseException(
        `Support Case '${query.supportCasePublicId.value}' was not found.`,
      );
    }

    return aggregate.notes;
  }
}

export default GetSupportCaseNotesHandler;
