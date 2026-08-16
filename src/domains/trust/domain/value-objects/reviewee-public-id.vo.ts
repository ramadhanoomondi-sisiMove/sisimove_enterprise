// src/domains/trust/domain/value-objects/reviewee-public-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class RevieweePublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'MBR');
  }
}
