// src/domains/assets/domain/value-objects/asset-moderation-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class AssetModerationId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'AMD');
  }
}
