// -----------------------------------------------------------------------------
// Support — Get Support Case Messages Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving all messages belonging to a
// SupportCaseAggregate.
//
// Aggregate ownership:
//
// SupportCaseAggregate
// ├── SupportCaseEntity
// ├── SupportCaseParticipantEntity[]
// ├── SupportCaseMessageEntity[]
// ├── SupportCaseNoteEntity[]
// ├── SupportCaseEvidenceEntity[]
// └── SupportCaseResolutionEntity?
//
// Messages are aggregate-owned entities. They are therefore retrieved through
// the SupportCaseAggregate rather than through an independent message
// repository.
//
// The aggregate intentionally exposes its child collections as readonly
// collections to prevent application consumers from mutating aggregate state
// outside the aggregate API.
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetSupportCaseMessagesQuery } from '../queries/get-support-case-messages.query';

import { SUPPORT_TOKENS } from '../support.tokens';

import { SupportCaseException } from '../../domain/exceptions/support-case.exception';

import type { SupportCaseMessageEntity } from '../../domain/entities/support-case-message.entity';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

@Injectable()
export class GetSupportCaseMessagesHandler implements QueryHandler<
  GetSupportCaseMessagesQuery,
  readonly SupportCaseMessageEntity[]
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    query: GetSupportCaseMessagesQuery,
  ): Promise<readonly SupportCaseMessageEntity[]> {
    const aggregate = await this.supportCaseRepository.findByPublicId(
      query.supportCasePublicId,
    );

    if (aggregate === null) {
      throw new SupportCaseException(
        `Support Case '${query.supportCasePublicId.value}' was not found.`,
      );
    }

    return aggregate.messages;
  }
}

export default GetSupportCaseMessagesHandler;
