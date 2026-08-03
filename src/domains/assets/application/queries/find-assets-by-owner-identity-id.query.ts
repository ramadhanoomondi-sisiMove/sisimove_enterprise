export class FindAssetsByOwnerIdentityIdQuery {
  constructor(
    public readonly ownerIdentityId: string,
    public readonly correlationId?: string,
  ) {}
}
