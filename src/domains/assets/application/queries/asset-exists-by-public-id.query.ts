export class AssetExistsByPublicIdQuery {
  constructor(
    public readonly assetId: string,
    public readonly correlationId?: string,
  ) {}
}
