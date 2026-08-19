// -----------------------------------------------------------------------------
// Journey Boarding — List Query DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST query DTO for listing Journey Boardings.
 *
 * The current application query does not define filters or pagination,
 * therefore this DTO intentionally contains no fields.
 *
 * Pagination and filtering can be introduced later without changing the
 * domain repository contract prematurely.
 */
export class ListJourneyBoardingsQueryDto {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ListJourneyBoardingsQueryDto;
