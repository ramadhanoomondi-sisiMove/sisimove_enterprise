// src/domains/identity/application/queries/get-authentication.query.ts

export class GetAuthenticationQuery {
  constructor(
    public readonly publicId: string,
    public readonly correlationId?: string,
  ) {}
}
