export class FindAssetEntitiesByCategoryQuery {
  constructor(
    public readonly category: string,
    public readonly correlationId?: string,
  ) {}
}
