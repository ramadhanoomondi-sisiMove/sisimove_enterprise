import type { AssetStatus } from '../../domain/value-objects';

export class FindAssetEntitiesByStatusQuery {
  constructor(
    public readonly status: AssetStatus,
    public readonly correlationId?: string,
  ) {}
}
