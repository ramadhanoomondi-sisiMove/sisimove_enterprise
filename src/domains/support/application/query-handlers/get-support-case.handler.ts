// -----------------------------------------------------------------------------
// Support — Get Support Case Query Handler
// -----------------------------------------------------------------------------
//
// Application handler for retrieving a single SupportCase aggregate by its
// public identifier.
//
// Aggregate:
//
// SupportCaseAggregate
// ├── SupportCaseEntity
// ├── SupportCaseParticipantEntity[]
// ├── SupportCaseMessageEntity[]
// ├── SupportCaseNoteEntity[]
// ├── SupportCaseEvidenceEntity[]
// └── SupportCaseResolutionEntity?
//
// Responsibilities:
//
// - receive the GetSupportCaseQuery;
// - retrieve the complete SupportCase aggregate;
// - return the aggregate to the caller.
//
// This handler does NOT:
//
// - modify the SupportCase aggregate;
// - access Prisma;
// - access infrastructure directly;
// - perform authorization;
// - validate cross-domain references;
// - publish domain events.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import { GetSupportCaseQuery } from '../queries/get-support-case.query';

// -----------------------------------------------------------------------------
// Support — Aggregate
// -----------------------------------------------------------------------------

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

// -----------------------------------------------------------------------------
// Support — Repository
// -----------------------------------------------------------------------------

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

// -----------------------------------------------------------------------------
// Support — Exception
// -----------------------------------------------------------------------------

import { SupportCaseException } from '../../domain/exceptions/support-case.exception';

// -----------------------------------------------------------------------------
// Support — Tokens
// -----------------------------------------------------------------------------

import { SUPPORT_TOKENS } from '../support.tokens';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetSupportCaseHandler implements QueryHandler<
  GetSupportCaseQuery,
  SupportCaseAggregate
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(
    query: GetSupportCaseQuery,
  ): Promise<SupportCaseAggregate> {
    const aggregate = await this.supportCaseRepository.findByPublicId(
      query.publicId,
    );

    if (aggregate === null) {
      throw new SupportCaseException(
        `Support Case '${query.publicId.value}' was not found.`,
      );
    }

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSupportCaseHandler;
