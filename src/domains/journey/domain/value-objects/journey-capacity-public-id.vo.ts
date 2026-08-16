// src/domains/journey/domain/value-objects/journey-capacity-public-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class JourneyCapacityPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'JCA');
  }
}
