// -----------------------------------------------------------------------------
// Assets — Get Public Asset Content Query Handler
// -----------------------------------------------------------------------------
//
// Application handler for retrieving the physical content of one publicly
// deliverable Asset.
//
// Application flow:
//
//     GetPublicAssetContentQuery
//              │
//              ▼
//     AssetRepository
//              │
//              ▼
//       AssetAggregate
//              │
//       ┌──────┴──────┐
//       │             │
//    PUBLIC         READY
//       │             │
//       └──────┬──────┘
//              ▼
//       AssetStoragePort
//              │
//              ▼
//    AssetStorageObjectContent
//
// -----------------------------------------------------------------------------
//
// RESPONSIBILITIES
// -----------------------------------------------------------------------------
//
// This handler is responsible for:
//
// - loading the Asset aggregate by public ID;
// - ensuring the Asset exists;
// - ensuring the Asset is publicly visible;
// - ensuring the Asset is usable/ready;
// - resolving the physical storage location from the aggregate;
// - retrieving the physical object through AssetStoragePort;
// - returning the storage content and transport-neutral metadata.
//
// -----------------------------------------------------------------------------
//
// THIS HANDLER DOES NOT
// -----------------------------------------------------------------------------
//
// This handler does NOT:
//
// - access Prisma;
// - access the filesystem directly;
// - access Bunny directly;
// - access AWS S3 directly;
// - access Cloudinary directly;
// - generate public URLs;
// - generate signed URLs;
// - expose bucket/object-key information to the HTTP caller;
// - mutate the Asset aggregate;
// - perform authorization;
// - construct Express Response objects;
// - set HTTP headers.
//
// Physical storage remains behind:
//
//     AssetStoragePort
//
// HTTP response construction remains inside the HTTP controller.
//
// -----------------------------------------------------------------------------
//
// PUBLIC DELIVERY SECURITY
// -----------------------------------------------------------------------------
//
// The caller supplies only:
//
//     AssetPublicId
//
// The handler obtains the physical storage identity exclusively from the
// persisted Asset aggregate:
//
//     AssetAggregate
//         ├── storageProvider
//         ├── bucket
//         └── objectKey
//
// A caller cannot supply or override any of those values.
//
// An Asset is publicly deliverable only when:
//
//     aggregate.isPublic()
//     aggregate.isUsable()
//
// If either condition fails, the handler reports the Asset as unavailable.
//
// Deliberately returning the same not-found exception for:
//
// - missing Asset;
// - non-public Asset;
// - unusable Asset;
//
// prevents the anonymous endpoint from revealing whether a private or
// non-ready Asset exists.
//
// -----------------------------------------------------------------------------
//
// MULTIPLE PUBLIC ASSETS
// -----------------------------------------------------------------------------
//
// A Journey card may reference several independent Assets:
//
//     Traveller
//         └── avatar
//
//     Vehicle
//         └── vehicle image
//
//     Trust Badge
//         └── badge image
//
//     Journey
//         └── journey/gallery images
//
// This handler retrieves exactly ONE physical Asset.
//
// Collection composition belongs to the consuming public read boundary.
//
// For example:
//
//     PublicJourney
//         ├── provider.traveller.avatar
//         ├── provider.trust.badges[].asset
//         ├── vehicle.asset
//         └── assets[]
//
// Each PublicAsset URL may ultimately resolve to:
//
//     GET /assets/public/:assetPublicId
//
// -----------------------------------------------------------------------------
//
// STORAGE RESULT
// -----------------------------------------------------------------------------
//
// AssetStoragePort returns:
//
//     AssetStorageObjectContent
//
// containing:
//
// - storage metadata required by the application/storage boundary;
// - the physical content stream.
//
// The HTTP controller decides how those values become an HTTP response.
//
// The handler does not know whether the content came from:
//
// - local filesystem;
// - Bunny;
// - AWS S3;
// - Google Cloud Storage;
// - Azure Blob Storage;
// - Cloudinary;
// - another supported provider.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { ASSET_TOKENS } from '../asset.tokens';

// -----------------------------------------------------------------------------
// Application — Ports
// -----------------------------------------------------------------------------

import type {
  AssetStorageObjectContent,
  AssetStoragePort,
} from '../ports/asset-storage.port';

// -----------------------------------------------------------------------------
// Application — Query
// -----------------------------------------------------------------------------

import type { GetPublicAssetContentQuery } from '../queries/get-public-asset-content.query';

// -----------------------------------------------------------------------------
// Domain — Repository
// -----------------------------------------------------------------------------

import type { AssetRepository } from '../../domain/repositories/asset.repository';

// -----------------------------------------------------------------------------
// Domain — Exceptions
// -----------------------------------------------------------------------------

import { AssetNotFoundException } from '../../domain/exceptions/asset-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetPublicAssetContentHandler implements QueryHandler<
  GetPublicAssetContentQuery,
  AssetStorageObjectContent
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    // -------------------------------------------------------------------------
    // Asset Repository
    // -------------------------------------------------------------------------
    //
    // The repository retrieves the Asset aggregate.
    //
    // The repository does not perform public-delivery policy. That decision
    // remains in this application handler.
    //

    @Inject(ASSET_TOKENS.REPOSITORIES.ASSET)
    private readonly assetRepository: AssetRepository,

    // -------------------------------------------------------------------------
    // Physical Storage
    // -------------------------------------------------------------------------
    //
    // The storage port performs the actual physical object retrieval.
    //
    // The handler remains independent of the concrete storage provider.
    //

    @Inject(ASSET_TOKENS.APPLICATION_SERVICES.ASSET_STORAGE)
    private readonly assetStorage: AssetStoragePort,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Retrieves the physical content of a publicly deliverable Asset.
   *
   * The Asset aggregate remains the authoritative source for:
   *
   * - public identity;
   * - visibility;
   * - lifecycle state;
   * - storage provider;
   * - bucket;
   * - object key.
   *
   * The caller cannot supply physical storage addressing.
   */
  public async execute(
    query: GetPublicAssetContentQuery,
  ): Promise<AssetStorageObjectContent> {
    // -------------------------------------------------------------------------
    // Load Asset aggregate
    // -------------------------------------------------------------------------
    //
    // Public delivery is always resolved through the Asset public identity.
    //
    // No internal persistence ID is accepted by this boundary.
    //

    const aggregate = await this.assetRepository.findByPublicId(query.publicId);

    // -------------------------------------------------------------------------
    // Missing Asset
    // -------------------------------------------------------------------------
    //
    // Use the same not-found response for unavailable Assets so the anonymous
    // endpoint does not reveal whether a private/non-ready Asset exists.
    //

    if (aggregate === null) {
      throw new AssetNotFoundException(
        `Public Asset with public ID ${query.publicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Public visibility
    // -------------------------------------------------------------------------
    //
    // An Asset being READY is not sufficient for anonymous delivery.
    //
    // The Asset must explicitly be PUBLIC.
    //

    if (!aggregate.isPublic()) {
      throw new AssetNotFoundException(
        `Public Asset with public ID ${query.publicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Asset usability
    // -------------------------------------------------------------------------
    //
    // AssetAggregate delegates the actual usability rule to AssetEntity.
    //
    // This keeps lifecycle semantics inside the Asset domain rather than
    // duplicating status checks here.
    //

    if (!aggregate.isUsable()) {
      throw new AssetNotFoundException(
        `Public Asset with public ID ${query.publicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Retrieve physical content
    // -------------------------------------------------------------------------
    //
    // Physical storage addressing is obtained exclusively from the aggregate.
    //
    // The public caller never supplies:
    //
    // - storage provider;
    // - bucket;
    // - object key.
    //
    // AssetStoragePort hides the concrete storage implementation.
    //

    const content = await this.assetStorage.get(
      aggregate.storageProvider,
      aggregate.bucket,
      aggregate.objectKey,
    );

    // -------------------------------------------------------------------------
    // Physical object missing
    // -------------------------------------------------------------------------
    //
    // The Asset aggregate may exist in the database while its physical object
    // is unavailable due to an infrastructure inconsistency.
    //
    // Do not expose that distinction through the anonymous endpoint.
    //
    // The application reports the Asset as unavailable.
    //

    if (content === null) {
      throw new AssetNotFoundException(
        `Public Asset with public ID ${query.publicId.value} was not found.`,
      );
    }

    return content;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetPublicAssetContentHandler;
