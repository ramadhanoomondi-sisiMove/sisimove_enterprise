// src/domains/assets/domain/value-objects/asset-owner-identity-id.vo.ts

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

export class AssetOwnerIdentityId extends UniqueEntityId {
  constructor(value?: string) {
    super(value);
  }
}
