// -----------------------------------------------------------------------------
// Support — Get Support Case Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving a single SupportCase aggregate by its
// public identifier.
//
// The query handler is responsible for loading the complete SupportCase
// aggregate through SupportCaseRepository.findByPublicId().
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
// - modify the SupportCase aggregate;
// - modify any child entity;
// - access Prisma;
// - access infrastructure directly;
// - perform authorization checks;
// - validate requester Identity existence;
// - publish domain events;
// - perform application orchestration.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';

// =============================================================================
// Query
// =============================================================================

export class GetSupportCaseQuery implements Query {
  public constructor(
    /**
     * Public identifier of the SupportCase aggregate.
     */
    public readonly publicId: SupportCasePublicId,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSupportCaseQuery;
