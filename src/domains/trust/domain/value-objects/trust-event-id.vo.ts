// src/domains/trust/domain/value-objects/trust-event-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class TrustEventId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'TRE');
  }
}
