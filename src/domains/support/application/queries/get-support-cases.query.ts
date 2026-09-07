// -----------------------------------------------------------------------------
// Support — Get Support Cases Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving all SupportCase aggregates.
//
// The query handler is responsible for loading complete SupportCase
// aggregates through SupportCaseRepository.findAll().
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
// This query does NOT:
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

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// =============================================================================
// Query
// =============================================================================

export class GetSupportCasesQuery implements Query {
  public constructor() {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSupportCasesQuery;
