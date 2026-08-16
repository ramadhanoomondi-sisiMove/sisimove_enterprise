// src/domains/trust/domain/value-objects/actor-public-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class ActorPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'MBR');
  }
}
