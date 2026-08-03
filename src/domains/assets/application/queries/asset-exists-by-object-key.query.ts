export class AssetExistsByObjectKeyQuery {
  constructor(
    public readonly objectKey: string,
    public readonly correlationId?: string,
  ) {}
}
