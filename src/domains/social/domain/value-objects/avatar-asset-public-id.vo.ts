// src/domains/social/domain/value-objects/avatar-asset-public-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class AvatarAssetPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'AST');
  }
}
