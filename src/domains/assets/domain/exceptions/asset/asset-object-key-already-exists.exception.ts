// src/domains/assets/domain/exceptions/asset/asset-object-key-already-exists.exception.ts

import { AssetDomainException } from '../asset-domain.exception';

export class AssetObjectKeyAlreadyExistsException extends AssetDomainException {
  constructor(objectKey: string) {
    super(
      'ASSET_OBJECT_KEY_ALREADY_EXISTS',
      `An asset already exists with object key '${objectKey}'.`,
    );

    Object.freeze(this);
  }
}
