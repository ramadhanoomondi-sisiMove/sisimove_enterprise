// src/domains/social/domain/value-objects/traveller-profile-corridor-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class TravellerProfileCorridorId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'TPC');
  }
}
