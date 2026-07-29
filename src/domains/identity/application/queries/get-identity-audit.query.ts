export class GetIdentityAuditQuery {
  constructor(
    public readonly publicId: string,
    public readonly correlationId?: string,
  ) {}
}
