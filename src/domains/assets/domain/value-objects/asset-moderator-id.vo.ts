// src/domains/assets/domain/value-objects/asset-moderator-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class AssetModeratorId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'IDN');
  }
}
