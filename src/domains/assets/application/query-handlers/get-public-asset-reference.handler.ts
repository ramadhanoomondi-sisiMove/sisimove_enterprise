// -----------------------------------------------------------------------------
// sisiMove — Assets
// Get Public Asset Reference Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for resolving the public consumer-
// facing reference of an Asset.
//
// The handler coordinates:
//
//     AssetRepository
//          │
//          ├── AssetAggregate
//          │      ├── public identity
//          │      ├── lifecycle state
//          │      └── visibility
//          │
//          └── AssetDeliveryPort
//                 │
//                 └── consumer-facing URL
//
// -----------------------------------------------------------------------------
//
// RESPONSIBILITIES
//
// This handler:
//
// - loads the Asset through the AssetRepository;
// - establishes that the Asset exists;
// - establishes that the Asset is usable;
// - establishes that the Asset is public;
// - delegates URL resolution to AssetDeliveryPort;
// - returns the public Asset reference.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// AssetDeliveryPort is deliberately defined in terms of Asset domain value
// objects.
//
// The handler therefore passes the aggregate's value objects directly to the
// delivery port.
//
// It must NOT unwrap:
//
// - AssetPublicId;
// - AssetStorageProvider;
// - AssetBucket;
// - AssetObjectKey;
//
// merely to pass them across the application boundary.
//
// The delivery port explicitly owns a contract expressed in those domain
// types.
//
// -----------------------------------------------------------------------------
//
// URL RESOLUTION
//
// AssetDeliveryPort.getUrl() is synchronous.
//
// URL resolution itself performs no asynchronous I/O, so the handler does not
// await the delivery operation.
//
// -----------------------------------------------------------------------------
//
// PUBLIC CONTRACT
//
// The returned reference contains:
//
//     {
//       publicId,
//       url,
//     }
//
// Domain and infrastructure metadata remain behind the application boundary.
//
// -----------------------------------------------------------------------------

import { Inject } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type {
  GetPublicAssetReferenceQuery,
  PublicAssetReference,
} from '../queries/get-public-asset-reference.query';

import type { AssetDeliveryPort } from '../ports/asset-delivery.port';

import { ASSET_TOKENS } from '../asset.tokens';

import type { AssetRepository } from '../../domain/repositories/asset.repository';
import { AssetNotFoundException } from '../../domain/exceptions';

// =============================================================================
// Handler
// =============================================================================

export class GetPublicAssetReferenceQueryHandler implements QueryHandler<
  GetPublicAssetReferenceQuery,
  PublicAssetReference
> {
  public constructor(
    @Inject(ASSET_TOKENS.REPOSITORIES.ASSET)
    private readonly repository: AssetRepository,

    @Inject(ASSET_TOKENS.APPLICATION_SERVICES.ASSET_DELIVERY)
    private readonly assetDelivery: AssetDeliveryPort,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  public async execute(
    query: GetPublicAssetReferenceQuery,
  ): Promise<PublicAssetReference> {
    // -------------------------------------------------------------------------
    // Load Asset aggregate
    // -------------------------------------------------------------------------
    //
    // Persistence reconstruction remains the responsibility of the
    // AssetRepository. The application handler does not access Prisma or any
    // other persistence mechanism directly.
    //
    const aggregate = await this.repository.findByPublicId(query.publicId);

    // -------------------------------------------------------------------------
    // Asset must exist
    // -------------------------------------------------------------------------
    //
    // A public reference cannot be resolved for an Asset that does not exist.
    //
    if (aggregate === null) {
      throw new AssetNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Asset must be usable
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the definition of whether its lifecycle state permits
    // the Asset to be used.
    //
    if (!aggregate.isUsable()) {
      throw new AssetNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Asset must be public
    // -------------------------------------------------------------------------
    //
    // A usable Asset is not necessarily publicly deliverable.
    //
    // Visibility is therefore checked independently from lifecycle state.
    //
    if (!aggregate.isPublic()) {
      throw new AssetNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Resolve consumer-facing delivery URL
    // -------------------------------------------------------------------------
    //
    // AssetDeliveryPort deliberately accepts the Asset domain value objects.
    //
    // Keep those value objects intact at the application boundary.
    //
    // Do NOT use `.value` here.
    //
    // Unwrapping the value objects would violate the declared
    // AssetDeliveryRequest contract and would unnecessarily discard the
    // domain type information already available from the aggregate.
    //
    const delivery = this.assetDelivery.getUrl({
      assetPublicId: aggregate.publicId,
      storageProvider: aggregate.storageProvider,
      bucket: aggregate.bucket,
      objectKey: aggregate.objectKey,
    });

    // -------------------------------------------------------------------------
    // Return public reference
    // -------------------------------------------------------------------------
    //
    // The public query contract intentionally exposes primitive consumer-facing
    // data rather than domain value objects.
    //
    return {
      publicId: aggregate.publicId.value,
      url: delivery.url,
    };
  }
}

export default GetPublicAssetReferenceQueryHandler;
