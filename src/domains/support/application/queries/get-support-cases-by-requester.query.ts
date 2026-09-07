// -----------------------------------------------------------------------------
// Support — Get Support Cases By Requester Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving SupportCase aggregates belonging to a
// specific requester.
//
// The query handler is responsible for loading complete SupportCase
// aggregates through SupportCaseRepository.findByRequesterPublicId().
//
// requesterPublicId is an opaque reference to an Identity-domain public
// identity. The query does not validate or dereference Identity.
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

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { SupportCaseRequesterPublicId } from '../../domain/value-objects/support-case-requester-public-id.vo';

// =============================================================================
// Query
// =============================================================================

export class GetSupportCasesByRequesterQuery implements Query {
  public constructor(
    /**
     * Public identity of the member who requested the Support Cases.
     *
     * This is an opaque Identity-domain reference.
     */
    public readonly requesterPublicId: SupportCaseRequesterPublicId,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSupportCasesByRequesterQuery;
