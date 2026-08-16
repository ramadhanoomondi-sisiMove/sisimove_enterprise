// src/domains/trust/domain/value-objects/trust-badge-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class TrustBadgeId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'TRB');
  }
}
