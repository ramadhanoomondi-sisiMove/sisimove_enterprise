export class FindAssetByObjectKeyQuery {
  constructor(
    public readonly objectKey: string,
    public readonly correlationId?: string,
  ) {}
}
