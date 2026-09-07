// -----------------------------------------------------------------------------
// Support — Get Support Cases Query DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for retrieving all SupportCase aggregates.
//
// This query does not require any request parameters.
//
// The application query:
//
// GetSupportCasesQuery
//
// is responsible for retrieving all Support Cases through:
//
// SupportCaseRepository.findAll()
//
// The DTO does NOT contain:
//
// - internal database identifiers;
// - Support Case public identifiers;
// - requester filters;
// - assignee filters;
// - status filters;
// - category filters;
// - priority filters;
// - reference filters;
// - pagination parameters;
// - domain entities;
// - value objects;
// - authorization data.
//
// Filtering and specialized retrieval operations belong to dedicated queries,
// such as:
//
// - GetSupportCasesByRequesterQuery
// - GetSupportCasesByAssigneeQuery
// - GetSupportCasesByReferenceQuery
// - GetSupportCasesByStatusQuery
// - GetSupportCasesByCategoryQuery
// - GetSupportCasesByPriorityQuery
//
// -----------------------------------------------------------------------------

export class GetSupportCasesQueryDto {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSupportCasesQueryDto;
