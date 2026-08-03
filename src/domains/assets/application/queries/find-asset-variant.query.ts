import type { AssetVariantType } from '../../domain/value-objects';

export class FindAssetVariantQuery {
  constructor(
    /**
     * Aggregate UUID (internal database identifier).
     */
    public readonly assetId: string,

    public readonly variant: AssetVariantType,

    public readonly correlationId?: string,
  ) {}
}
