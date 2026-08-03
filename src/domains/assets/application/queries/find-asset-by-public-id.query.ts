export class FindAssetByPublicIdQuery {
  constructor(
    public readonly assetId: string,
    public readonly correlationId?: string,
  ) {}
}
