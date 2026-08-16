// src/domains/journey/domain/value-objects/journey-pricing-public-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class JourneyPricingPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'JPR');
  }
}
