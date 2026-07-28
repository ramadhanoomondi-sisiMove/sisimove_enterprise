// src/domains/identity/application/queries/authentication-exists-by-identity.query.ts

export class AuthenticationExistsByIdentityQuery {
  constructor(
    public readonly identityId: string,
    public readonly correlationId?: string,
  ) {}
}
