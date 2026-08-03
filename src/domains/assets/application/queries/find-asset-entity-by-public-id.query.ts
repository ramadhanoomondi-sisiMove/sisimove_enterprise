export class FindAssetEntityByPublicIdQuery {
  constructor(
    public readonly assetId: string,
    public readonly correlationId?: string,
  ) {}
}
