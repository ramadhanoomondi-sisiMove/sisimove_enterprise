// src/domains/trust/domain/value-objects/rating-public-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class RatingPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'TRR');
  }
}
