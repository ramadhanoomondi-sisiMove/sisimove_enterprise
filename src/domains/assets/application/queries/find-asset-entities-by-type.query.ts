import type { AssetType } from '../../domain/value-objects';

export class FindAssetEntitiesByTypeQuery {
  constructor(
    public readonly type: AssetType,

    public readonly correlationId?: string,
  ) {}
}
