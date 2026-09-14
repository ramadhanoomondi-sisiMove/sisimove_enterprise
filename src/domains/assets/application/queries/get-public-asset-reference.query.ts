// -----------------------------------------------------------------------------
// sisiMove — Get Public Asset Reference Query
// -----------------------------------------------------------------------------
//
// This query is intentionally different from GetPublicAssetContentQuery.
//
// GetPublicAssetContentQuery:
//
//     Asset public ID
//          ↓
//     physical public asset content
//
// GetPublicAssetReferenceQuery:
//
//     Asset public ID
//          ↓
//     public browser URL
//
// The latter is useful to other bounded contexts when composing public
// read models.
//
// Consumers do not need to know:
// - storage provider;
// - bucket;
// - object key;
// - filesystem;
// - object storage implementation;
// - delivery implementation.
//
// The Asset bounded context remains the owner of public asset delivery.
//
// -----------------------------------------------------------------------------

import type { Query } from '../../../../foundation/kernel/application/query';

import type { AssetPublicId } from '../../domain/value-objects';

// =============================================================================
// Result
// =============================================================================

export interface PublicAssetReference {
  readonly publicId: string;
  readonly url: string;
}

// =============================================================================
// Query
// =============================================================================

export class GetPublicAssetReferenceQuery implements Query {
  public constructor(public readonly publicId: AssetPublicId) {}
}

export default GetPublicAssetReferenceQuery;
