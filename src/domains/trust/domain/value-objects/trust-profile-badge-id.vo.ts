// src/domains/trust/domain/value-objects/trust-profile-badge-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class TrustProfileBadgeId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'TPB');
  }
}
