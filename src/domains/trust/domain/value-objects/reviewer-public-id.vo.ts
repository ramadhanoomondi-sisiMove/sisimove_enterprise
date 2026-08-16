// src/domains/trust/domain/value-objects/reviewer-public-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class ReviewerPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'MBR');
  }
}
