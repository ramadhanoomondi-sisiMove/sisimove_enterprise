// src/domains/journey/domain/value-objects/journey-vehicle-asset-public-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class JourneyVehicleAssetPublicId extends PublicEntityId {
  constructor(value: string) {
    super(value, 'AST');
  }
}
