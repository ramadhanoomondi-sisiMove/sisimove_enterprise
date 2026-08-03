// src/domains/assets/domain/value-objects/asset-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class AssetId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'AST');
  }
}
