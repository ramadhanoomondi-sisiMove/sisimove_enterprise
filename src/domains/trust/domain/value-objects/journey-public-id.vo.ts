// src/domains/trust/domain/value-objects/journey-public-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class JourneyPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'JNY');
  }
}
