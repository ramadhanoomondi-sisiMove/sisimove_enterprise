// -----------------------------------------------------------------------------
// Support Case — Get Evidence Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving all evidence items belonging to a Support
// Case.
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
// - identify the Support Case whose evidence is requested.
//
// The query does not perform retrieval itself. The corresponding query handler
// coordinates the application use case through the SupportCaseRepository.
//
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';
import type { SupportCasePublicId } from '../../domain/value-objects/support-case-public-id.vo';

export class GetSupportCaseEvidenceQuery implements Query {
  public constructor(
    public readonly supportCasePublicId: SupportCasePublicId,
  ) {}
}

export default GetSupportCaseEvidenceQuery;
