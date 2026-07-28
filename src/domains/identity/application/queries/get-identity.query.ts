export class GetIdentityQuery {
  constructor(
    public readonly publicId: string,
    public readonly correlationId: string,
  ) {}
}
