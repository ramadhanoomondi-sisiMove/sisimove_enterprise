import { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

export class AssetVariantId extends PublicEntityId {
  constructor(value?: string) {
    super(value, 'AVR');
  }
}
