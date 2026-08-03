// src/domains/assets/domain/value-objects/asset-scan-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class AssetScanId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'ASC');
  }
}
