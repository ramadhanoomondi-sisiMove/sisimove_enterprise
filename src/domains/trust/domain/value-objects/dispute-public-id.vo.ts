// src/domains/trust/domain/value-objects/dispute-public-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class DisputePublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'DSP');
  }
}
