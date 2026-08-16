// src/domains/trust/domain/value-objects/trust-rating-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class TrustRatingId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'TRR');
  }
}
