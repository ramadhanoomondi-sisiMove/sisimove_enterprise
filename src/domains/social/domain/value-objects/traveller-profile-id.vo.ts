// src/domains/social/domain/value-objects/traveller-profile-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class TravellerProfileId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'TPR');
  }
}
