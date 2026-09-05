// -----------------------------------------------------------------------------
// Assets — Delete Asset Request DTO
// -----------------------------------------------------------------------------
//
// Public HTTP request contract for deleting an existing Asset.
//
// The request represents the user's/business actor's intent:
//
//     Delete Asset
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
// - deletedAt;
// - persistence identifiers;
// - storage information;
// - physical storage details.
//
// -----------------------------------------------------------------------------
//
// Domain responsibility:
//
// AssetAggregate / AssetEntity remain responsible for the lifecycle transition
// to DELETED.
//
// AssetStoragePort remains responsible for physical object deletion.
//
// The DTO contains no business rules and no storage concerns.
//
// -----------------------------------------------------------------------------
//
// HTTP body:
//
// No request body is required for this operation.
//
// Example:
//
//     DELETE /assets/:publicId
//
// Request body:
//
//     {}
//
// -----------------------------------------------------------------------------
//
// Swagger:
//
// This DTO intentionally contains no properties because deletion requires
// no client-provided body data.
//
// -----------------------------------------------------------------------------

// =============================================================================
// DTO
// =============================================================================

export class DeleteAssetRequestDto {}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default DeleteAssetRequestDto;
