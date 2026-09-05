// -----------------------------------------------------------------------------
// Assets — Archive Asset Request DTO
// -----------------------------------------------------------------------------
//
// Public HTTP request contract for archiving an existing Asset.
//
// The request represents the user's/business actor's intent:
//
//     Archive Asset
//
// No request-body fields are required.
//
// The Asset public identifier is supplied by the route and is therefore not
// duplicated in this DTO.
//
// -----------------------------------------------------------------------------
//
// Public boundary:
//
// The client supplies:
//
//     publicId
//
// through the HTTP route.
//
// The application/internal boundary supplies:
//
//     correlationId
//     causationId
//
// -----------------------------------------------------------------------------
//
// This DTO deliberately does NOT expose:
//
// - AssetPublicId;
// - correlationId;
// - causationId;
// - AssetStatus;
// - archivedAt;
// - persistence identifiers;
// - storage information;
// - physical storage details.
//
// -----------------------------------------------------------------------------
//
// Domain responsibility:
//
// AssetAggregate / AssetEntity remain responsible for determining whether
// the Asset is currently in a lifecycle state that permits archiving.
//
// The DTO contains no business rules.
//
// -----------------------------------------------------------------------------
//
// HTTP body:
//
// No request body is required for this operation.
//
// Example:
//
//     POST /assets/:publicId/archive
//
// Request body:
//
//     {}
//
// -----------------------------------------------------------------------------
//
// Swagger:
//
// This DTO intentionally contains no properties because archiving requires
// no client-provided body data.
//
// -----------------------------------------------------------------------------

// =============================================================================
// DTO
// =============================================================================

export class ArchiveAssetRequestDto {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ArchiveAssetRequestDto;
