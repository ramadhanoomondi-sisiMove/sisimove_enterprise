// src/domains/trust/domain/value-objects/trust-review-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class TrustReviewId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'TRV');
  }
}
