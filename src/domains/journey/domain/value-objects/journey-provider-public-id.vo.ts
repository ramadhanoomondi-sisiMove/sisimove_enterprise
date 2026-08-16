// src/domains/journey/domain/value-objects/journey-provider-public-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class JourneyProviderPublicId extends PublicEntityId {
  constructor(value: string) {
    super(value, 'IDN');
  }
}
