// src/domains/assets/domain/exceptions/asset/asset-checksum-already-exists.exception.ts

import { AssetDomainException } from '../asset-domain.exception';

export class AssetChecksumAlreadyExistsException extends AssetDomainException {
  constructor(checksum: string) {
    super(
      'ASSET_CHECKSUM_ALREADY_EXISTS',
      `An asset already exists with checksum '${checksum}'.`,
    );

    Object.freeze(this);
  }
}
