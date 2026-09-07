// -----------------------------------------------------------------------------
// Support Case — Get Resolution Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving the resolution belonging to a Support
// Case.
//
// A Support Case may have at most one resolution.
//
// Aggregate:
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
// - carry the Support Case public identity;
// - identify the Support Case whose resolution is requested.
//
// The query does not perform retrieval itself. The corresponding query handler
// coordinates the application use case through the SupportCaseRepository.
//
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';
import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';

export class GetSupportCaseResolutionQuery implements Query {
  public constructor(
    public readonly supportCasePublicId: SupportCasePublicId,
  ) {}
}

export default GetSupportCaseResolutionQuery;
