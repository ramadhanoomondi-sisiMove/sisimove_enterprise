// src/domains/trust/domain/value-objects/badge-public-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class BadgePublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'TRB');
  }
}
