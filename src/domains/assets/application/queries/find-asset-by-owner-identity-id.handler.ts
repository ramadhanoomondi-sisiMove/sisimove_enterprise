export class FindAssetByOwnerIdentityIdQuery {
  constructor(
    public readonly ownerIdentityId: string,
    public readonly correlationId?: string,
  ) {}
}
