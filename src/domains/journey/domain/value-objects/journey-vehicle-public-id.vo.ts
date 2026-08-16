// src/domains/journey/domain/value-objects/journey-vehicle-public-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class JourneyVehiclePublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'JVE');
  }
}
