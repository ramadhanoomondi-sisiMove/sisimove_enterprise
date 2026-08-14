// src/domains/social/domain/value-objects/traveller-profile-public-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class TravellerProfilePublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'TPR');
  }
}
