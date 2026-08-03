// src/domains/assets/domain/value-objects/asset-processing-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class AssetProcessingId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'APR');
  }
}
