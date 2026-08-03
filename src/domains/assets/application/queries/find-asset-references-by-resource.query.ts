import type { AssetResourceType } from '../../domain/value-objects';

export class FindAssetReferencesByResourceQuery {
  constructor(
    public readonly resourceType: AssetResourceType,

    public readonly resourcePublicId: string,

    public readonly correlationId?: string,
  ) {}
}
