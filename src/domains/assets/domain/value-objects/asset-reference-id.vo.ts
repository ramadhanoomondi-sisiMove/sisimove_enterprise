// src/domains/assets/domain/value-objects/asset-reference-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class AssetReferenceId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'ARF');
  }
}
