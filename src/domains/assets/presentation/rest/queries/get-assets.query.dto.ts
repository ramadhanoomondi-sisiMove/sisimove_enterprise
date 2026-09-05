// -----------------------------------------------------------------------------
// Assets — Get Assets Query DTO
// -----------------------------------------------------------------------------
//
// Public HTTP request contract for retrieving Asset aggregates.
//
// This DTO represents a general Asset collection lookup.
//
// The current GetAssetsQuery does not accept:
//
// - filtering;
// - pagination;
// - sorting;
// - result shaping.
//
// Therefore, this request DTO intentionally contains no properties.
//
// -----------------------------------------------------------------------------
//
// Public boundary:
//
// No request-body fields are required.
//
// The application/internal boundary remains responsible for:
//
// - query construction;
// - repository selection;
// - filtering;
// - pagination;
// - result shaping.
//
// -----------------------------------------------------------------------------
//
// This DTO deliberately does NOT expose:
//
// - domain value objects;
// - persistence identifiers;
// - internal repository criteria;
// - storage-provider details;
// - lifecycle mutation data;
// - correlationId;
// - causationId.
//
// -----------------------------------------------------------------------------
//
// Query responsibility:
//
// GetAssetsQuery represents a read operation only.
//
// It does NOT:
//
// - modify Asset state;
// - perform lifecycle transitions;
// - modify physical storage;
// - directly access Prisma.
//
// -----------------------------------------------------------------------------
//
// HTTP:
//
// Example:
//
//     GET /assets
//
// No request body is required.
//
// -----------------------------------------------------------------------------

// =============================================================================
// DTO
// =============================================================================

export class GetAssetsQueryDto {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAssetsQueryDto;
