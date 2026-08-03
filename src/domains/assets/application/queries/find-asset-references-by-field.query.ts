import type {
  AssetReferenceField,
  AssetResourceType,
} from '../../domain/value-objects';

export class FindAssetReferencesByFieldQuery {
  constructor(
    public readonly resourceType: AssetResourceType,

    public readonly resourcePublicId: string,

    public readonly referenceField: AssetReferenceField,

    public readonly correlationId?: string,
  ) {}
}
