// src/domains/social/domain/value-objects/traveller-profile-preferences-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class TravellerProfilePreferencesId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'TPP');
  }
}
