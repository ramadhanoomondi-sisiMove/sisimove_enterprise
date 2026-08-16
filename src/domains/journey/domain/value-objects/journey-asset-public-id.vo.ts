// src/domains/journey/domain/value-objects/journey-asset-public-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class JourneyAssetPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'JAS');
  }
}
