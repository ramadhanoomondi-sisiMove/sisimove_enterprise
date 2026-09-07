// -----------------------------------------------------------------------------
// Support — Get Support Cases Query Handler
// -----------------------------------------------------------------------------
//
// Application handler for retrieving all SupportCase aggregates.
//
// Responsibilities:
//
// - receive the GetSupportCasesQuery;
// - retrieve all SupportCase aggregates;
// - return the aggregates to the caller.
//
// The repository is responsible for complete aggregate rehydration.
//
// This handler does not:
//
// - modify SupportCase aggregates;
// - modify child entities;
// - access Prisma;
// - access infrastructure directly;
// - perform authorization checks;
// - validate external Identity references;
// - publish domain events;
// - perform application orchestration.
//
// -----------------------------------------------------------------------------
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
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { GetSupportCasesQuery } from '../queries/get-support-cases.query';

import { SupportCaseAggregate } from '../../domain/aggregates/support-case.aggregate';

import type { SupportCaseRepository } from '../../domain/repositories/support-case.repository';

import { SUPPORT_TOKENS } from '../support.tokens';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetSupportCasesHandler implements QueryHandler<
  GetSupportCasesQuery,
  SupportCaseAggregate[]
> {
  public constructor(
    @Inject(SUPPORT_TOKENS.REPOSITORIES.SUPPORT_CASE)
    private readonly supportCaseRepository: SupportCaseRepository,
  ) {}

  public async execute(): Promise<SupportCaseAggregate[]> {
    return this.supportCaseRepository.findAll();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSupportCasesHandler;
