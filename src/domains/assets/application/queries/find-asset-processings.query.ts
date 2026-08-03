export class FindAssetProcessingsQuery {
  constructor(
    /**
     * Aggregate UUID (internal database identifier).
     */
    public readonly assetId: string,

    public readonly correlationId?: string,
  ) {}
}
