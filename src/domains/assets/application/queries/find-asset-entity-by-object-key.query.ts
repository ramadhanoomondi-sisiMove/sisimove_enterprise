export class FindAssetEntityByObjectKeyQuery {
  constructor(
    public readonly objectKey: string,
    public readonly correlationId?: string,
  ) {}
}
