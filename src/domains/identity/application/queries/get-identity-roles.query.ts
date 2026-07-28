// src/domains/identity/application/queries/get-identity-roles.query.ts
export class GetIdentityRolesQuery {
  constructor(
    public readonly identityPublicId: string,
    public readonly correlationId: string,
  ) {}
}
