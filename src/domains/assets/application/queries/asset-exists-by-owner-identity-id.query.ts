export class AssetExistsByOwnerIdentityIdQuery {
  constructor(
    public readonly ownerIdentityId: string,
    public readonly correlationId?: string,
  ) {}
}
