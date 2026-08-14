// src/domains/social/domain/value-objects/member-public-id.vo.ts

import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class MemberPublicId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'MBR');
  }
}
