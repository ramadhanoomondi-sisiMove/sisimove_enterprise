// src/domains/trust/domain/value-objects/trust-profile-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class TrustProfileId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'TRP');
  }
}
