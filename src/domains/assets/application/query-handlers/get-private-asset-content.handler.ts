// -----------------------------------------------------------------------------
// Assets — Get Private Asset Content Query Handler
// -----------------------------------------------------------------------------
//
// Retrieves physical content for a private Asset.
//
// SECURITY BOUNDARY
//
// This handler does not perform HTTP authorization. Callers must establish
// authorization before invoking it. For verification evidence, the Identity
// flow must first resolve the verification aggregate and confirm that the
// requested verification request references this Asset.
//
// This handler deliberately does not require public visibility.
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_TOKENS } from '../asset.tokens';

import type {
  AssetStorageObjectContent,
  AssetStoragePort,
} from '../ports/asset-storage.port';

import type { GetPrivateAssetContentQuery } from '../queries/get-private-asset-content.query';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

import { AssetNotFoundException } from '../../domain/exceptions/asset-not-found.exception';

@Injectable()
export class GetPrivateAssetContentHandler implements QueryHandler<
  GetPrivateAssetContentQuery,
  AssetStorageObjectContent
> {
  public constructor(
    @Inject(ASSET_TOKENS.REPOSITORIES.ASSET)
    private readonly assetRepository: AssetRepository,

    @Inject(ASSET_TOKENS.APPLICATION_SERVICES.ASSET_STORAGE)
    private readonly assetStorage: AssetStoragePort,
  ) {}

  public async execute(
    query: GetPrivateAssetContentQuery,
  ): Promise<AssetStorageObjectContent> {
    const aggregate = await this.assetRepository.findByPublicId(query.publicId);

    if (aggregate === null || !aggregate.isUsable()) {
      throw new AssetNotFoundException(
        `Private Asset with public ID ${query.publicId.value} was not found.`,
      );
    }

    const content = await this.assetStorage.get(
      aggregate.storageProvider,
      aggregate.bucket,
      aggregate.objectKey,
    );

    if (content === null) {
      throw new AssetNotFoundException(
        `Private Asset with public ID ${query.publicId.value} was not found.`,
      );
    }

    return {
      ...content,
      mimeType: aggregate.mimeType,
    };
  }
}

export default GetPrivateAssetContentHandler;
