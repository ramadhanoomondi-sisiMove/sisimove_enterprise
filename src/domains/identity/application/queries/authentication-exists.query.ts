// src/domains/identity/application/queries/authentication-exists.query.ts

export class AuthenticationExistsQuery {
  constructor(
    public readonly publicId: string,
    public readonly correlationId?: string,
  ) {}
}
